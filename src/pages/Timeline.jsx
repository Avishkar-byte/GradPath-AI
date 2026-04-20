import { useState } from 'react';
import { api } from '../utils/api';
import './Timeline.css';

const PRIORITY_COLORS = {
  high: 'var(--rose)',
  medium: 'var(--amber)',
  low: 'var(--emerald-light)',
};

const CATEGORY_ICONS = {
  test: '📝',
  application: '📋',
  financial: '💰',
  visa: '✈️',
  prep: '🎒',
};

export default function Timeline() {
  const [params, setParams] = useState({
    intake: 'Fall 2026',
    country: 'USA',
    universities: [],
  });
  const [timeline, setTimeline] = useState(null);
  const [loading, setLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState(new Set());

  const generate = async () => {
    setLoading(true);
    try {
      const data = await api.generateTimeline(params);
      setTimeline(data.timeline);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const toggleTask = (monthIdx, taskIdx) => {
    const key = `${monthIdx}-${taskIdx}`;
    setCompletedTasks(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const totalTasks = timeline ? timeline.reduce((sum, m) => sum + m.tasks.length, 0) : 0;
  const completedCount = completedTasks.size;

  return (
    <div className="page timeline-page">
      <div className="container">
        <div className="tl-header animate-fade-in-up">
          <h1>📅 Application Timeline</h1>
          <p>AI-generated month-by-month roadmap tailored to your target intake. Track milestones and stay on schedule.</p>
        </div>

        {!timeline && (
          <div className="tl-setup glass-strong animate-fade-in-up stagger-1">
            <h3>Generate Your Timeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="input-group">
                <label>Target Intake</label>
                <select value={params.intake} onChange={e => setParams(p => ({ ...p, intake: e.target.value }))}>
                  <option>Fall 2025</option>
                  <option>Spring 2026</option>
                  <option>Fall 2026</option>
                  <option>Spring 2027</option>
                </select>
              </div>
              <div className="input-group">
                <label>Target Country</label>
                <select value={params.country} onChange={e => setParams(p => ({ ...p, country: e.target.value }))}>
                  {['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <button className="btn btn-primary btn-lg" onClick={generate} disabled={loading}
              style={{ width: '100%', marginTop: '20px' }}>
              {loading ? <><span className="spinner" /> Generating with AI...</> : '📅 Generate Timeline'}
            </button>
          </div>
        )}

        {timeline && (
          <div className="tl-content animate-fade-in-up">
            {/* Progress */}
            <div className="tl-progress-bar-container">
              <div className="tl-progress-info">
                <span>{completedCount} of {totalTasks} tasks completed</span>
                <span>{totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-bar-fill" style={{ width: `${totalTasks > 0 ? (completedCount / totalTasks) * 100 : 0}%` }} />
              </div>
            </div>

            {/* Timeline */}
            <div className="tl-timeline">
              {timeline.map((month, mIdx) => (
                <div key={mIdx} className="tl-month animate-fade-in-up" style={{ animationDelay: `${mIdx * 0.08}s` }}>
                  <div className="tl-month-marker">
                    <div className="tl-month-dot" />
                    <div className="tl-month-line" />
                  </div>

                  <div className="tl-month-content">
                    <h4 className="tl-month-label">{month.month}</h4>
                    <div className="tl-tasks">
                      {month.tasks.map((task, tIdx) => {
                        const key = `${mIdx}-${tIdx}`;
                        const done = completedTasks.has(key);
                        return (
                          <div key={tIdx}
                            className={`tl-task card ${done ? 'completed' : ''}`}
                            onClick={() => toggleTask(mIdx, tIdx)}>
                            <div className="tl-task-check">
                              <input type="checkbox" checked={done} readOnly />
                            </div>
                            <div className="tl-task-body">
                              <div className="tl-task-title">
                                <span>{CATEGORY_ICONS[task.category] || '📌'}</span>
                                <span style={{ textDecoration: done ? 'line-through' : 'none' }}>{task.title}</span>
                              </div>
                              <p className="tl-task-desc">{task.description}</p>
                              <div className="tl-task-meta">
                                <span className="tl-priority-dot" style={{ background: PRIORITY_COLORS[task.priority] || 'var(--text-muted)' }} />
                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>{task.priority} priority</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="btn btn-ghost" onClick={() => { setTimeline(null); setCompletedTasks(new Set()); }}
              style={{ marginTop: '32px' }}>
              ← Regenerate Timeline
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
