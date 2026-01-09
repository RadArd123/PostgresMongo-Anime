"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const episodes_controller_1 = require("../controllers/episodes.controller");
const router = express_1.default.Router();
router.post("/create-episode", episodes_controller_1.createEpisode);
router.get("/episodes-by-anime/:animeId", episodes_controller_1.getEpisodesByAnimeId);
router.delete("/delete-episode", episodes_controller_1.deleteEpisode);
exports.default = router;
