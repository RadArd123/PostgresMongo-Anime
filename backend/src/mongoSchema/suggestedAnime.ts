import mongoose from 'mongoose';
import type { ISuggestedAnime } from '../interfaces/suggestedAnime.types';

const SuggestedAnimeSchema = new mongoose.Schema<ISuggestedAnime>({
  // LEGĂTURA CU POSTGRES
  postgres_anime_id: { 
    type: Number, 
    required: true 
  },

  title: { type: String, required: true },      
  description: { type: String },                 
  rating: { type: Number },                      
  views_count: { type: String },                
  
  badge_label: { type: String, default: "Trending" }, 

  poster_image: { type: String, required: true }, 

},{
  timestamps: { createdAt: 'created_at', updatedAt: false }
});

export const SuggestedAnime = mongoose.model<ISuggestedAnime>('SuggestedAnime', SuggestedAnimeSchema);