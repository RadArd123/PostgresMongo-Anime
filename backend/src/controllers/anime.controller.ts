import {Request, Response} from "express";
import { Anime } from "../interfaces/anime.types";
import { animeModel } from "../model/anime.model";
import { uploadToCloudinary } from "../scripts/uploadToCloudinary";
import type { UploadedFile } from "express-fileupload";
import fs from 'fs';


export const createAnime = async (req:Request, res:Response) => {

    let iconFile: UploadedFile | undefined;
    let bannerFile: UploadedFile | undefined;
   
    try{
        if(!req.files || !req.files.img_file_icon || !req.files.img_file_banner){
           return res.status(400).json({ message: 'img_file_icon and img_file_banner are required' });
        }
        iconFile = req.files.img_file_icon as UploadedFile;
        bannerFile = req.files.img_file_banner as UploadedFile;

        const {title, description, genre, release_year } = req.body as Anime;

        if(!title){
            return res.status(400).json({message: "Title are required"});
        }
        const img_url_icon = await uploadToCloudinary(iconFile)
        const img_url_banner = await uploadToCloudinary(bannerFile)

        const animeData  = {
            title: title,
            description: description,
            genre: genre,
            release_year: release_year,
            img_url_icon: img_url_icon,
            img_url_banner: img_url_banner
        } as Anime

        const newAnime = await animeModel.createAnime(animeData)

        
        res.status(201).json({message: "Anime created successfully", anime: newAnime});   
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error during anime creation." });
    }finally {
    // <-- 3. (CRITIC) Curăță fișierele temporare
    // Acest bloc se execută indiferent dacă 'try' a reușit sau a eșuat
        if (iconFile) {
            fs.unlink(iconFile.tempFilePath, (err) => {
            if (err) console.error("Failed to delete temp icon file:", err);
            });
        }
        if (bannerFile) {
            fs.unlink(bannerFile.tempFilePath, (err) => {
                if (err) console.error("Failed to delete temp banner file:", err);
                });
            }
        }
    };
export const getAnimes = async (req:Request, res:Response) => {
    try{
        const animes = await animeModel.getAnimes();
        res.status(200).json({animes});
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error fetching animes." });
    }
};
export const getAnimeById = async (req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const anime = await animeModel.getAnimeById(Number(id));
        if (!anime) {
            return res.status(404).json({ message: "Anime not found" });
        }
        res.status(200).json({ anime: anime });
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error fetching anime." });
    }
};
export const deleteAnime = async (req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const anime = await animeModel.deleteAnime(Number(id));
        if (!anime) {
            return res.status(404).json({ message: "Anime not found" });
        }
        res.status(200).json({message: "Anime deleted successfully", anime: anime});
    }catch(err:any){
          if (err instanceof Error && err.message === "Anime not found") {
            return res.status(404).json({ message: err.message });
            }
        console.error(err);
        res.status(500).json({ message: "Server error deleting anime." });
    }
};
export const updateAnime = async (req:Request, res:Response) => {
    try{
        const {id} = req.params;
        const {title, description, genre, release_year} = req.body as Anime;
        const anime = await animeModel.updateAnime(Number(id),{title, description, genre, release_year} as Anime);
        if (!anime) { 
            return res.status(404).json({ message: "Anime not found" });
        }
        res.status(200).json({message: "Anime updated successfully", anime: anime}); 
    }catch(err:any){
        console.error(err);
        res.status(500).json({ message: "Server error updating anime." });
    }
};