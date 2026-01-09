
import {Request, Response} from 'express';
import {Favorites} from '../interfaces/favorites.types';
import { favoritesModel } from "../model/favorites.model";
import { ExtendedRequest } from '../interfaces/request.types';



export const addFavorites = async (req: ExtendedRequest , res: Response) => {
   try{
 
     const {anime_id} = req.body as Favorites;
        if(!anime_id){
            return res.status(400).json({message: "anime_id is required"});
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const favorites = await favoritesModel.add(req.user.id, anime_id);
      
        res.status(201).json({message: "Favorite added successfully", favorites: favorites});

   }catch(err){
      if (err instanceof Error && err.message === "Favorites already selected") {
            // Este eroarea noastră specifică!
            // Trimitem un status HTTP 409 Conflict (standardul pentru duplicate)
            return res.status(409).json({ message: "This anime is already in favorites list" });
        }
     console.error(err);
     res.status(500).json({message: "Server error while adding favorite"});
   }
};
export const getFavorites = async (req:ExtendedRequest, res: Response) => {
   try{
      if(!req.user || !req.user.id){
        return res.status(401).json({message: "Unauthorized"});
      }
      const favorites = await favoritesModel.getFavoritesByUser(req.user.id);
      res.status(200).json({message: "Favorites fetch with success", favorites: favorites})
   }catch(err){
      console.error(err);
      res.status(500).json({message: "Server error while getting favorites list"})
   }
}
export const deleteFavorites = async (req:ExtendedRequest, res: Response) => {
   try{
      const {animeId} = req.params;
      if(!req.user || !req.user.id){
        return res.status(401).json({message: "Unauthorized"});
      }
      const deletedFavorites = await favoritesModel.delete(req.user.id, Number(animeId));
      if(deletedFavorites.length === 0){
         return res.status(404).json({ message: "Favorite not found" });
      }
      res.status(200).json({message: "Deleted with success", deletedFavorites: deletedFavorites})
   }catch(err){
      console.error(err);
      res.status(500).json({message: "Server error while deleting favorites"});
   }
}
