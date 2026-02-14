import { useEffect, useState, useCallback } from 'react'
import { Chess } from 'chess.js'
import './ChessPuzzle.css'

const PIECE_NAMES = { p: 'P', n: 'N', b: 'B', r: 'R', q: 'Q', k: 'K' }

function pieceImgUrl(color, type) {
  return `https://lichess1.org/assets/piece/cburnett/${color === 'w' ? 'w' : 'b'}${PIECE_NAMES[type]}.svg`
}

function uciToMove(uci) {
  const move = { from: uci.slice(0, 2), to: uci.slice(2, 4) }
  if (uci.length > 4) move.promotion = uci[4]
  return move
}

export default function ChessPuzzle() {
  const [game, setGame] = useState(null)
  const [solution, setSolution] = useState([])
  const [moveIndex, setMoveIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [legalMoves, setLegalMoves] = useState([])
  const [status, setStatus] = useState('')
  const [statusClass, setStatusClass] = useState('')
  const [flipped, setFlipped] = useState(false)
  const [lastMove, setLastMove] = useState(null)
  const [dragging, setDragging] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [puzzleInfo, setPuzzleInfo] = useState(null)

  useEffect(() => {
    fetch('https://lichess.org/api/puzzle/daily', {
      headers: { Accept: 'application/json' },
    })
      .then((r) => r.json())
      .then((data) => {
        // Replay the full PGN — the last move is the opponent's trigger
        const chess = new Chess()
        chess.loadPgn(data.game.pgn)
        const history = chess.history({ verbose: true })

        // Rebuild position up to the last PGN move (the trigger)
        const setupChess = new Chess()
        for (let i = 0; i < history.length; i++) {
          setupChess.move(history[i].san)
        }

        // The trigger move is the last PGN move; solution[0] is the player's first move
        const triggerMove = history[history.length - 1]
        const playerColor = setupChess.turn() // 'w' or 'b'
        const shouldFlip = playerColor === 'b'

        setGame(setupChess)
        setSolution(data.puzzle.solution)
        setMoveIndex(0)
        setFlipped(shouldFlip)
        setLastMove({ from: triggerMove.from, to: triggerMove.to })
        setStatus(playerColor === 'w' ? 'White to move' : 'Black to move')
        setStatusClass('')
        setPuzzleInfo({ rating: data.puzzle.rating, id: data.puzzle.id })
        setLoading(false)
      })
      .catch((err) => {
        console.error('Puzzle load error:', err)
        setError('Failed to load puzzle')
        setLoading(false)
      })
  }, [])

  const tryMove = useCallback(
    (fromSquare, toSquare) => {
      if (!game || statusClass === 'correct') return false

      const moves = game.moves({ square: fromSquare, verbose: true })
      const targetMove = moves.find((m) => m.to === toSquare)
      if (!targetMove) return false

      const expectedUci = solution[moveIndex]
      const expected = uciToMove(expectedUci)

      if (targetMove.from === expected.from && targetMove.to === expected.to) {
        const newGame = new Chess(game.fen())
        newGame.move({ from: targetMove.from, to: targetMove.to, promotion: expected.promotion || 'q' })
        setGame(newGame)
        setLastMove({ from: targetMove.from, to: targetMove.to })
        setSelected(null)
        setLegalMoves([])

        const nextIndex = moveIndex + 1
        if (nextIndex >= solution.length) {
          setStatus('Puzzle complete!')
          setStatusClass('correct')
          setMoveIndex(nextIndex)
        } else {
          const opponentUci = solution[nextIndex]
          const opponentMove = uciToMove(opponentUci)
          const afterOpponent = new Chess(newGame.fen())
          afterOpponent.move(opponentMove)
          setGame(afterOpponent)
          setLastMove({ from: opponentMove.from, to: opponentMove.to })
          setMoveIndex(nextIndex + 1)

          if (nextIndex + 1 >= solution.length) {
            setStatus('Puzzle complete!')
            setStatusClass('correct')
          } else {
            setStatus('Correct! Keep going...')
            setStatusClass('')
          }
        }
      } else {
        setStatus('Try again')
        setStatusClass('wrong')
        setSelected(null)
        setLegalMoves([])
        setTimeout(() => {
          setStatus(game.turn() === 'w' ? 'White to move' : 'Black to move')
          setStatusClass('')
        }, 1200)
      }
      return true
    },
    [game, solution, moveIndex, statusClass]
  )

  const handleSquareClick = useCallback(
    (square) => {
      if (!game || statusClass === 'correct') return

      const piece = game.get(square)

      if (selected) {
        if (selected !== square && tryMove(selected, square)) return

        if (piece && piece.color === game.turn()) {
          setSelected(square)
          setLegalMoves(game.moves({ square, verbose: true }))
          setStatusClass('')
          return
        }

        setSelected(null)
        setLegalMoves([])
        return
      }

      if (piece && piece.color === game.turn()) {
        setSelected(square)
        setLegalMoves(game.moves({ square, verbose: true }))
      }
    },
    [game, selected, tryMove, statusClass]
  )

  const handleDragStart = useCallback(
    (e, square) => {
      if (!game || statusClass === 'correct') return
      const piece = game.get(square)
      if (!piece || piece.color !== game.turn()) {
        e.preventDefault()
        return
      }
      e.dataTransfer.setData('text/plain', square)
      e.dataTransfer.effectAllowed = 'move'
      setSelected(square)
      setLegalMoves(game.moves({ square, verbose: true }))
      requestAnimationFrame(() => setDragging(square))
    },
    [game, statusClass]
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

  if (loading) return <p className="puzzle-loading">Loading daily puzzle...</p>
  if (error) return <p className="puzzle-error">{error}</p>

  const board = game.board()
  const rows = flipped ? [...board].reverse() : board
  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']

  return (
    <div className="chess-puzzle">
      {puzzleInfo && (
        <div className="puzzle-info">
          <span>Daily Puzzle</span>
          <span>Rating: {puzzleInfo.rating}</span>
        </div>
      )}
      <div className="chess-board">
        {rows.map((row, rowIdx) => {
          const displayRow = flipped ? [...row].reverse() : row
          const rankIdx = flipped ? rowIdx : 7 - rowIdx
          return displayRow.map((piece, colIdx) => {
            const fileIdx = flipped ? 7 - colIdx : colIdx
            const square = files[fileIdx] + (rankIdx + 1)
            const isLight = (rankIdx + fileIdx) % 2 === 0
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
                    draggable={piece.color === game.turn() && statusClass !== 'correct'}
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
      <p className={`puzzle-status ${statusClass}`}>{status}</p>
    </div>
  )
}
