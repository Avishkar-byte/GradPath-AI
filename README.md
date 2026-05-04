# GradPath AI

An AI-powered study abroad companion for Indian students. GradPath helps students discover universities, optimize their profiles, navigate education loans, and plan their journey — all through a unified, intelligent platform.

Built for TenzorX Hackathon 2025

---

## Architecture

- **Frontend** — React 19, Vite, React Router 7, Vanilla CSS
- **Backend** — Node.js, Express.js
- **AI** — Groq SDK (Llama 3.3 70B) for high-speed inference and streaming
- **Database** — Supabase (PostgreSQL)
- **Deployment** — Vercel (frontend), Render (backend)

## Core Engines

| Engine | Responsibility |
|---|---|
| ScoreEngine | Computes Dream Score (0–1000) across 5 weighted pillars |
| RecEngine | Cosine similarity university matching from 55+ programs |
| LoanEngine | NBFC loan eligibility, interest rate calculation, EMI simulation |
| ROIEngine | Break-even analysis and 10-year salary projections |

## Features

- **PathFinder** — AI-driven university discovery and profile matching
- **LoanOracle** — Conversational loan advisor with memory, eligibility check, and application flow
- **ScoreBooster** — Live SOP generation with streaming and AI review
- **GrowthEngine** — Autonomous user acquisition and engagement loop
- **Dream Score** — Gamified readiness score driving daily engagement
- **Referral System** — Viral loop with score rewards

## Getting Started

### Prerequisites

- Node.js 18+
- A Groq API key (free at [console.groq.com](https://console.groq.com))
- A Supabase project (free at [supabase.com](https://supabase.com)) — optional

### Setup

1. Clone the repository
```bash
git clone https://github.com/Avishkar-byte/GradPath-AI.git
cd GradPath-AI
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Fill in your GROQ_API_KEY and other values
```

4. Run in development
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:3001

### Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for AI inference |
| `PORT` | Server port (default: 3001) |
| `FRONTEND_URL` | Production frontend URL for CORS |
| `VITE_API_URL` | Backend API URL for the client |
| `VITE_SUPABASE_URL` | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key |

## Project Structure

```
gradpath-ai/
├── public/                     # Static assets
├── src/                        # React frontend
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Third-party client setup
│   ├── pages/                  # One file per route
│   ├── utils/                  # Pure utility functions
│   ├── App.jsx                 # Router + context
│   ├── main.jsx                # Entry point
│   └── index.css               # Design system + global styles
├── server/                     # Express backend
│   ├── ai/                     # Groq client setup
│   ├── engines/                # Computation engines
│   ├── routes/                 # Route handlers
│   ├── data/                   # JSON datasets
│   ├── middleware/             # Express middleware
│   └── index.js                # Server entry point
├── .env.example
├── .gitignore
├── package.json
└── vite.config.js
```

## Deployment

**Frontend (Vercel)**
- Connect the repository to a Vercel project
- Set framework preset to Vite
- Add all `VITE_` prefixed environment variables in Vercel dashboard

**Backend (Render)**
- Connect the repository to a Render web service
- Set start command to `node server/index.js`
- Add `GROQ_API_KEY`, `PORT`, and `FRONTEND_URL` in Render dashboard

## Known Limitations

- University dataset covers 55 programs across 11 countries. A production version would require a live database integration.
- Loan eligibility is rule-based, not connected to live NBFC APIs.
- Conversation sessions are stored in server memory and reset on server restart. A Redis layer would be needed for production.
- Supabase integration is optional — the app gracefully falls back to mock data when not configured.

## License

MIT
