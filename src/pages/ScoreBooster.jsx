import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { fetchStream } from '../utils/api';
import './ScoreBooster.css';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

export default function ScoreBooster() {
  const { userData, dreamScore, setDreamScore } = useContext(AppContext);

  // Form state
  const [formData, setFormData] = useState({
    studentName: '',
    targetUniversity: '',
    targetProgram: '',
    targetCountry: 'USA',
    undergraduateDegree: '',
    cgpa: '',
    workExperience: '',
    researchPapers: '',
    extracurriculars: '',
    careerGoal: '',
    whyThisProgram: '',
    uniqueAngle: '',
  });

  // SOP state
  const [sopText, setSopText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [copied, setCopied] = useState(false);

  // Review state
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [loadingReview, setLoadingReview] = useState(false);
  const [scoreBoostApplied, setScoreBoostApplied] = useState(false);

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  // ── Stream-based SOP generation ──
  const generateSOP = async () => {
    setSopText('');
    setIsGenerating(true);
    setWordCount(0);
    setFeedback([]);

    try {
      const response = await fetchStream('/score-booster/sop', formData);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              setIsGenerating(false);
              break;
            }
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                fullText += parsed.text;
                setSopText(fullText);
                setWordCount(fullText.trim().split(/\s+/).filter(Boolean).length);
              }
              if (parsed.error) {
                setIsGenerating(false);
                break;
              }
            } catch { /* skip parse errors */ }
          }
        }
      }
      setIsGenerating(false);
    } catch (err) {
      console.error('SOP stream error:', err);
      setIsGenerating(false);
    }
  };

  // ── SOP Review ──
  const reviewSOP = async () => {
    const textToReview = showReview ? reviewText : sopText;
    if (!textToReview.trim()) return;
    setLoadingReview(true);
    setFeedback([]);

    try {
      const res = await fetch(`${API_BASE}/score-booster/review`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sopText: textToReview,
          targetUniversity: formData.targetUniversity,
          targetProgram: formData.targetProgram,
        }),
      });
      const data = await res.json();
      setFeedback(data.feedback || []);
    } catch (err) {
      console.error('Review error:', err);
    }
    setLoadingReview(false);
  };

  // ── Score boost ──
  const applyScoreBoost = () => {
    if (dreamScore && !scoreBoostApplied) {
      const updated = {
        ...dreamScore,
        totalScore: Math.min(1000, dreamScore.totalScore + 20),
      };
      setDreamScore(updated);
      localStorage.setItem('gradpath_score', JSON.stringify(updated));
      setScoreBoostApplied(true);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sopText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const impactColor = (impact) => {
    if (impact === 'high') return 'var(--rose)';
    if (impact === 'medium') return 'var(--amber)';
    return 'var(--emerald-light)';
  };

  return (
    <div className="page scorebooster-page">
      <div className="container">
        <div className="sb-header animate-fade-in-up">
          <h1>✍️ ScoreBooster — SOP Generator</h1>
          <p>Generate a professional Statement of Purpose with AI streaming. Complete an SOP to earn <strong style={{ color: 'var(--amber)' }}>+20 Dream Score</strong>.</p>
        </div>

        <div className="sb-layout animate-fade-in-up stagger-1">
          {/* Left Panel — Input Form */}
          <div className="sb-form glass-strong">
            <h3>Your Details</h3>
            <div className="sb-form-grid">
              <div className="input-group">
                <label>Full Name</label>
                <input className="input" placeholder="Your name" value={formData.studentName}
                  onChange={e => updateField('studentName', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Target University</label>
                <input className="input" placeholder="e.g. MIT" value={formData.targetUniversity}
                  onChange={e => updateField('targetUniversity', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Target Program</label>
                <input className="input" placeholder="e.g. MS Computer Science" value={formData.targetProgram}
                  onChange={e => updateField('targetProgram', e.target.value)} />
              </div>
              <div className="input-group">
                <label>Target Country</label>
                <select value={formData.targetCountry} onChange={e => updateField('targetCountry', e.target.value)}>
                  {['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Netherlands', 'France', 'Sweden', 'India'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>UG Degree</label>
                <input className="input" placeholder="e.g. B.Tech CSE" value={formData.undergraduateDegree}
                  onChange={e => updateField('undergraduateDegree', e.target.value)} />
              </div>
              <div className="input-group">
                <label>CGPA</label>
                <input className="input" type="number" step="0.1" placeholder="e.g. 8.5" value={formData.cgpa}
                  onChange={e => updateField('cgpa', e.target.value)} />
              </div>
            </div>

            <div className="input-group" style={{ marginTop: '12px' }}>
              <label>Why This Program? (key reason)</label>
              <textarea className="input sb-textarea" placeholder="What specifically attracts you to this program?"
                maxLength={500} value={formData.whyThisProgram}
                onChange={e => updateField('whyThisProgram', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Career Goal</label>
              <textarea className="input sb-textarea" placeholder="Your long-term career aspiration"
                maxLength={300} value={formData.careerGoal}
                onChange={e => updateField('careerGoal', e.target.value)} />
            </div>
            <div className="input-group">
              <label>Unique Angle / Achievement</label>
              <textarea className="input sb-textarea" placeholder="What sets you apart? (optional)"
                maxLength={300} value={formData.uniqueAngle}
                onChange={e => updateField('uniqueAngle', e.target.value)} />
            </div>

            <div className="sb-form-actions">
              <button className="btn btn-amber btn-lg" onClick={generateSOP}
                disabled={isGenerating || !formData.targetUniversity}>
                {isGenerating ? <><span className="spinner" /> Generating...</> : '✦ Generate SOP'}
              </button>
              <button className="btn btn-ghost" onClick={() => setShowReview(!showReview)}>
                {showReview ? 'Hide Review' : '📝 Review My SOP'}
              </button>
            </div>
          </div>

          {/* Right Panel — Output */}
          <div className="sb-output">
            <div className="sb-output-card glass-strong">
              <div className="sb-output-header">
                <h3>Generated SOP</h3>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {wordCount > 0 && (
                    <span className="tag tag-amber" style={{ fontSize: '0.75rem' }}>
                      {wordCount} words
                    </span>
                  )}
                  {isGenerating && (
                    <span className="tag tag-emerald" style={{ fontSize: '0.7rem', animation: 'pulse 1.5s infinite' }}>
                      ⚡ Streaming...
                    </span>
                  )}
                </div>
              </div>

              <div className="sb-sop-content">
                {sopText ? (
                  <div className="sb-sop-text">
                    {sopText}
                    {isGenerating && <span className="sb-cursor">|</span>}
                  </div>
                ) : (
                  <div className="sb-sop-placeholder">
                    <span style={{ fontSize: '3rem' }}>✍️</span>
                    <p>Your SOP will appear here as it's being generated, streaming in real-time.</p>
                  </div>
                )}
              </div>

              {sopText && !isGenerating && (
                <div className="sb-output-actions">
                  <button className="btn btn-primary btn-sm" onClick={copyToClipboard}>
                    {copied ? '✓ Copied!' : '📋 Copy to Clipboard'}
                  </button>
                  <button className="btn btn-ghost btn-sm" onClick={reviewSOP} disabled={loadingReview}>
                    {loadingReview ? <><span className="spinner" /> Reviewing...</> : '🔍 Get AI Review'}
                  </button>
                  {!scoreBoostApplied && (
                    <button className="btn btn-amber btn-sm" onClick={applyScoreBoost}>
                      +20 Score ✦
                    </button>
                  )}
                  {scoreBoostApplied && (
                    <span className="tag tag-emerald" style={{ fontSize: '0.78rem' }}>✓ +20 Score Applied</span>
                  )}
                </div>
              )}
            </div>

            {/* Review Section */}
            {showReview && (
              <div className="sb-review-card glass-strong animate-fade-in">
                <h4>📝 Paste Your Existing SOP for Review</h4>
                <textarea className="input sb-textarea-large" placeholder="Paste your existing SOP here..."
                  value={reviewText} onChange={e => setReviewText(e.target.value)} />
                <button className="btn btn-primary" onClick={reviewSOP} disabled={loadingReview || !reviewText.trim()}
                  style={{ marginTop: '12px' }}>
                  {loadingReview ? <><span className="spinner" /> Analyzing...</> : '🔍 Review This SOP'}
                </button>
              </div>
            )}

            {/* Feedback Cards */}
            {feedback.length > 0 && (
              <div className="sb-feedback animate-fade-in">
                <h4 style={{ marginBottom: '12px' }}>AI Feedback</h4>
                {feedback.map((fb, i) => (
                  <div key={i} className="card sb-feedback-card" style={{ borderLeft: `3px solid ${impactColor(fb.impact)}` }}>
                    <div className="sb-feedback-header">
                      <span className="sb-feedback-issue">⚠ {fb.issue}</span>
                      <span className="tag" style={{
                        fontSize: '0.7rem',
                        background: `${impactColor(fb.impact)}20`,
                        color: impactColor(fb.impact),
                        border: `1px solid ${impactColor(fb.impact)}40`
                      }}>
                        {fb.impact}
                      </span>
                    </div>
                    <p className="sb-feedback-fix">💡 {fb.fix}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
