export function formatCurrency(amount, currency = 'INR') {
  if (currency === 'INR') {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)}Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString('en-IN')}`;
  }
  return `$${amount.toLocaleString('en-US')}`;
}

export function formatNumber(num) {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

export function getCountryFlag(country) {
  const flags = {
    'USA': '🇺🇸', 'UK': '🇬🇧', 'Canada': '🇨🇦', 'Germany': '🇩🇪',
    'Australia': '🇦🇺', 'France': '🇫🇷', 'Switzerland': '🇨🇭',
    'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Singapore': '🇸🇬',
    'India': '🇮🇳', 'Japan': '🇯🇵', 'South Korea': '🇰🇷'
  };
  return flags[country] || '🌍';
}

export function getScoreColor(score) {
  if (score >= 901) return '#c4935a';
  if (score >= 751) return '#4a7c6f';
  if (score >= 551) return '#5a8f4a';
  if (score >= 301) return '#7a6b4a';
  return '#6b6b6b';
}

export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function animateValue(start, end, duration, callback) {
  const startTime = performance.now();
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);
    callback(current);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
