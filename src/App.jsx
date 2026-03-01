import { useEffect, useState, lazy, Suspense } from 'react'
import './App.css'
import ChessPuzzle from './ChessPuzzle'
import WritingDetail from './WritingDetail'
import writings, { TAGS } from './writings'
import Hemicycle from './Hemicycle'

const ChessEngine = lazy(() => import('./ChessEngine'))

const projects = [
  { id: 'chess-engine', title: 'play chess with me' },
  { id: 'chess-puzzles', title: 'play a chess puzzle!' },
]

function App() {
  const [filter, setFilter] = useState('all')

  const [page, setPage] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/'
    if (path.startsWith('/writings/')) {
      return { type: 'writing-detail', slug: path.replace('/writings/', '') }
    }
    if (path === '/writings') return { type: 'writings' }
    if (path.startsWith('/projects/')) {
      return { type: 'project-detail', id: path.replace('/projects/', '') }
    }
    if (path === '/projects') return { type: 'projects' }
    if (path === '/') return { type: 'home' }
    // Unknown route
    return { type: 'not-found' }
  })

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname
      if (path.startsWith('/writings/')) {
        setPage({ type: 'writing-detail', slug: path.replace('/writings/', '') })
      } else if (path === '/writings') {
        setPage({ type: 'writings' })
      } else if (path.startsWith('/projects/')) {
        setPage({ type: 'project-detail', id: path.replace('/projects/', '') })
      } else if (path === '/projects') {
        setPage({ type: 'projects' })
      } else if (path === '/') {
        setPage({ type: 'home' })
      } else {
        setPage({ type: 'not-found' })
      }
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  useEffect(() => {
    if (page.type === 'not-found') return
    let desiredPath = '/'
    if (page.type === 'writings') desiredPath = '/writings'
    if (page.type === 'writing-detail') desiredPath = `/writings/${page.slug}`
    if (page.type === 'projects') desiredPath = '/projects'
    if (page.type === 'project-detail') desiredPath = `/projects/${page.id}`
    if (window.location.pathname !== desiredPath) {
      window.history.pushState(null, '', desiredPath)
    }
  }, [page])

  // Writing detail page
  if (page.type === 'writing-detail') {
    const writing = writings.find((w) => w.slug === page.slug)
    return (
      <div className="projects-page">
        <header className="projects-header">
          <button className="back-link" onClick={() => setPage({ type: 'writings' })}>
            &larr; back to all writings
          </button>
        </header>
        <div className="writing-detail-wrapper">
          {writing ? <WritingDetail writing={writing} /> : <p>not found</p>}
        </div>
        <button className="bottom-home-link" onClick={() => setPage({ type: 'home' })}>
          home
        </button>
        <span className="vibecoded">100% vibecoded (it shows)<br />website inspired by my friend <a href="https://tedchai.com" target="_blank" rel="noopener noreferrer">Ted</a></span>
      </div>
    )
  }

  // Writings list page
  if (page.type === 'writings') {
    const filtered = filter === 'all' ? writings : writings.filter((w) => w.tag === filter)
    return (
      <div className="projects-page">
        <header className="projects-header">
          <h2>writings</h2>
          <button className="back-link" onClick={() => setPage({ type: 'home' })}>
            back
          </button>
        </header>
        <div className="writing-tags">
          {TAGS.map((tag) => (
            <button
              key={tag}
              className={`writing-tag${filter === tag ? ' writing-tag-active' : ''}`}
              onClick={() => setFilter(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        <div className="writing-list">
          {filtered.map((w) => (
            <div
              key={w.slug}
              className="writing-row"
              onClick={() => setPage({ type: 'writing-detail', slug: w.slug })}
            >
              <p className="writing-row-title">{w.title}</p>
              <span className="writing-row-date">{w.date}</span>
            </div>
          ))}
        </div>
        <button className="bottom-home-link" onClick={() => setPage({ type: 'home' })}>
          home
        </button>
        <span className="vibecoded">100% vibecoded (it shows)<br />website inspired by my friend <a href="https://tedchai.com" target="_blank" rel="noopener noreferrer">Ted</a></span>
      </div>
    )
  }

  // Project detail page
  if (page.type === 'project-detail') {
    const project = projects.find((p) => p.id === page.id)
    return (
      <div className="projects-page">
        <header className="projects-header">
          <h2>{project ? project.title : 'Project'}</h2>
          <button className="back-link" onClick={() => setPage({ type: 'projects' })}>
            Back
          </button>
        </header>
        <div className="project-detail">
          {page.id === 'chess-engine' ? (
            <Suspense fallback={<p style={{ color: '#555', fontSize: '0.85rem' }}>Loading chess engine...</p>}>
              <ChessEngine />
            </Suspense>
          ) : page.id === 'chess-puzzles' ? <ChessPuzzle /> : page.id === 'taiwan-hemicycle' ? <Hemicycle /> : <p>TBD</p>}
        </div>
        <button className="bottom-home-link" onClick={() => setPage({ type: 'home' })}>
          Home
        </button>
        <span className="vibecoded">100% vibecoded (it shows)<br />website inspired by my friend <a href="https://tedchai.com" target="_blank" rel="noopener noreferrer">Ted</a></span>
      </div>
    )
  }

  // 404 page
  if (page.type === 'not-found') {
    return (
      <div className="not-found-page">
        <p className="not-found-text">this page doesn&apos;t exist, but play a chess puzzle while you&apos;re here!</p>
        <ChessPuzzle />
        <button className="not-found-home" onClick={() => setPage({ type: 'home' })}>
          go back to the home page
        </button>
      </div>
    )
  }

  // Projects list page
  if (page.type === 'projects') {
    return (
      <div className="projects-page">
        <header className="projects-header">
          <h2>Projects</h2>
          <button className="back-link" onClick={() => setPage({ type: 'home' })}>
            Back
          </button>
        </header>
        <div className="project-list">
          {projects.map((project) => (
            <div
              key={project.id}
              className="project-row"
              onClick={() => setPage({ type: 'project-detail', id: project.id })}
            >
              <p className="project-row-title">{project.title}</p>
              <span className="project-row-arrow">&rarr;</span>
            </div>
          ))}
        </div>
        <button className="bottom-home-link" onClick={() => setPage({ type: 'home' })}>
          Home
        </button>
        <span className="vibecoded">100% vibecoded (it shows)<br />website inspired by my friend <a href="https://tedchai.com" target="_blank" rel="noopener noreferrer">Ted</a></span>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="name-block">
          <p className="name">Stephen Yang</p>
          <p className="email">stephenkyang [at] wing [dot] com</p>
          <a className="linkedin-link" href="https://linkedin.com/in/stephen-yang-" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>
        </div>
        <div className="nav-links">
          <button className="nav-link" onClick={() => setPage({ type: 'projects' })}>
            projects
          </button>
          <button className="nav-link" onClick={() => setPage({ type: 'writings' })}>
            writings
          </button>
        </div>
      </header>

      <main className="landing">
        <section className="intro">
          <p>Hi, I&apos;m Stephen.</p>
          <p className="bio">
            I&apos;m a software engineer at Wing, working on automating traffic management for UAVs (drones). In the past, I worked at DoorDash where I created agentic workflows to
            automate fraud detection and customer support processes.
          </p>
        </section>
      </main>

      <button className="recent-project" onClick={() => setPage({ type: 'project-detail', id: 'chess-engine' })}>
        last update: play chess with me (feb 2026)
      </button>

      <span className="vibecoded">100% vibecoded (it shows)<br />website inspired by my friend <a href="https://tedchai.com" target="_blank" rel="noopener noreferrer">Ted</a></span>
    </div>
  )
}

export default App
