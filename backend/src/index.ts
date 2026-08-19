import express from 'express';
import dotenv from 'dotenv';
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
import fileUpload from 'express-fileupload';
import cors from 'cors';
import profilesRoute from './routes/profiles.route';
import adminRoute from './routes/admin.route';
import continueWatchingRoute from './routes/continueWatching.route';
import chatRoute from './routes/chat.route';
import donationsRoute from './routes/donations.route';
import http from 'http';
import { initSocket } from './config/socket';

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
initSocket(httpServer);

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: 'uploads/',
  createParentPath: true,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }
}));
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

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



initDB().catch(err => console.error('DB init failed:', err));

httpServer.listen(PORT, () => {
  console.log(`Server & Live Socket running at http://localhost:${PORT}`);
});


