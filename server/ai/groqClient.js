import Groq from 'groq-sdk';
import dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function chatWithGroq(messages, options = {}) {
  try {
    const completion = await groq.chat.completions.create({
      model: options.model || 'llama-3.3-70b-versatile',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      top_p: 1,
      stream: false,
    });
    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error.message);
    return null;
  }
}

export async function streamWithGroq(messages, options = {}) {
  try {
    const stream = await groq.chat.completions.create({
      model: options.model || 'llama-3.3-70b-versatile',
      messages,
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1024,
      top_p: 1,
      stream: true,
    });
    return stream;
  } catch (error) {
    console.error('Groq Stream error:', error.message);
    return null;
  }
}

export default groq;
