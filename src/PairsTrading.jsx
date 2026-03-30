import { useEffect, useState, useRef } from 'react'
import './PairsTrading.css'

const PADDING = { top: 30, right: 20, bottom: 40, left: 60 }

function PairsTrading() {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [hoverIndex, setHoverIndex] = useState(null)
  const [activeLines, setActiveLines] = useState({ pairs: true, sp500: true })
  const svgRef = useRef(null)

  useEffect(() => {
    fetch('/pairs-data.json')
      .then((r) => {
        if (!r.ok) throw new Error('Data not found')
        return r.json()
      })
      .then(setData)
      .catch(() => setError('Could not load pairs trading data.'))
  }, [])

  if (error) return <p className="pairs-error">{error}</p>
  if (!data) return <p className="pairs-loading">loading chart data...</p>

  const pairs = data.pairs_trading
  const sp500 = data.sp500
  const hasSP500 = sp500 && sp500.length > 0

  // Build a unified date→value map for SP500 for alignment
  const sp500Map = {}
  if (hasSP500) {
    sp500.forEach((d) => { sp500Map[d.date] = d.value })
  }

  // Use pairs trading dates as the x-axis
  const hasDates = pairs[0] && pairs[0].date
  const labels = pairs.map((d, i) => d.date || i)

  // Get aligned SP500 values (may have gaps on non-trading days)
  const sp500Aligned = hasDates && hasSP500
    ? pairs.map((d) => sp500Map[d.date] ?? null)
    : hasSP500 ? sp500.map((d) => d.value) : []

  const pairsValues = pairs.map((d) => d.value)

  // Compute chart dimensions
  const width = 600
  const height = 300
  const chartW = width - PADDING.left - PADDING.right
  const chartH = height - PADDING.top - PADDING.bottom

  // Value range
  const allValues = [
    ...pairsValues,
    ...(activeLines.sp500 ? sp500Aligned.filter((v) => v !== null) : []),
  ]
  const minVal = Math.min(...allValues) * 0.95
  const maxVal = Math.max(...allValues) * 1.05
  const valRange = maxVal - minVal

  const xScale = (i) => PADDING.left + (i / (pairsValues.length - 1)) * chartW
  const yScale = (v) => PADDING.top + chartH - ((v - minVal) / valRange) * chartH

  // Build SVG path strings
  const buildPath = (values) => {
    let d = ''
    values.forEach((v, i) => {
      if (v === null) return
      const x = xScale(i)
      const y = yScale(v)
      if (d === '' || (i > 0 && values[i - 1] === null)) {
        d += `M${x},${y}`
      } else {
        d += `L${x},${y}`
      }
    })
    return d
  }

  const pairsPath = buildPath(pairsValues)
  const sp500Path = hasSP500 ? buildPath(sp500Aligned) : ''

  // Y-axis ticks
  const tickCount = 5
  const yTicks = Array.from({ length: tickCount + 1 }, (_, i) => {
    const val = minVal + (valRange * i) / tickCount
    return { val, y: yScale(val) }
  })

  // X-axis labels (show ~5 dates)
  const xLabelCount = 5
  const xLabels = Array.from({ length: xLabelCount }, (_, i) => {
    const idx = Math.round((i / (xLabelCount - 1)) * (labels.length - 1))
    const label = hasDates ? formatDate(labels[idx]) : `Day ${labels[idx]}`
    return { label, x: xScale(idx) }
  })

  // Hover tooltip
  const handleMouseMove = (e) => {
    if (!svgRef.current) return
    const rect = svgRef.current.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const idx = Math.round(((mouseX - PADDING.left) / chartW) * (pairsValues.length - 1))
    if (idx >= 0 && idx < pairsValues.length) {
      setHoverIndex(idx)
    }
  }

  const finalPairs = pairsValues[pairsValues.length - 1]
  const pairsReturn = ((finalPairs - 10000) / 10000 * 100).toFixed(1)
  const finalSP = hasSP500 && sp500Aligned.length > 0
    ? sp500Aligned.filter((v) => v !== null).pop()
    : null
  const spReturn = finalSP ? ((finalSP - 10000) / 10000 * 100).toFixed(1) : null

  return (
    <div className="pairs-trading">
      <div className="pairs-legend">
        <button
          className={`legend-item${activeLines.pairs ? ' active' : ''}`}
          onClick={() => setActiveLines((p) => ({ ...p, pairs: !p.pairs }))}
        >
          <span className="legend-dot pairs-dot" />
          pairs trading {pairsReturn > 0 ? '+' : ''}{pairsReturn}%
        </button>
        {hasSP500 && (
          <button
            className={`legend-item${activeLines.sp500 ? ' active' : ''}`}
            onClick={() => setActiveLines((p) => ({ ...p, sp500: !p.sp500 }))}
          >
            <span className="legend-dot sp500-dot" />
            s&p 500 {spReturn > 0 ? '+' : ''}{spReturn}%
          </button>
        )}
      </div>

      <svg
        ref={svgRef}
        className="pairs-chart"
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid lines */}
        {yTicks.map((t, i) => (
          <line key={i} x1={PADDING.left} x2={width - PADDING.right} y1={t.y} y2={t.y} className="grid-line" />
        ))}

        {/* $10k baseline */}
        <line
          x1={PADDING.left} x2={width - PADDING.right}
          y1={yScale(10000)} y2={yScale(10000)}
          className="baseline"
        />

        {/* Lines */}
        {activeLines.sp500 && sp500Path && (
          <path d={sp500Path} className="chart-line sp500-line" />
        )}
        {activeLines.pairs && (
          <path d={pairsPath} className="chart-line pairs-line" />
        )}

        {/* Y-axis labels */}
        {yTicks.map((t, i) => (
          <text key={i} x={PADDING.left - 8} y={t.y + 4} className="axis-label" textAnchor="end">
            ${(t.val / 1000).toFixed(1)}k
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((l, i) => (
          <text key={i} x={l.x} y={height - 8} className="axis-label" textAnchor="middle">
            {l.label}
          </text>
        ))}

        {/* Hover crosshair and tooltip */}
        {hoverIndex !== null && (
          <>
            <line
              x1={xScale(hoverIndex)} x2={xScale(hoverIndex)}
              y1={PADDING.top} y2={PADDING.top + chartH}
              className="crosshair"
            />
            {activeLines.pairs && (
              <circle cx={xScale(hoverIndex)} cy={yScale(pairsValues[hoverIndex])} r="3" className="hover-dot pairs-dot-svg" />
            )}
            {activeLines.sp500 && sp500Aligned[hoverIndex] !== null && sp500Aligned[hoverIndex] !== undefined && (
              <circle cx={xScale(hoverIndex)} cy={yScale(sp500Aligned[hoverIndex])} r="3" className="hover-dot sp500-dot-svg" />
            )}
          </>
        )}
      </svg>

      {/* Hover info — always rendered to avoid layout shift */}
      <div className="pairs-hover-info" style={{ visibility: hoverIndex !== null ? 'visible' : 'hidden' }}>
        <span className="hover-date">{hoverIndex !== null ? (hasDates ? formatDate(labels[hoverIndex]) : `Day ${labels[hoverIndex]}`) : '\u00A0'}</span>
        {activeLines.pairs && (
          <span className="hover-val pairs-color">{hoverIndex !== null ? `pairs: $${pairsValues[hoverIndex].toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '\u00A0'}</span>
        )}
        {activeLines.sp500 && (
          <span className="hover-val sp500-color">{hoverIndex !== null && sp500Aligned[hoverIndex] != null ? `s&p: $${sp500Aligned[hoverIndex].toLocaleString(undefined, { maximumFractionDigits: 0 })}` : '\u00A0'}</span>
        )}
      </div>

      <p className="pairs-explanation">
        i wrote a pairs trading algorithm my freshman year of college and now finally have the ability to get claude to graph the results.
        backtested on $10k over {data.trading_days} trading days using cointegration, hurst exponent, and bollinger bands.
        of course, everyone&apos;s a genius in a bull market.{' '}
        <a href="https://github.com/stephenkyang/mean-reversion-pairs-trading" target="_blank" rel="noopener noreferrer">
          view source
        </a>
      </p>
    </div>
  )
}

function formatDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return dateStr
  const d = new Date(dateStr + 'T00:00:00')
  const formatted = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
  return formatted.replace(/(\d{2})$/, "'$1")
}

export default PairsTrading
