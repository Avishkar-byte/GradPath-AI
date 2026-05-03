import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../App';
import { api } from '../utils/api';
import AgentOrchestration from '../components/AgentOrchestration';
import './Quiz.css';

const STEPS = [
  {
    id: 'academic',
    title: 'Academic Profile',
    icon: '📚',
    fields: [
      { key: 'gpa', label: 'Current GPA / Percentage', type: 'number', placeholder: 'e.g. 8.5 (out of 10)', step: 0.1, min: 0, max: 10 },
      { key: 'gpaScale', label: 'GPA Scale', type: 'select', options: [{ value: 10, label: 'Out of 10' }, { value: 4, label: 'Out of 4.0' }] },
      { key: 'undergradTier', label: 'Undergraduate Institution Tier', type: 'select', options: [
        { value: 'tier1', label: 'Tier 1 (IITs, NITs, BITS, Top 50 globally)' },
        { value: 'tier2', label: 'Tier 2 (Established state/private universities)' },
        { value: 'tier3', label: 'Tier 3 (Other recognized institutions)' },
        { value: 'other', label: 'Other' }
      ]},
      { key: 'greScore', label: 'GRE Score (leave blank if not taken)', type: 'number', placeholder: 'e.g. 320', min: 260, max: 340 },
      { key: 'gmatScore', label: 'GMAT Score (leave blank if not taken)', type: 'number', placeholder: 'e.g. 710', min: 200, max: 800 },
      { key: 'ieltsScore', label: 'IELTS Score', type: 'number', placeholder: 'e.g. 7.5', step: 0.5, min: 0, max: 9 },
      { key: 'toeflScore', label: 'TOEFL Score (alternative)', type: 'number', placeholder: 'e.g. 105', min: 0, max: 120 },
    ]
  },
  {
    id: 'financial',
    title: 'Financial Readiness',
    icon: '💰',
    fields: [
      { key: 'familyIncome', label: 'Annual Family Income (in Lakhs)', type: 'number', placeholder: 'e.g. 12', min: 0 },
      { key: 'hasCollateral', label: 'Collateral Available (Property/FD)', type: 'checkbox' },
      { key: 'hasSavings', label: 'Education Savings Fund Available', type: 'checkbox' },
      { key: 'cobilScore', label: 'Co-borrower CIBIL Score (approx)', type: 'number', placeholder: 'e.g. 750', min: 300, max: 900 },
      { key: 'scholarshipExpected', label: 'Expecting Scholarship / Aid', type: 'checkbox' },
    ]
  },
  {
    id: 'profile',
    title: 'Profile Strength',
    icon: '📄',
    fields: [
      { key: 'hasResume', label: 'Resume / CV Updated', type: 'checkbox' },
      { key: 'hasSOP', label: 'Statement of Purpose Drafted', type: 'checkbox' },
      { key: 'hasLOR', label: 'Letters of Recommendation Secured', type: 'checkbox' },
      { key: 'lorCount', label: 'Number of LORs', type: 'number', placeholder: '0-3', min: 0, max: 5, condition: 'hasLOR' },
      { key: 'hasWorkExperience', label: 'Work Experience', type: 'checkbox' },
      { key: 'workYears', label: 'Years of Work Experience', type: 'number', placeholder: 'e.g. 2', min: 0, max: 20, condition: 'hasWorkExperience' },
      { key: 'hasResearch', label: 'Research Publications / Papers', type: 'checkbox' },
      { key: 'hasProjects', label: 'Notable Projects / Portfolio', type: 'checkbox' },
      { key: 'hasExtracurriculars', label: 'Strong Extracurriculars', type: 'checkbox' },
    ]
  },
  {
    id: 'targets',
    title: 'Your Targets',
    icon: '🎯',
    fields: [
      { key: 'targetCountries', label: 'Target Countries', type: 'multiselect', options: ['USA', 'UK', 'Canada', 'Germany', 'Australia', 'Singapore', 'Switzerland', 'Netherlands', 'France', 'Sweden', 'India'] },
      { key: 'courseType', label: 'Degree Type', type: 'select', options: [
        { value: 'ms', label: 'MS / M.Tech / Masters' },
        { value: 'mba', label: 'MBA / PGP' },
        { value: 'phd', label: 'PhD' }
      ]},
      { key: 'intakeTimeline', label: 'Target Intake', type: 'select', options: [
        { value: 'fall2025', label: 'Fall 2025' },
        { value: 'spring2026', label: 'Spring 2026' },
        { value: 'fall2026', label: 'Fall 2026' },
        { value: 'spring2027', label: 'Spring 2027' },
      ]},
      { key: 'budgetRange', label: 'Total Budget (in Lakhs)', type: 'number', placeholder: 'e.g. 40', min: 5 },
    ]
  },
  {
    id: 'progress',
    title: 'Application Progress',
    icon: '🚀',
    fields: [
      { key: 'testsTaken', label: 'Entrance Tests Taken (GRE/GMAT/IELTS)', type: 'checkbox' },
      { key: 'applicationsStarted', label: 'Started University Applications', type: 'checkbox' },
      { key: 'applicationsSubmitted', label: 'Applications Submitted', type: 'number', placeholder: '0', min: 0, max: 20 },
      { key: 'offersReceived', label: 'Offers Received', type: 'number', placeholder: '0', min: 0, max: 20 },
      { key: 'visaApplied', label: 'Visa Application Submitted', type: 'checkbox' },
    ]
  }
];

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    gpaScale: 10,
    targetCountries: [],
    courseType: 'ms',
  });
  const [loading, setLoading] = useState(false);
  const [showOrchestration, setShowOrchestration] = useState(false);
  const { setUserData, setDreamScore, dreamScore } = useContext(AppContext);
  const navigate = useNavigate();

  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const updateField = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const toggleCountry = (country) => {
    setFormData(prev => {
      const countries = prev.targetCountries || [];
      return {
        ...prev,
        targetCountries: countries.includes(country)
          ? countries.filter(c => c !== country)
          : [...countries, country]
      };
    });
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await api.calculateDreamScore(formData);
      setUserData(formData);
      setDreamScore(result);
      localStorage.setItem('gradpath_user', JSON.stringify(formData));
      localStorage.setItem('gradpath_score', JSON.stringify(result));
      // Show agent orchestration instead of direct navigate
      setShowOrchestration(true);
    } catch (error) {
      console.error('Score calculation error:', error);
      // Fallback: navigate anyway
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const renderField = (field) => {
    // Conditional field
    if (field.condition && !formData[field.condition]) return null;

    if (field.type === 'checkbox') {
      return (
        <label className="checkbox-group quiz-checkbox" key={field.key}>
          <input
            type="checkbox"
            checked={!!formData[field.key]}
            onChange={e => updateField(field.key, e.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      );
    }

    if (field.type === 'select') {
      return (
        <div className="input-group" key={field.key}>
          <label>{field.label}</label>
          <select
            value={formData[field.key] || ''}
            onChange={e => updateField(field.key, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      );
    }

    if (field.type === 'multiselect') {
      return (
        <div className="input-group" key={field.key}>
          <label>{field.label}</label>
          <div className="multi-select-grid">
            {field.options.map(opt => (
              <button
                key={opt}
                type="button"
                className={`multi-select-chip ${(formData.targetCountries || []).includes(opt) ? 'selected' : ''}`}
                onClick={() => toggleCountry(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="input-group" key={field.key}>
        <label>{field.label}</label>
        <input
          className="input"
          type="number"
          placeholder={field.placeholder}
          step={field.step || 1}
          min={field.min}
          max={field.max}
          value={formData[field.key] || ''}
          onChange={e => updateField(field.key, e.target.value ? parseFloat(e.target.value) : '')}
        />
      </div>
    );
  };

  return (
    <div className="page quiz-page">
      {showOrchestration && (
        <AgentOrchestration
          dreamScore={dreamScore}
          onComplete={() => setShowOrchestration(false)}
        />
      )}
      <div className="container">
        <div className="quiz-wrapper animate-fade-in">
          {/* Progress */}
          <div className="quiz-progress">
            <div className="quiz-progress-bar">
              <div className="quiz-progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <span className="quiz-progress-label">Step {currentStep + 1} of {STEPS.length}</span>
          </div>

          {/* Step Indicators */}
          <div className="quiz-step-indicators">
            {STEPS.map((s, i) => (
              <button
                key={s.id}
                className={`step-indicator ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'completed' : ''}`}
                onClick={() => i <= currentStep && setCurrentStep(i)}
              >
                <span className="step-indicator-icon">{i < currentStep ? '✓' : s.icon}</span>
                <span className="step-indicator-label">{s.title}</span>
              </button>
            ))}
          </div>

          {/* Form */}
          <div className="quiz-form-card glass-strong animate-scale-in" key={currentStep}>
            <div className="quiz-step-header">
              <span className="quiz-step-icon">{step.icon}</span>
              <h2>{step.title}</h2>
              <p style={{ color: 'var(--text-tertiary)', marginTop: '4px' }}>
                {currentStep === 0 && 'Tell us about your academic background'}
                {currentStep === 1 && 'Help us assess your financial readiness'}
                {currentStep === 2 && 'How prepared is your application profile?'}
                {currentStep === 3 && 'Where do you want to study?'}
                {currentStep === 4 && "How far along are you in the process?"}
              </p>
            </div>

            <div className="quiz-fields">
              {step.fields.map(renderField)}
            </div>

            <div className="quiz-actions">
              {currentStep > 0 && (
                <button className="btn btn-ghost" onClick={handleBack}>
                  ← Back
                </button>
              )}
              <div style={{ flex: 1 }} />
              {currentStep < STEPS.length - 1 ? (
                <button className="btn btn-primary" onClick={handleNext}>
                  Next →
                </button>
              ) : (
                <button
                  className="btn btn-amber btn-lg"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="spinner" /> Calculating...
                    </span>
                  ) : (
                    '✦ Calculate My Dream Score'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
