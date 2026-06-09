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

const FN = ({ n }) => (
  <sup style={{ fontSize: '0.7rem', lineHeight: 0 }}>
    <a href={`#note-${n}`} style={{ color: 'var(--text)', textDecoration: 'none' }}>{n}</a>
  </sup>
)

const notes = [
  'John Aquilino, prepared testimony to the House Armed Services Committee, March 2024 ("all indications point to the PLA meeting President Xi Jinping\'s directive to be ready to invade Taiwan by 2027"). Japan Times',
  'Cheng Li-wun led a KMT delegation to the mainland April 7–12, 2026, meeting Xi Jinping at the Great Hall of the People on April 10, the first KMT–CCP leaders\' meeting in a decade. Reuters',
  'Seventeen KMT lawmakers led by caucus whip Fu Kun-chi met Wang Huning in Beijing on April 27, 2024, weeks before Lai Ching-te\'s May 20 inauguration. Taiwan News',
  'The Zhen Xiaojiang ring, described as the largest Chinese spy network uncovered in Taiwan in recent decades, recruited retired and active military officers, including retired major general Hsu Nai-chuan. Taipei Times',
  'After multiple trials and appeals, Zhen was sentenced to four years before deportation; co-conspirators received comparable or suspended terms. Taipei Times',
  'The High Court later imposed a seventeen-year sentence on former air force officer Lou Wen-ching for passing secrets to Zhen\'s network, a sharp departure from the three-to-four-year norm of the prior decade. Taipei Times',
  'President Lai called in March 2025 for a disclosure mechanism requiring officials and elected representatives, from legislators to village chiefs, to make their China-exchange information public. CNA',
  'The Executive Yuan approved draft Cross-Strait Act amendments in December 2025 requiring elected officials who contact PRC, CCP, or PLA bodies to report the time, location, and records of such meetings, with fines for violations. Focus Taiwan',
  'The reporting requirement targets the legislators who must pass it; the KMT has characterized the measure as a political maneuver. Focus Taiwan',
  'Legal experts have urged tougher sentences, attributing leniency to statutory language and reliance on civil courts. Taipei Times',
  'ODNI 2026 Annual Threat Assessment: Chinese leaders "do not currently plan to execute an invasion of Taiwan in 2027, nor do they have a fixed timeline for achieving unification." USNI News',
]

export default function ChineseInfluenceInTaiwan() {
  return (
    <div>
      <P>
        In March 2024, Admiral John Aquilino testified to the House Armed Services Committee that all indications pointed to the People&apos;s Liberation Army (PLA) meeting Xi Jinping&apos;s (習近平) directive to be ready to invade Taiwan by 2027.<FN n={1} /> In Western media, it is common to focus on the offensive capabilities of China, fixating on the drills, the amphibious threat, and the aerial advancements that the PLA has made. These observations, while notable, only represent one side of the Chinese strategy of reunification. Xi Jinping and the official Chinese position have always claimed that peaceful reunification is the preferred way to reunite with Taiwan, while maintaining the right to use force. The cheaper route does not run through an amphibious landing. It runs through Taiwan&apos;s own institutions, and Beijing has shown it is willing to exploit the gaps it finds there.
      </P>

      <H2>Backchannels With Taiwan&apos;s Political Opposition</H2>
      <P>
        Taiwan&apos;s two major opposition parties, the KMT and TPP, both favor closer ties with the mainland than the ruling party does. Disagreement over how to manage a powerful neighbor is ordinary in any democracy. What is unusual is how Beijing chooses to communicate with Taiwan&apos;s political class. While Beijing permanently closed any dialogue with Taiwan&apos;s elected government, it cultivates formalized relationships with Taiwan&apos;s opposition. This lets Beijing extend selective legitimacy, dialogue, and economic incentives to elements of Taiwan&apos;s political arena, regardless of any individual legislator&apos;s intentions.
      </P>
      <P>
        That engagement shows the mechanism at work. From April 7 to 12, 2026, KMT chairperson Cheng Li-wun visited the mainland. During the six-day visit to Nanjing, Shanghai, and Beijing, she met Xi Jinping at the Great Hall of the People on April 10, alongside Beijing&apos;s most senior officials on Taiwan policy, in the first meeting between KMT and CCP leaders in a decade.<FN n={2} />
      </P>
      <P>
        Cheng&apos;s visit was not isolated. Before the May 20, 2024 inauguration of Lai Ching-te, whom Beijing actively worked against during the presidential election, seventeen KMT legislators led by caucus whip Fu Kun-chi traveled to the mainland to meet Wang Huning (王滬寧), the Politburo Standing Committee member responsible for cross-strait affairs.<FN n={3} /> Wang has met KMT leaders repeatedly in recent years. Any single meeting reads as legitimate cross-strait contact. But their regularity over time reveals a systemic arrangement: a standing line of communication between Beijing&apos;s chief Taiwan strategist and the leadership of Taiwan&apos;s largest opposition party, maintained while Beijing refuses to engage the government Taiwan&apos;s voters elected.
      </P>

      <Hemicycle />

      <P>
        The danger is not secrecy. The meetings are publicly disclosed and routinely covered in local media. Nor does it lie in proving intent. The danger is the asymmetry. Beijing has made the freezing-out of Taiwan&apos;s elected government and the rewarding of its opposition a permanent structural feature of cross-strait relations, rather than an issue-based response to specific choices by Taiwanese voters.
      </P>

      <H2>Inconsistencies In Espionage Sentencing</H2>
      <P>
        For years, Taiwan&apos;s military court system issued light penalties to military personnel charged with espionage. Officers who leaked sensitive national-security material to Chinese intelligence generally received one to four years. Such terms gave corrupt officials little reason to refuse. Selling out the state carried minimal risk.
      </P>
      <P>
        Zhen Xiaojiang&apos;s (鎮小江) case is the benchmark. Posing as a Hong Kong businessman, he began traveling to Taiwan in 2007, cultivating military contacts and paying those willing to collaborate. He built what has been called the largest Chinese espionage network uncovered in Taiwan in recent decades, recruiting retired and active-duty personnel including a retired army major general.<FN n={4} /> After years of proceedings and appeals, Zhen was convicted and sentenced to just four years before deportation to the mainland; most of his co-conspirators received comparable or suspended terms.<FN n={5} /> A network that large drew so little prison time in total that the sentence itself advertised how small the risk was.
      </P>

      <EspionageTimeline collapsible />

      <P>
        The judiciary has since adjusted, partly in response to Lai&apos;s decision to again allow military judges to preside over such cases. Courts have begun handing down far longer terms, including a seventeen-year sentence on appeal for a former air force officer who passed secrets to Zhen&apos;s network.<FN n={6} /> According to the Control Yuan, Taiwan recorded forty espionage cases between 2011 and 2023, nearly triple the prior decade, and prosecutions rose to dozens of individuals per year. Taiwan&apos;s counterintelligence effort has plainly grown more vigilant, and the message to the military has shifted.
      </P>

      <ProsecutionChart />

      <P>
        That shift is real, but it is the weakest form of deterrence. It came through judicial readjustment, not legislation. It is recent, and any future administration or judicial panel could reverse it simply by prosecuting differently. Deterrence that depends on which judge hears the case is not deterrence Taiwan can rely on. The recent severity shows the system can respond. It also shows the response rests on discretion a future court can withdraw.
      </P>

      <H2>Recommendations</H2>
      <P>
        Two remedies are worth pursuing, and neither would stop the opposition from advocating closer ties with China. Taiwanese law cannot remove the politics from this. The root cause, Beijing&apos;s choice to engage one party and shun the government, sits entirely outside Taiwan&apos;s jurisdiction. What the legislature can address is how Beijing exploits the resulting conditions: by reducing the secrecy that surrounds the meetings, and by raising the cost of the espionage that secrecy enables.
      </P>
      <P>
        The first remedy is already drafted and stalled. When politicians meeting Chinese counterparts produce understandings whose terms voters never see, voters are left guessing what was discussed and promised, and that guessing game is exactly where Beijing operates. In March 2025, President Lai called for a disclosure mechanism requiring officials and elected representatives, from legislators down to village chiefs, to make their cross-strait exchange information public.<FN n={7} /> In December 2025, the Executive Yuan approved draft amendments to the Cross-Strait Act that would require elected officials who meet bodies overseen by the Chinese government, the CCP, or the PLA to report the time, location, and records of those contacts, with fines for violations.<FN n={8} /> The executive faced this exact problem and did not try to ban the meetings. It required disclosure of them. Advocating closer ties is legitimate, and legislators are no more obligated to narrate every private conversation than officials anywhere else. But forcing these meetings into public view changes their value. Whether Beijing offers legitimacy or economic benefit, each is worth most to the opposition when voters cannot see what was given in return. Disclosure does not remove the benefit. It attaches a visible commitment to it, one the opposition must defend at the ballot box rather than enjoy privately. Influence that must be announced is influence voters can weigh.
      </P>
      <P>
        The reporting bill has not become law. The requirement is aimed at the very legislators who would have to pass it, and the KMT has dismissed it as a political maneuver rather than a security measure.<FN n={9} /> An opposition that benefits from undisclosed contact has every incentive to block a rule that would disclose it. The resistance to the bill tracks the argument of this essay. Those who gain most from secrecy are the ones positioned to keep it.
      </P>
      <P>
        The second remedy is to codify stricter espionage penalties. Statutory minimums would harden the deterrence that now rests solely on judicial discretion. As noted, sentences have clustered at the low end of the one-to-four-year range, leniency that experts attribute to vague statutory language and the past reliance on civil courts for these cases.<FN n={10} /> The Ministry of National Defense has proposed raising penalties for treasonous acts, but such measures have faced a difficult path in a legislature where the opposition holds sway. That the fix sits with the opposition illustrates the problem itself.
      </P>
      <P>
        Western strategists continue to plan for a possible 2027 invasion, but Beijing would likely prefer not to invade at all. The U.S. intelligence community&apos;s 2026 Annual Threat Assessment found that Chinese leaders do not currently plan to invade Taiwan in 2027 and have no fixed timeline for unification.<FN n={11} /> The cheaper route runs through Taiwan&apos;s own institutions, and Beijing is willing to exploit the gap. Taiwan cannot legislate away the appeal of closeness to China. It can decide whether that closeness is negotiated openly or sold in secret.
      </P>

      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {notes.map((text, i) => (
            <li key={i} id={`note-${i + 1}`} style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.8rem', lineHeight: 1.55, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'flex', gap: '0.5rem', scrollMarginTop: '2rem' }}>
              <span style={{ flexShrink: 0, fontWeight: 600 }}>{i + 1}.</span>
              <span>{text}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
