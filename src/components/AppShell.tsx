import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { PRIVACY_PATH, TERMS_PATH } from '../legal/urls'

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user, logout, isAuthenticated } = useAuth()

  return (
    <div className="app-shell">
      <header className="top-nav">
        <div className="top-nav__inner">
          <Link to={isAuthenticated ? '/jobs' : '/'} className="brand">
            <span className="brand__mark" aria-hidden="true">
              W
            </span>
            <span className="brand__text">
              <span className="brand__name">Workcove</span>
              <span className="brand__byline">a product of TERARC LLC</span>
            </span>
          </Link>

          {isAuthenticated ? (
            <nav className="top-nav__links" aria-label="Primary">
              <NavLink to="/jobs" className={({ isActive }) => (isActive ? 'nav-link is-active' : 'nav-link')}>
                Jobs
              </NavLink>
              <div className="user-chip">
                <span className="user-chip__avatar" aria-hidden="true">
                  {(user?.email?.[0] || 'U').toUpperCase()}
                </span>
                <div className="user-chip__meta">
                  <span className="user-chip__email">{user?.email}</span>
                  <span className="user-chip__role">{user?.role === 'worker' ? 'Worker' : 'Hiring manager'}</span>
                </div>
                <button type="button" className="btn btn--ghost btn--sm" onClick={logout}>
                  Sign out
                </button>
              </div>
            </nav>
          ) : (
            <nav className="top-nav__links" aria-label="Primary">
              <Link to="/login" className="btn btn--ghost btn--sm">
                Sign in
              </Link>
              <Link to="/register" className="btn btn--primary btn--sm">
                Join now
              </Link>
            </nav>
          )}
        </div>
      </header>

      <main className="page">{children}</main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <span>Workcove is a product of TERARC LLC</span>
          <nav className="site-footer__links" aria-label="Legal">
            <Link to={TERMS_PATH}>Terms &amp; Conditions</Link>
            <Link to={PRIVACY_PATH}>Privacy Policy</Link>
            <a href="https://www.terarc-llc.com/" target="_blank" rel="noreferrer">
              terarc-llc.com
            </a>
          </nav>
        </div>
      </footer>
    </div>
  )
}
