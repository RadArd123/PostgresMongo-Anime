export interface IAnimeNews extends Document {
    _id: string;
    title: string;
    sub_title?: string;
    body_text: string;  
    background_image: string;  
    tags?: string[];
    publish_date: Date;
    overlay_stats: {
        rating?: number;
        views_text?: string;
    };
    related_postgres_anime_id?: number | null;
}