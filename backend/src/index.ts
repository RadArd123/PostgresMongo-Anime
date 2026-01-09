import express from 'express';
import dotenv from 'dotenv';
// import {initDB} from './data/initDB';
import {initMongoDB} from './config/mongodb';
import userRoute from './routes/auth.route';
import animeRoute from './routes/anime.route';
import episodesRoute from './routes/episodes.route';
import favoritesRoute from './routes/favorites.route';
import animeMongoRoute from './routes/animeMongo.route';
import cookieParser from 'cookie-parser';
import reviewsRoute from './routes/reviews.route';
import watchlistRoute from './routes/watchlist.route'
import fileUpload from 'express-fileupload';
import cors from 'cors';

dotenv.config();

const app = express();
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
app.use('/api/anime-data', animeMongoRoute);


initMongoDB().then(() => {
    app.listen(PORT, () => {
     console.log(`Server running at http://localhost:${PORT}`);
});
});


    