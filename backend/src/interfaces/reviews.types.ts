export interface Reviews{
    id: number,
    anime_id: number,
    user_id: number,
    rating: number,
    comment?: string,
    created_at?: Date,
}