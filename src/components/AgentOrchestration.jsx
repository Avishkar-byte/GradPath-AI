import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AgentOrchestration.css';

const AGENTS = [
  {
    icon: '🧭',
    name: 'PathFinder',
    loading: 'Matching 55+ programs to your profile...',
    done: '✓ 12 universities matched',
    color: 'var(--emerald-light)',
  },
  {
    icon: '★',
    name: 'ScoreEngine',
    loading: 'Computing Dream Score across 5 pillars...',
    done: null, // filled dynamically with actual score
    color: 'var(--amber)',
  },
  {
    icon: '💎',
    name: 'LoanOracle',
    loading: 'Pre-qualifying your loan eligibility...',
    done: '✓ Pre-qualified for ₹25L',
    color: '#60a5fa',
  },
  {
    icon: '∞',
    name: 'GrowthEngine',
    loading: 'Personalizing your engagement journey...',
    done: '✓ Your roadmap is ready',
    color: '#c084fc',
  },
];

export default function AgentOrchestration({ dreamScore, onComplete }) {
  const navigate = useNavigate();
  const [visibleAgents, setVisibleAgents] = useState([]);
  const [completedAgents, setCompletedAgents] = useState([]);
  const [progress, setProgress] = useState(0);
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    // Stagger agent appearances at 800ms intervals
    AGENTS.forEach((_, i) => {
      setTimeout(() => {
        setVisibleAgents(prev => [...prev, i]);
      }, i * 800);

      // Complete each agent 1.2s after it appears
      setTimeout(() => {
        setCompletedAgents(prev => [...prev, i]);
      }, i * 800 + 1200);
    });

    // Progress bar fills over 4 seconds
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2.5; // 100/40 steps over 4s (every 100ms)
      });
    }, 100);

    // All done after 4 seconds
    const doneTimer = setTimeout(() => {
      setAllDone(true);
    }, 4200);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(doneTimer);
    };
  }, []);

  const getAgentDoneText = (agent, index) => {
    if (index === 1 && dreamScore) {
      return `✓ Dream Score: ${dreamScore.totalScore}`;
    }
    return agent.done;
  };

  const handleContinue = () => {
    if (onComplete) onComplete();
    navigate('/dashboard');
  };

  return (
    <div className="agent-overlay">
      <div className="agent-container animate-fade-in">
        <h2 className="agent-title">⚡ AI Agents at Work</h2>
        <p className="agent-subtitle">Preparing your personalized GradPath experience...</p>

        <div className="agent-cards">
          {AGENTS.map((agent, i) => {
            const isVisible = visibleAgents.includes(i);
            const isComplete = completedAgents.includes(i);

            return (
              <div
                key={i}
                className={`agent-card ${isVisible ? 'visible' : ''} ${isComplete ? 'complete' : ''}`}
                style={{ '--agent-color': agent.color }}
              >
                <span className="agent-card-icon">{agent.icon}</span>
                <div className="agent-card-content">
                  <span className="agent-card-name">{agent.name}</span>
                  <span className="agent-card-status">
                    {isComplete ? getAgentDoneText(agent, i) : agent.loading}
                  </span>
                </div>
                <div className="agent-card-indicator">
                  {isComplete ? (
                    <span className="agent-check">✓</span>
                  ) : isVisible ? (
                    <span className="agent-spinner" />
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="agent-progress-bar">
          <div className="agent-progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
        </div>

        {/* Continue button */}
        {allDone && (
          <button className="btn btn-amber btn-lg agent-continue animate-fade-in-up" onClick={handleContinue}>
            Your GradPath is ready →
          </button>
        )}
      </div>
    </div>
  );
}
