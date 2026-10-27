import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { connectToMongoDb, getDb, getDatabaseStatus, getBootstrapData } from './server/db/mongodb.js';
import competitionsRouter from './server/routes/competitions.routes.js';
import registrationsRouter from './server/routes/registrations.routes.js';
import galleryRouter from './server/routes/gallery.routes.js';
import authRouter from './server/routes/auth.routes.js';

// Prevent uncaught exceptions from terminating the process
process.on('uncaughtException', (err) => {
  console.error('[Server] Uncaught exception:', err);
});
process.on('unhandledRejection', (reason) => {
  console.error('[Server] Unhandled rejection:', reason);
});

const app = express();
const PORT = 3000;

app.use(compression());
app.use(cors());
app.use(express.json());

// High-speed bulk bootstrap endpoint (loads competitions, gallery, and registrations in 1 call)
app.get('/api/bootstrap', async (req, res) => {
  try {
    const data = await getBootstrapData();
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// API routes
app.use('/api/competitions', competitionsRouter);
app.use('/api/registrations', registrationsRouter);
app.use('/api/gallery', galleryRouter);
app.use('/api/auth', authRouter);

// System health and MongoDB status check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'PawExcellence Pet Show Platform',
    timestamp: new Date().toISOString(),
    database: getDatabaseStatus(),
  });
});

// Reference compatibility routes mirroring user's provided server.js
app.get('/getall', async (req, res) => {
  try {
    const db = getDb();
    const students = await db.collection('users').find().toArray();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

async function startServer() {
  await connectToMongoDb();

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // Error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('[Server Error Handler]:', err);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  });

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[PawExcellence] Pet Show server listening on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('[Server Listen Error]:', err);
  });
}

startServer();
