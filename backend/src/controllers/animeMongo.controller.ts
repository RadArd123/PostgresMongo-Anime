import { Request, Response } from "express";
import { UploadedFile } from "express-fileupload";
import { HeroAnime } from "../mongoSchema/heroAnime";
import { SuggestedAnime } from "../mongoSchema/suggestedAnime";
import { AnimeNews } from "../mongoSchema/animeNews";
import { uploadToCloudinary } from "../scripts/uploadToCloudinary";

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
    const newHeroAnime = new HeroAnime({
      postgres_anime_id,
      title,
      description,
      original_title,
      rating: Number(rating),
      background_image: imageUrl,
    });
    await newHeroAnime.save();

    res
      .status(201)
      .json({
        message: "Hero Anime created successfully",
        heroAnime: newHeroAnime,
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
    const heroAnimes = await HeroAnime.find().sort({ created_at: -1 });
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
    const deletedHeroAnime = await HeroAnime.findByIdAndDelete(id);
    if (!deletedHeroAnime) {
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
    const newSuggestedAnime = new SuggestedAnime({
        postgres_anime_id,
        title,
        description,
        views_count,
        rating: rating ? Number(rating) : undefined,
        badge_label,
        poster_image: imageUrl,
    });
    await newSuggestedAnime.save();

    res.status(201).json({message: "Suggested Anime created successfully", suggestedAnime: newSuggestedAnime});

  } catch (err: any) {
    console.error(err);
    res.status(500).json({ message: "Server error during Suggested Anime creation." });
  }
};
export const getSuggestedAnimes = async (req: Request, res: Response) => {
    try{
        const suggestedAnimes = await SuggestedAnime.find().sort({ created_at: -1 });
        res.status(200).json(suggestedAnimes);
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during fetching Suggested Animes." });
    }
}
export const removeSuggestedAnime =async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const deletedSuggestedAnime = await SuggestedAnime.findByIdAndDelete(id);
        if(!deletedSuggestedAnime){
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
        const newAnimeNews = new AnimeNews({
            title,
            sub_title,
            body_text,
            background_image: imageUrl,
            tags: parsedTags,
            related_postgres_anime_id: related_postgres_anime_id ? Number(related_postgres_anime_id) : null,
            overlay_stats: {
                rating: rating ? Number(rating) : undefined,
                views_text: views_text? views_text : undefined,
            }
        });
     
        await newAnimeNews.save();

        res.status(201).json({ message: "Anime News created successfully", animeNews: newAnimeNews });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "Server error during file upload." });
    }
}
export const getAnimeNews = async (req: Request, res: Response) => {
    try{
        const animeNewsList = await AnimeNews.find().sort({ publish_date: -1 });
        res.status(200).json(animeNewsList);
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during fetching Anime News." });
    }
};
export const removeAnimeNews = async (req: Request, res: Response) => {
    try{
        const {id} = req.params;
        const deletedAnimeNews = await AnimeNews.findByIdAndDelete(id);
        if(!deletedAnimeNews){
            return res.status(404).json({ message: "Anime News not found" });
        }
        res.status(200).json({ message: "Anime News deleted successfully" });
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during deleting Anime News." });
    }
};
