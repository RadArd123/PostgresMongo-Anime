export interface IHeroAnime extends Document {
    postgres_anime_id: number;
    title: string;
    description: string;
    original_title?: string;
    rating: number;
    background_image: string;
    created_at: Date;
}