import {create} from 'zustand';
import  {axiosInstance} from '../lib/axios';
import type { ReviewResponse, Reviews } from '../interfaces/reviews.types.ts';

export const useReviewsStore = create<ReviewResponse>((set) => ({
   
   currentAnimeReviews: [],
    error: null,
    isLoading: false,
    message: null,

    createReview: async (reviewData: Partial<Reviews>): Promise<void> => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.post('/reviews/createReviews', reviewData);
            set((state) => ({currentAnimeReviews: [...state.currentAnimeReviews, response.data.review], message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Review creation failed'});
        } finally {
            set({isLoading: false});
        }
    },
    fetchReviewsByAnimeId: async (animeId: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.get(`/reviews/getReviews/${animeId}`);
            set({currentAnimeReviews: response.data.reviews});
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to fetch reviews'});
        } finally {
            set({isLoading: false});
        }
    },
    deleteReview : async (id: number) => {
        set({isLoading: true, error: null});
        try{
            const response = await axiosInstance.delete(`/reviews/deleteReviews/${id}`);
            set((state) => ({currentAnimeReviews: state.currentAnimeReviews.filter((review) => review.id !== id),message: response.data.message}));
        }catch (err: any) {
            set({error: err.response?.data?.message || 'Failed to delete review'}); 
        } finally {
            set({isLoading: false});
        }
    },
}));