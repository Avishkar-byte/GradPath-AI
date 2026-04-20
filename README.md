<div align="center">

# 🎓 GradPath AI

### *Your Education Journey, Supercharged*

**AI-First Student Engagement Ecosystem for Education Discovery & Financing**

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_Now-4a7c6f?style=for-the-badge)](https://gradpath-ai.vercel.app)
![Tech Stack](https://img.shields.io/badge/Stack-React_+_Node_+_Groq-c4935a?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-Llama_3.3_70B-5a9a88?style=for-the-badge)

---

*An AI-powered platform that guides Indian students through university discovery, application planning, and education loan financing — with 4 specialized AI agents and a gamified Dream Score system.*

</div>

---

## 🌟 What Makes GradPath AI Different

Existing platforms (Yocket, LeapScholar, GradRight) are essentially **directories with a chatbot bolted on**. GradPath AI's differentiator:

| Feature | Competitors | GradPath AI |
|---------|------------|-------------|
| Architecture | Monolithic chatbot | **4 Specialized AI Agents** |
| Engagement | Static profiles | **Dream Score (0-1000)** gamification |
| Loan Integration | Separate portals | **Seamless LoanOracle** conversation |
| Personalization | Basic filtering | **Cosine similarity matching** |
| Growth | Manual marketing | **Zero-human AI growth loop** |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    GradPath AI Platform                   │
├─────────────────┬───────────────────┬───────────────────┤
│   🧭 PathFinder │   💰 LoanOracle   │   ⚡ ScoreBooster │
│   University     │   Loan Eligibility │   AI Tips &       │
│   Matching AI    │   & Chat AI        │   Recommendations │
├─────────────────┴───────────────────┴───────────────────┤
│                  ✦ Dream Score Engine                     │
│            Rule-based 0-1000 readiness scoring           │
├─────────────────────────────────────────────────────────┤
│              🤖 GrowthEngine (Bonus)                     │
│     Zero-human intervention content & nudge generation   │
├─────────────────────────────────────────────────────────┤
│                     AI Layer                             │
│     Groq (Llama 3.3 70B) · Cosine Similarity · Rules    │
├─────────────────────────────────────────────────────────┤
│                    Data Layer                            │
│    55+ Universities · NBFC Rules · Salary Benchmarks    │
└─────────────────────────────────────────────────────────┘
```

---

## ✦ Core Features

### 1. Dream Score (0-1000) — The Stickiness Engine
> *A gamified readiness number that students obsessively want to improve*

<table>
<tr>
<td width="50%">

- **5 Weighted Pillars**: Academic (25%), Financial (25%), Profile (20%), Alignment (15%), Progress (15%)
- **Tier System**: Early Explorer → Rising Applicant → Strong Contender → Top Performer → Dream Ready
- **Streak Counter**: Daily engagement tracking
- **ScoreBooster Tips**: AI-generated actions with point predictions

</td>
<td width="50%">

```
Tier Breakdown:
🌱 0-300   Early Explorer
🚀 301-550 Rising Applicant
💪 551-750 Strong Contender
⭐ 751-900 Top Performer
🏆 901-1000 Dream Ready
```

</td>
</tr>
</table>

### 2. 🧭 PathFinder — AI University Matching
- **Cosine similarity** matching against 55+ university programs
- **11 countries**: USA, UK, Canada, Germany, Australia, Singapore, Switzerland, Netherlands, Sweden, France, India
- **Match categories**: Safe / Moderate / Ambitious
- **AI Insights**: Groq-powered personalized narratives for top matches

### 3. 💰 LoanOracle — Conversational Loan AI
- **Eligibility Engine**: NBFC rule-based assessment (age, CIBIL, income, collateral)
- **Dynamic Interest Rates**: 9.5% - 14.5% based on profile strength
- **3 Lender Offers**: Personalized rate comparisons
- **EMI Calculator**: Interactive slider with repayment scenario visualization
- **Document Checklist**: Auto-generated based on loan type
- **AI Chat**: Groq-powered conversational loan guidance

### 4. 📊 ROI Calculator
- **Cost vs Earnings**: Visual break-even analysis over 10 years
- **Salary Projections**: Year 1/3/5/10 with field-specific growth curves
- **INR Conversion**: Real-time with embedded exchange rates
- **Country-specific Data**: Living costs, visa fees, work permits for 11 countries

### 5. 📅 Application Timeline
- **AI-generated** month-by-month roadmap using Groq LLM
- **Interactive Checkpoints**: Click to mark tasks as complete
- **Priority System**: High/Medium/Low with visual indicators
- **Progress Tracking**: Overall completion percentage

### 6. 🤖 GrowthEngine (Bonus — Zero Human Loop)
- **Smart Nudges**: AI-generated WhatsApp-style engagement messages
- **Blog Generation**: Auto-created content snippets
- **Referral Engine**: Dynamic codes with Dream Score point rewards
- Demonstrates full **acquisition → engagement → conversion** lifecycle managed by AI

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React + Vite | Fast SPA with hot reload |
| **Styling** | Vanilla CSS | Premium dark theme, glassmorphism, micro-animations |
| **Backend** | Express.js (Node) | REST API with 6 route modules |
| **Primary LLM** | Groq (Llama 3.3 70B) | ~500 tok/sec chat responses |
| **Recommendation** | Cosine Similarity | Vector matching on JSON dataset |
| **Scoring** | Rule-based Engine | Deterministic, explainable Dream Score |
| **Loan Engine** | NBFC Rule Engine | EMI, eligibility, interest rate calculation |
| **Deployment** | Vercel + Render | Frontend + Backend hosting |

---

## 🚀 Quick Start

```bash
# Clone
git clone https://github.com/YOUR_USERNAME/gradpath-ai.git
cd gradpath-ai

# Install
npm install

# Configure
cp .env.example .env
# Add your GROQ_API_KEY to .env

# Run (starts both frontend + backend)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 📁 Project Structure

```
├── server/                    # Express.js Backend
│   ├── ai/groqClient.js       # Groq API wrapper
│   ├── engines/
│   │   ├── scoreEngine.js     # Dream Score calculator
│   │   ├── recEngine.js       # Cosine similarity recommender
│   │   ├── loanEngine.js      # NBFC loan rule engine
│   │   └── roiEngine.js       # ROI computation
│   ├── routes/                # 6 API route modules
│   └── data/                  # University, loan, salary datasets
├── src/                       # React Frontend
│   ├── pages/                 # 7 page components
│   ├── components/            # Reusable UI components
│   ├── utils/                 # API client, helpers
│   └── index.css              # Design system
└── index.html                 # Entry point with SEO meta
```

---

## 🎯 Judging Criteria Coverage

| Criteria | How We Deliver |
|----------|---------------|
| **Innovation & Creativity** | Dream Score gamification + 4-agent architecture — no competitor has this |
| **AI Integration & Execution** | Groq LLM chat, cosine similarity recs, rule-based scoring, AI content gen |
| **User Experience** | Premium dark UI, animated score ring, glassmorphism, micro-interactions, streaks |
| **Business Relevance** | Clear funnel: Dream Score → PathFinder → LoanOracle → Loan Application |
| **Prototype Quality** | Full-stack working demo with all flows functional end-to-end |
| **Bonus: Zero-Human Loop** | GrowthEngine panel: auto-generated nudges, blogs, referrals |

---

## 📊 Data Coverage

- **55+ University Programs** across MS CS, MBA, Data Science, Engineering
- **11 Countries** with living costs, visa fees, work permit details
- **3 Simulated Lenders** with NBFC-realistic criteria
- **Salary Progressions** by field (CS, MBA, Data Science, Engineering)
- **Exchange Rates** for USD, GBP, EUR, CAD, AUD, CHF, SGD, SEK, INR

---

<div align="center">

### Built with 🤖 AI-first thinking for the future of education

**GradPath AI** — Awareness → Engagement → Trust → Conversion

</div>
