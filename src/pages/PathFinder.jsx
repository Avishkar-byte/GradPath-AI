import { useState, useContext } from 'react';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { getCountryFlag, formatCurrency } from '../utils/helpers';
import './PathFinder.css';

export default function PathFinder() {
  const { userData } = useContext(AppContext);
  const [filters, setFilters] = useState({
    gpa: userData?.gpa || '',
    greScore: userData?.greScore || '',
    gmatScore: userData?.gmatScore || '',
    ieltsScore: userData?.ieltsScore || '',
    courseType: userData?.courseType || 'ms',
    targetCountries: userData?.targetCountries || [],
    budgetMax: userData?.budgetRange ? userData.budgetRange * 100000 / 83.5 : '',
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedCard, setExpandedCard] = useState(null);
  const [explainCache, setExplainCache] = useState({});
  const [loadingExplain, setLoadingExplain] = useState(null);

  const countries = ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Switzerland', 'Netherlands', 'Sweden', 'France', 'India'];

  const toggleCountry = (c) => {
    setFilters(prev => ({
      ...prev,
      targetCountries: prev.targetCountries.includes(c)
        ? prev.targetCountries.filter(x => x !== c)
        : [...prev.targetCountries, c]
    }));
  };

  const handleSearch = async () => {
    setLoading(true);
    setSearched(true);
    try {
      const data = await api.getRecommendations(filters);
      setResults(data.recommendations || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  return (
    <div className="page pathfinder-page">
      <div className="container">
        <div className="pf-header animate-fade-in-up">
          <h1>🧭 PathFinder AI</h1>
          <p>AI-powered university matching using cosine similarity. Find your perfect-fit programs from 55+ universities across 11 countries.</p>
        </div>

        {/* Filters */}
        <div className="pf-filters glass-strong animate-fade-in-up stagger-1">
          <div className="pf-filters-grid">
            <div className="input-group">
              <label>GPA (out of 10)</label>
              <input className="input" type="number" step="0.1" min="0" max="10" placeholder="e.g. 8.5"
                value={filters.gpa} onChange={e => setFilters(p => ({ ...p, gpa: parseFloat(e.target.value) || '' }))} />
            </div>
            <div className="input-group">
              <label>GRE Score</label>
              <input className="input" type="number" min="260" max="340" placeholder="e.g. 320"
                value={filters.greScore} onChange={e => setFilters(p => ({ ...p, greScore: parseFloat(e.target.value) || '' }))} />
            </div>
            <div className="input-group">
              <label>GMAT Score</label>
              <input className="input" type="number" min="200" max="800" placeholder="e.g. 710"
                value={filters.gmatScore} onChange={e => setFilters(p => ({ ...p, gmatScore: parseFloat(e.target.value) || '' }))} />
            </div>
            <div className="input-group">
              <label>IELTS Score</label>
              <input className="input" type="number" step="0.5" min="0" max="9" placeholder="e.g. 7.5"
                value={filters.ieltsScore} onChange={e => setFilters(p => ({ ...p, ieltsScore: parseFloat(e.target.value) || '' }))} />
            </div>
            <div className="input-group">
              <label>Degree Type</label>
              <select value={filters.courseType} onChange={e => setFilters(p => ({ ...p, courseType: e.target.value }))}>
                <option value="ms">MS / Masters</option>
                <option value="mba">MBA / PGP</option>
              </select>
            </div>
          </div>

          <div className="input-group" style={{ marginTop: '16px' }}>
            <label>Target Countries</label>
            <div className="multi-select-grid">
              {countries.map(c => (
                <button key={c} type="button"
                  className={`multi-select-chip ${filters.targetCountries.includes(c) ? 'selected' : ''}`}
                  onClick={() => toggleCountry(c)}>
                  {getCountryFlag(c)} {c}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn-primary btn-lg" onClick={handleSearch} disabled={loading}
            style={{ marginTop: '20px', width: '100%' }}>
            {loading ? <><span className="spinner" /> Matching...</> : '🧭 Find Best-Fit Universities'}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="pf-loading">
            <div className="pf-loading-grid">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="card skeleton" style={{ height: '220px' }} />
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length > 0 && (
          <div className="pf-results animate-fade-in-up">
            <h3 style={{ marginBottom: '20px' }}>
              {results.length} Matches Found
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '12px' }}>
                Ranked by cosine similarity match score
              </span>
            </h3>

            <div className="pf-results-grid">
              {results.map((uni, i) => (
                <div key={uni.id} className={`uni-card card animate-fade-in-up`} style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="uni-card-top">
                    <div className="uni-match-badge" style={{
                      background: uni.matchScore >= 75 ? 'var(--emerald-glow)' : uni.matchScore >= 55 ? 'var(--amber-glow)' : 'rgba(184,92,92,0.12)',
                      color: uni.matchScore >= 75 ? 'var(--emerald-light)' : uni.matchScore >= 55 ? 'var(--amber)' : '#d47a7a',
                      borderColor: uni.matchScore >= 75 ? 'rgba(74,124,111,0.3)' : uni.matchScore >= 55 ? 'rgba(196,147,90,0.3)' : 'rgba(184,92,92,0.3)',
                    }}>
                      {uni.matchScore}% match
                    </div>
                    <span className={`tag ${uni.category === 'Safe' ? 'tag-emerald' : uni.category === 'Moderate' ? 'tag-amber' : 'tag-rose'}`}>
                      {uni.category}
                    </span>
                  </div>

                  <h4 className="uni-name">{getCountryFlag(uni.country)} {uni.name}</h4>
                  <p className="uni-course">{uni.course}</p>
                  <p className="uni-location">{uni.city}, {uni.country}</p>

                  <div className="uni-stats">
                    <div className="uni-stat">
                      <span className="uni-stat-value">#{uni.ranking}</span>
                      <span className="uni-stat-label">QS Rank</span>
                    </div>
                    <div className="uni-stat">
                      <span className="uni-stat-value">${(uni.tuition / 1000).toFixed(0)}K</span>
                      <span className="uni-stat-label">Tuition/yr</span>
                    </div>
                    <div className="uni-stat">
                      <span className="uni-stat-value">{uni.acceptance_rate}%</span>
                      <span className="uni-stat-label">Accept Rate</span>
                    </div>
                    <div className="uni-stat">
                      <span className="uni-stat-value">{uni.duration}mo</span>
                      <span className="uni-stat-label">Duration</span>
                    </div>
                  </div>

                  {uni.gre_avg && <p className="uni-req">GRE Avg: {uni.gre_avg}</p>}
                  {uni.gmat_avg && <p className="uni-req">GMAT Avg: {uni.gmat_avg}</p>}

                  {uni.aiInsight && (
                    <div className="uni-insight">
                      <span style={{ fontSize: '0.78rem', color: 'var(--emerald-light)', fontWeight: 600 }}>✦ AI Insight</span>
                      <p>{uni.aiInsight}</p>
                    </div>
                  )}

                  <div className="uni-tags">
                    {uni.specializations?.slice(0, 3).map(s => (
                      <span key={s} className="tag tag-emerald" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>

                  <div className="uni-footer">
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      📅 {uni.deadline} · {uni.intake}
                    </span>
                    {uni.scholarship && <span className="tag tag-amber" style={{ fontSize: '0.72rem' }}>💰 Scholarship</span>}
                  </div>

                  {/* Why this match? */}
                  <button className="btn btn-ghost btn-sm" style={{ marginTop: '10px', width: '100%', fontSize: '0.8rem' }}
                    onClick={() => {
                      if (expandedCard === uni.id) {
                        setExpandedCard(null);
                        return;
                      }
                      setExpandedCard(uni.id);
                      if (!explainCache[uni.id]) {
                        setLoadingExplain(uni.id);
                        api.explainPathfinderMatch(uni, filters, uni.matchScore)
                          .then(data => {
                            setExplainCache(prev => ({ ...prev, [uni.id]: data }));
                            setLoadingExplain(null);
                          })
                          .catch(() => setLoadingExplain(null));
                      }
                    }}>
                    {expandedCard === uni.id ? '▲ Hide Details' : '▼ Why this match?'}
                  </button>

                  {expandedCard === uni.id && (
                    <div className="uni-explain animate-fade-in" style={{ marginTop: '12px' }}>
                      {loadingExplain === uni.id ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <div className="skeleton-line" style={{ width: '80%', height: '14px' }} />
                          <div className="skeleton-line" style={{ width: '60%', height: '14px' }} />
                          <div className="skeleton-line" style={{ width: '90%', height: '14px' }} />
                        </div>
                      ) : explainCache[uni.id] ? (
                        <>
                          {explainCache[uni.id].probabilityBreakdown && (
                            <p style={{ fontSize: '0.85rem', marginBottom: '10px', color: 'var(--text-secondary)' }}>
                              {explainCache[uni.id].probabilityBreakdown}
                            </p>
                          )}
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                            {(explainCache[uni.id].strengths || []).map((s, j) => (
                              <span key={j} className="tag tag-emerald" style={{ fontSize: '0.72rem' }}>✓ {s}</span>
                            ))}
                            {(explainCache[uni.id].gaps || []).map((g, j) => (
                              <span key={j} className="tag tag-amber" style={{ fontSize: '0.72rem' }}>⚠ {g}</span>
                            ))}
                          </div>
                          {explainCache[uni.id].boostTip && (
                            <div style={{ padding: '10px 14px', background: 'rgba(196,147,90,0.08)', border: '1px solid rgba(196,147,90,0.25)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem' }}>
                              💡 <strong>Boost Tip:</strong> {explainCache[uni.id].boostTip}
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="pf-empty animate-fade-in">
            <span style={{ fontSize: '3rem' }}>🔍</span>
            <h3>No matches found</h3>
            <p>Try adjusting your filters or adding more countries.</p>
          </div>
        )}
      </div>
    </div>
  );
}
