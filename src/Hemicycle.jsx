import { useState, useRef, useCallback } from 'react'
import './Hemicycle.css'

const LY = 'https://www.ly.gov.tw/Pages/List.aspx?nodeid='

const PARTIES = [
  { id: 'dpp', name: 'DPP', color: '#1B9431', seats: 51 },
  { id: 'tpp', name: 'TPP', color: '#28C8C8', seats: 8 },
  { id: 'ind', name: 'Independent', color: '#CCCCCC', seats: 2 },
  { id: 'kmt', name: 'KMT', color: '#000099', seats: 52 },
]

// All 113 legislators ordered by party (DPP, TPP, Ind, KMT) for left-to-right hemicycle assignment
const ALL_LEGISLATORS = [
  // DPP (51)
  { name: 'Wang Shih-chien (王世堅)', id: 46758, party: 'dpp' },
  { name: 'Wang Ting-yu (王定宇)', id: 46760, party: 'dpp' },
  { name: 'Wang Mei-hui (王美惠)', id: 46761, party: 'dpp' },
  { name: 'Wang Cheng-hsu (王正旭)', id: 55030, party: 'dpp' },
  { name: 'Wang Yi-chuan (王義川)', id: 55855, party: 'dpp' },
  { name: 'Wu Li-hua (伍麗華)', id: 46763, party: 'dpp' },
  { name: 'Ho Hsin-chun (何欣純)', id: 46765, party: 'dpp' },
  { name: 'Wu Pei-yi (吳沛憶)', id: 46766, party: 'dpp' },
  { name: 'Wu Ping-jui (吳秉叡)', id: 46768, party: 'dpp' },
  { name: 'Wu Ssu-yao (吳思瑤)', id: 46769, party: 'dpp' },
  { name: 'Wu Chi-ming (吳琪銘)', id: 46771, party: 'dpp' },
  { name: 'Li Kun-cheng (李坤城)', id: 46863, party: 'dpp' },
  { name: 'Li Kun-tse (李昆澤)', id: 46772, party: 'dpp' },
  { name: 'Li Po-yi (李柏毅)', id: 46774, party: 'dpp' },
  { name: 'Shen Po-yang (沈伯洋)', id: 46775, party: 'dpp' },
  { name: 'Shen Fa-hui (沈發惠)', id: 46776, party: 'dpp' },
  { name: 'Lin Yueh-chin (林月琴)', id: 46777, party: 'dpp' },
  { name: 'Lin Yi-chin (林宜瑾)', id: 46779, party: 'dpp' },
  { name: 'Lin Tai-hua (林岱樺)', id: 46780, party: 'dpp' },
  { name: 'Lin Chun-hsien (林俊憲)', id: 46781, party: 'dpp' },
  { name: 'Lin Shu-fen (林淑芬)', id: 46785, party: 'dpp' },
  { name: 'Lin Chu-yin (林楚茵)', id: 46786, party: 'dpp' },
  { name: 'Chiu Chih-wei (邱志偉)', id: 46788, party: 'dpp' },
  { name: 'Chiu Yi-ying (邱議瑩)', id: 46791, party: 'dpp' },
  { name: 'Ke Chien-ming (柯建銘)', id: 46793, party: 'dpp' },
  { name: 'Fan Yun (范雲)', id: 46795, party: 'dpp' },
  { name: 'Hsu Fu-kuei (徐富癸)', id: 46798, party: 'dpp' },
  { name: 'Chang Hung-lu (張宏陸)', id: 46802, party: 'dpp' },
  { name: 'Chang Ya-lin (張雅琳)', id: 46805, party: 'dpp' },
  { name: 'Chuang Jui-hsiung (莊瑞雄)', id: 46807, party: 'dpp' },
  { name: 'Hsu Chih-chieh (許智傑)', id: 46809, party: 'dpp' },
  { name: 'Kuo Yu-ching (郭昱晴)', id: 46810, party: 'dpp' },
  { name: 'Kuo Kuo-wen (郭國文)', id: 46811, party: 'dpp' },
  { name: 'Chen Hsiu-pao (陳秀寳)', id: 46814, party: 'dpp' },
  { name: 'Chen Ting-fei (陳亭妃)', id: 46815, party: 'dpp' },
  { name: 'Chen Chun-yu (陳俊宇)', id: 46816, party: 'dpp' },
  { name: 'Chen Kuan-ting (陳冠廷)', id: 46817, party: 'dpp' },
  { name: 'Chen Su-yueh (陳素月)', id: 46818, party: 'dpp' },
  { name: 'Chen Pei-yu (陳培瑜)', id: 46819, party: 'dpp' },
  { name: 'Chen Ying (陳瑩)', id: 46823, party: 'dpp' },
  { name: 'Huang Hsiu-fang (黃秀芳)', id: 46828, party: 'dpp' },
  { name: 'Huang Chieh (黃捷)', id: 46833, party: 'dpp' },
  { name: 'Yang Yao (楊曜)', id: 46834, party: 'dpp' },
  { name: 'Liu Chien-kuo (劉建國)', id: 46841, party: 'dpp' },
  { name: 'Tsai Chi-chang (蔡其昌)', id: 46842, party: 'dpp' },
  { name: 'Tsai Yi-yu (蔡易餘)', id: 46843, party: 'dpp' },
  { name: 'Chung Chia-pin (鍾佳濱)', id: 46853, party: 'dpp' },
  { name: 'Lai Hui-yuan (賴惠員)', id: 46849, party: 'dpp' },
  { name: 'Lai Jui-lung (賴瑞隆)', id: 46850, party: 'dpp' },
  { name: 'Lo Mei-ling (羅美玲)', id: 46858, party: 'dpp' },
  { name: 'Su Chiao-hui (蘇巧慧)', id: 46860, party: 'dpp' },
  // TPP (8)
  { name: 'Chen Chao-tzu (陳昭姿)', id: 46755, party: 'tpp' },
  { name: 'Liu Shu-pin (劉書彬)', id: 77699, party: 'tpp' },
  { name: 'Hung Yu-hsiang (洪毓祥)', id: 56378, party: 'tpp' },
  { name: 'Tsai Chun-chou (蔡春綢)', id: 56398, party: 'tpp' },
  { name: 'Wang An-hsiang (王安祥)', id: 56418, party: 'tpp' },
  { name: 'Chiu Hui-ru (邱慧洳)', id: 56438, party: 'tpp' },
  { name: 'Chen Ching-lung (陳清龍)', id: 56458, party: 'tpp' },
  { name: 'Li Chen-hsiu (李貞秀)', id: 56478, party: 'tpp' },
  // Independent (2)
  { name: 'Kao Chin-su-mei (高金素梅)', id: 46801, party: 'ind' },
  { name: 'Chen Chao-ming (陳超明)', id: 46822, party: 'ind' },
  // KMT (52) — non-China-trip first, then China-trip grouped at bottom-right
  { name: 'Ting Hsueh-chung (丁學忠)', id: 46752, party: 'kmt' },
  { name: 'Niu Hsu-ting (牛煦庭)', id: 46757, party: 'kmt' },
  { name: 'Wang Yu-min (王育敏)', id: 46759, party: 'kmt' },
  { name: 'Chiang Chi-chen (江啟臣)', id: 46764, party: 'kmt' },
  { name: 'Wu Tsung-hsien (吳宗憲)', id: 46767, party: 'kmt' },
  { name: 'Li Yen-hsiu (李彥秀)', id: 46773, party: 'kmt' },
  { name: 'Lin Te-fu (林德福)', id: 46787, party: 'kmt' },
  { name: 'Ke Chih-en (柯志恩)', id: 46792, party: 'kmt' },
  { name: 'Hung Meng-kai (洪孟楷)', id: 46794, party: 'kmt' },
  { name: 'Hsu Chiao-hsin (徐巧芯)', id: 46796, party: 'kmt' },
  { name: 'Ma Wen-chun (馬文君)', id: 46800, party: 'kmt' },
  { name: 'Chang Chia-chun (張嘉郡)', id: 46806, party: 'kmt' },
  { name: 'Hsu Yu-chen (許宇甄)', id: 46808, party: 'kmt' },
  { name: 'Chen Yung-kang (陳永康)', id: 46812, party: 'kmt' },
  { name: 'Chen Ching-hui (陳菁徽)', id: 46821, party: 'kmt' },
  { name: 'Huang Chien-pin (黃建賓)', id: 46829, party: 'kmt' },
  { name: 'Huang Chien-hao (黃健豪)', id: 46831, party: 'kmt' },
  { name: 'Yang Chiung-ying (楊瓊瓔)', id: 46835, party: 'kmt' },
  { name: 'Wan Mei-ling (萬美玲)', id: 46836, party: 'kmt' },
  { name: 'Ko Ju-chun (葛如鈞)', id: 46838, party: 'kmt' },
  { name: 'Liao Wei-hsiang (廖偉翔)', id: 46840, party: 'kmt' },
  { name: 'Lu Ming-che (魯明哲)', id: 46846, party: 'kmt' },
  { name: 'Lai Shih-pao (賴士葆)', id: 46848, party: 'kmt' },
  { name: 'Hsieh Yi-feng (謝衣鳯)', id: 46851, party: 'kmt' },
  { name: 'Hsieh Lung-chieh (謝龍介)', id: 46852, party: 'kmt' },
  { name: 'Han Kuo-yu (韓國瑜)', id: 46854, party: 'kmt' },
  { name: 'Yen Kuan-heng (顏寬恒)', id: 46855, party: 'kmt' },
  { name: 'Lo Ting-wei (羅廷瑋)', id: 46856, party: 'kmt' },
  { name: 'Lo Chih-chiang (羅智強)', id: 46859, party: 'kmt' },
  { name: 'Su Ching-chuan (蘇清泉)', id: 46861, party: 'kmt' },
  // KMT — visited China (22, grouped together)
  { name: 'Fu Kun-chi (傅崐萁)', id: 46824, party: 'kmt' },
  { name: 'Chang Chih-lun (張智倫)', id: 46804, party: 'kmt' },
  { name: 'Liao Hsien-hsiang (廖先翔)', id: 46839, party: 'kmt' },
  { name: 'Chen Hsueh-sheng (陳雪生)', id: 46820, party: 'kmt' },
  { name: 'Chen Yu-chen (陳玉珍)', id: 46813, party: 'kmt' },
  { name: 'Huang Jen (黃仁)', id: 46827, party: 'kmt' },
  { name: 'Weng Hsiao-ling (翁曉玲)', id: 46754, party: 'kmt' },
  { name: 'Cheng Cheng-chien (鄭正鈐)', id: 46845, party: 'kmt' },
  { name: 'Lin Chien-chi (林倩綺)', id: 46783, party: 'kmt' },
  { name: 'Chiu Chen-chun (邱鎮軍)', id: 46790, party: 'kmt' },
  { name: 'Yu Hao (游顥)', id: 46826, party: 'kmt' },
  { name: 'Lin Pei-hsiang (林沛祥)', id: 46778, party: 'kmt' },
  { name: 'Hsu Hsin-ying (徐欣瑩)', id: 46797, party: 'kmt' },
  { name: 'Sasuyu Ruljuwan (盧縣一)', id: 46847, party: 'kmt' },
  { name: 'Sra Kacaw (鄭天財)', id: 46844, party: 'kmt' },
  { name: 'Lo Ming-tsai (羅明才)', id: 46857, party: 'kmt' },
  { name: 'Wang Hung-wei (王鴻薇)', id: 46762, party: 'kmt' },
  { name: 'Lin Szu-ming (林思銘)', id: 46782, party: 'kmt' },
  { name: 'Yeh Yuan-chih (葉元之)', id: 46837, party: 'kmt' },
  { name: 'Chiu Jo-hua (邱若華)', id: 46789, party: 'kmt' },
  { name: 'Lu Yu-ling (呂玉玲)', id: 46862, party: 'kmt' },
  { name: 'Tu Chuan-chi (涂權吉)', id: 46799, party: 'kmt' },
]

// China trip data keyed by LY nodeid
const CHINA_TRIPS = {
  46824: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Fu Kun-chi
  46804: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Chang Chih-lun
  46839: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Liao Hsien-hsiang
  46820: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Chen Hsueh-sheng
  46813: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Chen Yu-chen
  46827: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Huang Jen
  46754: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }, { date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Weng Hsiao-ling
  46845: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }, { date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Cheng Cheng-chien
  46783: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Lin Chien-chi
  46790: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Chiu Chen-chun
  46826: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Yu Hao
  46778: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Lin Pei-hsiang
  46797: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Hsu Hsin-ying
  46847: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Sasuyu Ruljuwan
  46844: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Sra Kacaw
  46857: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Lo Ming-tsai
  46762: [{ date: 'April 2024', source: 'http://en.cppcc.gov.cn/2024-04/28/c_983108.htm' }], // Wang Hung-wei
  46782: [{ date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Lin Szu-ming
  46837: [{ date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Yeh Yuan-chih
  46789: [{ date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Chiu Jo-hua
  46862: [{ date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Lu Yu-ling
  46799: [{ date: 'December 2025', source: 'https://udn.com/news/story/6656/9217708' }], // Tu Chuan-chi
}

const PARTY_COLORS = Object.fromEntries(PARTIES.map((p) => [p.id, p.color]))
const TOTAL = 113
const CX = 500
const CY = 500
const SEAT_RADIUS = 14

function buildHemicycle() {
  const targetGap = 40
  const innerRadius = 150

  const rows = []
  let totalPlaced = 0
  let r = innerRadius
  while (totalPlaced < TOTAL) {
    const arcLength = Math.PI * r
    let n = Math.round(arcLength / targetGap)
    if (totalPlaced + n > TOTAL) n = TOTAL - totalPlaced
    rows.push({ radius: r, count: n })
    totalPlaced += n
    r += targetGap
  }

  const allSeats = []
  for (const row of rows) {
    const { radius, count } = row
    for (let i = 0; i < count; i++) {
      const angle = Math.PI - (i / (count - 1 || 1)) * Math.PI
      allSeats.push({
        x: CX + radius * Math.cos(angle),
        y: CY - radius * Math.sin(angle),
        angle,
        radius,
      })
    }
  }

  // Sort left-to-right
  allSeats.sort((a, b) => {
    const diff = b.angle - a.angle
    if (Math.abs(diff) > 0.01) return diff
    return a.radius - b.radius
  })

  // Assign legislators to seats in order
  for (let i = 0; i < ALL_LEGISLATORS.length; i++) {
    const leg = ALL_LEGISLATORS[i]
    allSeats[i].color = PARTY_COLORS[leg.party]
    allSeats[i].party = leg.party
    allSeats[i].legislator = {
      name: leg.name,
      profile: `${LY}${leg.id}`,
      trips: CHINA_TRIPS[leg.id] || null,
    }
    allSeats[i].outlined = !!CHINA_TRIPS[leg.id]
  }

  return allSeats
}

const seats = buildHemicycle()

export default function Hemicycle() {
  const [tooltip, setTooltip] = useState(null)
  const hideTimeout = useRef(null)

  const showTooltip = useCallback((data) => {
    clearTimeout(hideTimeout.current)
    setTooltip(data)
  }, [])

  const scheduleHide = useCallback(() => {
    hideTimeout.current = setTimeout(() => setTooltip(null), 150)
  }, [])

  return (
    <div className="hemicycle-wrapper">
      <h2 className="hemicycle-title">11th Legislative Yuan of the Republic of China (Taiwan)</h2>
      <svg viewBox="0 90 1000 430" className="hemicycle-svg">
        {seats.map((seat, i) => (
          seat.outlined ? (
            <g
              key={i}
              className="hemicycle-seat"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.closest('svg').getBoundingClientRect()
                const svgX = seat.x / 1000 * rect.width
                const svgY = (seat.y - 90) / 430 * rect.height
                showTooltip({ x: rect.left + svgX, y: rect.top + svgY, legislator: seat.legislator })
              }}
              onMouseLeave={scheduleHide}
            >
              <circle cx={seat.x} cy={seat.y} r={SEAT_RADIUS + 3} fill="#ff3333" />
              <circle cx={seat.x} cy={seat.y} r={SEAT_RADIUS - 3} fill={seat.color} />
            </g>
          ) : (
            <circle
              key={i}
              cx={seat.x}
              cy={seat.y}
              r={SEAT_RADIUS}
              fill={seat.color}
              className="hemicycle-seat"
              onMouseEnter={(e) => {
                const rect = e.currentTarget.closest('svg').getBoundingClientRect()
                const svgX = seat.x / 1000 * rect.width
                const svgY = (seat.y - 90) / 430 * rect.height
                showTooltip({ x: rect.left + svgX, y: rect.top + svgY, legislator: seat.legislator })
              }}
              onMouseLeave={scheduleHide}
            />
          )
        ))}
      </svg>
      {tooltip && (
        <div
          className="hemicycle-tooltip"
          style={{ left: tooltip.x, top: tooltip.y }}
          onMouseEnter={() => clearTimeout(hideTimeout.current)}
          onMouseLeave={scheduleHide}
        >
          <a className="hemicycle-tooltip-name" href={tooltip.legislator.profile} target="_blank" rel="noopener noreferrer">{tooltip.legislator.name}</a>
          {tooltip.legislator.trips && (
            <>
              <div className="hemicycle-tooltip-context">Visited PRC officials in Mainland China</div>
              {tooltip.legislator.trips.map((trip, i) => (
                <div key={i} className="hemicycle-tooltip-trip">
                  <a href={trip.source} target="_blank" rel="noopener noreferrer">{trip.date}</a>
                </div>
              ))}
            </>
          )}
        </div>
      )}
      <div className="hemicycle-count">113</div>
      <div className="hemicycle-label">seats</div>
      <div className="hemicycle-legend">
        {PARTIES.map((p) => (
          <div key={p.id} className="hemicycle-legend-item">
            <span className="hemicycle-legend-swatch" style={{ background: p.color }} />
            <span>{p.name} ({p.seats})</span>
          </div>
        ))}
      </div>
      <div className="hemicycle-outline-legend">
        <span className="hemicycle-outline-swatch" />
        <span>Met with PRC officials in Mainland China without official government sanction</span>
      </div>
    </div>
  )
}
