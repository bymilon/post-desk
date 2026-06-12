import { Hono } from 'hono';
import { logger } from 'hono/logger';
import postsRouter from './features/posts';
import inspirationRouter from './features/inspiration';
import copilotRouter from './features/copilot';
import { authMiddleware } from './lib/auth';

const app = new Hono();

// Log all requests
app.use('*', logger());

// API Routes
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// API Version 1
const v1 = new Hono();
v1.use('/*', authMiddleware);
v1.route('/posts', postsRouter);
v1.route('/inspirations', inspirationRouter);
v1.route('/copilot', copilotRouter);

app.route('/api/v1', v1);

export default app;
