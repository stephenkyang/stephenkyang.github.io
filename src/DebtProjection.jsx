import { useState, useRef } from 'react'
import './DebtProjection.css'

// Historical debt-to-GDP (debt held by public, %)
const HISTORICAL = [
  { year: 2000, ratio: 33.7 },
  { year: 2001, ratio: 31.5 },
  { year: 2002, ratio: 33.0 },
  { year: 2003, ratio: 34.5 },
  { year: 2004, ratio: 35.6 },
  { year: 2005, ratio: 35.7 },
  { year: 2006, ratio: 35.4 },
  { year: 2007, ratio: 35.2 },
  { year: 2008, ratio: 39.4 },
  { year: 2009, ratio: 52.3 },
  { year: 2010, ratio: 60.6 },
  { year: 2011, ratio: 65.5 },
  { year: 2012, ratio: 70.3 },
  { year: 2013, ratio: 72.3 },
  { year: 2014, ratio: 73.7 },
  { year: 2015, ratio: 73.6 },
  { year: 2016, ratio: 76.4 },
  { year: 2017, ratio: 76.0 },
  { year: 2018, ratio: 77.8 },
  { year: 2019, ratio: 79.2 },
  { year: 2020, ratio: 100.3 },
  { year: 2021, ratio: 97.0 },
  { year: 2022, ratio: 96.2 },
  { year: 2023, ratio: 97.3 },
  { year: 2024, ratio: 99.0 },
]

// FY2024 baseline (trillions)
const BASE_YEAR = 2024
const BASE_GDP = 29.0
const BASE_DEBT = 28.9
const BASE_REVENUE_PCT = 17.8 // % of GDP
const BASE_DISCRETIONARY = 1.80 // trillions
const BASE_MANDATORY = 3.85 // trillions
const DEFAULTS = {
  gdpGrowth: 1.8,
  inflation: 2.4,
  discretionaryGrowth: 3.2,
  mandatoryGrowth: 5.8,
  interestRate: 3.2,
  revenueGrowthPct: 0.2, // CBO assumes slight rise from current-law tax provisions expiring
}

function project(params) {
  const { gdpGrowth, inflation, discretionaryGrowth, mandatoryGrowth, interestRate } = params
  const nominalGdpGrowth = (1 + gdpGrowth / 100) * (1 + inflation / 100) - 1
  const revenuePct = (BASE_REVENUE_PCT + params.revenueGrowthPct) / 100

  const points = []
  let gdp = BASE_GDP
  let debt = BASE_DEBT
  let disc = BASE_DISCRETIONARY
  let mand = BASE_MANDATORY

  for (let y = BASE_YEAR + 1; y <= 2050; y++) {
    gdp *= (1 + nominalGdpGrowth)
    disc *= (1 + discretionaryGrowth / 100)
    mand *= (1 + mandatoryGrowth / 100)

    const interest = debt * (interestRate / 100)
    const spending = disc + mand + interest
    const revenue = gdp * revenuePct
    const deficit = spending - revenue

    debt += deficit
    points.push({ year: y, ratio: Math.max(0, (debt / gdp) * 100) })
  }
  return points
}

function Slider({ label, sublabel, displayValue, rawValue, defaultValue, min, max, step, onChange }) {
  const pct = ((defaultValue - min) / (max - min)) * 100
  return (
    <div className="slider-group">
      <label><span>{label}</span> <span className="slider-value">{displayValue}</span></label>
      {sublabel && <span className="slider-sublabel">{sublabel}</span>}
      <div className="slider-track-wrapper">
        <div className="slider-default-mark" style={{ left: `${pct}%` }} />
        <input type="range" min={min} max={max} step={step} value={rawValue} onChange={onChange} />
      </div>
    </div>
  )
}

const PADDING = { top: 30, right: 20, bottom: 40, left: 55 }

function DebtProjection() {
  const [params, setParams] = useState(DEFAULTS)
  const [hoverIndex, setHoverIndex] = useState(null)
  const svgRef = useRef(null)

  const projected = project(params)
  const allData = [...HISTORICAL, ...projected]
  const years = allData.map(d => d.year)
  const ratios = allData.map(d => d.ratio)

  const minYear = years[0]
  const maxYear = years[years.length - 1]
  const maxRatio = Math.max(...ratios, 120)
  const minRatio = 0

  const width = 640
  const height = 320
  const chartW = width - PADDING.left - PADDING.right
  const chartH = height - PADDING.top - PADDING.bottom

  const xScale = (year) => PADDING.left + ((year - minYear) / (maxYear - minYear)) * chartW
  const yScale = (ratio) => PADDING.top + chartH - ((ratio - minRatio) / (maxRatio - minRatio)) * chartH

  const historicalPath = HISTORICAL.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(d.year).toFixed(1)},${yScale(d.ratio).toFixed(1)}`
  ).join(' ')

  const projectedPath = [HISTORICAL[HISTORICAL.length - 1], ...projected].map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(d.year).toFixed(1)},${yScale(d.ratio).toFixed(1)}`
  ).join(' ')

  // Country debt-to-GDP reference lines
  const countries = [
    { name: 'Luxembourg', ratio: 26 },
    { name: 'Germany', ratio: 62 },
    { name: 'China', ratio: 88 },
    { name: 'UK', ratio: 94 },
    { name: 'Italy', ratio: 135 },
    { name: 'Greece', ratio: 154 },
    { name: 'Weimar Republic 1923', ratio: 170 },
    { name: 'Singapore', ratio: 173 },
    { name: 'Japan', ratio: 237 },
  ]
  const peakProjected = Math.max(...projected.map(d => d.ratio))
  const visibleCountries = countries.filter(c => c.ratio <= peakProjected && c.ratio <= maxRatio)

  // Offset labels that are too close vertically
  // sorted low→high ratio, which means high→low y (since y-axis is inverted in SVG)
  const labelPositions = visibleCountries.map(c => ({ ...c, labelY: yScale(c.ratio) - 4 }))
  const minGap = 10
  // walk from highest ratio (lowest y) to lowest ratio (highest y)
  // if two labels overlap, push the lower-ratio one further down (higher y)
  for (let i = labelPositions.length - 2; i >= 0; i--) {
    const above = labelPositions[i + 1] // higher ratio, lower y
    const current = labelPositions[i]   // lower ratio, higher y
    if (current.labelY - above.labelY < minGap) {
      current.labelY = above.labelY + minGap
    }
  }

  // CBO baseline for comparison
  const cboBaseline = [
    { year: 2024, ratio: 99 }, { year: 2025, ratio: 100 }, { year: 2026, ratio: 101 },
    { year: 2027, ratio: 103 }, { year: 2028, ratio: 105 }, { year: 2029, ratio: 107 },
    { year: 2030, ratio: 109 }, { year: 2031, ratio: 111 }, { year: 2032, ratio: 113 },
    { year: 2033, ratio: 116 }, { year: 2034, ratio: 118 }, { year: 2035, ratio: 118 },
    { year: 2040, ratio: 133 }, { year: 2045, ratio: 150 }, { year: 2050, ratio: 166 },
  ]
  const cboPath = cboBaseline.map((d, i) =>
    `${i === 0 ? 'M' : 'L'}${xScale(d.year).toFixed(1)},${yScale(d.ratio).toFixed(1)}`
  ).join(' ')

  // Grid lines
  const yTicks = []
  const step = maxRatio > 200 ? 50 : 25
  for (let v = 0; v <= maxRatio; v += step) yTicks.push(v)

  const xTicks = []
  for (let y = 2000; y <= 2050; y += 10) xTicks.push(y)

  const handleMouseMove = (e) => {
    const svg = svgRef.current
    if (!svg) return
    const rect = svg.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const year = minYear + ((mouseX - PADDING.left) / chartW) * (maxYear - minYear)
    const closest = allData.reduce((prev, curr, i) =>
      Math.abs(curr.year - year) < Math.abs(allData[prev].year - year) ? i : prev, 0)
    setHoverIndex(closest)
  }

  const set = (key) => (e) => setParams(p => ({ ...p, [key]: parseFloat(e.target.value) }))

  const hoverData = hoverIndex !== null ? allData[hoverIndex] : null
  const isProjected = hoverData && hoverData.year > BASE_YEAR
  const finalRatio = projected[projected.length - 1]?.ratio

  return (
    <div className="debt-projection">
      <p className="debt-intro">
        I wanted to illustrate just how (im)possible it is to put US debt on a
        sustainable path. Use the sliders below to see what combination of growth, spending cuts,
        and revenue increases it would actually take.
      </p>
      <p className="debt-subtitle">
        Federal Debt Held by the Public as a Percentage of GDP, 2000–2050
      </p>

      <svg
        ref={svgRef}
        className="debt-chart"
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        {/* Grid */}
        {yTicks.map(v => (
          <g key={v}>
            <line className="grid-line" x1={PADDING.left} x2={width - PADDING.right} y1={yScale(v)} y2={yScale(v)} />
            <text className="axis-label" x={PADDING.left - 8} y={yScale(v) + 3} textAnchor="end">{v}%</text>
          </g>
        ))}
        {xTicks.map(y => (
          <text key={y} className="axis-label" x={xScale(y)} y={height - 8} textAnchor="middle">{y}</text>
        ))}

        {/* 100% reference line */}
        <line className="baseline" x1={PADDING.left} x2={width - PADDING.right} y1={yScale(100)} y2={yScale(100)} />

        {/* Projection zone shading */}
        <rect
          x={xScale(BASE_YEAR)}
          y={PADDING.top}
          width={xScale(2050) - xScale(BASE_YEAR)}
          height={chartH}
          className="projection-zone"
        />

        {/* Country reference lines */}
        {labelPositions.map(c => (
          <g key={c.name}>
            <line className="country-line" x1={PADDING.left} x2={width - PADDING.right} y1={yScale(c.ratio)} y2={yScale(c.ratio)} />
            <text className="country-label" x={PADDING.left + 4} y={c.labelY} textAnchor="start">{c.name} ({c.ratio}%)</text>
          </g>
        ))}

        {/* CBO baseline */}
        <path d={cboPath} className="chart-line cbo-line" />

        {/* Historical line */}
        <path d={historicalPath} className="chart-line historical-line" />

        {/* Projected line */}
        <path d={projectedPath} className="chart-line projected-line" />

        {/* Hover */}
        {hoverData && (
          <>
            <line className="crosshair" x1={xScale(hoverData.year)} x2={xScale(hoverData.year)} y1={PADDING.top} y2={PADDING.top + chartH} />
            <circle cx={xScale(hoverData.year)} cy={yScale(hoverData.ratio)} r={3.5} className="hover-dot" style={{ stroke: isProjected ? '#ff6b6b' : '#7aa2f7' }} />
          </>
        )}
      </svg>

      {/* Hover info */}
      <div className="debt-hover-info">
        {hoverData ? (
          <>
            <span className="hover-year">{hoverData.year}</span>
            <span className={isProjected ? 'projected-color' : 'historical-color'}>
              {hoverData.ratio.toFixed(1)}% of GDP
            </span>
            {isProjected && <span className="hover-tag">projected</span>}
          </>
        ) : (
          <span className="hover-year">hover over chart</span>
        )}
      </div>

      {/* Legend */}
      <div className="debt-legend">
        <span className="debt-legend-item"><span className="legend-swatch historical-swatch" /> historical</span>
        <span className="debt-legend-item"><span className="legend-swatch projected-swatch" /> your projection</span>
        <span className="debt-legend-item"><span className="legend-swatch cbo-swatch" /> CBO baseline</span>
      </div>

      <p className="debt-cbo-note">
        note: if you're wondering why the two lines don't match exactly — CBO models each program
        individually with demographic projections (e.g. accelerating Medicare costs as boomers age),
        while this model uses constant growth rates. the endpoints converge but the path differs.
      </p>

      {/* Sliders */}
      <div className="debt-controls">
        <Slider label="real GDP growth" displayValue={`${params.gdpGrowth.toFixed(1)}%`} rawValue={params.gdpGrowth} defaultValue={DEFAULTS.gdpGrowth}
          min={-2} max={6} step={0.1} onChange={set('gdpGrowth')} />
        <Slider label="inflation" displayValue={`${params.inflation.toFixed(1)}%`} rawValue={params.inflation} defaultValue={DEFAULTS.inflation}
          min={0} max={10} step={0.1} onChange={set('inflation')} />
        <Slider label="discretionary spending growth" displayValue={`${params.discretionaryGrowth.toFixed(1)}%`} rawValue={params.discretionaryGrowth} defaultValue={DEFAULTS.discretionaryGrowth}
          min={-2} max={10} step={0.1} onChange={set('discretionaryGrowth')} />
        <Slider label="mandatory spending growth" displayValue={`${params.mandatoryGrowth.toFixed(1)}%`} rawValue={params.mandatoryGrowth} defaultValue={DEFAULTS.mandatoryGrowth}
          min={0} max={10} step={0.1} onChange={set('mandatoryGrowth')} />
        <Slider label="avg interest rate on debt" displayValue={`${params.interestRate.toFixed(1)}%`} rawValue={params.interestRate} defaultValue={DEFAULTS.interestRate}
          min={1} max={8} step={0.1} onChange={set('interestRate')} />
        <Slider label="revenue as % of GDP" sublabel="the share of GDP the government collects in taxes" displayValue={`${(BASE_REVENUE_PCT + params.revenueGrowthPct).toFixed(1)}%`} rawValue={params.revenueGrowthPct} defaultValue={DEFAULTS.revenueGrowthPct}
          min={-5} max={7} step={0.1} onChange={set('revenueGrowthPct')} />
        <button className="reset-btn" onClick={() => setParams(DEFAULTS)}>reset to CBO baseline</button>
      </div>

      {/* Summary */}
      <p className="debt-summary">
        with these assumptions, debt reaches <strong>{finalRatio?.toFixed(0)}%</strong> of GDP by 2050
      </p>

      <p className="debt-explanation">
        model uses FY2024 baselines from CBO: $29T GDP, $28.9T public debt, $1.8T discretionary spending,
        $3.85T mandatory spending, 17.8% revenue/GDP. defaults are calibrated to approximate the
        CBO January 2025 projections under current law. interest compounds on accumulated debt.
      </p>
    </div>
  )
}

export default DebtProjection
