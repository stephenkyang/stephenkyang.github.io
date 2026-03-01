import TaiwanFifthColumn from './TaiwanFifthColumn'

export const TAGS = ['all', 'international relations', 'domestic policy', 'ai']

const writings = [
  {
    slug: 'taiwans-fifth-column-problem',
    title: "Taiwan's Fifth Column Problem",
    date: 'feb 2026',
    tag: 'international relations',
    component: TaiwanFifthColumn,
  },
  {
    slug: 'gavin-newsom-harnessing-anger',
    title: "Gavin Newsom Is Harnessing the Anger of Americans to a Void of Nowhere",
    date: 'feb 2026',
    tag: 'domestic policy',
    image: '/newsom.png',
    content: `TBD`,
  },
  {
    slug: 'hello-world',
    title: 'Hello World',
    date: 'feb 2026',
    content: `this is my first post. more to come.`,
  },
]

export default writings
