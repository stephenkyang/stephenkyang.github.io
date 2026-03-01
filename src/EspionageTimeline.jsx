import { useState, useRef, useCallback } from 'react'
import './EspionageTimeline.css'

const BRANCH_COLORS = {
  military: '#cc2222',
  civilian: '#2266aa',
  political: '#7744aa',
}

const BRANCH_LABELS = {
  military: 'Military',
  civilian: 'Civilian',
  political: 'Political',
}

const CASES = [
  {
    date: 'Dec 2025',
    sortDate: 2025.92,
    individuals: 'Ret. Col. Chang Chao-jan; Ret. Col. Chou Tien-tzu; Fmr. MG Yueh Chih-chung',
    branch: 'military',
    details: 'Three former Military Intelligence Bureau officials developed spy ring for China starting 2008. Chang introduced Chinese intelligence officials to Chou; Yueh drawn in after meetings in 2012 and 2016.',
    outcome: 'Convicted. Sentences of 10–18 months upheld by Supreme Court Dec 2025.',
    sources: ['https://www.globalsecurity.org/intell/library/news/2025/intell-251203-cna01.htm'],
  },
  {
    date: 'Jan 2023',
    sortDate: 2023.03,
    individuals: 'Ret. MG Chien Yao-tung; Ret. Lt. Col. Wei Hsien-yi',
    branch: 'military',
    details: 'Recruited by Hong Kong businessman acting for China\'s state security ministry. Approached at least 5 senior officers incl. former Vice Defense Minister Chang Che-ping.',
    outcome: 'Found guilty Jan 2023. Suspended sentences up to 5 years and fines up to NT$600,000.',
    sources: ['https://www.rfa.org/english/news/southchinasea/taiwan-spies-01112023063004.html'],
  },
  {
    date: 'Feb 2021',
    sortDate: 2021.15,
    individuals: 'Ret. MG Yueh + 3 others (incl. 2 colonels)',
    branch: 'military',
    details: 'Four retired military intelligence officers indicted for developing spy network and collecting confidential information for Beijing.',
    outcome: 'Indicted Feb 2021.',
    sources: ['https://www.france24.com/en/live-news/20210220-four-taiwan-ex-intelligence-officers-charged-with-spying-for-china'],
  },
  {
    date: 'Feb 2021',
    sortDate: 2021.14,
    individuals: 'Gen. Chang Che-ping (張哲平)',
    branch: 'military',
    details: 'Investigated for alleged contact with Chinese spy ring. Had served as Vice Minister of Defense 2019–2021 and as strategic adviser to President Tsai.',
    outcome: 'Not found guilty; reclassified as witness.',
    sources: ['https://www.rfa.org/english/news/southchinasea/taiwan-spies-01112023063004.html'],
  },
  {
    date: 'Nov 2022',
    sortDate: 2022.85,
    individuals: 'Retired Marine Major (unnamed)',
    branch: 'military',
    details: 'Arrested after entering Zuoying Navy Base in Kaohsiung with a forged ID.',
    outcome: 'Under investigation.',
    sources: ['https://www.rfa.org/english/news/southchinasea/taiwan-spies-01112023063004.html'],
  },
  {
    date: 'Nov 2022',
    sortDate: 2022.86,
    individuals: 'Col. Hsiang Te-en (on Kinmen)',
    branch: 'military',
    details: 'Army colonel on frontline island of Kinmen discovered working for China. Pledged allegiance to China and promised to surrender in event of Chinese attack.',
    outcome: 'Suspended and under investigation.',
    sources: ['https://www.rfa.org/english/news/southchinasea/taiwan-spies-01112023063004.html'],
  },
  {
    date: 'Jan 2023',
    sortDate: 2023.02,
    individuals: 'Ret. Air Force Col. "Liu" + 6 others; Fmr. Legislator Lo Chih-ming; Ret. Rear Adm. Hsia Fu-hsiang',
    branch: 'military',
    details: 'Seven members of spy ring arrested in Kaohsiung. Retired colonel Liu ran espionage activities for at least 8 years. Six recruited from Navy and Air Force; 3 active-duty.',
    outcome: 'Arrested Jan 6, 2023.',
    sources: ['https://www.rfa.org/english/news/southchinasea/taiwan-spies-01112023063004.html'],
  },
  {
    date: 'Mar 2023',
    sortDate: 2023.2,
    individuals: 'Ret. Rear Adm. Hsia Fu-hsiang; Fmr. Legislator Lo Chih-ming',
    branch: 'political',
    details: 'Charged with organizing meetings between former senior military officers and Chinese intelligence. Recruited by Chinese military and United Front Work Department.',
    outcome: 'Charged Mar 2023. Each faces up to 5 years.',
    sources: ['https://en.wikipedia.org/wiki/Chinese_intelligence_activity_abroad'],
  },
  {
    date: 'Apr 2023',
    sortDate: 2023.3,
    individuals: 'Ret. Air Force Col. Liu Sheng-shu + 6 officers incl. Sun Wei & wife Liu Yun-ya',
    branch: 'military',
    details: 'Liu recruited by Chinese side after retirement, then recruited 6 officers incl. married couple. Passed classified military info. Payments NT$200k–700k per recruit.',
    outcome: 'Indicted Apr 2023. Sun sentenced 47 yrs, wife 57 yrs (retrial Apr 2025).',
    sources: ['https://www.globalsecurity.org/intell/library/news/2025/intell-250410-cna01.htm'],
  },
  {
    date: 'Nov 2023',
    sortDate: 2023.85,
    individuals: 'Chen Yu-hsin spy ring — 10 persons total',
    branch: 'military',
    details: 'Major spy ring: Chen (ringleader, fled to China). Passed intel on military sites, training, deployments. Conspiracy to fly CH-47 Chinook to Chinese aircraft carrier. Surrender videos filmed by junior officers.',
    outcome: 'Indicted Nov 2023. Sentenced Aug 2024: 18 months to 13 years. Chen remains fugitive.',
    sources: [
      'https://globaltaiwan.org/2024/09/recent-chinese-spy-cases-in-taiwan/',
      'https://www.voanews.com/a/taiwan-sentences-8-military-officers-to-prison-for-spying-for-china/7754492.html',
    ],
  },
  {
    date: 'Oct 2024',
    sortDate: 2024.75,
    individuals: 'Temple chairman + 9 others',
    branch: 'civilian',
    details: 'Ten individuals indicted for running spy ring that exploited religious networks to gather intelligence and spread pro-China narratives.',
    outcome: 'Indicted Oct 2024.',
    sources: ['https://ceias.eu/a-threat-from-within-chinese-espionage-in-taiwan/'],
  },
  {
    date: 'Nov 2025',
    sortDate: 2025.86,
    individuals: 'Ret. Air Force officer Lou (盧)',
    branch: 'military',
    details: 'Former military instructor at air force unit (2009–2015). Passed classified air force flight mission documents to Chinese intelligence officer. ~NT$170k in payments.',
    outcome: 'Sentenced 12 years (3rd retrial, Nov 2025).',
    sources: ['https://www.taipeitimes.com/News/taiwan/archives/2025/11/28/2003847980'],
  },
  {
    date: 'Dec 2024',
    sortDate: 2024.92,
    individuals: '4 military police: Lai Chung-yu, Chen Wen-hao, Li Yu-erh, Lin Yu-kai',
    branch: 'military',
    details: 'Four servicemen assigned to Presidential Office security. Photographed and relayed sensitive documents to Chinese agents. Active Apr 2022–2024.',
    outcome: 'Indicted Dec 2024. Sentenced 5 yrs 10 mos to 7 yrs. Upheld Dec 2025.',
    sources: [
      'https://focustaiwan.tw/cross-strait/202512050012',
      'https://www.taipeitimes.com/News/front/archives/2025/12/06/2003848407',
      'https://www.washingtonpost.com/world/2025/03/28/taiwanese-soldiers-jailed-chinese-espionage/',
    ],
  },
  {
    date: 'Jan 2025',
    sortDate: 2025.02,
    individuals: 'Ret. Army officer Chu Hung-i + 6 others',
    branch: 'military',
    details: 'Chu worked for PLA intelligence after retirement (from 2019). Recruited retired personnel to photograph AIT, Alishan Radar Station, military bases. Sent via WeChat.',
    outcome: 'Indicted. Face 7+ years and fines NT$50M–100M.',
    sources: ['https://www.taiwannews.com.tw/news/6010285'],
  },
  {
    date: 'Jan 2025',
    sortDate: 2025.04,
    individuals: 'Ret. Lt. Gen. Kao An-kuo + 5 others',
    branch: 'military',
    details: 'Founded "Republic of China Taiwan Military Government" — armed organization to act as collaborators during Chinese invasion. Received NT$9.62M from PRC. Used drones to surveil military radar.',
    outcome: 'Detained Jan 10. Indicted Jan 22. Sentenced Oct 2025: 7.5 years for Kao.',
    sources: [
      'https://www.taipeitimes.com/News/front/archives/2025/01/23/2003830681',
      'https://www.taiwannews.com.tw/news/6021328',
      'https://focustaiwan.tw/cross-strait/202510230019',
      'https://en.wikipedia.org/wiki/Kao_An-kuo',
    ],
  },
  {
    date: 'Jun 2025',
    sortDate: 2025.48,
    individuals: 'Ret. Lt. Col. Kung Fan-chia (孔繁嘉)',
    branch: 'military',
    details: 'While serving at Military News Agency, introduced to Xiamen official linked to PLA Eastern Theater Command. Received payments for arranging military personnel travel to China for recruitment.',
    outcome: 'Sentenced 5 years 4 months.',
    sources: ['https://www.taiwannews.com.tw/news/6141038'],
  },
  {
    date: 'Aug 2025',
    sortDate: 2025.6,
    individuals: 'Fmr. airman Hsueh Chen-chun',
    branch: 'military',
    details: 'Recruited by two MSS officials during business trip to China in 2014. Tasked with collecting intelligence on Falun Gong founder Li Hongzhi (US citizen) from a Taiwanese investigator.',
    outcome: 'Sentenced 14 months.',
    sources: ['https://www.ntd.com/taiwan-sentences-ex-military-officer-for-spying-on-falun-gong_1087014.html'],
  },
  {
    date: 'Nov 2025',
    sortDate: 2025.87,
    individuals: 'Chinese national Ding Xiaohu + Wang Wen-hao, Tan Chun-ming, Lu Fang-chi + 3 others',
    branch: 'military',
    details: 'Ding (Hong Kong passport) entered Taiwan to build espionage network from ~2018. Instructed by PLA General Political Dept. NT$11.12M funneled to Taiwan. Members urged to encourage surrender in wartime.',
    outcome: 'Indicted and detained Nov 2025.',
    sources: [
      'https://focustaiwan.tw/society/202511190005',
      'https://www.taipeitimes.com/News/taiwan/archives/2025/11/18/2003847418',
    ],
  },
  {
    date: 'Mid-2025',
    sortDate: 2025.5,
    individuals: 'Multiple DPP-affiliated aides (at least 5)',
    branch: 'political',
    details: 'At least 5 people associated with senior DPP politicians under investigation for allegedly leaking classified information to Chinese intelligence, including aides to President Lai and NSC Secretary General.',
    outcome: 'Under investigation / detained.',
    sources: ['https://www.scmp.com/news/china/politics/article/3307097/island-infiltrators-taiwan-spy-scandals-expose-frailty-political-and-military-defences'],
  },
  {
    date: 'Jan 2026',
    sortDate: 2026.08,
    individuals: 'Ret. Col. Chang Ming-che (張銘哲)',
    branch: 'military',
    details: 'Former Air Force Academy dept director. Recruited in Bali, Indonesia in 2019 by 3 PLA officers. Received NT$1.34M plus US$10k signing bonus. Provided intel and recruited spies 2019–2023.',
    outcome: 'Sentenced 11 years. Supreme Court remanded 2 charges for retrial Jan 2026.',
    sources: ['https://focustaiwan.tw/society/202601300016'],
  },
].sort((a, b) => a.sortDate - b.sortDate)

function branchColor(branch) {
  return BRANCH_COLORS[branch] || '#999'
}

function sourceLabel(url) {
  try {
    const host = new URL(url).hostname.replace('www.', '')
    return host
  } catch {
    return 'source'
  }
}

function Tooltip({ data, onEnter, onLeave }) {
  if (!data) return null
  const c = data.caseData
  return (
    <div
      className="esp-tooltip"
      style={{ left: data.x, top: data.y }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="esp-tooltip-date">{c.date}</div>
      <div className="esp-tooltip-individuals">{c.individuals}</div>
      <div className="esp-tooltip-branch" style={{ color: branchColor(c.branch) }}>
        {BRANCH_LABELS[c.branch]}
      </div>
      <div className="esp-tooltip-details">{c.details}</div>
      <div className="esp-tooltip-outcome"><strong>Outcome:</strong> {c.outcome}</div>
      <div className="esp-tooltip-sources">
        {c.sources.map((s, i) => (
          <a key={i} href={s} target="_blank" rel="noopener noreferrer">{sourceLabel(s)}</a>
        ))}
      </div>
    </div>
  )
}

function VerticalTimeline({ showTooltip, scheduleHide }) {
  return (
    <div className="esp-vertical-wrapper">
      <div className="esp-vertical-line" />
      {CASES.map((c, i) => {
        const isLeft = i % 2 === 0
        return (
          <div key={i} className={`esp-v-event ${isLeft ? 'esp-v-left' : 'esp-v-right'}`}>
            <div
              className="esp-v-dot"
              style={{ backgroundColor: branchColor(c.branch) }}
              onMouseEnter={(e) => {
                const rect = e.currentTarget.getBoundingClientRect()
                showTooltip({
                  x: rect.left + rect.width / 2,
                  y: rect.top,
                  caseData: c,
                })
              }}
              onMouseLeave={scheduleHide}
            />
            <div className="esp-v-card">
              <div className="esp-v-date">{c.date}</div>
              <div className="esp-v-individuals">{c.individuals}</div>
              <div className="esp-v-branch" style={{ color: branchColor(c.branch) }}>
                {BRANCH_LABELS[c.branch]}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default function EspionageTimeline({ collapsible = false }) {
  const [tooltip, setTooltip] = useState(null)
  const [expanded, setExpanded] = useState(!collapsible)
  const hideTimeout = useRef(null)

  const showTooltip = useCallback((data) => {
    clearTimeout(hideTimeout.current)
    setTooltip(data)
  }, [])

  const scheduleHide = useCallback(() => {
    hideTimeout.current = setTimeout(() => setTooltip(null), 150)
  }, [])

  return (
    <div className="esp-timeline-container">
      <h2 className="esp-section-title">Chinese Espionage Cases in Taiwan (2021–2026)</h2>

      <div className="esp-legend">
        {Object.entries(BRANCH_LABELS).map(([key, label]) => (
          <div key={key} className="esp-legend-item">
            <span className="esp-legend-swatch" style={{ backgroundColor: BRANCH_COLORS[key] }} />
            <span>{label}</span>
          </div>
        ))}
      </div>

      {collapsible && !expanded && (
        <button className="esp-toggle" onClick={() => setExpanded(true)}>
          Show {CASES.length} espionage cases
        </button>
      )}

      {expanded && (
        <>
          {collapsible && (
            <button className="esp-toggle-sticky" onClick={() => setExpanded(false)}>
              Hide timeline
            </button>
          )}
          <VerticalTimeline showTooltip={showTooltip} scheduleHide={scheduleHide} />
        </>
      )}

      <Tooltip
        data={tooltip}
        onEnter={() => clearTimeout(hideTimeout.current)}
        onLeave={scheduleHide}
      />
    </div>
  )
}
