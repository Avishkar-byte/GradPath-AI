import { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppContext } from '../App';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { dreamScore, streak } = useContext(AppContext);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const navLinks = [
    { path: '/', label: 'Home', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7L7 2L12 7V12H9V9H5V12H2V7Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/></svg> },
    { path: '/pathfinder', label: 'PathFinder', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.2"/><path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/loans', label: 'LoanOracle', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="3" width="10" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 6H9M5 8H7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/scorebooster', label: 'SOP Gen', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M3 11L7 3L11 11" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round"/><path d="M4.5 8.5H9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/growth', label: 'GrowthEngine', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12C2 12 3 8 7 8C11 8 12 12 12 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M4 5C4 6.66 5.34 8 7 8C8.66 8 10 6.66 10 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 2V4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
    { path: '/roi', label: 'ROI Calc', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 10L5 7L7 9L10 5L12 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { path: '/timeline', label: 'Timeline', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="2" y="2" width="10" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M5 2V4M9 2V4M2 6H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo" style={{ textDecoration: 'none' }}>
          <div className="nav-logo-icon">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 2L13 5V11L8 14L3 11V5L8 2Z" stroke="#C9A96E" strokeWidth="1.2" fill="none"/>
              <circle cx="8" cy="8" r="2" fill="#C9A96E" opacity="0.7"/>
            </svg>
          </div>
          <div className="nav-logo-text">
            <div className="nav-logo-name">GradPath</div>
            <div className="nav-logo-sub">AI</div>
          </div>
        </Link>

        <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                <span className="nav-link-icon">{link.icon}</span>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="navbar-cta">
          {dreamScore && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              marginRight: '8px'
            }}>
              {streak > 0 && (
                <span style={{
                  fontSize: '0.82rem',
                  color: 'var(--amber)',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  🔥 {streak}
                </span>
              )}
              <Link to="/dashboard" className="nav-score-pill">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L7.5 4.5H11L8 6.5L9 10L6 8L3 10L4 6.5L1 4.5H4.5L6 1Z" fill="#C9A96E"/></svg>
                {dreamScore.totalScore}
              </Link>
            </div>
          )}

          {!dreamScore ? (
            <Link to="/quiz" className="btn btn-primary btn-sm">
              Get Dream Score
            </Link>
          ) : (
            <Link to="/dashboard" className="btn btn-ghost btn-sm">
              Dashboard
            </Link>
          )}

          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
}
