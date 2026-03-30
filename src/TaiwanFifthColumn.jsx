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
      <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontWeight: 400, fontSize: '1.1rem', color: 'var(--writing-body)', margin: '0 0 0.75rem', textAlign: 'center' }}>
        Number of Taiwanese Prosecuted as Chinese Spies
      </h2>
      <div style={{ width: '100%', maxWidth: 420 }}>
        {PROSECUTIONS.map((d) => (
          <div key={d.year} style={{ display: 'flex', alignItems: 'center', marginBottom: '0.4rem' }}>
            <span style={{ width: 36, fontSize: '0.75rem', color: 'var(--text-secondary)', textAlign: 'right', marginRight: 8, flexShrink: 0 }}>{d.year}</span>
            <div style={{ flex: 1, position: 'relative', height: 22 }}>
              <div style={{
                width: `${(d.count / MAX_COUNT) * 100}%`,
                height: '100%',
                backgroundColor: '#cc2222',
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }} />
            </div>
            <span style={{ width: 28, fontSize: '0.72rem', color: 'var(--text)', fontWeight: 600, textAlign: 'left', marginLeft: 6, flexShrink: 0 }}>{d.count}</span>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.6rem', color: 'var(--text-muted)', margin: '0.4rem 0 0', textAlign: 'center' }}>
        Source: National Security Bureau via Domino Theory
      </p>
    </div>
  )
}

const P = ({ children }) => (
  <p style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--writing-body)', margin: '0 0 1.2rem', fontWeight: 400 }}>
    {children}
  </p>
)

const H2 = ({ children }) => (
  <h2 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.4rem', fontWeight: 700, color: 'var(--text)', margin: '2.5rem 0 1rem' }}>
    {children}
  </h2>
)

export default function TaiwanFifthColumn() {
  return (
    <div>
      <P>
        In February 2023, CIA Director William Burns disclosed what the U.S. intelligence community had known for some time: Xi Jinping had <a href="https://www.cbsnews.com/news/cia-director-william-burns-i-wouldnt-underestimate-xis-ambitions-for-taiwan/" target="_blank" rel="noopener noreferrer">instructed the People&apos;s Liberation Army to be ready to conduct a successful invasion of Taiwan by 2027</a>. Admiral John Aquilino, then-Commander of U.S. Indo-Pacific Command, later <a href="https://www.armed-services.senate.gov/imo/media/doc/aquilino_statement.pdf" target="_blank" rel="noopener noreferrer">testified before Congress</a> that all indications pointed to the PLA meeting that directive. The deadline coincides with the PLA&apos;s centennial and the 21st Party Congress, where Xi will likely secure an unprecedented fourth term. It has concentrated minds in Washington and Taipei alike.
      </P>
      <P>
        But Western analysis of the Taiwan problem suffers from a persistent blind spot. Analysts fixate on amphibious landing craft, beach gradients, and missile salvos. These are real threats. They are also only half of Beijing&apos;s strategy, and probably not the half that matters most.
      </P>
      <P>
        Xi himself has been explicit about this. In speech after speech, he frames reunification as a matter to be achieved &ldquo;peacefully or otherwise,&rdquo; and peaceful reunification always comes first. This is not rhetoric. It is the operational mandate of the Chinese Communist Party&apos;s United Front Work Department, what Xi has called his &ldquo;magic weapon.&rdquo; The United Front&apos;s approach to Taiwan does not require turning a majority of Taiwanese into PRC loyalists. It requires only that enough of the population is sympathetic, apathetic, or economically entangled that Taiwan&apos;s ability to mount a coherent defense becomes politically untenable.
      </P>
      <P>
        That project is well underway. It operates on two fronts simultaneously: covert penetration of Taiwan&apos;s military, and overt cultivation of its political class. Both are accelerating.
      </P>

      <H2>Espionage and Military Subversion</H2>
      <P>
        The most alarming dimension is the direct penetration of Taiwan&apos;s armed forces. The accompanying timeline catalogues the documented cases from 2021 through early 2026, but the pattern extends further back, and a handful of cases capture its trajectory.
      </P>
      <P>
        In 2011, Major General <a href="https://www.washingtonpost.com/world/asia-pacific/in-taiwan-military-chinese-spy-stirs-unease/2011/09/20/gIQA9aYm2K_story.html" target="_blank" rel="noopener noreferrer">Lo Hsien-che was arrested</a>, the highest-ranking officer caught spying for the PRC in fifty years. Lo had been recruited through a honey trap in Thailand and spent nearly a decade passing classified intelligence to Chinese handlers, including details of the Po Sheng electronic warfare system, an advanced island-wide network for directing joint Taiwan-U.S. war operations. He was sentenced to life imprisonment. The Lo case should have been a wake-up call. Instead it was a prelude.
      </P>
      <P>
        What has followed is not simply more espionage but a qualitative shift in its purpose. China&apos;s intelligence operations in Taiwan now aim not merely to steal secrets but to build infrastructure for capitulation. As Russell Hsiao of the Global Taiwan Institute has observed, the goal is to foster a <a href="https://globaltaiwan.org/2024/05/an-assessment-of-the-prc-fifth-column-network-within-taiwan/" target="_blank" rel="noopener noreferrer">fifth column</a>: personnel who will &ldquo;lie low and not resist in wartime&rdquo; in exchange for financial rewards.
      </P>
      <P>
        The 2023 indictment of the Chen Yu-hsin spy ring illustrates this clearly. The network had recruited seven active-duty soldiers, but what distinguished the case was not the intelligence compromised. It was the fifth-column apparatus being assembled. A special forces wing commander had been recruited to defect by flying a CH-47 Chinook helicopter onto a Chinese aircraft carrier. Junior officers <a href="https://globaltaiwan.org/2024/09/recent-chinese-spy-cases-in-taiwan/" target="_blank" rel="noopener noreferrer">filmed propaganda videos</a> declaring they would surrender to the PLA in the event of war, scripted and recorded recruitment tools designed to encourage mass desertion. When the defendants were sentenced in August 2024, the heaviest term was thirteen years. Some received eighteen months.
      </P>
      <P>
        By January 2025, retired Lieutenant General Kao An-kuo had been <a href="https://www.taipeitimes.com/News/front/archives/2025/01/23/2003830681" target="_blank" rel="noopener noreferrer">arrested for founding</a> the &ldquo;Republic of China Taiwan Military Government,&rdquo; an organization funded with NT$9.62 million from the PRC and designed to act as an armed collaborator force during an invasion. Kao&apos;s group used drones to surveil military radar vehicles and recruited active and retired military personnel. He received seven and a half years for planning armed insurrection on behalf of a foreign power. Later that year, four military police officers assigned to Presidential Office security, the most sensitive posting in Taiwan&apos;s military, were found to have been <a href="https://www.washingtonpost.com/world/2025/03/28/taiwanese-soldiers-jailed-chinese-espionage/" target="_blank" rel="noopener noreferrer">photographing and relaying classified documents</a> to Chinese agents since 2022.
      </P>

      <EspionageTimeline collapsible />

      <P>
        These cases are not outliers. They are the ones that happened to be caught, and the rate of detection is itself escalating. Since 2020, approximately 160 individuals have been prosecuted, 95 of them current or former military officers. From January 2022 to June 2024, the government documented over <a href="https://globaltaiwan.org/2024/09/recent-chinese-spy-cases-in-taiwan/" target="_blank" rel="noopener noreferrer">1,700 instances of Chinese intelligence attempting to recruit Taiwanese military personnel</a> through online platforms. As early as 2017, Taiwan estimated that more than <a href="https://www.taipeitimes.com/News/front/archives/2017/03/13/2003666661" target="_blank" rel="noopener noreferrer">5,000 Chinese spies were operating within its borders</a>.
      </P>

      <ProsecutionChart />

      <P>
        The numbers tell one story. The sentences tell another. Eighteen months for participating in a spy ring that prepared surrender infrastructure. Seven years for founding an armed collaborator force. These are not penalties calibrated to deter a foreign intelligence service with functionally unlimited resources and patience.
      </P>

      <H2>The KMT&apos;s Pilgrimage to Beijing</H2>
      <P>
        If the military subversion is covert, the political dimension is conducted in broad daylight.
      </P>
      <P>
        Consider what Taiwan&apos;s legislature looks like. The 11th Legislative Yuan has 113 seats: 51 held by the DPP, 52 by the KMT, 8 by the TPP, and 2 by independents. The hemicycle diagram below maps every sitting legislator. The seats ringed in red are KMT members who have traveled to mainland China to meet with PRC officials, roughly a third of the KMT caucus, or about one in six of all legislators.
      </P>

      <Hemicycle />

      <P>
        In April 2024, KMT legislative caucus whip Fu Kun-chi <a href="https://taiwannews.com.tw/news/5675193" target="_blank" rel="noopener noreferrer">led a delegation of seventeen sitting lawmakers to Beijing</a>. They went not as private citizens but as sitting legislators, and met with Taiwan Affairs Office director Song Tao and Wang Huning, Xi&apos;s chief ideologue and the man in charge of Taiwan policy. The trip was conducted with minimal transparency; the DPP was unable to learn what was discussed behind closed doors. Upon return, China announced it would lift bans on Taiwanese agricultural products — a gesture calibrated to make the KMT look effective and the DPP look obstructionist.
      </P>
      <P>
        This delegation did not happen in a vacuum. It followed former President Ma Ying-jeou&apos;s <a href="https://globaltaiwan.org/2023/04/ma-ying-jeou-trip-brings-the-ccps-united-front-cultivation-of-taiwan-youth-back-into-the-spotlight/" target="_blank" rel="noopener noreferrer">March 2023 visit to the mainland</a>, the first by a former ROC leader since 1949. That trip was framed as personal, but as the Global Taiwan Institute documented, it was a CCP-orchestrated propaganda vehicle and a tool for the United Front Work Department&apos;s program to cultivate Taiwanese youth. Ma brought twenty university students through a curated itinerary designed to reinforce a shared Chinese identity that is, in fact, fading among young Taiwanese. He returned in April 2024 to meet Xi Jinping at the Great Hall of the People, and again in June 2025, in what has become an annual pilgrimage.
      </P>
      <P>
        The pattern is escalating. RUSI, a British defense think tank, noted that the April 2024 legislative delegation came just one month before the KMT-TPP coalition <a href="https://www.rusi.org/explore-our-research/publications/commentary/lawfare-and-subversion-taiwans-legislative-yuan" target="_blank" rel="noopener noreferrer">launched what amounted to a constitutional crisis</a> in the legislature, ramming through amendments to expand legislative powers at the expense of the executive. Taiwan&apos;s Constitutional Court later <a href="https://focustaiwan.tw/politics/202410280005" target="_blank" rel="noopener noreferrer">ruled the amendments were largely unconstitutional</a>. The same coalition has since moved to <a href="https://thediplomat.com/2025/02/amid-kmt-budget-cuts-taiwans-dpp-proposes-raising-defense-spending/" target="_blank" rel="noopener noreferrer">freeze and cut Taiwan&apos;s defense budget</a>, at the precise moment that U.S. officials are calling on Taiwan to spend 5 to 10 percent of GDP on defense.
      </P>
      <P>
        Then came the October 2025 KMT chair election. Cheng Li-wun, a deep-blue figure who has promoted the idea of making &ldquo;all Taiwanese say &lsquo;I&apos;m a Chinese,&rsquo;&rdquo; won the leadership. Within days she <a href="https://english.www.gov.cn/news/202510/19/content_WS68f495c2c6d00ca5f9a06e28.html" target="_blank" rel="noopener noreferrer">received a congratulatory message from Xi Jinping</a> and replied affirming the 1992 Consensus. Reporting from the Taipei Times in December 2025 revealed that Beijing had <a href="https://www.taipeitimes.com/News/front/archives/2025/12/08/2003848501" target="_blank" rel="noopener noreferrer">set three conditions for a Cheng-Xi meeting</a>, among them that the KMT block Taiwan&apos;s arms purchases. KMT Vice Chairman Chang Jung-kung reportedly traveled to Beijing in November to finalize the arrangement with Song Tao. Cheng has confirmed she will prioritize a Beijing trip over a visit to Washington in the first half of 2026, and has publicly opposed President Lai&apos;s proposed goal of spending 5% of GDP on defense by 2030.
      </P>
      <P>
        An opposition party chair who opposes defense spending, coordinates with the CCP&apos;s Taiwan Affairs Office, and pledges to promote Chinese identity among Taiwanese: this is not normal opposition politics. This is a party that has become a vector for Beijing&apos;s influence, operating within the institutions of Taiwanese democracy to constrain Taiwan&apos;s ability to defend itself.
      </P>

      <P>
        These two fronts, covert military penetration and overt political cultivation, are not separate problems. They are two instruments of the same strategy, and they reinforce each other in ways that make both more dangerous than either would be alone.
      </P>
      <P>
        Military pressure creates anxiety. Anxiety creates demand for accommodation. Accommodation creates political space for the actors already aligned with Beijing. The KMT&apos;s argument, that engagement with China reduces tension and benefits Taiwan economically, gains traction precisely when the PLA is conducting exercises off Taiwan&apos;s coast, cutting undersea cables, and probing its airspace. The cycle feeds itself: grey-zone warfare generates the political conditions that the United Front exploits, and United Front successes erode the political will needed to sustain deterrence.
      </P>
      <P>
        Meanwhile, the espionage infrastructure ensures that even if Taiwan&apos;s civilian leadership chose to fight, it cannot be confident in the loyalty of its own forces. A military that has been penetrated at the level of presidential security details and special forces command is a military that has to ask, in any contingency, who will follow orders and who has already agreed not to.
      </P>
      <P>
        This is what a fifth column looks like: less a dramatic coup than a slow, distributed erosion of the internal cohesion that any defense ultimately depends on.
      </P>

      <H2>What Needs to Happen</H2>
      <P>
        Taiwan&apos;s window is narrowing. If 2027 is the planning horizon, then the measures that matter are those that can be implemented in the next twelve to eighteen months.
      </P>
      <P>
        On counterintelligence, the sentencing regime needs to be rebuilt from the ground up. Eighteen months for espionage amounts to a speeding ticket. Taiwan needs mandatory minimums for national security offenses that reflect the scale of the threat, and it needs to resource its counterintelligence agencies to match the scope of Chinese operations that, by the government&apos;s own estimate, involved over 1,700 recruitment attempts against military personnel in a two-year span.
      </P>
      <P>
        On political transparency, Taiwan needs binding disclosure requirements for legislators who meet with officials from a government that claims sovereignty over their country. The current arrangement, where a third of the KMT caucus can travel to Beijing, meet with the CCP&apos;s top Taiwan policymakers, and face no obligation to disclose what was discussed, is indefensible.
      </P>
      <P>
        On resilience, Taiwan needs to accelerate efforts to reduce its dependence on Chinese platforms for information and its dependence on Chinese markets for economic security. Algorithmic manipulation through TikTok, Xiaohongshu, and WeChat is a delivery mechanism for United Front narratives, and economic entanglement is the leverage that makes those narratives land.
      </P>
      <P>
        None of this will be easy, and all of it runs into the fundamental paradox of defending a democracy against a threat that operates partly through democratic institutions. Drawing the line between legitimate opposition and activity that functionally serves a foreign annexation strategy is genuinely difficult. But the alternative to drawing that line is not neutrality. It is capitulation by default.
      </P>
      <P>
        If Taiwan cannot build the internal consensus necessary to sustain its own defense, no amount of American arms sales or Japanese contingency planning will matter. A nation divided against itself cannot stand, and Beijing is counting on exactly that.
      </P>
    </div>
  )
}
