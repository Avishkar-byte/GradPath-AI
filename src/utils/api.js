const API_BASE = '/api';

async function fetchJSON(url, options = {}) {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API Error: ${res.status}`);
  return res.json();
}

export const api = {
  // Dream Score
  calculateDreamScore: (data) => fetchJSON('/dream-score/calculate', { method: 'POST', body: JSON.stringify(data) }),

  // PathFinder
  getRecommendations: (profile) => fetchJSON('/pathfinder/recommend', { method: 'POST', body: JSON.stringify(profile) }),
  getUniversities: () => fetchJSON('/pathfinder/universities'),

  // Loan Oracle
  checkLoanEligibility: (profile) => fetchJSON('/loan-oracle/eligibility', { method: 'POST', body: JSON.stringify(profile) }),
  chatLoanOracle: (messages, profile) => fetchJSON('/loan-oracle/chat', { method: 'POST', body: JSON.stringify({ messages, profile }) }),

  // ROI
  calculateROI: (params) => fetchJSON('/roi/calculate', { method: 'POST', body: JSON.stringify(params) }),

  // Timeline
  generateTimeline: (params) => fetchJSON('/timeline/generate', { method: 'POST', body: JSON.stringify(params) }),

  // Growth Engine
  generateContent: (type, profile) => fetchJSON('/growth/generate-content', { method: 'POST', body: JSON.stringify({ type, profile }) }),
};
