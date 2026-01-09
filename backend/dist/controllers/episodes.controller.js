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
exports.deleteEpisode = exports.getEpisodesByAnimeId = exports.createEpisode = void 0;
const db_1 = require("../config/db");
const createEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anime_id, title, duration, episode_number, video_url } = req.body;
        if (!anime_id || !title || !episode_number || !video_url) {
            return res.status(400).json({ message: "anime_id, title, episode_number and video_url are required" });
        }
        const newEpisode = yield db_1.pool.query(`INSERT INTO episodes (anime_id, title, duration, episode_number, video_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`, [anime_id, title, duration, episode_number, video_url]);
        res.status(201).json({ message: "Episode created successfully", episode: newEpisode.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during episode creation." });
    }
});
exports.createEpisode = createEpisode;
const getEpisodesByAnimeId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { animeId } = req.params;
        const episodes = yield db_1.pool.query("SELECT * FROM episodes WHERE anime_id = $1 ORDER BY episode_number ASC", [animeId]);
        res.status(200).json({ episodes: episodes.rows });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error fetching episodes." });
    }
});
exports.getEpisodesByAnimeId = getEpisodesByAnimeId;
const deleteEpisode = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const deleteEpisode = yield db_1.pool.query("DELETE FROM episodes WHERE id = $1 RETURNING *", [id]);
        if (deleteEpisode.rows.length === 0) {
            return res.status(404).json({ message: "Episode not found" });
        }
        return res.status(200).json({ message: "Episode deleted successfully" });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error deleting episode." });
    }
});
exports.deleteEpisode = deleteEpisode;
