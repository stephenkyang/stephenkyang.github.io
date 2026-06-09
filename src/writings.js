import DebtProjection from './DebtProjection'
import ChineseInfluenceInTaiwan from './ChineseInfluenceInTaiwan'
import ForceCorollary from './ForceCorollary'

export const TAGS = ['all', 'domestic policy', 'foreign policy', 'ai']

const writings = [
  {
    slug: 'chinese_influence_in_taiwan',
    title: 'Beijing Doesn\'t Need to Invade',
    subtitle: 'How China Exploits the Gaps in Taiwan\'s Institutions',
    date: 'may 2026',
    tag: 'foreign policy',
    component: ChineseInfluenceInTaiwan,
  },
  {
    slug: 'severity-of-us-debt',
    title: 'Illustrating the Severity of US Debt',
    date: 'mar 2026',
    tag: 'domestic policy',
    component: DebtProjection,
  },
  {
    slug: 'force-corollary',
    title: 'The Contestable Force Corollary to the Intelligence Curse',
    description: 'This essay proposes a diagnostic for evaluating the policies The Intelligence Curse (Drago & Laine, 2025) recommends. It asks of each one whether the policy preserves the public\'s capacity to refuse.',
    date: 'feb 2026',
    tags: ['ai', 'domestic policy'],
    component: ForceCorollary,
  },
]

export default writings
