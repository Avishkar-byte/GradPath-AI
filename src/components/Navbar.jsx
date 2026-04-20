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
    { path: '/', label: 'Home', icon: '⌂' },
    { path: '/pathfinder', label: 'PathFinder', icon: '🧭' },
    { path: '/loans', label: 'LoanOracle', icon: '💰' },
    { path: '/roi', label: 'ROI Calc', icon: '📊' },
    { path: '/timeline', label: 'Timeline', icon: '📅' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`} id="main-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎓</span>
          <span>GradPath<span style={{ color: 'var(--emerald-light)' }}> AI</span></span>
        </Link>

        <ul className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={location.pathname === link.path ? 'active' : ''}
              >
                <span style={{ marginRight: '6px' }}>{link.icon}</span>
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
              <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                background: 'var(--bg-surface)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-default)',
                fontSize: '0.85rem',
                fontWeight: 600,
                color: dreamScore.tier?.color || 'var(--text-primary)',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}>
                <span style={{ fontSize: '0.7rem' }}>✦</span>
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
