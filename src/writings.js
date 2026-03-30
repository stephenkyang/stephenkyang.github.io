import TaiwanFifthColumn from './TaiwanFifthColumn'
import DebtProjection from './DebtProjection'

export const TAGS = ['all', 'international relations', 'domestic policy', 'ai']

const writings = [
  {
    slug: 'severity-of-us-debt',
    title: 'Illustrating the Severity of US Debt',
    date: 'mar 2026',
    tag: 'domestic policy',
    component: DebtProjection,
  },
  {
    slug: 'taiwans-fifth-column-problem',
    title: "Taiwan's Fifth Column Problem",
    date: 'feb 2026',
    tag: 'international relations',
    component: TaiwanFifthColumn,
  },
]

export default writings
