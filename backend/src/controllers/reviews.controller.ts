import {Request, Response} from 'express';
import {Reviews} from '../interfaces/reviews.types'
import {reviewsModel} from '../model/reviews.model';
import { ExtendedRequest } from '../interfaces/request.types';


export const createReviews = async(req:ExtendedRequest, res:Response)=>{
    try{
       
        if(!req.user || !req.user.id ){
            return res.status(400).json({message:"You must be authenticated"})
        }
        const userId = req.user.id;

         const {anime_id,rating, comment} = req.body as Reviews;
        if(!anime_id || !rating){
            return res.status(400).json({message: "Anime ID and rating are required"})
        }
        if (typeof rating !== 'number' || rating < 1 || rating > 5) {
             return res.status(400).json({message: "Rating must be a number between 1 and 5"});
        }
        const reviewData = {
            anime_id: anime_id,
            rating: rating,
            comment: comment // 'comment' va fi undefined/null dacă lipsește, ceea ce e ok
        };
        const reviews = await reviewsModel.create(userId, reviewData as Reviews);
        res.status(201).json({message: "Review created succesfully ",review: reviews})
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error while adding reviews"})
    }
}
export const getReviewsByAnimeId = async(req:Request, res:Response) => {
    try{
        const {animeId} = req.params;
        const reviews = await reviewsModel.getByAnimeId(Number(animeId));
        if(!reviews){
            res.status(400).json({message: "No reviews"})
        }
        res.status(200).json({message: "reviews fetch succesful", reviews: reviews})
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error while getting reviews"})
    }
}
export const deleteReviews = async(req:ExtendedRequest, res: Response) => {
    try{
        if(!req.user || !req.user.id ){
           
            return res.status(401).json({message:"You must be authenticated"}); 
        }
        const userId = req.user?.id
        const {id} = req.params

        const deletedReviews = await reviewsModel.deletedById(userId, Number(id));
        if (!deletedReviews) {
            return res.status(404).json({message: "Review not found"});
        }

        return res.status(200).json({message: "Review deleted successfully"});
    
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Server error while deleting reviews"})
    }
}