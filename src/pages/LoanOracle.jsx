import { useState, useContext, useRef, useEffect } from 'react';
import { AppContext } from '../App';
import { api } from '../utils/api';
import { formatCurrency } from '../utils/helpers';
import './LoanOracle.css';

export default function LoanOracle() {
  const { userData } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('eligibility');

  // Eligibility state
  const [loanProfile, setLoanProfile] = useState({
    age: 22,
    loanAmount: 2500000,
    coborrowerIncome: userData?.familyIncome || 12,
    cibilScore: userData?.cobilScore || 720,
    hasCollateral: userData?.hasCollateral || false,
    hasAdmission: false,
    universityRanking: 50,
    isStem: true,
    gpa: userData?.gpa || 8,
    greScore: userData?.greScore || 315,
  });
  const [eligibilityResult, setEligibilityResult] = useState(null);
  const [loadingElig, setLoadingElig] = useState(false);

  // Chat state
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm LoanOracle, your AI education loan specialist. I can help you understand loan options, check eligibility, and plan your finances.\n\nTell me — which country and program are you considering? I'll help you figure out the best financing path." }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);
  const chatEndRef = useRef(null);

  // EMI Calculator state
  const [emiAmount, setEmiAmount] = useState(2500000);
  const [emiRate, setEmiRate] = useState(11.5);
  const [emiYears, setEmiYears] = useState(7);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const checkEligibility = async () => {
    setLoadingElig(true);
    try {
      const result = await api.checkLoanEligibility(loanProfile);
      setEligibilityResult(result);
    } catch (e) {
      console.error(e);
    }
    setLoadingElig(false);
  };

  const sendMessage = async () => {
    if (!inputMsg.trim() || loadingChat) return;
    const userMsg = { role: 'user', content: inputMsg.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInputMsg('');
    setLoadingChat(true);

    try {
      const data = await api.chatLoanOracle(newMessages.slice(1), loanProfile);
      setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
    } catch (e) {
      setMessages([...newMessages, { role: 'assistant', content: "I'm having trouble connecting right now. Please try again in a moment." }]);
    }
    setLoadingChat(false);
  };

  const calculateEMI = () => {
    const r = emiRate / 100 / 12;
    const n = emiYears * 12;
    const emi = emiAmount * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
    return {
      emi: Math.round(emi),
      total: Math.round(emi * n),
      interest: Math.round(emi * n - emiAmount)
    };
  };

  const emiCalc = calculateEMI();

  return (
    <div className="page loan-page">
      <div className="container">
        <div className="loan-header animate-fade-in-up">
          <h1>💰 LoanOracle</h1>
          <p>AI-powered education loan advisor. Check eligibility, compare offers, and plan your finances with conversational AI guidance.</p>
        </div>

        {/* Tabs */}
        <div className="loan-tabs animate-fade-in-up stagger-1">
          {[
            { id: 'eligibility', label: '📋 Eligibility Check', },
            { id: 'chat', label: '💬 AI Advisor' },
            { id: 'emi', label: '🧮 EMI Calculator' },
          ].map(tab => (
            <button key={tab.id}
              className={`loan-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Eligibility Tab */}
        {activeTab === 'eligibility' && (
          <div className="loan-content animate-fade-in">
            <div className="loan-elig-layout">
              <div className="loan-form glass-strong">
                <h3>Your Profile</h3>
                <div className="loan-form-grid">
                  <div className="input-group">
                    <label>Loan Amount (₹)</label>
                    <input className="input" type="number" value={loanProfile.loanAmount}
                      onChange={e => setLoanProfile(p => ({ ...p, loanAmount: parseInt(e.target.value) || 0 }))} />
                    <span className="input-hint">{formatCurrency(loanProfile.loanAmount)}</span>
                  </div>
                  <div className="input-group">
                    <label>Co-borrower Annual Income (Lakhs)</label>
                    <input className="input" type="number" value={loanProfile.coborrowerIncome}
                      onChange={e => setLoanProfile(p => ({ ...p, coborrowerIncome: parseFloat(e.target.value) || 0 }))} />
                  </div>
                  <div className="input-group">
                    <label>Co-borrower CIBIL Score</label>
                    <input className="input" type="number" min="300" max="900" value={loanProfile.cibilScore}
                      onChange={e => setLoanProfile(p => ({ ...p, cibilScore: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="input-group">
                    <label>University Ranking (approx)</label>
                    <input className="input" type="number" value={loanProfile.universityRanking}
                      onChange={e => setLoanProfile(p => ({ ...p, universityRanking: parseInt(e.target.value) || 100 }))} />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '16px 0' }}>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.hasCollateral}
                      onChange={e => setLoanProfile(p => ({ ...p, hasCollateral: e.target.checked }))} />
                    <span>Collateral Available</span>
                  </label>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.hasAdmission}
                      onChange={e => setLoanProfile(p => ({ ...p, hasAdmission: e.target.checked }))} />
                    <span>Confirmed University Admission</span>
                  </label>
                  <label className="checkbox-group quiz-checkbox">
                    <input type="checkbox" checked={loanProfile.isStem}
                      onChange={e => setLoanProfile(p => ({ ...p, isStem: e.target.checked }))} />
                    <span>STEM Course</span>
                  </label>
                </div>

                <button className="btn btn-amber" onClick={checkEligibility} disabled={loadingElig} style={{ width: '100%' }}>
                  {loadingElig ? <><span className="spinner" /> Checking...</> : '💰 Check Eligibility'}
                </button>
              </div>

              {/* Results Panel */}
              {eligibilityResult && (
                <div className="loan-results animate-slide-in">
                  {/* Eligibility Status */}
                  <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '2rem' }}>
                        {eligibilityResult.eligibility.eligible ? '✅' : eligibilityResult.eligibility.conditionallyEligible ? '⚠️' : '❌'}
                      </span>
                      <div>
                        <h4 style={{ color: eligibilityResult.eligibility.eligible ? 'var(--emerald-light)' : 'var(--amber)' }}>
                          {eligibilityResult.eligibility.eligible ? 'Eligible!' : eligibilityResult.eligibility.conditionallyEligible ? 'Conditionally Eligible' : 'Not Eligible'}
                        </h4>
                        {eligibilityResult.eligibility.issues.map((issue, i) => (
                          <p key={i} style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>• {issue}</p>
                        ))}
                      </div>
                    </div>

                    <div className="result-stats">
                      <div className="result-stat">
                        <span className="result-stat-label">Approved Amount</span>
                        <span className="result-stat-value">{formatCurrency(eligibilityResult.loanDetails.approvedAmount)}</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-label">Interest Rate</span>
                        <span className="result-stat-value">{eligibilityResult.loanDetails.interestRate}%</span>
                      </div>
                      <div className="result-stat">
                        <span className="result-stat-label">Processing Fee</span>
                        <span className="result-stat-value">{formatCurrency(eligibilityResult.loanDetails.processingFee)}</span>
                      </div>
                    </div>
                  </div>

                  {/* EMI Options */}
                  <div className="card" style={{ padding: '24px', marginBottom: '16px' }}>
                    <h4 style={{ marginBottom: '16px' }}>Repayment Options</h4>
                    <div className="emi-options">
                      {eligibilityResult.loanDetails.emiOptions.map((opt, i) => (
                        <div key={i} className="emi-option">
                          <span className="emi-option-label">{opt.label}</span>
                          <span className="emi-option-emi">{formatCurrency(opt.emi)}<small>/mo</small></span>
                          <span className="emi-option-total">Total: {formatCurrency(opt.totalPayment)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lender Offers */}
                  <h4 style={{ marginBottom: '12px' }}>💎 Personalized Lender Offers</h4>
                  {eligibilityResult.lenders.map((lender, i) => (
                    <div key={i} className="card lender-card" style={{ padding: '20px', marginBottom: '12px' }}>
                      <div className="lender-header">
                        <div>
                          <h4 style={{ fontSize: '1rem' }}>{lender.name}</h4>
                          <span className="tag tag-emerald">{lender.type}</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 700, color: 'var(--emerald-light)' }}>
                            {lender.personalizedRate}
                          </span>
                          <br />
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            EMI ≈ {formatCurrency(lender.estimatedEMI)}/mo
                          </span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '12px' }}>
                        {lender.features.map((f, j) => (
                          <span key={j} className="tag tag-amber" style={{ fontSize: '0.72rem' }}>{f}</span>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)' }}>
                        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                          Approval: <strong style={{ color: lender.approvalChance === 'High' ? 'var(--emerald-light)' : 'var(--amber)' }}>{lender.approvalChance}</strong>
                          {' · '}{lender.processing_days} days
                        </span>
                        <button className="btn btn-primary btn-sm">Apply →</button>
                      </div>
                    </div>
                  ))}

                  {/* Document Checklist */}
                  <div className="card" style={{ padding: '24px', marginTop: '16px' }}>
                    <h4 style={{ marginBottom: '16px' }}>📋 Document Checklist</h4>
                    {Object.entries(eligibilityResult.documents).map(([cat, docs]) => (
                      <div key={cat} style={{ marginBottom: '12px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                          {cat.replace(/_/g, ' ')}
                        </span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
                          {docs.map((doc, i) => (
                            <label key={i} className="checkbox-group" style={{ fontSize: '0.88rem' }}>
                              <input type="checkbox" />
                              <span>{doc}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="loan-content animate-fade-in">
            <div className="chat-container glass-strong">
              <div className="chat-header">
                <span style={{ fontSize: '1.3rem' }}>🤖</span>
                <div>
                  <h4 style={{ fontSize: '0.95rem' }}>LoanOracle AI</h4>
                  <span style={{ fontSize: '0.78rem', color: 'var(--emerald-light)' }}>● Online · Powered by Llama 3.3 70B</span>
                </div>
              </div>

              <div className="chat-messages">
                {messages.map((msg, i) => (
                  <div key={i} className={`chat-msg ${msg.role}`}>
                    {msg.role === 'assistant' && <span className="chat-avatar">🤖</span>}
                    <div className="chat-bubble">
                      {msg.content.split('\n').map((line, j) => (
                        <p key={j} style={{ marginBottom: line ? '6px' : '0' }}>{line}</p>
                      ))}
                    </div>
                    {msg.role === 'user' && <span className="chat-avatar">👤</span>}
                  </div>
                ))}
                {loadingChat && (
                  <div className="chat-msg assistant">
                    <span className="chat-avatar">🤖</span>
                    <div className="chat-bubble typing">
                      <span className="typing-dot" /><span className="typing-dot" /><span className="typing-dot" />
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              <div className="chat-input-area">
                <input className="input chat-input"
                  placeholder="Ask about loan eligibility, interest rates, documents..."
                  value={inputMsg}
                  onChange={e => setInputMsg(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button className="btn btn-primary" onClick={sendMessage} disabled={loadingChat}>
                  Send
                </button>
              </div>
            </div>
          </div>
        )}

        {/* EMI Calculator Tab */}
        {activeTab === 'emi' && (
          <div className="loan-content animate-fade-in">
            <div className="emi-calc-layout">
              <div className="glass-strong emi-form">
                <h3>EMI Calculator</h3>
                <div className="input-group">
                  <label>Loan Amount: {formatCurrency(emiAmount)}</label>
                  <input type="range" min="100000" max="15000000" step="100000" value={emiAmount}
                    onChange={e => setEmiAmount(parseInt(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>₹1L</span><span>₹1.5Cr</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Interest Rate: {emiRate}%</label>
                  <input type="range" min="8" max="16" step="0.5" value={emiRate}
                    onChange={e => setEmiRate(parseFloat(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>8%</span><span>16%</span>
                  </div>
                </div>

                <div className="input-group">
                  <label>Tenure: {emiYears} years</label>
                  <input type="range" min="3" max="15" step="1" value={emiYears}
                    onChange={e => setEmiYears(parseInt(e.target.value))}
                    className="range-slider" />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <span>3 yrs</span><span>15 yrs</span>
                  </div>
                </div>
              </div>

              <div className="emi-result-panel">
                <div className="card emi-result-card">
                  <span className="emi-result-label">Monthly EMI</span>
                  <span className="emi-result-value">{formatCurrency(emiCalc.emi)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Total Payment</span>
                  <span className="emi-result-value">{formatCurrency(emiCalc.total)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Total Interest</span>
                  <span className="emi-result-value" style={{ color: 'var(--rose)' }}>{formatCurrency(emiCalc.interest)}</span>
                </div>
                <div className="card emi-result-card">
                  <span className="emi-result-label">Interest / Principal</span>
                  <span className="emi-result-value">{((emiCalc.interest / emiAmount) * 100).toFixed(0)}%</span>
                  <div className="progress-bar" style={{ marginTop: '8px' }}>
                    <div className="progress-bar-fill" style={{
                      width: `${(emiAmount / emiCalc.total) * 100}%`,
                      background: 'var(--emerald-light)'
                    }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>Principal</span><span>Interest</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
