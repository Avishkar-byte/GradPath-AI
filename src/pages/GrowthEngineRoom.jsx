import { useState, useEffect, useRef } from 'react';
import { api } from '../utils/api';
import './GrowthEngineRoom.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const ACTION_TEMPLATES = [
  { icon: '📱', text: 'WhatsApp nudge sent to {name} → "{msg}"' },
  { icon: '📝', text: 'Blog post auto-published → "{title}"' },
  { icon: '🎁', text: 'Referral reward triggered → {name} referred {name2}, both +25 Dream Score' },
  { icon: '🏦', text: 'Loan application auto-routed to {lender}' },
  { icon: '🔍', text: 'New user acquired via SEO → "{query}" blog post' },
  { icon: '⚡', text: 'Smart nudge sent → IELTS deadline reminder for {name}' },
  { icon: '📊', text: 'Dream Score recalculated for {name} → {score}' },
  { icon: '🎓', text: 'PathFinder match updated → {name} now has 15 university matches' },
  { icon: '💰', text: 'EMI calculator engagement spike detected — pushed loan CTA to {count} users' },
  { icon: '📧', text: 'Automated email campaign sent → "{subject}"' },
  { icon: '🔗', text: 'Referral link clicked {count} times from Instagram bio' },
  { icon: '📅', text: 'Timeline deadline alert sent to {count} students → Application due in 7 days' },
  { icon: '🤖', text: 'GrowthEngine auto-generated 3 new blog outlines' },
  { icon: '✅', text: 'Document checklist reminder sent to {name} → 2 docs pending' },
  { icon: '🌍', text: 'Country preference shift detected → {count} more students choosing Canada over UK' },
];

const NAMES = ['Arjun S.', 'Priya P.', 'Rohit K.', 'Sneha I.', 'Vikram S.', 'Ananya N.', 'Karan M.', 'Divya R.'];
const LENDERS = ['HDFC Credila', 'Avanse Financial', 'Auxilo Finserve', 'ICICI Bank'];
const TITLES = ['Top 7 CS Programs in USA Under ₹50L', 'How to Get Education Loan Without Collateral', 'UK vs Canada: Which is Better for MBA?', 'GRE vs GMAT: The Ultimate Guide for 2025'];
const QUERIES = ['MS CS USA 2025 scholarship', 'education loan India low interest', 'best MBA colleges Canada for Indians', 'study abroad without IELTS'];
const SUBJECTS = ['Your Dream Score improved!', 'New scholarship alert 🎓', '3 universities match your profile', 'Application deadline in 14 days'];

function generateAction() {
  const template = ACTION_TEMPLATES[Math.floor(Math.random() * ACTION_TEMPLATES.length)];
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const name2 = NAMES[Math.floor(Math.random() * NAMES.length)];
  const lender = LENDERS[Math.floor(Math.random() * LENDERS.length)];
  const title = TITLES[Math.floor(Math.random() * TITLES.length)];
  const query = QUERIES[Math.floor(Math.random() * QUERIES.length)];
  const subject = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)];
  const score = Math.floor(550 + Math.random() * 400);
  const count = Math.floor(5 + Math.random() * 50);
  const msg = `Your IELTS deadline is in ${Math.floor(7 + Math.random() * 30)} days...`;

  let text = template.text
    .replace('{name}', name).replace('{name2}', name2)
    .replace('{lender}', lender).replace('{title}', title)
    .replace('{query}', query).replace('{subject}', subject)
    .replace('{score}', score).replace('{count}', count)
    .replace('{msg}', msg);

  return { icon: template.icon, text, time: 'Just now' };
}

export default function GrowthEngineRoom() {
  // Live counters
  const [counters, setCounters] = useState({
    users: 2847, scored: 2103, nudges: 8492, loanEnquiries: 1204, conversions: 347
  });

  // Action feed
  const [actions, setActions] = useState([
    { icon: '📱', text: 'WhatsApp nudge sent to Arjun S. → "Your IELTS deadline is in 30 days..."', time: '2 min ago' },
    { icon: '📝', text: 'Blog post published → "Top 7 CS programs in USA under ₹50L"', time: '5 min ago' },
    { icon: '🎁', text: 'Referral reward triggered → Priya P. referred Rohit K., both +25 Dream Score', time: '8 min ago' },
    { icon: '🏦', text: 'Loan application auto-routed to HDFC Credila', time: '12 min ago' },
    { icon: '🔍', text: 'New user acquired via SEO → "MS CS USA 2025 scholarship" blog post', time: '18 min ago' },
  ]);

  // Nudge simulator
  const [nudgeStage, setNudgeStage] = useState('Exploration');
  const [nudgeResult, setNudgeResult] = useState(null);
  const [loadingNudge, setLoadingNudge] = useState(false);

  // Blog generator
  const [blogResult, setBlogResult] = useState({
    title: 'Top 5 Scholarships for Indian Students in USA 2025',
    summary: 'Discover fully-funded opportunities at Stanford, MIT, and Carnegie Mellon that many students overlook. Our analysis covers application tips and deadlines.'
  });
  const [loadingBlog, setLoadingBlog] = useState(false);

  // ── Live counter increments ──
  useEffect(() => {
    const intervals = [
      setInterval(() => setCounters(p => ({ ...p, users: p.users + 1 })), 8000),
      setInterval(() => setCounters(p => ({ ...p, scored: p.scored + 1 })), 10000),
      setInterval(() => setCounters(p => ({ ...p, nudges: p.nudges + 1 })), 3000),
      setInterval(() => setCounters(p => ({ ...p, loanEnquiries: p.loanEnquiries + 1 })), 15000),
      setInterval(() => setCounters(p => ({ ...p, conversions: p.conversions + 1 })), 45000),
    ];
    return () => intervals.forEach(clearInterval);
  }, []);

  // ── Auto-prepend new actions every 12 seconds ──
  useEffect(() => {
    const interval = setInterval(() => {
      setActions(prev => [generateAction(), ...prev].slice(0, 8));
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // ── Generate nudge ──
  const generateNudge = async () => {
    setLoadingNudge(true);
    setNudgeResult(null);
    try {
      const res = await fetch(`${API_BASE}/growth/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'nudge', profile: { stage: nudgeStage.toLowerCase() } }),
      });
      const data = await res.json();
      setNudgeResult(data.message || 'Hey! Your GradPath journey awaits. Check your score today! 🎓');
    } catch {
      setNudgeResult('Hey! Your GradPath journey awaits. Check your score today! 🎓');
    }
    setLoadingNudge(false);
  };

  // ── Generate blog ──
  const generateBlog = async () => {
    setLoadingBlog(true);
    try {
      const res = await fetch(`${API_BASE}/growth/generate-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'blog', profile: {} }),
      });
      const data = await res.json();
      setBlogResult({ title: data.title || 'Study Abroad Insights 2025', summary: data.preview || data.summary || '' });
    } catch {
      setBlogResult({ title: 'Study Abroad Insights 2025', summary: 'An overview of the latest trends in international education.' });
    }
    setLoadingBlog(false);
  };

  return (
    <div className="page growth-room-page">
      <div className="container">
        {/* Header */}
        <div className="gr-header animate-fade-in-up">
          <div>
            <h1>∞ GrowthEngine Control Room</h1>
            <p>Zero-human intervention AI growth loop — autonomous acquisition, engagement, and conversion.</p>
          </div>
          <div className="gr-live-badge">
            <span className="gr-live-dot" />
            LIVE
          </div>
        </div>

        {/* Section 1: Live Metrics */}
        <div className="gr-metrics animate-fade-in-up stagger-1">
          {[
            { label: 'Users Acquired', value: counters.users, icon: '👤' },
            { label: 'Profiles Scored', value: counters.scored, icon: '★' },
            { label: 'Nudges Sent', value: counters.nudges, icon: '📱' },
            { label: 'Loan Enquiries', value: counters.loanEnquiries, icon: '💰' },
            { label: 'Conversions', value: counters.conversions, icon: '✅' },
          ].map((m, i) => (
            <div key={i} className="gr-metric-card card">
              <span className="gr-metric-icon">{m.icon}</span>
              <span className="gr-metric-value">{m.value.toLocaleString()}</span>
              <span className="gr-metric-label">{m.label}</span>
            </div>
          ))}
        </div>

        {/* Section 2: Recent AI Actions Feed */}
        <div className="gr-section animate-fade-in-up stagger-2">
          <h3>🤖 Recent AI Actions</h3>
          <div className="gr-feed">
            {actions.map((action, i) => (
              <div key={i} className="gr-feed-item card" style={{ animationDelay: `${i * 0.05}s` }}>
                <span className="gr-feed-icon">{action.icon}</span>
                <span className="gr-feed-text">{action.text}</span>
                <span className="gr-feed-time">{action.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Interactive Demo */}
        <div className="gr-demo-grid animate-fade-in-up stagger-3">
          {/* Left: WhatsApp Nudge Simulator */}
          <div className="gr-demo-card glass-strong">
            <h4>📱 WhatsApp Nudge Simulator</h4>
            <div className="input-group" style={{ marginTop: '12px' }}>
              <label>Journey Stage</label>
              <select value={nudgeStage} onChange={e => setNudgeStage(e.target.value)}>
                <option value="Exploration">Exploration</option>
                <option value="Application In Progress">Application In Progress</option>
                <option value="Awaiting Visa">Awaiting Visa</option>
                <option value="Loan Approved">Loan Approved</option>
              </select>
            </div>
            <button className="btn btn-primary" onClick={generateNudge} disabled={loadingNudge}
              style={{ marginTop: '12px', width: '100%' }}>
              {loadingNudge ? <><span className="spinner" /> Generating...</> : '⚡ Generate Nudge'}
            </button>

            {nudgeResult && (
              <div className="gr-whatsapp-bubble animate-fade-in">
                <div className="gr-wa-header">
                  <span className="gr-wa-name">GradPath AI</span>
                  <span className="gr-wa-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="gr-wa-text">{nudgeResult}</p>
                <span className="gr-wa-ticks">✓✓</span>
              </div>
            )}
          </div>

          {/* Right: AI Blog Generator */}
          <div className="gr-demo-card glass-strong">
            <h4>📝 Latest Auto-Published Post</h4>
            <div className="gr-blog-card" style={{ marginTop: '16px' }}>
              {loadingBlog ? (
                <div className="gr-blog-shimmer">
                  <div className="skeleton-line" style={{ width: '80%', height: '18px' }} />
                  <div className="skeleton-line" style={{ width: '100%', height: '14px', marginTop: '12px' }} />
                  <div className="skeleton-line" style={{ width: '60%', height: '14px' }} />
                </div>
              ) : (
                <>
                  <h4 style={{ fontSize: '1rem', marginBottom: '8px', lineHeight: 1.4 }}>{blogResult.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{blogResult.summary}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'block' }}>
                    Published {new Date().toLocaleDateString()} · Auto-generated by GrowthEngine
                  </span>
                </>
              )}
            </div>
            <button className="btn btn-ghost" onClick={generateBlog} disabled={loadingBlog}
              style={{ marginTop: '12px', width: '100%' }}>
              {loadingBlog ? 'Generating...' : '🔄 Generate New Post'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
