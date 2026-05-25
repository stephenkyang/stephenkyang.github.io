import DebtProjection from './DebtProjection'
import TaiwanFifthColumn from './TaiwanFifthColumn'

export const TAGS = ['all', 'domestic policy', 'foreign policy', 'ai']

const writings = [
  {
    slug: 'taiwan-fifth-column',
    title: 'Taiwan’s Fifth Column',
    date: 'feb 2026',
    tag: 'foreign policy',
    component: TaiwanFifthColumn,
  },
  {
    slug: 'severity-of-us-debt',
    title: 'Illustrating the Severity of US Debt',
    date: 'mar 2026',
    tag: 'domestic policy',
    component: DebtProjection,
  },
]

export default writings
