import Hemicycle from './Hemicycle'
import EspionageTimeline from './EspionageTimeline'

const PROSECUTIONS = [
  { year: 2021, count: 16 },
  { year: 2022, count: 10 },
  { year: 2023, count: 48 },
  { year: 2024, count: 64 },
]

const MAX_COUNT = Math.max(...PROSECUTIONS.map((d) => d.count))

function ProsecutionChart() {
  return (
    <div style={{ maxWidth: 700, margin: '2rem auto 0', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: '1.1rem', color: '#1a1a1a', margin: '0 0 0.75rem', textAlign: 'center' }}>
        Number of Taiwanese Prosecuted as Chinese Spies
      </h2>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {PROSECUTIONS.map((d) => (
          <div key={d.year} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ width: 36, fontSize: '0.75rem', color: '#555', textAlign: 'right', marginRight: 8, flexShrink: 0 }}>{d.year}</span>
            <div style={{ flex: 1, position: 'relative', height: 22 }}>
              <div style={{
                width: `${(d.count / MAX_COUNT) * 100}%`,
                height: '100%',
                backgroundColor: '#cc2222',
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{ width: 28, fontSize: '0.72rem', color: '#1a1a1a', fontWeight: 600, textAlign: 'left', marginLeft: 6, flexShrink: 0 }}>{d.count}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.6rem', color: '#999', margin: '0.4rem 0 0', textAlign: 'center' }}>
        Source: National Security Bureau via Domino Theory
      </p>
    </div>
  )
}

export default function TaiwanFifthColumn() {
  return (
    <div>
      <Hemicycle />
      <ProsecutionChart />
      <EspionageTimeline collapsible />
    </div>
  )
}
