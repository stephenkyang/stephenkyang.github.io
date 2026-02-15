import { useEffect, useState } from 'react'
import './App.css'
import ChessPuzzle from './ChessPuzzle'

const projects = [
  { id: 'chess-puzzles', title: 'play a chess puzzle!' },
]

function App() {
  const [page, setPage] = useState(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '/'
    if (path.startsWith('/projects/')) {
      return { type: 'project-detail', id: path.replace('/projects/', '') }
    }
    if (path === '/projects') return { type: 'projects' }
    if (path === '/') return { type: 'home' }
    // Unknown route — show chess puzzle
    return { type: 'project-detail', id: 'chess-puzzles' }
  })

  useEffect(() => {
    const handlePop = () => {
      const path = window.location.pathname
      if (path.startsWith('/projects/')) {
        setPage({ type: 'project-detail', id: path.replace('/projects/', '') })
      } else if (path === '/projects') {
        setPage({ type: 'projects' })
      } else if (path === '/') {
        setPage({ type: 'home' })
      } else {
        setPage({ type: 'project-detail', id: 'chess-puzzles' })
      }
    }

    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  useEffect(() => {
    let desiredPath = '/'
    if (page.type === 'projects') desiredPath = '/projects'
    if (page.type === 'project-detail') desiredPath = `/projects/${page.id}`
    if (window.location.pathname !== desiredPath) {
      window.history.pushState(null, '', desiredPath)
    }
  }, [page])

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
          {page.id === 'chess-puzzles' ? <ChessPuzzle /> : <p>TBD</p>}
        </div>
        <button className="bottom-home-link" onClick={() => setPage({ type: 'home' })}>
          Home
        </button>
        <span className="vibecoded">100% vibecoded (it shows)</span>
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
        <span className="vibecoded">100% vibecoded (it shows)</span>
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
            Projects
          </button>
        </div>
      </header>

      <main className="landing">
        <section className="intro">
          <p>Hi, I&apos;m Stephen.</p>
          <p className="bio">
            I&apos;m a software engineer at Wing, working on automating traffic management for UAVs. In the past, I worked at DoorDash where I created agentic workflows to
            automate fraud detection and customer support processes.
          </p>
        </section>
      </main>

      <button className="recent-project" onClick={() => setPage({ type: 'project-detail', id: 'chess-puzzles' })}>
        last update: play a chess puzzle! (feb 2026)
      </button>

      <span className="vibecoded">100% vibecoded (it shows)</span>
    </div>
  )
}

export default App
