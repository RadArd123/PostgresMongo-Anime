import { crudError } from '../utils/crudError';
import { Episode } from "../interfaces/episodes.types";
import { Request, Response } from "express";
import { episodeModel } from "../model/episodes.model";
import { notifyAnimeSubscribers } from "../utils/notificationHelper";
import { getIO } from "../config/socket";
import { pool } from "../config/db";

export const createEpisode = async (req: Request, res: Response) => {
    try{
        const { anime_id, title, duration, episode_number, video_url } = req.body as Episode;
        if(!anime_id || !title || !episode_number || !video_url){
            return res.status(400).json({message: "anime_id, title, episode_number and video_url are required"});
        }
        const episode = await episodeModel.createEpisode(req.body);

        // Notify all anime subscribers in real-time
        try {
          const animeResult = await pool.query(
            'SELECT title, img_url_icon FROM animes WHERE id = $1',
            [anime_id]
          );
          const anime = animeResult.rows[0];
          if (anime) {
            await notifyAnimeSubscribers(getIO(), Number(anime_id), {
              type: 'new_episode',
              title: `Episod Nou: ${anime.title}! 🎬`,
              message: `${title} - Episodul ${episode_number} este acum disponibil!`,
              actionUrl: `/anime/${anime_id}`,
              imageUrl: anime.img_url_icon || null,
            });
          }
        } catch (notifErr) {
          console.warn('Episode notification error:', notifErr);
        }

        res.status(201).json({message: "Episode created successfully", episode: episode})
    }catch(err){
        console.error(err);
        crudError(res, err, "Server error during episode creation.");
        }
};

export const getLatestEpisodes = async (req: Request, res: Response) => {
    try {
        const page = Math.max(1, Math.min(100000, parseInt(req.query.page as string) || 1));
        const limit = Math.max(1, Math.min(100, parseInt(req.query.limit as string) || 6));
        const offset = (page - 1) * limit;
        
        const episodes = await episodeModel.getLatestEpisodes(limit, offset);
        res.status(200).json({ episodes });
    } catch (err) {
        console.error(err);
        crudError(res, err, "Server error fetching latest episodes.");
    }
};
export const getEpisodesByAnimeId = async (req: Request, res: Response) => {
    try{
        const {animeId} = req.params;
        const episodes = await episodeModel.getEpisodesByAnimeId(Number(animeId));
        res.status(200).json({episodes: episodes || []});
    }catch(err){
        console.error(err);
        crudError(res, err, "Server error fetching episodes.");
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
        crudError(res, err, "Server error deleting episode.");
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
        crudError(res, err, "Server error fetching episode.");
    }
};

export const updateEpisode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updatedEpisode = await episodeModel.updateEpisode(Number(id), req.body);
        if (!updatedEpisode) {
            return res.status(404).json({ message: "Episode not found" });
        }
        res.status(200).json({ message: "Episode updated successfully", episode: updatedEpisode });
    } catch (err) {
        console.error(err);
        crudError(res, err, "Server error updating episode.");
    }
};
