import { Context } from 'hono';
import { GoogleGenAI } from '@google/genai';
import * as v from 'valibot';

// Ensure we have access to the Gemini Key from process.env
// The SDK will automatically pick up GEMINI_API_KEY from environment variables by default, 
// or we can explicitly pass it.
let ai: GoogleGenAI | null = null;
function getAI() {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not defined in the environment variables.');
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return ai;
}

export const generateDraftsHandler = async (c: Context) => {
  try {
    const body = await c.req.json();
    const result = v.safeParse(v.object({
      intent: v.string(),
      context: v.optional(v.string(), ''),
      postType: v.optional(v.string(), 'Insight'),
    }), body);

    if (!result.success) {
      return c.json({ error: 'Invalid payload', details: result.issues }, 400);
    }

    const { intent, context, postType } = result.output;

    const aiClient = getAI();
    
    // We request highly structured JSON response
    const prompt = `You are an expert ghostwriter creating X (Twitter) posts.
User's intent: ${intent}
Context provided: ${context}
Format/Framework: ${postType}

Generate 3 distinct post variations based on the intent, context, and requested format framework.

Constraints:
* ≤276 characters
* conversational, human tone
* strong hook in first line, fast pacing
* no fluff, no filler
* explicitly avoid “AI slop” (no generic LLM phrasing, no templated motivational tone, no engagement bait)
* keep it tight, context-aware to the thread

Output JSON adhering strictly to this schema:
{
  "drafts": [
    { "content": "post text...", "type": "standard | hook-heavy | thread-starter" }
  ]
}`;

    const response = await aiClient.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: "OBJECT",
          properties: {
            drafts: {
              type: "ARRAY",
              items: {
                type: "OBJECT",
                properties: {
                  content: { type: "STRING" },
                  type: { type: "STRING" },
                },
                required: ["content", "type"]
              }
            }
          },
          required: ["drafts"]
        }
      }
    });

    if (!response.text) {
      return c.json({ error: 'AI generated empty response' }, 500);
    }

    const draftsParsed = JSON.parse(response.text);

    return c.json({ drafts: draftsParsed.drafts });

  } catch (err: any) {
    if (err.message?.includes('GEMINI_API_KEY')) {
      return c.json({ error: 'Gemini API keys are not configured correctly on the server.' }, 500);
    }
    return c.json({ error: err.message || 'Internal server error' }, 500);
  }
};
