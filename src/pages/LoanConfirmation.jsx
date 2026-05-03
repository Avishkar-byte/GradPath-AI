import { useEffect, useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import './LoanConfirmation.css';

export default function LoanConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { dreamScore, setDreamScore, userData } = useContext(AppContext);
  const [showCheck, setShowCheck] = useState(false);
  const [scoreUpdated, setScoreUpdated] = useState(false);

  const applicationData = location.state;

  useEffect(() => {
    if (!applicationData) {
      navigate('/loans');
      return;
    }
    // Trigger animated checkmark after mount
    const timer = setTimeout(() => setShowCheck(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const applicationId = applicationData?.applicationId || generateApplicationId();

  function generateApplicationId() {
    const year = new Date().getFullYear();
    const rand = Math.floor(100000 + Math.random() * 900000);
    return `GPA-${year}-${rand}`;
  }

  const handleReturnDashboard = async () => {
    // Boost Dream Score Progress pillar by +15
    if (userData && dreamScore && !scoreUpdated) {
      try {
        const updatedData = { ...userData, applicationsSubmitted: (userData.applicationsSubmitted || 0) + 1 };
        const result = await api.calculateDreamScore(updatedData);
        if (result) {
          // Add flat +15 bonus to the total
          result.totalScore = Math.min(1000, (result.totalScore || dreamScore.totalScore) + 15);
          setDreamScore(result);
          localStorage.setItem('gradpath_score', JSON.stringify(result));
          localStorage.setItem('gradpath_user', JSON.stringify(updatedData));
          setScoreUpdated(true);
        }
      } catch (e) {
        console.warn('Score update failed (non-critical):', e);
      }
    }
    navigate('/dashboard');
  };

  const downloadChecklist = () => {
    const checklist = `
═══════════════════════════════════════════════
  GradPath AI — Document Checklist
  Application ID: ${applicationId}
  Generated: ${new Date().toLocaleDateString()}
═══════════════════════════════════════════════

📋 IDENTITY DOCUMENTS
  □ Aadhaar Card
  □ PAN Card
  □ Passport (valid for 18+ months)

📚 ACADEMIC DOCUMENTS
  □ 10th Marksheet
  □ 12th Marksheet
  □ UG Transcripts (all semesters)
  □ Degree Certificate
  □ GRE/GMAT Score Report
  □ IELTS/TOEFL Score Report

🎓 ADMISSION DOCUMENTS
  □ University Offer Letter
  □ I-20 / CAS Letter
  □ Fee Structure from University

💰 FINANCIAL — STUDENT
  □ Bank Statements (last 6 months)
  □ Scholarship Letter (if applicable)

💼 FINANCIAL — CO-APPLICANT
  □ Income Tax Returns (last 2 years)
  □ Salary Slips (last 3 months)
  □ Bank Statements (last 6 months)
  □ Property Documents (if collateral)

📄 OTHERS
  □ Passport-size Photographs (6 copies)
  □ Loan Application Form (signed)

═══════════════════════════════════════════════
  Note: Keep original + 2 photocopies of each.
  Processing time: 3–5 business days.
═══════════════════════════════════════════════
`.trim();

    const blob = new Blob([checklist], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `GradPath-Checklist-${applicationId}.txt`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!applicationData) return null;

  const nextSteps = [
    { icon: '📄', title: 'Upload Documents', desc: 'Submit KYC, admission letter, and financial proofs' },
    { icon: '📞', title: 'Co-applicant Verification', desc: 'Verification call scheduled within 24 hours' },
    { icon: '📧', title: 'Loan Agreement', desc: 'Agreement sent to your registered email' },
    { icon: '🏦', title: 'Disbursement', desc: 'Funds disbursed to university within 7 days of approval' },
  ];

  return (
    <div className="page confirmation-page">
      <div className="container">
        <div className="confirmation-wrapper animate-fade-in-up">

          {/* Animated Checkmark */}
          <div className={`confirm-check-container ${showCheck ? 'visible' : ''}`}>
            <div className="confirm-check-ring">
              <svg viewBox="0 0 52 52" className="confirm-check-svg">
                <circle cx="26" cy="26" r="25" fill="none" className="confirm-check-circle" />
                <path fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" className="confirm-check-path" />
              </svg>
            </div>
          </div>

          <h1 style={{ textAlign: 'center', marginBottom: '8px' }}>Application Submitted!</h1>
          <p style={{ textAlign: 'center', maxWidth: '100%', marginBottom: '24px' }}>
            Your loan application has been received and is being processed.
          </p>

          {/* Application ID Badge */}
          <div className="confirm-id-badge glass-strong">
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Application ID</span>
            <span className="confirm-id-value">{applicationId}</span>
            <button className="btn btn-ghost btn-sm" onClick={() => {
              navigator.clipboard.writeText(applicationId);
            }} style={{ fontSize: '0.75rem' }}>
              📋 Copy
            </button>
          </div>

          {/* Processing Time */}
          <div className="card" style={{ textAlign: 'center', padding: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              ⏱ Expected Processing Time: <strong style={{ color: 'var(--amber)' }}>3–5 business days</strong>
            </span>
          </div>

          {/* Application Summary */}
          {applicationData.summary && (
            <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
              <h4 style={{ marginBottom: '12px' }}>📋 Application Summary</h4>
              <div className="confirm-summary-grid">
                {applicationData.summary.name && (
                  <div className="confirm-summary-item">
                    <span className="confirm-summary-label">Applicant</span>
                    <span className="confirm-summary-value">{applicationData.summary.name}</span>
                  </div>
                )}
                {applicationData.summary.university && (
                  <div className="confirm-summary-item">
                    <span className="confirm-summary-label">University</span>
                    <span className="confirm-summary-value">{applicationData.summary.university}</span>
                  </div>
                )}
                {applicationData.summary.loanAmount && (
                  <div className="confirm-summary-item">
                    <span className="confirm-summary-label">Loan Amount</span>
                    <span className="confirm-summary-value">{applicationData.summary.loanAmount}</span>
                  </div>
                )}
                {applicationData.summary.lender && (
                  <div className="confirm-summary-item">
                    <span className="confirm-summary-label">Preferred Lender</span>
                    <span className="confirm-summary-value">{applicationData.summary.lender}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="card" style={{ padding: '24px', marginBottom: '24px' }}>
            <h4 style={{ marginBottom: '16px' }}>📌 Next Steps</h4>
            <div className="confirm-steps">
              {nextSteps.map((step, i) => (
                <div key={i} className="confirm-step">
                  <div className="confirm-step-number">{i + 1}</div>
                  <div className="confirm-step-content">
                    <span className="confirm-step-icon">{step.icon}</span>
                    <div>
                      <strong>{step.title}</strong>
                      <p style={{ fontSize: '0.85rem', marginTop: '2px' }}>{step.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="confirm-actions">
            <button className="btn btn-amber" onClick={downloadChecklist}>
              📥 Download Document Checklist
            </button>
            <button className="btn btn-primary" onClick={handleReturnDashboard}>
              ← Return to Dashboard (+15 Score)
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
