"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAnime = exports.deleteAnime = exports.getAnimeById = exports.getAnimes = exports.createAnime = void 0;
const db_1 = require("../config/db");
const createAnime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, genre, release_year, img_url_icon, img_url_banner } = req.body;
        if (!title || !img_url_icon || !img_url_banner) {
            return res.status(400).json({ message: "Title, img_url_icon and imag_url_banner are required" });
        }
        const newAnime = yield db_1.pool.query(`INSERT INTO animes (title, description, genre, release_year, img_url_icon, img_url_banner) 
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`, [title, description, genre, release_year, img_url_icon, img_url_banner]);
        res.status(201).json({ message: "Anime created successfully", anime: newAnime.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during anime creation." });
    }
});
exports.createAnime = createAnime;
const getAnimes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const animes = yield db_1.pool.query("SELECT * FROM animes ORDER BY created_at DESC");
        res.status(200).json({ animes: animes.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching animes." });
    }
});
exports.getAnimes = getAnimes;
const getAnimeById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const anime = yield db_1.pool.query("SELECT * FROM animes WHERE id = $1", [id]);
        if (anime.rows.length === 0) {
            return res.status(404).json({ message: "Anime not found" });
        }
        res.status(200).json({ anime: anime.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching anime." });
    }
});
exports.getAnimeById = getAnimeById;
const deleteAnime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deleteAnime = yield db_1.pool.query("DELETE FROM animes WHERE id = $1 RETURNING *", [id]);
        if (deleteAnime.rows.length === 0) {
            return res.status(404).json({ message: "Anime not found" });
        }
        return res.status(200).json({ message: "Anime deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting anime." });
    }
});
exports.deleteAnime = deleteAnime;
const updateAnime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description, genre, release_year, img_url_icon, img_url_banner } = req.body;
        const updatedAnime = yield db_1.pool.query(`UPDATE animes 
             SET title = $1, description = $2, genre = $3, release_year = $4, img_url_icon = $5, img_url_banner = $6
             WHERE id = $7
             RETURNING *`, [title, description, genre, release_year, img_url_icon, img_url_banner, id]);
        if (updatedAnime.rows.length === 0) {
            return res.status(404).json({ message: "Anime not found" });
        }
        res.status(200).json({ message: "Anime updated successfully", anime: updatedAnime.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error updating anime." });
    }
});
exports.updateAnime = updateAnime;
