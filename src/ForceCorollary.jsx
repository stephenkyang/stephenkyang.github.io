
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

const Ref = ({ children }) => (
  <li style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--writing-body)', marginBottom: '0.6rem', paddingLeft: '2rem', textIndent: '-2rem' }}>
    {children}
  </li>
)

export default function ForceCorollary() {
  return (
    <div>
      <P>The Intelligence Curse presents several policy options, which can generally be grouped into three broad categories.</P>
      <ol style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--writing-body)', margin: '0 0 1.2rem', paddingLeft: '1.5rem' }}>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}><strong>Aversion</strong> is the prevention of catastrophes such as engineered pandemics and large-scale cyberattacks.</li>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}><strong>Diffusion</strong> is the spreading of user-aligned AI and the fair allocation of the benefits derived from it (for example, universal basic compute).</li>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}><strong>Democratization</strong> is keeping the government accountable to the populace even as the capabilities of the state come to greatly exceed those of its citizenry.</li>
      </ol>

      <P>Each remedy raises similar questions:</P>

      <ol style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--writing-body)', margin: '0 0 1.2rem', paddingLeft: '1.5rem', fontWeight: 400 }}>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}>Who will implement, monitor, and enforce the rules?</li>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}>Why should companies or governments abide by the rules once no longer forced to?</li>
        <li style={{ marginBottom: '0.5rem', fontWeight: 400 }}>What can the public do if a rogue entity captures control of the state?</li>
      </ol>

      <P>The Intelligence Curse identifies these problems but largely treats enforcement as a downstream detail—as though the rules, once written, will find something to back them. This assumption leaves a significant gap.</P>

      <H2>Why Do Rulers Franchise the Public?</H2>
      <P>
        Rulers require a coalition, and such coalitions have historically included ordinary people. There are two distinct explanations for why that is.
      </P>
      <P>
        First, there is <em>value</em>. Rulers rely on the taxes, labor, and expertise of the public to run the state. People are therefore necessary. This resembles Mancur Olson&apos;s stationary bandit (Olson, 1993), who protects and invests in his subjects because he profits from them.
      </P>
      <P>
        Second, there is <em>force</em>. The public can collectively threaten to overthrow a ruler. People are therefore feared. This parallels the account of democracy by Acemoglu and Robinson (2005): de facto power leads to de jure rights being granted to the public as a result of its potential for revolt.
      </P>
      <P>
        There is no inherent relationship between value and force. A ruler may fund infrastructure for his subjects both because they are valuable and because they are dangerous, and artificial intelligence whittles down both points of leverage at once. The automation of tasks diminishes the value of human labor. The automation of force diminishes the threat of public revolt. As both diminish, so does the size of the winning coalition a ruler must keep on its side. Ultimately, as both disappear, <strong>the only coalition a ruler must satisfy is the owners of the AGI</strong>.
      </P>
      <P>
        Value and force are the two reasons a ruler has ever needed the public. The Intelligence Curse addresses value directly: diffusion is, at its core, a strategy for keeping the public economically relevant. But force goes almost unmentioned. And as the rest of this essay argues, force is the precondition on which every one of its proposed solutions implicitly depends.
      </P>

      <H2>Force Must Be Contestable</H2>
      <P>
        <em>Contestable force</em> means that rulers cannot act without limits because the public retains the capacity to resist and impose costs on them. This threat of resistance is credible when the ruler knows that they cannot easily suppress the public if retaliation begins. This credible threat incentivizes rulers to respect agreements, institutions, and public rights. It is also the very precondition that makes any policy solutions to The Intelligence Curse sustainable.
      </P>
      <P>
        As such, any suggestion for solving The Intelligence Curse must maintain the public&apos;s capacity to impose costs on rulers. Force is therefore the necessary precondition for any policy to hold. Protect its contestability and rulers have a reason to keep the institutions the public chose. Strip it away and rights become withdrawable at no cost, whatever the social contract says.
      </P>

      <H2>A Case Study: The Rentier State</H2>
      <P>
        To isolate the importance of contestable force, we need a real-life case where value collapsed but contestable force did not. A rentier state is such a case. Because its revenues come from resources rather than from taxing or employing its citizens, a rentier state sees the public&apos;s value collapse with no corresponding loss of force (Ross, 2001). Any difference in accountability between two rentier states must therefore come from the contestability of force, not from the value of the public. Norway and Venezuela are examples where wealth is predominantly derived from oil resources controlled by the government, not from the economic value of the public. If public value alone determined political outcomes, the two countries should have followed similar paths. Yet, Norway remains one of the most accountable governments in the world. On the other hand, Venezuela became a personalistic dictatorship. Because oil weakened public value in both cases, public value alone cannot explain the divergence in governance outcomes. Contestable force can.
      </P>
      <P>
        Norway staffs its state apparatus with people drawn from the public—soldiers and officials who remain embedded in the society they would be ordered against, and who can always withhold their cooperation. The inherent threat to refuse keeps force contestable, and contestable force keeps the government accountable. Venezuela&apos;s apparatus runs in the opposite way: a small core of loyalists paid directly by Maduro, in currency and immunity. This is what a ruler does when he can no longer assume loyalty and has to buy it.
      </P>
      <P>
        Maduro&apos;s authority still carries a price, and a price is something a payee can refuse. The post-AGI ruler&apos;s authority carries no price. Until now, every ruler&apos;s power has rested on cooperation that could be withdrawn. Theirs would not.
      </P>

      <H2>Where Does the Power to Exert Force Come From?</H2>
      <P>
        Now that we have established contestable force as a necessary precondition for any sustainable solution to The Intelligence Curse, the natural question is to ask: How does the public contest force today and how does automation threaten the public&apos;s role? Force can be understood through three layers:
      </P>
      <ul style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--writing-body)', margin: '0 0 1.2rem', paddingLeft: '1.5rem', fontWeight: 400 }}>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>The first layer is the <em>means</em>: the instruments of force and the infrastructure required to produce them. The public&apos;s leverage here comes from the workforce that produced the arms. Building and operating armaments at scale requires large numbers of skilled workers who can strike, slow down, or refuse to work. But with more automation, so goes the public&apos;s leverage.</li>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>The second layer is the <em>operators</em>: those who physically apply force to actual bodies, namely soldiers and police. They are the public&apos;s greatest source of leverage. No regime has ever fully eliminated the possibility of troops refusing to fire, defecting, fraternizing with the enemy, or deserting. Autonomous weapons have no conscience, so without regulation the possibility of defection shrinks toward zero.</li>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>The third layer is the <em>commanders</em>: those who direct the means of force toward targets. Directing force historically required many hands, and seizing or redirecting it required assembling a coalition. This is why coups are coordination problems: as fewer people take part in the decision, control concentrates toward a single point of authority. Automation removes the coordination. A small command group that once needed many hands to act can act alone, which is its own form of irreversibility.</li>
      </ul>
      <P>
        Of the three layers, operators are the one historically staffed by the public. Referring back to the rentier state case study, both Norway and Venezuela still run on an operator link: someone is compensated to maintain the apparatus, which is why both rulers still answer to someone, even if Venezuela&apos;s someone is just a paid group. The Intelligence Curse is a rentier state plus one more step. Automate the operator link and there is no longer anyone to pay.
      </P>

      <H2>A Smell Test for Sustainable Solutions to The Intelligence Curse</H2>
      <P>
        A single objective exists: maintain all three pillars with humans capable of refusing, thus keeping force contestable. One tool to determine whether a particular policy supports this goal is a diagnostic, and it works best when evaluating policies that have an impact on a pillar.
      </P>
      <ol style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', lineHeight: 1.7, color: 'var(--writing-body)', margin: '0 0 1.2rem', paddingLeft: '1.5rem', fontWeight: 400 }}>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>Identify the pillar (means, operator, or commander) that a policy touches.</li>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>Assess the chokepoint. A pillar constrains a ruler only while it has humans capable of withholding their consent: a workforce that can strike, soldiers who can desert, officers who must coordinate. How many humans must agree for the pillar to function? And what cost would each have to incur to withhold that agreement?</li>
        <li style={{ marginBottom: '0.75rem', fontWeight: 400 }}>Verify for durability. The question is not whether the pillar is manned today, but whether the policy holds the chokepoint as the technology changes, or merely describes the present and lets automation grow around it. Assess whether the policy slows the erosion of the human chokepoint, maintains it, or only window-dresses a process that has already been automated.</li>
      </ol>
      <P>
        The diagnostic can be run on any pillar, but the three are not interchangeable. Defending the means or the commanders preserves a chokepoint inside a small group—the workers who build the arms, the officers who direct them. Defending the operators preserves a chokepoint drawn from the general public, since operators are recruited from it, and historically the public&apos;s leverage over the other two pillars ran through them. Ideally a post-AGI society keeps every pillar staffed with the public. But the three are not equal: the means and the commanders are holding actions; the operator pillar is the line that cannot be conceded. Lose it, and the other defenses protect a chokepoint the public was never part of.
      </P>

      <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
        <h3 style={{ fontFamily: "Georgia, 'Times New Roman', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '1rem' }}>References</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <Ref>Acemoglu, D., &amp; Robinson, J. A. (2005). <em>Economic origins of dictatorship and democracy.</em> Cambridge University Press.</Ref>
          <Ref>Drago, L., &amp; Laine, R. (2025, April). <em>The intelligence curse.</em> Retrieved from <a href="https://intelligence-curse.ai" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text)' }}>https://intelligence-curse.ai</a></Ref>
          <Ref>Olson, M. (1993). Dictatorship, democracy, and development. <em>American Political Science Review, 87</em>(3), 567&ndash;576. doi: 10.2307/2938736</Ref>
          <Ref>Ross, M. L. (2001). Does oil hinder democracy? <em>World Politics, 53</em>(3), 325&ndash;361. doi: 10.1353/wp.2001.0011</Ref>
        </ul>
      </div>
    </div>
  )
}
