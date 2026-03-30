import { useEffect, useState, useCallback, useRef } from 'react'
import { Chess } from 'chess.js'
import './ChessEngine.css'

const PIECE_NAMES = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }

function pieceImgUrl(color, type) {
  return `https://lichess1.org/assets/piece/cburnett/${color === 'w' ? 'w' : 'b'}${PIECE_NAMES[type]}.svg`
}

// ── LC0/Maia board encoding (112 input planes) ───────────────

const PIECE_TO_PLANE = { p: 0, n: 1, b: 2, r: 3, q: 4, k: 5 }
const FILES = 'abcdefgh'
const RANKS = '12345678'

function encodeBoardForModel(game) {
  const planes = new Float32Array(8 * 8 * 112)
  const isBlack = game.turn() === 'b'

  for (let sq = 0; sq < 64; sq++) {
    const file = sq % 8
    const rank = Math.floor(sq / 8)
    const squareName = FILES[file] + RANKS[rank]
    const piece = game.get(squareName)
    if (!piece) continue

    let row = rank
    if (isBlack) row = 7 - row

    const plane = PIECE_TO_PLANE[piece.type]
    const isOurs = (piece.color === 'w' && !isBlack) || (piece.color === 'b' && isBlack)
    const offset = isOurs ? plane : plane + 6
    planes[(row * 8 + file) * 112 + offset] = 1.0
  }

  // Castling rights (planes 104-107)
  const fen = game.fen()
  const castling = fen.split(' ')[2]
  if (!isBlack) {
    if (castling.includes('K')) for (let i = 0; i < 64; i++) planes[i * 112 + 104] = 1.0
    if (castling.includes('Q')) for (let i = 0; i < 64; i++) planes[i * 112 + 105] = 1.0
    if (castling.includes('k')) for (let i = 0; i < 64; i++) planes[i * 112 + 106] = 1.0
    if (castling.includes('q')) for (let i = 0; i < 64; i++) planes[i * 112 + 107] = 1.0
  } else {
    if (castling.includes('k')) for (let i = 0; i < 64; i++) planes[i * 112 + 104] = 1.0
    if (castling.includes('q')) for (let i = 0; i < 64; i++) planes[i * 112 + 105] = 1.0
    if (castling.includes('K')) for (let i = 0; i < 64; i++) planes[i * 112 + 106] = 1.0
    if (castling.includes('Q')) for (let i = 0; i < 64; i++) planes[i * 112 + 107] = 1.0
  }

  // Side to move (plane 108)
  for (let i = 0; i < 64; i++) planes[i * 112 + 108] = 1.0

  // Move count (plane 111)
  const moveNum = parseInt(fen.split(' ')[5]) || 1
  const normalized = Math.min(moveNum / 100.0, 1.0)
  for (let i = 0; i < 64; i++) planes[i * 112 + 111] = normalized

  return planes
}

// ── LC0 convolution policy mapping ──────────────────────────
// Model outputs (8,8,80) flattened to 5120. Each move maps to one index.
// Must match LC0 encoder.cc direction definitions exactly.

// Queen directions: (rank_delta, file_delta)
const QUEEN_DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]]
// Knight directions
const KNIGHT_DIRS = [[2, 1], [1, 2], [-1, 2], [-2, 1], [-2, -1], [-1, -2], [1, -2], [2, -1]]

function moveToPolicyIndex(game, move) {
  const isBlack = game.turn() === 'b'
  const fromFile = FILES.indexOf(move.from[0])
  const fromRank = RANKS.indexOf(move.from[1])
  const toFile = FILES.indexOf(move.to[0])
  const toRank = RANKS.indexOf(move.to[1])

  // Mirror rank for black (LC0 convention)
  const fRank = isBlack ? 7 - fromRank : fromRank
  const fFile = fromFile
  const tRank = isBlack ? 7 - toRank : toRank
  const tFile = toFile

  const dr = tRank - fRank
  const df = tFile - fFile
  let plane

  // Underpromotion
  if (move.promotion && move.promotion !== 'q') {
    const promoMap = { n: 0, b: 1, r: 2 }
    const pieceIdx = promoMap[move.promotion]
    if (pieceIdx === undefined) return null
    const dirIdx = df + 1 // -1→0, 0→1, 1→2
    if (dirIdx < 0 || dirIdx > 2) return null
    plane = 64 + pieceIdx * 3 + dirIdx
  } else if ((Math.abs(dr) === 2 && Math.abs(df) === 1) || (Math.abs(dr) === 1 && Math.abs(df) === 2)) {
    // Knight move
    const kIdx = KNIGHT_DIRS.findIndex(([r, c]) => r === dr && c === df)
    if (kIdx === -1) return null
    plane = 56 + kIdx
  } else {
    // Queen-like move (also covers pawn pushes, captures, queen promos)
    const distance = Math.max(Math.abs(dr), Math.abs(df))
    if (distance === 0) return null
    const dRank = dr !== 0 ? dr / Math.abs(dr) : 0
    const dFile = df !== 0 ? df / Math.abs(df) : 0
    const dirIdx = QUEEN_DIRS.findIndex(([r, c]) => r === dRank && c === dFile)
    if (dirIdx === -1) return null
    plane = dirIdx * 7 + (distance - 1)
  }

  // Flatten (8, 8, 80) → 5120: index = rank * 640 + file * 80 + plane
  return fRank * 640 + fFile * 80 + plane
}

// ── Move safety check ────────────────────────────────────────

const PIECE_VALUES = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 }

function isHangingMove(game, moveObj) {
  const test = new Chess(game.fen())
  const result = test.move(moveObj)
  if (!result) return false
  const responses = test.moves({ verbose: true })
  for (const resp of responses) {
    if (resp.captured) {
      const capturedVal = PIECE_VALUES[resp.captured] || 0
      const weCapturedVal = result.captured ? (PIECE_VALUES[result.captured] || 0) : 0
      if (capturedVal > weCapturedVal + 1) return true
    }
  }
  if (responses.some((r) => {
    const t2 = new Chess(test.fen())
    t2.move(r)
    return t2.isCheckmate()
  })) return true
  return false
}

// ── Component ─────────────────────────────────────────────────

function positionKey(fen) {
  // First 4 FEN fields: position, turn, castling, en passant
  return fen.split(' ').slice(0, 4).join(' ')
}

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
  const [pendingPromotion, setPendingPromotion] = useState(null) // { from, to }
  const [playerColor, setPlayerColor] = useState(null) // null = choosing, 'w' or 'b'

  const modelRef = useRef(null)
  const tfRef = useRef(null)
  const positionCounts = useRef(new Map())
  const gameRef = useRef(null) // persistent Chess instance with full history

  // Initialize persistent game and position tracking
  useEffect(() => {
    gameRef.current = new Chess()
    const key = positionKey(gameRef.current.fen())
    positionCounts.current.set(key, 1)
  }, [])

  // Load TF.js and model on mount
  useEffect(() => {
    let cancelled = false

    async function loadModel() {
      try {
        const tf = await import('@tensorflow/tfjs')
        await tf.ready()
        if (cancelled) return
        tfRef.current = tf

        const model = await tf.loadLayersModel('/chess-model/model.json')

        if (cancelled) return
        modelRef.current = model
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
      if (!tf || !model) return null

      const board = encodeBoardForModel(currentGame)
      const boardTensor = tf.tensor(board, [1, 8, 8, 112])

      const prediction = model.predict(boardTensor)
      const logits = await prediction.data()

      boardTensor.dispose()
      prediction.dispose()

      // Get legal moves and map to policy indices (5120-space)
      const legal = currentGame.moves({ verbose: true })
      const candidates = []

      for (const move of legal) {
        const policyIdx = moveToPolicyIndex(currentGame, move)
        if (policyIdx !== null && policyIdx < logits.length) {
          candidates.push({ move, score: logits[policyIdx] })
        }
      }

      if (candidates.length === 0) {
        const randomIdx = Math.floor(Math.random() * legal.length)
        return legal[randomIdx]
      }

      // Sort by logit score, pick best non-hanging move
      candidates.sort((a, b) => b.score - a.score)

      for (const c of candidates.slice(0, 5)) {
        if (!isHangingMove(currentGame, c.move)) {
          return c.move
        }
      }
      return candidates[0].move
    },
    []
  )

  const recordPosition = useCallback((fen) => {
    const key = positionKey(fen)
    const count = (positionCounts.current.get(key) || 0) + 1
    positionCounts.current.set(key, count)
    return count
  }, [])

  const playModelMove = useCallback(
    async (currentGame) => {
      setThinking(true)
      setStatus('thinking...')

      await new Promise((r) => setTimeout(r, 300))

      const move = await getModelMove(currentGame)
      if (!move) {
        setThinking(false)
        return
      }

      const g = gameRef.current
      const result = g.move(move)
      if (!result) {
        setThinking(false)
        setStatus('your move')
        return
      }

      const count = recordPosition(g.fen())
      setGame(new Chess(g.fen()))
      setLastMove({ from: move.from, to: move.to })
      setMoveHistory((prev) => [...prev, result.san])
      setThinking(false)

      if (g.isGameOver() || count >= 3) {
        if (g.isCheckmate()) {
          setStatus('checkmate — you lose')
          setStatusClass('lost')
        } else if (count >= 3) {
          setStatus('draw — threefold repetition')
          setStatusClass('')
        } else {
          setStatus('draw')
          setStatusClass('')
        }
      } else {
        setStatus(g.inCheck() ? 'check — your move' : 'your move')
        setStatusClass('')
      }
    },
    [getModelMove, recordPosition]
  )

  const executeMove = useCallback(
    (fromSquare, toSquare, promotion) => {
      const g = gameRef.current
      const result = g.move({ from: fromSquare, to: toSquare, promotion })
      if (!result) return false

      const count = recordPosition(g.fen())
      setGame(new Chess(g.fen()))
      setLastMove({ from: fromSquare, to: toSquare })
      setSelected(null)
      setLegalMoves([])
      setMoveHistory((prev) => [...prev, result.san])

      if (g.isGameOver() || count >= 3) {
        if (g.isCheckmate()) {
          setStatus('checkmate — you win!')
          setStatusClass('won')
        } else if (count >= 3) {
          setStatus('draw — threefold repetition')
          setStatusClass('')
        } else {
          setStatus('draw')
          setStatusClass('')
        }
      } else {
        playModelMove(new Chess(g.fen()))
      }

      return true
    },
    [playModelMove, recordPosition]
  )

  const tryMove = useCallback(
    (fromSquare, toSquare) => {
      if (!game || thinking || game.isGameOver()) return false
      if (game.turn() !== playerColor) return false

      const moves = game.moves({ square: fromSquare, verbose: true })
      const targetMoves = moves.filter((m) => m.to === toSquare)
      if (targetMoves.length === 0) return false

      // Check if this is a promotion move
      if (targetMoves.some((m) => m.promotion)) {
        setPendingPromotion({ from: fromSquare, to: toSquare })
        return true
      }

      return executeMove(fromSquare, toSquare)
    },
    [game, thinking, executeMove, playerColor]
  )

  const handlePromotionChoice = useCallback(
    (piece) => {
      if (!pendingPromotion) return
      const { from, to } = pendingPromotion
      setPendingPromotion(null)
      executeMove(from, to, piece)
    },
    [pendingPromotion, executeMove]
  )

  const cancelPromotion = useCallback(() => {
    setPendingPromotion(null)
    setSelected(null)
    setLegalMoves([])
  }, [])

  const handleSquareClick = useCallback(
    (square) => {
      if (!game || thinking || game.isGameOver() || game.turn() !== playerColor || pendingPromotion) return

      const piece = game.get(square)

      if (selected) {
        if (selected !== square && tryMove(selected, square)) return

        if (piece && piece.color === playerColor) {
          setSelected(square)
          setLegalMoves(game.moves({ square, verbose: true }))
          return
        }

        setSelected(null)
        setLegalMoves([])
        return
      }

      if (piece && piece.color === playerColor) {
        setSelected(square)
        setLegalMoves(game.moves({ square, verbose: true }))
      }
    },
    [game, selected, tryMove, thinking, pendingPromotion, playerColor]
  )

  const handleDragStart = useCallback(
    (e, square) => {
      if (!game || thinking || game.isGameOver() || game.turn() !== playerColor) {
        e.preventDefault()
        return
      }
      const piece = game.get(square)
      if (!piece || piece.color !== playerColor) {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', square)
      e.dataTransfer.effectAllowed = 'move'
      setSelected(square)
      setLegalMoves(game.moves({ square, verbose: true }))
      requestAnimationFrame(() => setDragging(square))
    },
    [game, thinking, playerColor]
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

  const chooseColor = useCallback(
    (color) => {
      setPlayerColor(color)
      if (color === 'b') {
        const g = gameRef.current
        playModelMove(new Chess(g.fen()))
      } else {
        setStatus('your move')
      }
    },
    [playModelMove]
  )

  const handleNewGame = useCallback(() => {
    const fresh = new Chess()
    gameRef.current = fresh
    positionCounts.current = new Map()
    positionCounts.current.set(positionKey(fresh.fen()), 1)
    setGame(new Chess())
    setSelected(null)
    setLegalMoves([])
    setLastMove(null)
    setDragging(null)
    setStatus('')
    setStatusClass('')
    setMoveHistory([])
    setThinking(false)
    setPendingPromotion(null)
    setPlayerColor(null)
  }, [])

  if (modelError) return <p className="engine-error">{modelError}</p>
  if (modelLoading) return <p className="engine-loading">Loading chess model...</p>

  if (!playerColor) {
    return (
      <div className="chess-engine">
        <div className="color-picker">
          <p>play as</p>
          <div className="color-options">
            <button className="color-btn white" onClick={() => chooseColor('w')}>
              <img src={pieceImgUrl('w', 'k')} alt="white" />
              white
            </button>
            <button className="color-btn black" onClick={() => chooseColor('b')}>
              <img src={pieceImgUrl('b', 'k')} alt="black" />
              black
            </button>
          </div>
        </div>
        <p className="engine-explanation">
          built on top of <a href="https://maiachess.com" target="_blank" rel="noopener noreferrer">maia chess</a> and fine-tuned to play like me using my ~2,400 rated lichess games.
        </p>
      </div>
    )
  }

  const flipped = playerColor === 'b'
  const filesArr = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
  const repCount = positionCounts.current.get(positionKey(game.fen())) || 0
  const gameOver = game.isGameOver() || repCount >= 3

  // Build squares array with proper orientation
  const squares = []
  for (let displayRow = 0; displayRow < 8; displayRow++) {
    for (let displayCol = 0; displayCol < 8; displayCol++) {
      const rank = flipped ? displayRow : (7 - displayRow)
      const file = flipped ? (7 - displayCol) : displayCol
      const square = filesArr[file] + (rank + 1)
      const piece = game.get(square)
      squares.push({ square, piece, rank, file })
    }
  }

  const promoCol = pendingPromotion
    ? (flipped ? 7 - filesArr.indexOf(pendingPromotion.to[0]) : filesArr.indexOf(pendingPromotion.to[0]))
    : 0

  return (
    <div className="chess-engine">
      <div className="engine-info">
        <span className="player-label">
          <span className={`color-dot ${playerColor === 'w' ? 'white' : 'black'}`} />
          you
        </span>
        <span className="vs-separator">vs</span>
        <span className="player-label">
          <span className={`color-dot ${playerColor === 'w' ? 'black' : 'white'}`} />
          peak me (2100)
        </span>
      </div>
      <div className="chess-board">
        {squares.map(({ square, piece, rank, file }) => {
          const isLight = (rank + file) % 2 === 0
          const isSelected = selected === square
          const isLegalTarget = !pendingPromotion && legalMoves.some((m) => m.to === square)
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
              onClick={() => pendingPromotion ? cancelPromotion() : handleSquareClick(square)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, square)}
            >
              {piece && (
                <img
                  src={pieceImgUrl(piece.color, piece.type)}
                  alt=""
                  draggable={piece.color === playerColor && !thinking && !gameOver && !pendingPromotion}
                  onDragStart={(e) => handleDragStart(e, square)}
                  onDragEnd={handleDragEnd}
                  className="chess-piece-img"
                  style={dragging === square ? { visibility: 'hidden' } : undefined}
                />
              )}
            </div>
          )
        })}
        {pendingPromotion && (
          <div className="promotion-overlay" onClick={cancelPromotion}>
            <div
              className="promotion-picker"
              style={{ '--promo-col': promoCol }}
              onClick={(e) => e.stopPropagation()}
            >
              {['q', 'r', 'b', 'n'].map((p) => (
                <div key={p} className="promotion-option" onClick={() => handlePromotionChoice(p)}>
                  <img src={pieceImgUrl(playerColor, p)} alt={p} />
                </div>
              ))}
            </div>
          </div>
        )}
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
      <p className="engine-explanation">
        built on top of <a href="https://maiachess.com" target="_blank" rel="noopener noreferrer">maia chess</a> and fine-tuned to play like me using my ~2,400 rated lichess games.
      </p>
    </div>
  )
}
