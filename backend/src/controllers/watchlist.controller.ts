import { watchlistsModel } from "../model/watchlist.model";
import {Request, Response} from 'express';
import { ExtendedRequest } from '../interfaces/request.types';


export const addWatchlist = async (req: ExtendedRequest, res:Response)=>{
    try{
        const {animeId} = req.body as {animeId: number}
        if(!req.user || !req.user.id){
            res.status(401).json({message:"You must be authenticated"})
        }
        const userId = req.user?.id;
        const watchlist = await watchlistsModel.add(userId, animeId);
        res.status(201).json({message: "Anime added successfully to the Watchlist", watchlist: watchlist})
    
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error while adding in the watchlist"})
    }
}
export const getWatchlist = async (req:ExtendedRequest, res:Response) => {
    try{
        if(!req.user || !req.user.id){
            res.status(401).json({message:"You must be authenticated"})
            
        }
        const userId = req.user?.id;
        const watchlist = await watchlistsModel.getById(userId);
        res.status(200).json({message:"Watchlist fetch with success", watchlist: watchlist})
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error while getting the watchlist"})
    }
}
export const removeWatchlist = async (req:ExtendedRequest, res:Response) => {
    try{
        const {animeId} = req.params
        if(!req.user || !req.user.id){
            res.status(401).json({message:"You must be authenticated"})
        }
        const userId = req.user?.id;
         const watchlist = await watchlistsModel.remove(userId, Number(animeId));
         res.status(200).json({message: "Removed with success from watchlist", watchlist: watchlist})
    }catch(err){
        console.error(err);
        res.status(500).json({message:"Internal server error while removing from the watchlist"})
    }
}
    