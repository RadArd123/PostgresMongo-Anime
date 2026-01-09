import { Episode } from "../interfaces/episodes.types";
import { Request, Response } from "express";
import { episodeModel } from "../model/episodes.model";

export const createEpisode = async (req: Request, res: Response) => {

    try{
        const { anime_id, title, duration, episode_number, video_url } = req.body as Episode;
        if(!anime_id || !title || !episode_number || !video_url){
            return res.status(400).json({message: "anime_id, title, episode_number and video_url are required"});
        }
        const episode = await episodeModel.createEpisode(req.body);
        res.status(201).json({message: "Episode created successfully", episode: episode})
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error during episode creation." });
        }
};
export const getEpisodesByAnimeId = async (req: Request, res: Response) => {
    try{
        const {animeId} = req.params;
        const episodes = await episodeModel.getEpisodesByAnimeId(Number(animeId));
         if(!episodes || episodes.length === 0){
            return  res.status(404).json({message: "No episodes found for this anime."});
         }
        res.status(200).json({episodes: episodes});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error fetching episodes." });
    }
};
export const deleteEpisode = async (req: Request, res: Response) => {
    try{
       const {id} = req.params;
       const deleteEpisode = await episodeModel.deleteEpisode(Number(id));
         if(!deleteEpisode || deleteEpisode.length === 0){
            return res.status(404).json({message: "Episode not found"});
         }
        return res.status(200).json({message: "Episode deleted successfully"});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error deleting episode." });
    }
};
export const getEpisodeById = async (req: Request, res: Response) => {
    try{
       const {id} = req.params;
       const episode = await episodeModel.getEpisodeById(Number(id));
         if(!episode){
            return res.status(404).json({message: "Episode not found"});
         }
        res.status(200).json({episode: episode});
    }catch(err){
        console.error(err);
        res.status(500).json({ message: "Server error fetching episode." });
    }
};