import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dreamScoreRoutes from './routes/dreamScore.js';
import pathfinderRoutes from './routes/pathfinder.js';
import loanOracleRoutes from './routes/loanOracle.js';
import roiCalculatorRoutes from './routes/roiCalculator.js';
import timelineRoutes from './routes/timeline.js';
import growthEngineRoutes from './routes/growthEngine.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dream-score', dreamScoreRoutes);
app.use('/api/pathfinder', pathfinderRoutes);
app.use('/api/loan-oracle', loanOracleRoutes);
app.use('/api/roi', roiCalculatorRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/growth', growthEngineRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 GradPath AI server running on port ${PORT}`);
});
