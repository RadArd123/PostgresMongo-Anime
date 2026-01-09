export interface ISuggestedAnime extends Document {
    postgres_anime_id: number;
    title: string;
    description?: string;      
    views_count?: string;      
    rating?: number;           
    
    badge_label: string;     
    poster_image: string;
    
    created_at: Date;          
}
//cand scrii extends Document, ii spui ca acest obiect are campurile mele, dar are si toate metodele standard Mongoose.