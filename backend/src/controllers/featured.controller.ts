import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { uploadToCloudinary } from "../scripts/uploadToCloudinary";
import * as featuredModel from "../model/featured.model";

export const addHeroAnime = async (req: Request, res: Response) => {
  let bgFile: UploadedFile | undefined;
  try {
    if (!req.files || !req.files.background_image) {
      return res
        .status(400)
        .json({ message: "background_image file is required" });
    }
    bgFile = req.files.background_image as UploadedFile;

    const imageUrl = await uploadToCloudinary(bgFile);

    const { postgres_anime_id, title, description, original_title, rating } =
      req.body;

    if (!postgres_anime_id || !title || !description || !rating) {
      return res
        .status(400)
        .json({
          message:
            "postgres_anime_id, title, description and rating are required",
        });
    }

    const heroAnime = await featuredModel.createHeroAnime(
      postgres_anime_id,
      title,
      description,
      original_title || null,
      Number(rating),
      imageUrl
    );

    res
      .status(201)
      .json({
        message: "Hero Anime created successfully",
        heroAnime,
      });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error during Hero Anime creation." });
  }
};

export const getHeroAnimes = async (req: Request, res: Response) => {
  try {
    const heroAnimes = await featuredModel.fetchHeroAnimes();
    res.status(200).json(heroAnimes);
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error during fetching Hero Animes." });
  }
};

export const removeHeroAnime = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedCount = await featuredModel.deleteHeroAnime(id);
    
    if (deletedCount === 0) {
      return res.status(404).json({ message: "Hero Anime not found" });
    }
    res.status(200).json({ message: "Hero Anime deleted successfully" });
  } catch (err: any) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Server error during deleting Hero Anime." });
  }
};

export const addSuggestedAnime = async (req: Request, res: Response) => {
  let posterFile: UploadedFile | undefined;
  try {
    if (!req.files || !req.files.poster_image) {
      return res.status(400).json({ message: "poster_image file is required" });
    }
    posterFile = req.files.poster_image as UploadedFile;

    const imageUrl = await uploadToCloudinary(posterFile);
    const {postgres_anime_id, title, description, views_count, rating, badge_label} = req.body;

    if (!postgres_anime_id || !title ) {
        return res.status(400).json({ message: "postgres_anime_id and title are required" });
    }
    
    const suggestedAnime = await featuredModel.createSuggestedAnime(
        postgres_anime_id, 
        title, 
        description || null, 
        views_count || null, 
        rating ? Number(rating) : null, 
        badge_label || 'Trending', 
        imageUrl
    );

    res.status(201).json({message: "Suggested Anime created successfully", suggestedAnime});

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error during Suggested Anime creation." });
  }
};

export const getSuggestedAnimes = async (req: Request, res: Response) => {
    try{
        const suggestedAnimes = await featuredModel.fetchSuggestedAnimes();
        res.status(200).json(suggestedAnimes);
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during fetching Suggested Animes." });
    }
}

export const removeSuggestedAnime = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const deletedCount = await featuredModel.deleteSuggestedAnime(id);
        if(deletedCount === 0){
            return res.status(404).json({ message: "Suggested Anime not found" });
        }
        res.status(200).json({ message: "Suggested Anime deleted successfully" });
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during deleting Suggested Anime." });
    }
}

export const addAnimeNews = async (req: Request, res: Response) => {
    let bgFile: UploadedFile | undefined;
    try {
        if (!req.files || !req.files.background_image) {
            return res.status(400).json({ message: "background_image file is required" });
        }
        bgFile = req.files.background_image as UploadedFile;

        const imageUrl = await uploadToCloudinary(bgFile);

        const { title, sub_title, body_text, related_postgres_anime_id, rating, views_text, tags } = req.body;
        if (!title || !body_text) {
            return res.status(400).json({ message: "title and body_text are required" });
        }
        const parsedTags: string[] = [];
        if(tags){
            if (typeof tags === 'string') {
                parsedTags.push(...tags.split(',').map(tag => tag.trim()));
            } else if (Array.isArray(tags)) {
                parsedTags.push(...tags.map(tag => tag.trim()));
            }
        }
        
        const animeNews = await featuredModel.createAnimeNews(
             title,
             sub_title || null,
             body_text,
             imageUrl,
             parsedTags.length > 0 ? parsedTags : null,
             related_postgres_anime_id ? Number(related_postgres_anime_id) : null,
             rating ? Number(rating) : null,
             views_text || null
        );
        
        // Format to match old structure for frontend compatibility
        const formattedNews = {
            ...animeNews,
            overlay_stats: {
                rating: animeNews.overlay_rating,
                views_text: animeNews.overlay_views_text
            }
        };

        res.status(201).json({ message: "Anime News created successfully", animeNews: formattedNews });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Server error during file upload." });
    }
}

export const getAnimeNews = async (req: Request, res: Response) => {
    try{
        const newsList = await featuredModel.fetchAnimeNews();
        
        // Format to match old structure for frontend compatibility
        const formattedNews = newsList.map(news => ({
            ...news,
            overlay_stats: {
                rating: news.overlay_rating,
                views_text: news.overlay_views_text
            }
        }));
        
        res.status(200).json(formattedNews);
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during fetching Anime News." });
    }
};

export const removeAnimeNews = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const deletedCount = await featuredModel.deleteAnimeNews(id);
        if(deletedCount === 0){
            return res.status(404).json({ message: "Anime News not found" });
        }
        res.status(200).json({ message: "Anime News deleted successfully" });
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during deleting Anime News." });
    }
};

export const updateHeroAnime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { postgres_anime_id, title, description, original_title, rating } = req.body;
        const updated = await featuredModel.updateHeroAnime(
            id,
            postgres_anime_id,
            title,
            description,
            original_title || null,
            rating ? Number(rating) : 0
        );
        if (!updated) return res.status(404).json({ message: "Hero Anime not found" });
        res.status(200).json({ message: "Hero Anime updated successfully", heroAnime: updated });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error during Hero Anime update." });
    }
};

export const updateSuggestedAnime = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { postgres_anime_id, title, description, views_count, rating, badge_label } = req.body;
        const updated = await featuredModel.updateSuggestedAnime(
            id,
            postgres_anime_id,
            title,
            description || null,
            views_count || null,
            rating ? Number(rating) : null,
            badge_label || 'Trending'
        );
        if (!updated) return res.status(404).json({ message: "Suggested Anime not found" });
        res.status(200).json({ message: "Suggested Anime updated successfully", suggestedAnime: updated });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error during Suggested Anime update." });
    }
};

export const updateAnimeNews = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, sub_title, body_text, tags, related_postgres_anime_id, rating, views_text } = req.body;
        
        const parsedTags: string[] = [];
        if(tags){
            if (typeof tags === 'string') {
                parsedTags.push(...tags.split(',').map(tag => tag.trim()));
            } else if (Array.isArray(tags)) {
                parsedTags.push(...tags.map((tag: string) => tag.trim()));
            }
        }
        
        const updated = await featuredModel.updateAnimeNews(
            id,
            title,
            sub_title || null,
            body_text,
            parsedTags.length > 0 ? parsedTags : null,
            related_postgres_anime_id ? Number(related_postgres_anime_id) : null,
            rating ? Number(rating) : null,
            views_text || null
        );
        
        if (!updated) return res.status(404).json({ message: "Anime News not found" });
        
        const formattedNews = {
            ...updated,
            overlay_stats: {
                rating: updated.overlay_rating,
                views_text: updated.overlay_views_text
            }
        };

        res.status(200).json({ message: "Anime News updated successfully", animeNews: formattedNews });
    } catch (err: any) {
        console.error(err);
        res.status(500).json({ message: "Server error during Anime News update." });
    }
};
