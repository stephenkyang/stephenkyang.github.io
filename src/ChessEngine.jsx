import { useEffect, useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import './ChessEngine.css'

const PIECE_NAMES = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }

function pieceImgUrl(color, type) {
  return `https://lichess1.org/assets/piece/cburnett/${color === 'w' ? 'w' : 'b'}${PIECE_NAMES[type]}.svg`
}

// ── Board encoding (mirrors Python train.py exactly) ──────────

const PIECE_TO_CHANNEL = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }
const FILES = 'abcdefgh'
const RANKS = '12345678'

function encodeBoardForModel(game) {
  const board = new Float32Array(8 * 8 * 12)
  const isBlack = game.turn() === 'b'

  for (let sq = 0; sq < 64; sq++) {
    const file = sq % 8
    const rank = Math.floor(sq / 8)
    const squareName = FILES[file] + RANKS[rank]
    const piece = game.get(squareName)
    if (!piece) continue

    let row = rank
    let col = file
    if (isBlack) {
      row = 7 - row
      col = 7 - col
    }

    const channel = PIECE_TO_CHANNEL[piece.type]
    const isFriendly = (piece.color === 'w' && !isBlack) || (piece.color === 'b' && isBlack)
    const offset = isFriendly ? channel : channel + 6
    board[(row * 8 + col) * 12 + offset] = 1.0
  }

  // Auxiliary features
  const aux = new Float32Array(5)
  aux[0] = 1.0 // side to move is always "us"
  const fen = game.fen()
  const castling = fen.split(' ')[2]
  if (!isBlack) {
    aux[1] = castling.includes('K') ? 1 : 0
    aux[2] = castling.includes('Q') ? 1 : 0
    aux[3] = castling.includes('k') ? 1 : 0
    aux[4] = castling.includes('q') ? 1 : 0
  } else {
    aux[1] = castling.includes('k') ? 1 : 0
    aux[2] = castling.includes('q') ? 1 : 0
    aux[3] = castling.includes('K') ? 1 : 0
    aux[4] = castling.includes('Q') ? 1 : 0
  }

  return { board, aux }
}

function flipUci(uci) {
  const f1 = FILES[7 - FILES.indexOf(uci[0])]
  const r1 = RANKS[7 - RANKS.indexOf(uci[1])]
  const f2 = FILES[7 - FILES.indexOf(uci[2])]
  const r2 = RANKS[7 - RANKS.indexOf(uci[3])]
  let result = f1 + r1 + f2 + r2
  if (uci.length > 4) result += uci[4]
  return result
}

// ── Temperature-scaled sampling ───────────────────────────────

function sampleWithTemperature(probs, temperature = 1.2) {
  const logits = probs.map((p) => Math.log(Math.max(p, 1e-10)))
  const scaled = logits.map((l) => l / temperature)
  const maxScaled = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - maxScaled))
  const sumExps = exps.reduce((a, b) => a + b, 0)
  const softmax = exps.map((e) => e / sumExps)

  const r = Math.random()
  let cumulative = 0
  for (let i = 0; i < softmax.length; i++) {
    cumulative += softmax[i]
    if (r <= cumulative) return i
  }
  return softmax.length - 1
}

// ── Component ─────────────────────────────────────────────────

export default function ChessEngine() {
  const [game, setGame] = useState(() => new Chess())
  const [selected, setSelected] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [lastMove, setLastMove] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [status, setStatus] = useState('your move')
  const [statusClass, setStatusClass] = useState('')
  const [moveHistory, setMoveHistory] = useState([])
  const [modelLoading, setModelLoading] = useState(true)
  const [modelError, setModelError] = useState(null)
  const [thinking, setThinking] = useState(false)

  const modelRef = useRef(null)
  const vocabRef = useRef(null)
  const tfRef = useRef(null)

  // Load TF.js and model on mount
  useEffect(() => {
    let cancelled = false

    async function loadModel() {
      try {
        const tf = await import('@tensorflow/tfjs')
        await tf.ready()
        if (cancelled) return
        tfRef.current = tf

        const [model, vocabResp] = await Promise.all([
          tf.loadLayersModel('/chess-model/model.json'),
          fetch('/chess-model/move_vocab.json').then((r) => r.json()),
        ])

        if (cancelled) return
        modelRef.current = model
        vocabRef.current = vocabResp
        setModelLoading(false)
      } catch (err) {
        console.error('Model load error:', err)
        if (!cancelled) setModelError('Failed to load chess model')
      }
    }

    loadModel()
    return () => { cancelled = true }
  }, [])

  const getModelMove = useCallback(
    async (currentGame) => {
      const tf = tfRef.current
      const model = modelRef.current
      const vocab = vocabRef.current
      if (!tf || !model || !vocab) return null

      const { board, aux } = encodeBoardForModel(currentGame)
      const boardTensor = tf.tensor(board, [1, 8, 8, 12])
      const auxTensor = tf.tensor(aux, [1, 5])

      const prediction = model.predict([boardTensor, auxTensor])
      const probs = await prediction.data()

      boardTensor.dispose()
      auxTensor.dispose()
      prediction.dispose()

      // Get legal moves in UCI format
      const legal = currentGame.moves({ verbose: true })
      const legalUcis = legal.map((m) => {
        let uci = m.from + m.to
        if (m.promotion) uci += m.promotion
        return uci
      })

      // Map legal moves to vocab indices with their probabilities
      const isBlack = currentGame.turn() === 'b'
      const candidates = []

      for (const uci of legalUcis) {
        const orientedUci = isBlack ? flipUci(uci) : uci
        const idx = vocab.indexOf(orientedUci)
        if (idx !== -1) {
          candidates.push({ uci, prob: probs[idx] })
        }
      }

      if (candidates.length === 0) {
        // Fallback: pick a random legal move
        const randomIdx = Math.floor(Math.random() * legal.length)
        return { from: legal[randomIdx].from, to: legal[randomIdx].to, promotion: legal[randomIdx].promotion }
      }

      // Sample from candidates using temperature
      const candidateProbs = candidates.map((c) => c.prob)
      const chosenIdx = sampleWithTemperature(candidateProbs, 1.2)
      const chosen = candidates[chosenIdx].uci

      return {
        from: chosen.slice(0, 2),
        to: chosen.slice(2, 4),
        promotion: chosen.length > 4 ? chosen[4] : undefined,
      }
    },
    []
  )

  const playModelMove = useCallback(
    async (currentGame) => {
      setThinking(true)
      setStatus('thinking...')

      // Small delay so the UI updates
      await new Promise((r) => setTimeout(r, 300))

      const move = await getModelMove(currentGame)
      if (!move) {
        setThinking(false)
        return
      }

      const newGame = new Chess(currentGame.fen())
      const result = newGame.move(move)
      if (!result) {
        setThinking(false)
        setStatus('your move')
        return
      }

      setGame(newGame)
      setLastMove({ from: move.from, to: move.to })
      setMoveHistory((prev) => [...prev, result.san])
      setThinking(false)

      if (newGame.isGameOver()) {
        if (newGame.isCheckmate()) {
          setStatus('checkmate — you lose')
          setStatusClass('lost')
        } else {
          setStatus('draw')
          setStatusClass('')
        }
      } else {
        setStatus(newGame.inCheck() ? 'check — your move' : 'your move')
        setStatusClass('')
      }
    },
    [getModelMove]
  )

  const tryMove = useCallback(
    (fromSquare, toSquare) => {
      if (!game || thinking || game.isGameOver()) return false
      if (game.turn() !== 'w') return false

      const moves = game.moves({ square: fromSquare, verbose: true })
      const targetMove = moves.find((m) => m.to === toSquare)
      if (!targetMove) return false

      const newGame = new Chess(game.fen())
      const result = newGame.move({
        from: targetMove.from,
        to: targetMove.to,
        promotion: targetMove.promotion || 'q',
      })
      if (!result) return false

      setGame(newGame)
      setLastMove({ from: targetMove.from, to: targetMove.to })
      setSelected(null)
      setLegalMoves([])
      setMoveHistory((prev) => [...prev, result.san])

      if (newGame.isGameOver()) {
        if (newGame.isCheckmate()) {
          setStatus('checkmate — you win!')
          setStatusClass('won')
        } else {
          setStatus('draw')
          setStatusClass('')
        }
      } else {
        playModelMove(newGame)
      }

      return true
    },
    [game, thinking, playModelMove]
  )

  const handleSquareClick = useCallback(
    (square) => {
      if (!game || thinking || game.isGameOver() || game.turn() !== 'w') return

      const piece = game.get(square)

      if (selected) {
        if (selected !== square && tryMove(selected, square)) return

        if (piece && piece.color === 'w') {
          setSelected(square)
          setLegalMoves(game.moves({ square, verbose: true }))
          return
        }

        setSelected(null)
        setLegalMoves([])
        return
      }

      if (piece && piece.color === 'w') {
        setSelected(square)
        setLegalMoves(game.moves({ square, verbose: true }))
      }
    },
    [game, selected, tryMove, thinking]
  )

  const handleDragStart = useCallback(
    (e, square) => {
      if (!game || thinking || game.isGameOver() || game.turn() !== 'w') {
        e.preventDefault()
        return
      }
      const piece = game.get(square)
      if (!piece || piece.color !== 'w') {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', square)
      e.dataTransfer.effectAllowed = 'move'
      setSelected(square)
      setLegalMoves(game.moves({ square, verbose: true }))
      requestAnimationFrame(() => setDragging(square))
    },
    [game, thinking]
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (e, toSquare) => {
      e.preventDefault()
      const fromSquare = e.dataTransfer.getData('text/plain')
      if (fromSquare && fromSquare !== toSquare) {
        tryMove(fromSquare, toSquare)
      }
      setSelected(null)
      setLegalMoves([])
      setDragging(null)
    },
    [tryMove]
  )

  const handleDragEnd = useCallback(() => {
    setDragging(null)
    setSelected(null)
    setLegalMoves([])
  }, [])

  const handleNewGame = useCallback(() => {
    setGame(new Chess())
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setDragging(null)
    setStatus('your move')
    setStatusClass('')
    setMoveHistory([])
    setThinking(false)
  }, [])

  if (modelError) return <p className="engine-error">{modelError}</p>
  if (modelLoading) return <p className="engine-loading">Loading chess model...</p>

  const board = game.board()
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const gameOver = game.isGameOver()

  return (
    <div className="chess-engine">
      <div className="engine-info">
        <span>you (white) vs stevyk6&apos;s brain (black)</span>
      </div>
      <div className="chess-board">
        {board.map((row, rowIdx) => {
          const rankIdx = 7 - rowIdx
          return row.map((piece, colIdx) => {
            const square = files[colIdx] + (rankIdx + 1)
            const isLight = (rankIdx + colIdx) % 2 === 0
            const isSelected = selected === square
            const isLegalTarget = legalMoves.some((m) => m.to === square)
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square)
            const hasPiece = !!piece

            let className = `chess-square ${isLight ? 'light' : 'dark'}`
            if (isSelected) className += ' selected'
            if (isLastMove && !isSelected) className += ' last-move'
            if (isLegalTarget) className += ' legal-target'
            if (isLegalTarget && hasPiece) className += ' has-piece'

            return (
              <div
                key={square}
                className={className}
                onClick={() => handleSquareClick(square)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, square)}
              >
                {piece && (
                  <img
                    src={pieceImgUrl(piece.color, piece.type)}
                    alt=""
                    draggable={piece.color === 'w' && !thinking && !gameOver}
                    onDragStart={(e) => handleDragStart(e, square)}
                    onDragEnd={handleDragEnd}
                    className="chess-piece-img"
                    style={dragging === square ? { visibility: 'hidden' } : undefined}
                  />
                )}
              </div>
            )
          })
        })}
      </div>
      <div className="engine-controls">
        <p className={`engine-status ${statusClass}`}>{status}</p>
        {gameOver && (
          <button className="new-game-btn" onClick={handleNewGame}>
            new game
          </button>
        )}
      </div>
      {moveHistory.length > 0 && (
        <div className="move-history">
          {moveHistory.map((san, i) => (
            <span key={i} className="move-entry">
              {i % 2 === 0 && <span className="move-number">{Math.floor(i / 2) + 1}.</span>}
              {san}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
