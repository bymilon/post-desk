import 'dotenv/config';
import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import postsRouter from '@/features/posts';
import inspirationRouter from '@/features/inspiration';
import { authMiddleware } from '@/lib/auth';

async function startServer() {
  const app = new Hono();

  // Log all requests
  app.use('*', logger());

  // API Routes
  app.get('/api/health', (c) => c.json({ status: 'ok' }));
  
  // Secure API endpoints
  app.use('/api/v1/*', authMiddleware);
  app.route('/api/v1/posts', postsRouter);
  app.route('/api/v1/inspirations', inspirationRouter);

  if (process.env.NODE_ENV === 'production') {
    // Serve standard generic static files
    app.use('/*', serveStatic({
      root: './dist'
    }));

    // Fallback SPA route for React router
    app.get('*', async (c) => {
      try {
        const indexHtml = fs.readFileSync(path.resolve('./dist/index.html'), 'utf-8');
        return c.html(indexHtml);
      } catch {
        return c.text('Not Found', 404);
      }
    });

    createServer(getRequestListener(app.fetch)).listen(3000, '0.0.0.0', () => {
      console.log('Production Hono server running on http://localhost:3000');
    });
  } else {
    // Development
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    const fetchListener = getRequestListener(app.fetch);

    createServer((req, res) => {
      if (req.url?.startsWith('/api')) {
        fetchListener(req, res);
      } else {
        vite.middlewares(req, res, () => {
          res.statusCode = 404;
          res.end('Not Found');
        });
      }
    }).listen(3000, '0.0.0.0', () => {
      console.log('Development Hono server running on http://localhost:3000');
    });
  }
}

startServer();
