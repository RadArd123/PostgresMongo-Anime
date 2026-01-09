import mongoose from 'mongoose';
import type { IAnimeNews } from '../interfaces/animeNews.types';

const AnimeNewsSchema = new mongoose.Schema<IAnimeNews>({

  title: { type: String, required: true },      
  sub_title: { type: String },                  
  
  body_text: { type: String, required: true },  
  

  background_image: { type: String, required: true },
  tags: [{ type: String }],                     
  

  publish_date: { type: Date, default: Date.now }, 

  overlay_stats: {
    rating: Number,   
    views_text: String 
  },

  // (Opțional) Dacă știrea e despre un anime specific, legăm de Postgres
  related_postgres_anime_id: { type: Number, default: null } 
});

export const AnimeNews = mongoose.model<IAnimeNews>('AnimeNews', AnimeNewsSchema);