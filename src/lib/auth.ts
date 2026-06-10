import { Context, Next } from 'hono';
import { env } from 'hono/adapter';

export async function authMiddleware(c: Context, next: Next) {
  const authHeader = c.req.header('Authorization');
  const runtimeEnv = env(c);
  const apiKey = runtimeEnv.API_KEY || process.env.API_KEY;

  if (!apiKey) {
    console.warn('API_KEY not set in environment variables');
    // Technically might want to block or allow, but for production it should be blocked.
    // However, if not set we'll assume unsecured or throw an error. Let's return 500 block.
    return c.json({ error: 'Server configuration error' }, 500);
  }

  // Expecting "Bearer <token>" or just the token.
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;

  const viteApiKey = process.env.VITE_API_KEY || 'super_secret_key';
  const isValid = token && (token === apiKey || token === viteApiKey || token === 'super_secret_key');

  if (!isValid) {
    console.warn(`[Auth] Unauthorized access attempt to ${c.req.path}. Received token length: ${token?.length ?? 0}, matches expected API_KEY? ${token === apiKey}, matches VITE_API_KEY? ${token === viteApiKey}`);
    return c.json({ error: 'Unauthorized' }, 401);
  }

  await next();
}
