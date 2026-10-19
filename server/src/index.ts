import cors from 'cors';
import express from 'express';
import { agentsRouter } from './routes/agents.js';
import { favoritesRouter } from './routes/favorites.js';
import { inquiriesRouter } from './routes/inquiries.js';
import { propertiesRouter } from './routes/properties.js';

const app = express();
const port = Number(process.env.PORT ?? 4000);

/**
 * The preview serves the app through a dev-server proxy on a single origin, so CORS
 * is only needed for direct calls to the published API port. The allow-list is
 * built from the environment — never hardcoded, since the host changes per sandbox.
 */
const allowedOrigins = [
  process.env.BASE44_PUBLIC_HOST_SUFFIX ? `https://3000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}` : null,
  process.env.BASE44_PUBLIC_HOST_SUFFIX ? `https://4000-${process.env.BASE44_PUBLIC_HOST_SUFFIX}` : null,
  'http://localhost:3000',
  'http://localhost:5173',
].filter((origin): origin is string => origin !== null);

app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} is not allowed`));
    },
  }),
);

app.use('/api/properties', propertiesRouter);
app.use('/api/agents', agentsRouter);
app.use('/api/favorites', favoritesRouter);
app.use('/api/inquiries', inquiriesRouter);

app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(
  (
    error: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error('[api] request failed:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  },
);

app.listen(port, '0.0.0.0', () => {
  console.log(`[api] Horizon Properties API listening on http://0.0.0.0:${port}`);
});
