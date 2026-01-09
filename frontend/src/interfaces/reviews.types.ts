export interface Reviews{
    id: number,
    anime_id: number,
    user_id: number,
    rating: number,
    comment?: string,
    created_at?: Date,
}
export interface ReviewResponse{
 
   currentAnimeReviews: Reviews[];
    error?: string | null;
    isLoading: boolean;
    message?: string | null;
    createReview?: (reviewData: Partial<Reviews>) => Promise<void>;
    fetchReviewsByAnimeId?: (animeId: number) => Promise<void>;
    deleteReview?: (id: number) => Promise<void>;
    getReviewById?: (id: number) => Promise<void>;
}