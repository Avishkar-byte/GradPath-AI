import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { animateValue, getScoreColor } from '../utils/helpers';
import ShareableScoreCard from '../components/ShareableScoreCard';
import ScoreLeaderboard from '../components/ScoreLeaderboard';
import './Dashboard.css';

export default function Dashboard() {
  const { userData, dreamScore, setDreamScore, setUserData, streak } = useContext(AppContext);
  const navigate = useNavigate();
  const [animatedScore, setAnimatedScore] = useState(0);
  const [tips, setTips] = useState([]);
  const [growthContent, setGrowthContent] = useState([]);
  const [loadingGrowth, setLoadingGrowth] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    // Try loading from localStorage
    if (!dreamScore) {
      const saved = localStorage.getItem('gradpath_score');
      const savedUser = localStorage.getItem('gradpath_user');
      if (saved && savedUser) {
        setDreamScore(JSON.parse(saved));
        setUserData(JSON.parse(savedUser));
      } else {
        navigate('/quiz');
        return;
      }
    }
  }, []);

  useEffect(() => {
    if (dreamScore) {
      animateValue(0, dreamScore.totalScore, 2000, setAnimatedScore);
      setTips(dreamScore.tips || []);
      loadGrowthContent();
    }
  }, [dreamScore]);

  const loadGrowthContent = async () => {
    setLoadingGrowth(true);
    try {
      const [nudge, blog, referral] = await Promise.all([
        api.generateContent('nudge', { stage: 'exploring' }),
        api.generateContent('blog', {}),
        api.generateContent('referral', {})
      ]);
      setGrowthContent([nudge, blog, referral]);
    } catch (e) {
      setGrowthContent([
        { type: 'nudge', message: '🎓 Your Dream Score is waiting — take 2 minutes to improve it today!' },
        { type: 'blog', title: '5 Hidden Costs of Studying Abroad', preview: 'When planning your budget, most students forget about health insurance and currency fluctuations...', readTime: '4 min' },
        { type: 'referral', title: 'Share & Earn', message: 'Invite friends and earn +50 Dream Score points!', code: 'GRADAI2025', reward: '+50 Points' }
      ]);
    }
    setLoadingGrowth(false);
  };

  if (!dreamScore) return null;

  const breakdown = dreamScore.breakdown;
  const scoreColor = getScoreColor(dreamScore.totalScore);
  const circumference = 2 * Math.PI * 90;
  const offset = circumference - (dreamScore.totalScore / 1000) * circumference;

  return (
    <div className="page dashboard-page">
      <div className="container">
        {/* Header */}
        <div className="dash-header animate-fade-in-up">
          <div>
            <h1>Your Dream Score</h1>
            <p>Track your readiness across all 5 pillars and take action to improve.</p>
          </div>
          {streak > 0 && (
            <div className="streak-badge">
              <span className="streak-fire">🔥</span>
              <span className="streak-count">{streak}</span>
              <span className="streak-label">day streak</span>
            </div>
          )}
        </div>

        {/* Score Hero */}
        <div className="dash-score-hero animate-scale-in stagger-1">
          <div className="score-ring-container">
            <svg viewBox="0 0 200 200" className="score-ring-svg">
              <circle cx="100" cy="100" r="90" fill="none" stroke="var(--bg-surface)" strokeWidth="8" />
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke={scoreColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="score-ring-progress"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className="score-ring-center">
              <span className="score-ring-value">{animatedScore}</span>
              <span className="score-ring-max">/1000</span>
            </div>
          </div>

          <div className="score-tier-info">
            <div className="tier-badge" style={{ color: scoreColor }}>
              <span style={{ fontSize: '1.8rem' }}>{dreamScore.tier?.emoji}</span>
              <span className="tier-name">{dreamScore.tier?.name}</span>
            </div>
            <p className="tier-desc">
              {dreamScore.totalScore >= 751 ? "Outstanding! You're well-prepared for top programs." :
               dreamScore.totalScore >= 551 ? "Great progress! A few improvements will make you unstoppable." :
               dreamScore.totalScore >= 301 ? "You're on your way! Focus on the tips below to level up." :
               "Just getting started — every journey begins with a single step!"}
            </p>
            <div className="tier-actions">
              <Link to="/pathfinder" className="btn btn-primary btn-sm">Find Universities →</Link>
              <Link to="/loans" className="btn btn-ghost btn-sm">Check Loan Eligibility</Link>
              {dreamScore.totalScore > 0 && (
                <button className="btn btn-ghost btn-sm" onClick={() => setShowShare(true)}
                  style={{ borderColor: 'var(--amber)', color: 'var(--amber)' }}>📤 Share Score</button>
              )}
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="dash-section animate-fade-in-up stagger-2">
          <h3>Score Breakdown</h3>
          <div className="breakdown-grid">
            {Object.entries(breakdown).map(([key, pillar]) => (
              <div className="breakdown-card card" key={key}>
                <div className="breakdown-header">
                  <span className="breakdown-label">{pillar.label}</span>
                  <span className="breakdown-score">{pillar.score}<span style={{ color: 'var(--text-muted)' }}>/1000</span></span>
                </div>
                <div className="progress-bar" style={{ height: '6px' }}>
                  <div
                    className="progress-bar-fill"
                    style={{
                      width: `${pillar.score / 10}%`,
                      background: pillar.score >= 700 ? 'var(--emerald-light)' :
                                   pillar.score >= 400 ? 'var(--amber)' : 'var(--rose)'
                    }}
                  />
                </div>
                <span className="breakdown-weight">Weight: {(pillar.weight * 100)}% · Contribution: {pillar.weighted} pts</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="dash-section animate-fade-in-up stagger-2" style={{ marginTop: 0 }}>
          <ScoreLeaderboard
            currentScore={dreamScore.totalScore}
            currentCountry={userData?.targetCountries?.[0]}
          />
        </div>

        {/* Booster Tips */}
        {tips.length > 0 && (
          <div className="dash-section animate-fade-in-up stagger-3">
            <h3>⚡ ScoreBooster Tips</h3>
            <p style={{ marginBottom: '20px' }}>AI-recommended actions to improve your Dream Score:</p>
            <div className="tips-grid">
              {tips.map((tip, i) => (
                <div className="tip-card card" key={i}>
                  <div className="tip-impact" style={{ color: 'var(--emerald-light)' }}>
                    {tip.impact}
                  </div>
                  <p className="tip-text">{tip.text}</p>
                  <span className="tag tag-emerald">{tip.pillar}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="dash-section animate-fade-in-up stagger-4">
          <h3>Quick Actions</h3>
          <div className="quick-actions-grid">
            <Link to="/pathfinder" className="quick-action card">
              <span className="qa-icon">🧭</span>
              <span className="qa-title">Find Universities</span>
              <span className="qa-desc">AI-matched recommendations</span>
            </Link>
            <Link to="/loans" className="quick-action card">
              <span className="qa-icon">💰</span>
              <span className="qa-title">Loan Eligibility</span>
              <span className="qa-desc">Check with LoanOracle</span>
            </Link>
            <Link to="/roi" className="quick-action card">
              <span className="qa-icon">📊</span>
              <span className="qa-title">ROI Calculator</span>
              <span className="qa-desc">Cost vs earnings analysis</span>
            </Link>
            <Link to="/timeline" className="quick-action card">
              <span className="qa-icon">📅</span>
              <span className="qa-title">Timeline</span>
              <span className="qa-desc">Application schedule</span>
            </Link>
            <Link to="/scorebooster" className="quick-action card">
              <span className="qa-icon">✍️</span>
              <span className="qa-title">SOP Generator</span>
              <span className="qa-desc">AI-powered writing</span>
            </Link>
            <Link to="/growth" className="quick-action card">
              <span className="qa-icon">∞</span>
              <span className="qa-title">GrowthEngine</span>
              <span className="qa-desc">AI control room</span>
            </Link>
          </div>
        </div>

        {/* Referral System */}
        <div className="dash-section animate-fade-in-up stagger-4" style={{ marginTop: 0 }}>
          <div className="card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '200px' }}>
              <h4 style={{ marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🎁 Refer & Earn
                <span className="tag tag-amber" style={{ fontSize: '0.72rem' }}>+50 Score</span>
              </h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Share GradPath AI with a friend — both of you earn <strong style={{ color: 'var(--emerald-light)' }}>+50 Dream Score points</strong> when they complete their quiz!
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <code style={{
                padding: '8px 18px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)',
                fontSize: '1rem', fontWeight: 700, color: 'var(--amber)', border: '1px solid rgba(196,147,90,0.3)',
                letterSpacing: '0.04em'
              }}>
                GRAD{Math.random().toString(36).substring(2, 6).toUpperCase()}
              </code>
              <button className="btn btn-primary btn-sm" onClick={() => {
                const code = document.querySelector('.dash-section code');
                if (code) navigator.clipboard.writeText(code.textContent);
              }}>
                📋 Copy
              </button>
            </div>
          </div>
        </div>

        {/* Growth Engine Panel (Bonus) */}
        <div className="dash-section animate-fade-in-up stagger-5">
          <div className="growth-header">
            <h3>🤖 GrowthEngine <span className="tag tag-amber" style={{ marginLeft: '8px' }}>AI Auto-Generated</span></h3>
            <p>Zero-human intervention content loop — all generated by AI agents in real time.</p>
          </div>

          <div className="growth-grid">
            {loadingGrowth ? (
              <>
                <div className="card skeleton" style={{ height: '120px' }} />
                <div className="card skeleton" style={{ height: '120px' }} />
                <div className="card skeleton" style={{ height: '120px' }} />
              </>
            ) : (
              growthContent.map((item, i) => (
                <div className="growth-card card" key={i}>
                  {item.type === 'nudge' && (
                    <>
                      <div className="growth-card-label">📱 Smart Nudge (WhatsApp)</div>
                      <div className="nudge-bubble">{item.message}</div>
                    </>
                  )}
                  {item.type === 'blog' && (
                    <>
                      <div className="growth-card-label">📝 AI Blog Post</div>
                      <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem' }}>{item.preview}</p>
                      <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>⏱ {item.readTime} read</span>
                    </>
                  )}
                  {item.type === 'referral' && (
                    <>
                      <div className="growth-card-label">🎁 Referral Engine</div>
                      <h4 style={{ marginBottom: '8px', fontSize: '1rem' }}>{item.title}</h4>
                      <p style={{ fontSize: '0.85rem' }}>{item.message}</p>
                      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <code style={{ padding: '4px 12px', background: 'var(--bg-tertiary)', borderRadius: '6px', fontSize: '0.9rem', color: 'var(--amber)' }}>{item.code}</code>
                        <span className="tag tag-emerald">{item.reward}</span>
                      </div>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Share Score Modal */}
        {showShare && (
          <ShareableScoreCard
            dreamScore={dreamScore}
            userData={userData}
            onClose={() => setShowShare(false)}
          />
        )}
      </div>
    </div>
  );
}
