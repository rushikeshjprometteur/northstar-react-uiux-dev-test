import { useEffect, useMemo, useState, useCallback } from 'react'
import { createRoot } from 'react-dom/client'
import { Home, BarChart3, Users, Settings, HelpCircle, FolderKanban, CreditCard, Menu, X } from 'lucide-react'
import clsx from 'clsx'
import './styles/tailwind.css'
import './styles/global.scss'
import './styles/broken-layout.css'
import Dashboard from './pages/Dashboard.jsx'
import Projects from './pages/Projects.jsx'
import Team from './pages/Team.jsx'
import Reports from './pages/Reports.jsx'
import Billing from './pages/Billing.jsx'
import SettingsPage from './pages/Settings.jsx'
import Support from './pages/Support.jsx'

const routes = [
  { path: '/', label: 'Dashboard', icon: Home, component: Dashboard },
  { path: '/projects', label: 'Projects', icon: FolderKanban, component: Projects },
  { path: '/team', label: 'Team', icon: Users, component: Team },
  { path: '/reports', label: 'Reports', icon: BarChart3, component: Reports },
  { path: '/billing', label: 'Billing', icon: CreditCard, component: Billing },
  { path: '/settings', label: 'Settings', icon: Settings, component: SettingsPage },
  { path: '/support', label: 'Support', icon: HelpCircle, component: Support }
]

function readHashPath() {
  const hash = window.location.hash.replace('#', '') || '/'
  // Strip query strings to fix route matching (e.g. #/team?tab=active → /team)
  return hash.split('?')[0]
}

function App() {
  const [path, setPath] = useState(readHashPath())
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [globalSearch, setGlobalSearch] = useState('')

  useEffect(() => {
    const onHashChange = () => setPath(readHashPath())
    window.addEventListener('hashchange', onHashChange)
    // Fixed: cleanup now removes the same function reference
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    document.body.dataset.theme = theme
    localStorage.setItem('theme', theme)
  }, [theme])

  // Close sidebar on route change (mobile)
  const handleNavClick = useCallback(() => {
    setSidebarOpen(false)
  }, [])

  const currentRoute = useMemo(() => {
    return routes.find((route) => route.path === path) || routes[0]
  }, [path])

  const Page = currentRoute.component

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay visible"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside className={clsx('sidebar', sidebarOpen && 'sidebar--open')} role="navigation">
        <div className="brand-block">
          <div className="brand-logo" aria-hidden="true">N</div>
          <div>
            <strong>Northstar</strong>
            <span>Ops Console</span>
          </div>
          <button
            className="icon-only close-mobile"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <a
                key={route.path}
                className={clsx('nav-item', path === route.path && 'active')}
                href={`#${route.path}`}
                onClick={handleNavClick}
                aria-current={path === route.path ? 'page' : undefined}
              >
                <Icon size={18} aria-hidden="true" />
                <span>{route.label}</span>
              </a>
            )
          })}
        </nav>
        <div className="sidebar-footer">
          <p>Northstar Ops</p>
          <small>v1.0.0 · Operations Console</small>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="icon-only menu-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            <Menu size={20} />
          </button>
          <div className="search-box">
            <input
              id="global-search"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder="Search everything..."
              aria-label="Search across all pages"
              type="search"
            />
          </div>
          <button
            className="theme-toggle"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
          </button>
        </header>
        <section className="page-frame">
          <Page search={globalSearch} />
        </section>
      </main>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
