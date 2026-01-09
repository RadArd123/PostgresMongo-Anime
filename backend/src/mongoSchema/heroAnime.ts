import mongoose from 'mongoose';
import { IHeroAnime } from '../interfaces/heroAnime.types';

const HeroAnimeSchema = new mongoose.Schema<IHeroAnime>({
  // LEGĂTURA CU POSTGRES (Vital pentru butonul "Start Watching")
  postgres_anime_id: { 
    type: Number, 
    required: true,
    unique: true 
  },


  title: { type: String, required: true },      
  original_title: { type: String },                
  description: { type: String, required: true },  
  rating: { type: Number, default: 0 },           

  background_image: { type: String, required: true }, 
  

  created_at: { type: Date, default: Date.now }
});

export const HeroAnime = mongoose.model<IHeroAnime>('HeroAnime', HeroAnimeSchema);