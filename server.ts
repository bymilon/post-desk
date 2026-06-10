import 'dotenv/config';
import { getRequestListener } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createServer } from 'http';
import path from 'path';
import fs from 'fs';
import app from './src/router';

async function startServer() {
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
