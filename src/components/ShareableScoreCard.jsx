import { useRef } from 'react';
import './ShareableScoreCard.css';

export default function ShareableScoreCard({ dreamScore, userData, onClose }) {
  const cardRef = useRef(null);

  if (!dreamScore) return null;

  const score = dreamScore.totalScore || 0;
  const breakdown = dreamScore.breakdown || {};
  const tier = dreamScore.tier || {};
  const targetCountry = userData?.targetCountries?.[0] || 'Abroad';
  const targetField = userData?.courseType === 'mba' ? 'MBA' : 'Masters';

  const pillars = Object.entries(breakdown).map(([key, val]) => ({
    label: val.label || key,
    score: val.score || 0,
  }));

  const captureAndShare = async () => {
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default;
      const card = cardRef.current;
      if (!card) return;

      const canvas = await html2canvas(card, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#1a0f2e',
        logging: false,
      });

      // Mobile: use Web Share API
      if (navigator.share && navigator.canShare) {
        canvas.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'gradpath-score.png', { type: 'image/png' });
          try {
            await navigator.share({
              title: `My GradPath Dream Score: ${score}/1000`,
              text: `I scored ${score}/1000 on GradPath AI! Planning to study ${targetField} in ${targetCountry}. Check yours →`,
              files: [file],
            });
          } catch {
            downloadCanvas(canvas);
          }
        });
      } else {
        downloadCanvas(canvas);
      }
    } catch (err) {
      console.error('Share error:', err);
    }
  };

  const downloadCanvas = (canvas) => {
    const link = document.createElement('a');
    link.download = `GradPath-Score-${score}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const getScoreBarColor = (s) => {
    if (s >= 700) return '#4a7c6f';
    if (s >= 400) return '#c4935a';
    return '#b85c5c';
  };

  return (
    <div className="share-modal-overlay" onClick={onClose}>
      <div className="share-modal" onClick={e => e.stopPropagation()}>
        <div className="share-modal-header">
          <h3>📤 Share Your Score</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>✕</button>
        </div>

        {/* Preview */}
        <div className="share-preview-wrapper">
          <div ref={cardRef} className="share-card-capture">
            {/* Background gradient (hardcoded for canvas) */}
            <div className="share-card-inner">
              <div className="share-card-top">
                <span className="share-card-logo">🎓 GradPath AI</span>
                <span className="share-card-tier">{tier.emoji} {tier.name}</span>
              </div>

              <div className="share-card-score-section">
                <span className="share-card-score">{score}</span>
                <span className="share-card-max">/ 1000</span>
              </div>

              <div className="share-card-pillars">
                {pillars.map((p, i) => (
                  <div key={i} className="share-pillar">
                    <div className="share-pillar-header">
                      <span>{p.label}</span>
                      <span>{p.score}</span>
                    </div>
                    <div className="share-pillar-bar">
                      <div className="share-pillar-fill" style={{
                        width: `${p.score / 10}%`,
                        backgroundColor: getScoreBarColor(p.score),
                      }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="share-card-footer">
                <span>🌍 Target: {targetField} in {targetCountry}</span>
                <span>gradpath-ai.vercel.app</span>
              </div>
            </div>
          </div>
        </div>

        <div className="share-modal-actions">
          <button className="btn btn-amber btn-lg" onClick={captureAndShare}>
            📤 Download & Share
          </button>
        </div>
      </div>
    </div>
  );
}
