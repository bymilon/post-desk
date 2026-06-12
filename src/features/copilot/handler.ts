import { Context } from 'hono';
import { GoogleGenAI } from '@google/genai';
import * as v from 'valibot';
import { Result, Ok, Err } from 'ts-results-es';
import { InternalServerError, ValidationError } from '@/lib/errors';
import { CreateDraftCommandSchema } from './schema';

// Ensure we have access to the Gemini Key from process.env
let ai: GoogleGenAI | null = null;
function getAI(): Result<GoogleGenAI, InternalServerError> {
  if (!ai) {
    if (!process.env.GEMINI_API_KEY) {
      return Err(new InternalServerError('GEMINI_API_KEY is not defined in the environment variables.'));
    }
    ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return Ok(ai);
}

export const generateDraftsHandler = async (c: Context) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON payload' }, 400);
  }

  const parseResult = v.safeParse(CreateDraftCommandSchema, body);

  if (!parseResult.success) {
    const errorDetails = parseResult.issues.map(i => ({ path: i.path?.map(p => p.key).join('.'), message: i.message }));
    const validationError = new ValidationError('Invalid payload', errorDetails);
    return c.json({ error: validationError.message, details: validationError.details, tag: validationError._tag }, 400);
  }

  const { intent, context, postType } = parseResult.output;

  const aiClientResult = getAI();
  if (aiClientResult.isErr()) {
    const err = aiClientResult.error;
    return c.json({ error: err.message, tag: err._tag }, 500);
  }
  const aiClient = aiClientResult.value;
  
  // We request highly structured JSON response
  const prompt = `You are an expert, world-class X (Twitter) ghostwriter specializing in tech, marketing, and founder copy.
Your current objective is to write 3 engaging, highly professional, and perfectly formatted variations of a post based on the following inputs:

User's Intent/Topic: "${intent}"
Additional Context: "${context || 'None'}"
Target Post Type/Style: "${postType}"

=== STRUCTURE & FORMATTING RULES ===
1. VISUAL WHITE SPACE IS KEY: Never output a single block of continuous text.
2. LINE BREAKS: Use actual line-breaks (representing custom newline spaces via \\n) between paragraphs/ideas.
3. TYPICAL HIGH-PERFORMANCE X STRUCTURE:
   - Line 1: Clear, crisp scroll-stopping hook (never cheesy, no clickbait or predictable questions like "Have you ever wondered...?").
   - Line 2: [Blank space / Double newline]
   - Line 3-5: Rich value, punchy argument, structured list, or narrative climax. If listing items, use concise custom bullet points on their own separate lines (using a single newline per item).
   - Line 6: [Blank space / Double newline]
   - Line 7: Deep takeaway, action point, or sharp conclusion.
4. EXPLICIT WHITESPACE INJECTION: Make sure to embed concrete newline characters (\\n) directly into the generated JSON "content" property to ensure correct rendering.

=== CONTENT CONSTRAINTS ===
- Length strictly under 280 characters.
- Zero AI Slop: Absolutely forbid words like "In today's fast-paced world", "Introducing...", "Revolutionary", "Game-changer", "Crucial", "Foster", "Dive deep", "delve", "testament", "tapestry", "beacon".
- Authentic human voice: write with punchy, high-agency language, sentence fragments, and conversational cadence.

Output JSON adhering strictly to this schema:
{
  "drafts": [
    { 
      "content": "A high-performing post content string utilizing embedded \\n line breaks for crisp, vertical spacing and aesthetic formatting.", 
      "type": "Hook-heavy | Minimalist | Analytical | Narrative-starter" 
    }
  ]
}`;

  try {
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
      const err = new InternalServerError('AI generated empty response');
      return c.json({ error: err.message, tag: err._tag }, 500);
    }

    const draftsParsed = JSON.parse(response.text);

    return c.json({ drafts: draftsParsed.drafts });

  } catch (rawErr: any) {
    if (rawErr.message?.includes('GEMINI_API_KEY')) {
       const err = new InternalServerError('Gemini API keys are not configured correctly on the server.');
       return c.json({ error: err.message, tag: err._tag }, 500);
    }
    const err = new InternalServerError(rawErr.message ?? 'Error communicating with AI service');
    return c.json({ error: err.message, tag: err._tag }, 500);
  }
};
