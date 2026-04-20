import { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppContext } from '../App';
import './Landing.css';

export default function Landing() {
  const { dreamScore, updateStreak } = useContext(AppContext);

  useEffect(() => {
    updateStreak();
  }, []);

  const features = [
    {
      icon: '✦',
      title: 'Dream Score',
      desc: 'Get your personalized readiness score (0–1000) across 5 key pillars. Know exactly where you stand.',
      color: 'var(--amber)',
      link: '/quiz'
    },
    {
      icon: '🧭',
      title: 'PathFinder AI',
      desc: 'AI-powered university matching using cosine similarity. Find your perfect-fit programs worldwide.',
      color: 'var(--emerald-light)',
      link: '/pathfinder'
    },
    {
      icon: '💰',
      title: 'LoanOracle',
      desc: 'Conversational AI loan advisor. Check eligibility, compare lenders, and plan your finances — instantly.',
      color: 'var(--amber-light)',
      link: '/loans'
    },
    {
      icon: '📊',
      title: 'ROI Calculator',
      desc: 'Predict salary outcomes vs education cost. See your break-even year and 10-year earnings projection.',
      color: 'var(--olive-light)',
      link: '/roi'
    }
  ];

  const stats = [
    { value: '55+', label: 'University Programs' },
    { value: '11', label: 'Countries Covered' },
    { value: '4', label: 'AI Agents' },
    { value: '0→1000', label: 'Dream Score Range' }
  ];

  return (
    <div className="page landing-page">
      {/* Ambient Background */}
      <div className="landing-ambient">
        <div className="ambient-orb ambient-orb-1" />
        <div className="ambient-orb ambient-orb-2" />
        <div className="ambient-orb ambient-orb-3" />
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge animate-fade-in">
              <span className="tag tag-emerald">✦ AI-Powered Education Platform</span>
            </div>

            <h1 className="hero-title animate-fade-in-up">
              Your Education Journey,
              <span className="hero-gradient-text"> Supercharged</span>
            </h1>

            <p className="hero-subtitle animate-fade-in-up stagger-1">
              From university discovery to loan approval — GradPath AI's 4 specialized agents
              guide every step. Get your Dream Score, find perfect-fit programs, and secure
              financing — all in one platform.
            </p>

            <div className="hero-actions animate-fade-in-up stagger-2">
              <Link to="/quiz" className="btn btn-amber btn-lg" id="hero-cta-primary">
                <span>✦</span> Get Your Dream Score
              </Link>
              <Link to="/pathfinder" className="btn btn-ghost btn-lg" id="hero-cta-secondary">
                Explore Universities →
              </Link>
            </div>

            {dreamScore && (
              <div className="hero-score-preview animate-scale-in stagger-3">
                <div className="score-mini-ring" style={{ '--score-color': dreamScore.tier?.color }}>
                  <span className="score-mini-value">{dreamScore.totalScore}</span>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Your Dream Score</span>
                  <br />
                  <Link to="/dashboard" style={{ color: dreamScore.tier?.color, fontWeight: 600 }}>
                    {dreamScore.tier?.emoji} {dreamScore.tier?.name} — View Dashboard →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className={`stat animate-fade-in-up stagger-${i + 1}`}>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <h2>4 AI Agents. One Unified Journey.</h2>
            <p>Each agent specializes in a critical part of your education path — working together to maximize your readiness.</p>
          </div>

          <div className="features-grid">
            {features.map((f, i) => (
              <Link to={f.link} key={i} className={`feature-card card animate-fade-in-up stagger-${i + 1}`}>
                <div className="feature-icon" style={{ color: f.color }}>{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
                <span className="feature-link" style={{ color: f.color }}>
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header animate-fade-in-up">
            <h2>From Exploration to Enrollment</h2>
            <p>The platform that nurtures you from Day 1 to Day Done.</p>
          </div>

          <div className="journey-steps">
            {[
              { step: '01', title: 'Take the Dream Score Quiz', desc: 'Answer questions about your academics, finances, and goals. Get your 0–1000 readiness score in seconds.', icon: '📝' },
              { step: '02', title: 'Get AI University Matches', desc: 'PathFinder uses cosine similarity to match you with best-fit programs from 55+ universities across 11 countries.', icon: '🎯' },
              { step: '03', title: 'Check Loan Eligibility', desc: 'LoanOracle evaluates your profile against NBFC criteria and shows personalized loan offers with EMI breakdowns.', icon: '🏦' },
              { step: '04', title: 'Plan, Apply, Go!', desc: 'Get your application timeline, improve your Dream Score, and seamlessly apply for education financing.', icon: '🚀' }
            ].map((s, i) => (
              <div key={i} className={`journey-step animate-fade-in-up stagger-${i + 1}`}>
                <div className="step-number">{s.step}</div>
                <div className="step-icon">{s.icon}</div>
                <h4>{s.title}</h4>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-card glass-strong animate-fade-in-up">
            <h2>Ready to Start Your Journey?</h2>
            <p>Join thousands of students who've already discovered their Dream Score and found their path.</p>
            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/quiz" className="btn btn-amber btn-lg">
                ✦ Take the Quiz — It's Free
              </Link>
              <Link to="/loans" className="btn btn-ghost btn-lg">
                Check Loan Eligibility
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="navbar-logo" style={{ fontSize: '1.1rem' }}>
                <span className="logo-icon" style={{ width: '28px', height: '28px', fontSize: '0.9rem' }}>🎓</span>
                GradPath<span style={{ color: 'var(--emerald-light)' }}> AI</span>
              </span>
              <p style={{ fontSize: '0.85rem', marginTop: '8px', color: 'var(--text-muted)' }}>
                AI-powered education journey platform for Indian students.
              </p>
            </div>
            <div className="footer-links-group">
              <h5>Platform</h5>
              <Link to="/quiz">Dream Score</Link>
              <Link to="/pathfinder">PathFinder</Link>
              <Link to="/loans">LoanOracle</Link>
              <Link to="/roi">ROI Calculator</Link>
            </div>
            <div className="footer-links-group">
              <h5>Resources</h5>
              <Link to="/timeline">Timeline</Link>
              <a href="#">Blog</a>
              <a href="#">FAQ</a>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 GradPath AI — Built for TenzorX Hackathon</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
