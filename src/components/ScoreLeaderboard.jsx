import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import './ScoreLeaderboard.css';

const COUNTRY_FLAGS = {
  USA: '🇺🇸', UK: '🇬🇧', Canada: '🇨🇦', Germany: '🇩🇪', Australia: '🇦🇺',
  Singapore: '🇸🇬', Switzerland: '🇨🇭', Netherlands: '🇳🇱', France: '🇫🇷',
  Sweden: '🇸🇪', India: '🇮🇳',
};

// Fallback mock leaderboard data for when Supabase is not configured
const MOCK_LEADERBOARD = [
  { name: 'Rohan C.', dream_score: 921, target_country: 'USA', target_field: 'Computer Science', streak_days: 28 },
  { name: 'Sneha I.', dream_score: 901, target_country: 'USA', target_field: 'Computer Science', streak_days: 22 },
  { name: 'Akash M.', dream_score: 877, target_country: 'USA', target_field: 'Computer Science', streak_days: 21 },
  { name: 'Kavya M.', dream_score: 863, target_country: 'USA', target_field: 'MBA', streak_days: 19 },
  { name: 'Karan M.', dream_score: 845, target_country: 'USA', target_field: 'Computer Science', streak_days: 17 },
  { name: 'Arnav D.', dream_score: 815, target_country: 'Canada', target_field: 'MBA', streak_days: 15 },
  { name: 'Arjun S.', dream_score: 812, target_country: 'USA', target_field: 'Computer Science', streak_days: 14 },
  { name: 'Rahul V.', dream_score: 798, target_country: 'USA', target_field: 'Computer Science', streak_days: 13 },
  { name: 'Ananya N.', dream_score: 778, target_country: 'Australia', target_field: 'Finance', streak_days: 11 },
  { name: 'Priya P.', dream_score: 756, target_country: 'UK', target_field: 'MBA', streak_days: 8 },
  { name: 'Tanya B.', dream_score: 743, target_country: 'Germany', target_field: 'Engineering', streak_days: 7 },
  { name: 'Siddharth R.', dream_score: 741, target_country: 'Singapore', target_field: 'Finance', streak_days: 9 },
  { name: 'Pooja S.', dream_score: 724, target_country: 'Australia', target_field: 'Nursing', streak_days: 6 },
  { name: 'Divya R.', dream_score: 712, target_country: 'Canada', target_field: 'Biotech', streak_days: 5 },
  { name: 'Rohit K.', dream_score: 689, target_country: 'Canada', target_field: 'Data Science', streak_days: 3 },
  { name: 'Nisha P.', dream_score: 668, target_country: 'UK', target_field: 'Psychology', streak_days: 3 },
  { name: 'Meera G.', dream_score: 655, target_country: 'Netherlands', target_field: 'Design', streak_days: 4 },
  { name: 'Vikram S.', dream_score: 634, target_country: 'Germany', target_field: 'Engineering', streak_days: 1 },
  { name: 'Aditya J.', dream_score: 590, target_country: 'UK', target_field: 'Law', streak_days: 2 },
  { name: 'Ishaan K.', dream_score: 561, target_country: 'France', target_field: 'Culinary Arts', streak_days: 1 },
];

export default function ScoreLeaderboard({ currentScore, currentCountry }) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCountry, setFilterCountry] = useState('All');

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('name, dream_score, target_country, target_field, streak_days')
          .order('dream_score', { ascending: false })
          .limit(20);

        if (!error && data?.length > 0) {
          setLeaderboard(data);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Supabase fetch failed, using mock data:', e);
      }
    }

    // Fallback to mock data
    setLeaderboard(MOCK_LEADERBOARD);
    setLoading(false);
  };

  const filtered = filterCountry === 'All'
    ? leaderboard
    : leaderboard.filter(u => u.target_country === filterCountry);

  const countries = ['All', ...new Set(leaderboard.map(u => u.target_country).filter(Boolean))];

  return (
    <div className="leaderboard-section">
      <div className="leaderboard-header">
        <h3>🏆 Dream Score Leaderboard</h3>
        <span className="leaderboard-subtitle">Students like you</span>
      </div>

      {/* Country filter */}
      <div className="leaderboard-filters">
        {countries.map(c => (
          <button key={c}
            className={`leaderboard-filter-chip ${filterCountry === c ? 'active' : ''}`}
            onClick={() => setFilterCountry(c)}>
            {c !== 'All' && COUNTRY_FLAGS[c] ? `${COUNTRY_FLAGS[c]} ` : ''}{c}
          </button>
        ))}
      </div>

      {/* Leaderboard list */}
      <div className="leaderboard-list">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="leaderboard-row skeleton" style={{ height: '48px' }} />
          ))
        ) : (
          filtered.slice(0, 15).map((user, i) => {
            const isCurrentUser = currentScore && user.dream_score === currentScore;
            return (
              <div key={i} className={`leaderboard-row ${isCurrentUser ? 'highlight' : ''}`}>
                <span className="lb-rank">
                  {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
                </span>
                <div className="lb-info">
                  <span className="lb-name">{user.name}{isCurrentUser ? ' (You)' : ''}</span>
                  <span className="lb-meta">
                    {COUNTRY_FLAGS[user.target_country] || '🌍'} {user.target_field || ''}
                  </span>
                </div>
                <div className="lb-score-section">
                  {user.streak_days > 7 && <span className="lb-streak">🔥{user.streak_days}</span>}
                  <span className="lb-score">{user.dream_score}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
