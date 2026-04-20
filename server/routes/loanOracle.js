import { Router } from 'express';
import { checkEligibility, calculateLoanDetails, getDocumentChecklist, getLenderOffers } from '../engines/loanEngine.js';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

router.post('/eligibility', (req, res) => {
  try {
    const eligibility = checkEligibility(req.body);
    const loanDetails = calculateLoanDetails(req.body);
    const documents = getDocumentChecklist(req.body);
    const lenders = getLenderOffers(req.body, loanDetails);

    res.json({ eligibility, loanDetails, documents, lenders });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { messages, profile } = req.body;

    const systemPrompt = `You are LoanOracle, GradPath AI's education loan specialist agent. You help Indian students understand and navigate education loan options for studying abroad or in India.

You have deep knowledge of:
- NBFC and bank education loan eligibility criteria
- Interest rates (typically 9.5% - 14.5%)
- Collateral requirements (usually above ₹20-50L)
- EMI calculations and repayment options
- Required documents
- Moratorium periods (during study + 6 months post)
- Tax benefits under Section 80E

${profile ? `Student Profile:
- Loan Amount Needed: ₹${profile.loanAmount ? (profile.loanAmount / 100000).toFixed(1) + 'L' : 'Not specified'}
- Co-borrower Income: ₹${profile.coborrowerIncome || 'Not specified'}L/year
- CIBIL Score: ${profile.cibilScore || 'Not provided'}
- Collateral: ${profile.hasCollateral ? 'Available' : 'Not available'}
- University Ranking: ${profile.universityRanking || 'Not specified'}` : ''}

Respond in a friendly, clear, and professional tone. Use bullet points where helpful. Keep responses concise but thorough. Always be encouraging while being realistic. If asked about specific numbers, provide ranges rather than exact figures. Nudge the student toward checking their eligibility using the tool on the platform.`;

    const completion = await chatWithGroq([
      { role: 'system', content: systemPrompt },
      ...messages
    ], { temperature: 0.6, maxTokens: 800 });

    if (completion) {
      res.json({ reply: completion });
    } else {
      res.json({ reply: "I'm here to help you navigate education loan options! Could you tell me more about your plans — which country and program are you considering? I can help estimate your loan eligibility and walk you through the process." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
