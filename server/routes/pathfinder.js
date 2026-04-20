import { Router } from 'express';
import { getRecommendations, getAllUniversities } from '../engines/recEngine.js';
import { chatWithGroq } from '../ai/groqClient.js';

const router = Router();

router.post('/recommend', async (req, res) => {
  try {
    const recommendations = getRecommendations(req.body, { maxResults: 12 });

    // Generate AI narrative for top 3
    if (recommendations.length > 0) {
      const top3 = recommendations.slice(0, 3);
      const prompt = `You are GradPath AI's PathFinder agent. Given these top 3 university matches for a student, write a brief, encouraging 2-3 sentence personalized insight for EACH university explaining why it's a great fit. Be specific about the program strengths.

Student Profile: GPA ${req.body.gpa || 'N/A'}/10, GRE ${req.body.greScore || 'N/A'}, Target: ${req.body.courseType || 'MS'}

Universities:
${top3.map((u, i) => `${i + 1}. ${u.name} - ${u.course} (${u.country}) - Match: ${u.matchScore}%`).join('\n')}

Respond in JSON format: [{"university": "name", "insight": "..."}]`;

      const aiResponse = await chatWithGroq([{ role: 'user', content: prompt }], { temperature: 0.6 });

      if (aiResponse) {
        try {
          const insights = JSON.parse(aiResponse.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
          top3.forEach((uni, i) => {
            if (insights[i]) uni.aiInsight = insights[i].insight;
          });
        } catch (e) {
          // If AI response parsing fails, skip insights
        }
      }
    }

    res.json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/universities', (req, res) => {
  res.json(getAllUniversities());
});

export default router;
