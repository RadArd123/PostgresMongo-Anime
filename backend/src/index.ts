import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import { initDB } from './data/initDB';
// import {initMongoDB} from './config/mongodb';
import userRoute from './routes/auth.route';
import animeRoute from './routes/anime.route';
import episodesRoute from './routes/episodes.route';
import favoritesRoute from './routes/favorites.route';
import featuredRoute from './routes/featured.route';
import cookieParser from 'cookie-parser';
import reviewsRoute from './routes/reviews.route';
import watchlistRoute from './routes/watchlist.route'
import cors from 'cors';
import helmet from 'helmet';
import profilesRoute from './routes/profiles.route';
import adminRoute from './routes/admin.route';
import continueWatchingRoute from './routes/continueWatching.route';
import chatRoute from './routes/chat.route';
import donationsRoute from './routes/donations.route';
import { stripeWebhook } from './controllers/donations.controller';
import notificationRoute from './routes/notification.route';
import badgeRoute from './routes/badge.route';
import http from 'http';
import { initSocket } from './config/socket';
import { corsOptions, requireTrustedOrigin, validateSecurityConfig } from './config/security';
import { apiLimiter } from './middleware/rateLimits';
import path from 'node:path';
import fs from 'node:fs';
import { pool } from './config/db';

const app = express();
validateSecurityConfig();
if (process.env.TRUST_PROXY === '1') app.set('trust proxy', 1);
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: { directives: {
  imgSrc: ["'self'", 'https:', 'data:', 'blob:'],
  mediaSrc: ["'self'", 'https:', 'blob:'],
  frameSrc: ["'self'", 'https:'],
  fontSrc: ["'self'", 'https:', 'data:'],
  connectSrc: ["'self'", 'wss:'],
} } }));
app.use(cors(corsOptions));

app.get('/healthz', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.status(200).json({ status: 'ok' });
  } catch {
    res.status(503).json({ status: 'unavailable' });
  }
});

// Stripe webhook must be parsed as raw body
app.post('/api/donations/stripe-webhook', express.raw({ type: 'application/json' }), stripeWebhook);

app.use(express.json({ limit: '100kb' }));
app.use(express.urlencoded({ extended: true, limit: '100kb' }));
app.use(cookieParser());
app.use('/api', requireTrustedOrigin);
app.use('/api', apiLimiter);

app.use('/api/auth', userRoute);
app.use('/api/animes', animeRoute);
app.use('/api/episodes', episodesRoute);
app.use('/api/favorites', favoritesRoute);
app.use('/api/reviews', reviewsRoute);
app.use('/api/watchlist', watchlistRoute);
app.use('/api/anime-data', featuredRoute);
app.use('/api/profiles', profilesRoute);
app.use('/api/admin', adminRoute);
app.use('/api/continue-watching', continueWatchingRoute);
app.use('/api/chat', chatRoute);
app.use('/api/donations', donationsRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/badges', badgeRoute);

// Keep unknown API routes out of the client-side router.
app.use('/api', (_req, res) => { res.status(404).json({ message: 'Not found' }); });

if (process.env.SERVE_FRONTEND === 'true') {
  const frontendDirectory = path.resolve(__dirname, '../../frontend/dist');
  const entry = path.join(frontendDirectory, 'index.html');
  if (!fs.existsSync(entry)) throw new Error('Build the frontend before starting the combined server');
  app.use(express.static(frontendDirectory, { index: false }));
  app.get('/{*path}', (req, res, next) => {
    if (!req.accepts('html') || path.extname(req.path)) { next(); return; }
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(entry);
  });
}

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
    return;
  }

  console.error('Unhandled request error:', err.message);
  res.status(500).json({ message: 'Internal server error' });
});



async function start() {
  if (process.env.NODE_ENV !== 'production' || process.env.INIT_DB_ON_START === 'true') await initDB();
  httpServer.listen(PORT, () => {
    console.log(`Server & Live Socket listening on port ${PORT}`);
  });
}
start().catch(() => { console.error('Server startup failed'); process.exit(1); });
