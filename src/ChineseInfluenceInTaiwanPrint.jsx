// Static print view of the Taiwan Fifth Column visualizations.
// Navigate to /print/taiwan-fifth-column, then File → Print → Save as PDF.
import { useEffect } from 'react'

// ── Hemicycle data (duplicated from Hemicycle.jsx) ──────────────────────────
const LY = 'https://www.ly.gov.tw/Pages/List.aspx?nodeid='
const PARTIES = [
  { id: 'dpp', name: 'DPP', color: '#1B9431', seats: 51 },
  { id: 'tpp', name: 'TPP', color: '#28C8C8', seats: 8 },
  { id: 'ind', name: 'Independent', color: '#CCCCCC', seats: 2 },
  { id: 'kmt', name: 'KMT', color: '#3366cc', seats: 52 },
]
const ALL_LEGISLATORS = [
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
  { name: 'Chen Chao-tzu (陳昭姿)', id: 46755, party: 'tpp' },
  { name: 'Liu Shu-pin (劉書彬)', id: 77699, party: 'tpp' },
  { name: 'Hung Yu-hsiang (洪毓祥)', id: 56378, party: 'tpp' },
  { name: 'Tsai Chun-chou (蔡春綢)', id: 56398, party: 'tpp' },
  { name: 'Wang An-hsiang (王安祥)', id: 56418, party: 'tpp' },
  { name: 'Chiu Hui-ru (邱慧洳)', id: 56438, party: 'tpp' },
  { name: 'Chen Ching-lung (陳清龍)', id: 56458, party: 'tpp' },
  { name: 'Li Chen-hsiu (李貞秀)', id: 56478, party: 'tpp' },
  { name: 'Kao Chin-su-mei (高金素梅)', id: 46801, party: 'ind' },
  { name: 'Chen Chao-ming (陳超明)', id: 46822, party: 'ind' },
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
const CHINA_TRIPS = {
  46824: [{ date: 'April 2024' }],
  46804: [{ date: 'April 2024' }],
  46839: [{ date: 'April 2024' }],
  46820: [{ date: 'April 2024' }],
  46813: [{ date: 'April 2024' }],
  46827: [{ date: 'April 2024' }],
  46754: [{ date: 'April 2024' }, { date: 'December 2025' }],
  46845: [{ date: 'April 2024' }, { date: 'December 2025' }],
  46783: [{ date: 'April 2024' }],
  46790: [{ date: 'April 2024' }],
  46826: [{ date: 'April 2024' }],
  46778: [{ date: 'April 2024' }],
  46797: [{ date: 'April 2024' }],
  46847: [{ date: 'April 2024' }],
  46844: [{ date: 'April 2024' }],
  46857: [{ date: 'April 2024' }],
  46762: [{ date: 'April 2024' }],
  46782: [{ date: 'December 2025' }],
  46837: [{ date: 'December 2025' }],
  46789: [{ date: 'December 2025' }],
  46862: [{ date: 'December 2025' }],
  46799: [{ date: 'December 2025' }],
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
      allSeats.push({ x: CX + radius * Math.cos(angle), y: CY - radius * Math.sin(angle) })
    }
  }
  allSeats.sort((a, b) => {
    const da = Math.atan2(CY - a.y, a.x - CX)
    const db = Math.atan2(CY - b.y, b.x - CX)
    const diff = db - da
    if (Math.abs(diff) > 0.01) return diff
    const ra = Math.hypot(a.x - CX, a.y - CY)
    const rb = Math.hypot(b.x - CX, b.y - CY)
    return ra - rb
  })
  for (let i = 0; i < ALL_LEGISLATORS.length; i++) {
    const leg = ALL_LEGISLATORS[i]
    allSeats[i].color = PARTY_COLORS[leg.party]
    allSeats[i].outlined = !!CHINA_TRIPS[leg.id]
  }
  return allSeats
}

const seats = buildHemicycle()

// ── Espionage timeline data (duplicated from EspionageTimeline.jsx) ──────────
const BRANCH_COLORS = { military: '#cc2222', civilian: '#2266aa', political: '#7744aa' }
const BRANCH_LABELS = { military: 'Military', civilian: 'Civilian', political: 'Political' }
const CASES = [
  { date: 'Feb 2021', sortDate: 2021.14, individuals: 'Gen. Chang Che-ping (張哲平)', branch: 'military', details: 'Investigated for alleged contact with Chinese spy ring. Had served as Vice Minister of Defense 2019–2021 and as strategic adviser to President Tsai.', outcome: 'Not found guilty; reclassified as witness.' },
  { date: 'Feb 2021', sortDate: 2021.15, individuals: 'Ret. MG Yueh + 3 others (incl. 2 colonels)', branch: 'military', details: 'Four retired military intelligence officers indicted for developing spy network and collecting confidential information for Beijing.', outcome: 'Indicted Feb 2021.' },
  { date: 'Nov 2022', sortDate: 2022.85, individuals: 'Retired Marine Major (unnamed)', branch: 'military', details: 'Arrested after entering Zuoying Navy Base in Kaohsiung with a forged ID.', outcome: 'Under investigation.' },
  { date: 'Nov 2022', sortDate: 2022.86, individuals: 'Col. Hsiang Te-en (on Kinmen)', branch: 'military', details: 'Army colonel on frontline island of Kinmen discovered working for China. Pledged allegiance to China and promised to surrender in event of Chinese attack.', outcome: 'Sentenced 7.5 years Feb 2023.' },
  { date: 'Jan 2023', sortDate: 2023.02, individuals: 'Ret. Air Force Col. "Liu" + 6 others; Fmr. Legislator Lo Chih-ming; Ret. Rear Adm. Hsia Fu-hsiang', branch: 'military', details: 'Seven members of spy ring arrested in Kaohsiung. Retired colonel Liu ran espionage activities for at least 8 years. Six recruited from Navy and Air Force; 3 active-duty.', outcome: 'Arrested Jan 6, 2023.' },
  { date: 'Jan 2023', sortDate: 2023.03, individuals: 'Ret. MG Chien Yao-tung; Ret. Lt. Col. Wei Hsien-yi', branch: 'military', details: "Recruited by Hong Kong businessman acting for China's state security ministry. Approached at least 5 senior officers incl. former Vice Defense Minister Chang Che-ping.", outcome: 'Found guilty Jan 2023. Suspended sentences up to 5 years and fines up to NT$600,000.' },
  { date: 'Mar 2023', sortDate: 2023.2, individuals: 'Ret. Rear Adm. Hsia Fu-hsiang; Fmr. Legislator Lo Chih-ming', branch: 'political', details: 'Charged with organizing meetings between former senior military officers and Chinese intelligence. Recruited by Chinese military and United Front Work Department.', outcome: 'Charged Mar 2023. Lo acquitted in final Supreme Court ruling; partial retrial ordered for Hsia.' },
  { date: 'Apr 2023', sortDate: 2023.3, individuals: 'Ret. Air Force Col. Liu Sheng-shu + 6 officers incl. Sun Wei & wife Liu Yun-ya', branch: 'military', details: 'Liu recruited by Chinese side after retirement, then recruited 6 officers incl. married couple. Passed classified military info. Payments NT$200k–700k per recruit.', outcome: 'Indicted Apr 2023. Sun sentenced 47 yrs, wife 57 yrs (retrial Apr 2025).' },
  { date: 'Nov 2023', sortDate: 2023.85, individuals: 'Chen Yu-hsin spy ring — 10 persons total', branch: 'military', details: 'Major spy ring. Passed intel on military sites, training, deployments. Conspiracy to fly CH-47 Chinook to Chinese aircraft carrier. Surrender videos filmed by junior officers.', outcome: 'Indicted Nov 2023. Sentenced Aug 2024: 18 months to 13 years. Chen remains fugitive.' },
  { date: 'Oct 2024', sortDate: 2024.75, individuals: 'Temple chairman + 9 others', branch: 'civilian', details: 'Ten individuals indicted for running spy ring that exploited religious networks to gather intelligence and spread pro-China narratives.', outcome: 'Indicted Oct 2024.' },
  { date: 'Dec 2024', sortDate: 2024.92, individuals: '4 military police: Lai Chung-yu, Chen Wen-hao, Li Yu-erh, Lin Yu-kai', branch: 'military', details: 'Four servicemen assigned to Presidential Office security. Photographed and relayed sensitive documents to Chinese agents. Active Apr 2022–2024.', outcome: 'Indicted Dec 2024. Sentenced 5 yrs 10 mos to 7 yrs. Upheld Dec 2025.' },
  { date: 'Jan 2025', sortDate: 2025.02, individuals: 'Ret. Army officer Chu Hung-i + 6 others', branch: 'military', details: 'Chu worked for PLA intelligence after retirement (from 2019). Recruited retired personnel to photograph AIT, Alishan Radar Station, military bases. Sent via WeChat.', outcome: 'Indicted. Face 7+ years and fines NT$50M–100M.' },
  { date: 'Jan 2025', sortDate: 2025.04, individuals: 'Ret. Lt. Gen. Kao An-kuo + 5 others', branch: 'military', details: 'Founded "Republic of China Taiwan Military Government" — armed organization to act as collaborators during Chinese invasion. Received NT$9.62M from PRC. Used drones to surveil military radar.', outcome: 'Detained Jan 10. Indicted Jan 22. Sentenced Oct 2025: 7.5 years for Kao.' },
  { date: 'Jun 2025', sortDate: 2025.48, individuals: 'Ret. Lt. Col. Kung Fan-chia (孔繁嘉)', branch: 'military', details: 'While serving at Military News Agency, introduced to Xiamen official linked to PLA Eastern Theater Command. Received payments for arranging military personnel travel to China for recruitment.', outcome: 'Sentenced 5 years 4 months.' },
  { date: 'Mid-2025', sortDate: 2025.5, individuals: 'Multiple DPP-affiliated aides (at least 5)', branch: 'political', details: 'At least 5 people associated with senior DPP politicians under investigation for allegedly leaking classified information to Chinese intelligence, including aides to President Lai and NSC Secretary General.', outcome: 'Under investigation / detained.' },
  { date: 'Aug 2025', sortDate: 2025.6, individuals: 'Fmr. airman Hsueh Chen-chun', branch: 'military', details: 'Recruited by two MSS officials during business trip to China in 2014. Tasked with collecting intelligence on Falun Gong founder Li Hongzhi (US citizen) from a Taiwanese investigator.', outcome: 'Initially sentenced 14 months; High Court acquitted on retrial.' },
  { date: 'Nov 2025', sortDate: 2025.86, individuals: 'Ret. Air Force officer Lou (盧)', branch: 'military', details: 'Former military instructor at air force unit (2009–2015). Passed classified air force flight mission documents to Chinese intelligence officer. ~NT$170k in payments.', outcome: 'Sentenced 12 years (3rd retrial, Nov 2025).' },
  { date: 'Nov 2025', sortDate: 2025.87, individuals: 'Chinese national Ding Xiaohu + Wang Wen-hao, Tan Chun-ming, Lu Fang-chi + 3 others', branch: 'military', details: 'Ding (Hong Kong passport) entered Taiwan to build espionage network from ~2018. Instructed by PLA General Political Dept. NT$11.12M funneled to Taiwan. Members urged to encourage surrender in wartime.', outcome: 'Indicted and detained Nov 2025.' },
  { date: 'Dec 2025', sortDate: 2025.92, individuals: 'Ret. Col. Chang Chao-jan; Ret. Col. Chou Tien-tzu; Fmr. MG Yueh Chih-chung', branch: 'military', details: 'Three former Military Intelligence Bureau officials developed spy ring for China starting 2008. Chang introduced Chinese intelligence officials to Chou; Yueh drawn in after meetings in 2012 and 2016.', outcome: 'Convicted. Sentences of 10–18 months upheld by Supreme Court Dec 2025.' },
  { date: 'Jan 2026', sortDate: 2026.08, individuals: 'Ret. Col. Chang Ming-che (張銘哲)', branch: 'military', details: 'Former Air Force Academy dept director. Recruited in Bali, Indonesia in 2019 by 3 PLA officers. Received NT$1.34M plus US$10k signing bonus. Provided intel and recruited spies 2019–2023.', outcome: 'Sentenced 11 years. Supreme Court remanded 2 charges for retrial Jan 2026.' },
].sort((a, b) => a.sortDate - b.sortDate)

// ── Legislators who visited China ────────────────────────────────────────────
const CHINA_TRIP_LIST = ALL_LEGISLATORS
  .filter((l) => CHINA_TRIPS[l.id])
  .map((l) => ({ name: l.name, trips: CHINA_TRIPS[l.id], profile: `${LY}${l.id}` }))

const S = {
  page: { maxWidth: 900, margin: '0 auto', padding: '40px 32px', fontFamily: "Georgia, 'Times New Roman', serif", background: '#fff', color: '#111' },
  h1: { fontSize: '1.8rem', fontWeight: 700, marginBottom: 4 },
  subtitle: { fontSize: '0.85rem', color: '#666', marginBottom: 40 },
  sectionHead: { fontSize: '1.3rem', fontWeight: 700, margin: '40px 0 12px', borderBottom: '2px solid #222', paddingBottom: 6 },
  legend: { display: 'flex', gap: 20, margin: '12px 0 4px', flexWrap: 'wrap' },
  legendItem: { display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.82rem' },
  swatch: (color) => ({ width: 12, height: 12, borderRadius: '50%', background: color, display: 'inline-block' }),
  outlineSwatch: { width: 16, height: 16, borderRadius: '50%', background: '#3366cc', border: '2px solid #ff3333', display: 'inline-block' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', marginTop: 12 },
  th: { textAlign: 'left', padding: '6px 8px', borderBottom: '1px solid #ccc', fontWeight: 700, background: '#f5f5f5' },
  td: { padding: '6px 8px', borderBottom: '1px solid #eee', verticalAlign: 'top' },
  caseBlock: { marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #ddd' },
  caseDate: { fontWeight: 700, fontSize: '0.9rem', marginBottom: 2 },
  caseIndividuals: { fontSize: '0.88rem', marginBottom: 4 },
  caseBranch: (branch) => ({ fontSize: '0.75rem', fontWeight: 700, color: BRANCH_COLORS[branch], marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }),
  caseDetails: { fontSize: '0.83rem', lineHeight: 1.55, marginBottom: 4 },
  caseOutcome: { fontSize: '0.83rem', color: '#333' },
}

export default function ChineseInfluenceInTaiwanPrint() {
  useEffect(() => {
    document.title = "Taiwan's Fifth Column — Print View"
  }, [])

  return (
    <div style={S.page}>
      <h1 style={S.h1}>Taiwan&apos;s Fifth Column</h1>
      <p style={S.subtitle}>stephenkyang.github.io/writings/taiwan-fifth-column &mdash; print view (all hover data shown statically)</p>

      {/* ── Hemicycle ── */}
      <h2 style={S.sectionHead}>11th Legislative Yuan of the Republic of China (Taiwan)</h2>
      <div style={S.legend}>
        {PARTIES.map((p) => (
          <div key={p.id} style={S.legendItem}>
            <span style={S.swatch(p.color)} />
            {p.name} ({p.seats})
          </div>
        ))}
        <div style={S.legendItem}>
          <span style={S.outlineSwatch} />
          Met with PRC officials in Mainland China
        </div>
      </div>

      <svg viewBox="0 90 1000 430" style={{ width: '100%', maxWidth: 700, display: 'block', margin: '0 auto 8px' }}>
        {seats.map((seat, i) =>
          seat.outlined ? (
            <g key={i}>
              <circle cx={seat.x} cy={seat.y} r={SEAT_RADIUS + 3} fill="#ff3333" />
              <circle cx={seat.x} cy={seat.y} r={SEAT_RADIUS - 3} fill={seat.color} />
            </g>
          ) : (
            <circle key={i} cx={seat.x} cy={seat.y} r={SEAT_RADIUS} fill={seat.color} />
          )
        )}
      </svg>

      <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '24px 0 8px' }}>KMT Legislators Who Visited PRC Officials in Mainland China</h3>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Legislator</th>
            <th style={S.th}>Trip(s)</th>
          </tr>
        </thead>
        <tbody>
          {CHINA_TRIP_LIST.map((l) => (
            <tr key={l.name}>
              <td style={S.td}>{l.name}</td>
              <td style={S.td}>{l.trips.map((t) => t.date).join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── Espionage Timeline ── */}
      <h2 style={{ ...S.sectionHead, marginTop: 52 }}>Chinese Espionage Cases in Taiwan (2021–2026)</h2>
      <div style={S.legend}>
        {Object.entries(BRANCH_LABELS).map(([key, label]) => (
          <div key={key} style={S.legendItem}>
            <span style={S.swatch(BRANCH_COLORS[key])} />
            {label}
          </div>
        ))}
      </div>

      <div style={{ marginTop: 20 }}>
        {CASES.map((c, i) => (
          <div key={i} style={S.caseBlock}>
            <div style={S.caseDate}>{c.date}</div>
            <div style={S.caseIndividuals}>{c.individuals}</div>
            <div style={S.caseBranch(c.branch)}>{BRANCH_LABELS[c.branch]}</div>
            <div style={S.caseDetails}>{c.details}</div>
            <div style={S.caseOutcome}><strong>Outcome:</strong> {c.outcome}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
