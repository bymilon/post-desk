import { Hono } from 'hono';
import { logger } from 'hono/logger';
import postsRouter from './features/posts';
import inspirationRouter from './features/inspiration';
import { authMiddleware } from './lib/auth';

const app = new Hono();

// Log all requests
app.use('*', logger());

// API Routes
app.get('/api/health', (c) => c.json({ status: 'ok' }));

// Secure API endpoints
app.use('/api/v1/*', authMiddleware);
app.route('/api/v1/posts', postsRouter);
app.route('/api/v1/inspirations', inspirationRouter);

export default app;
