"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const anime_controller_1 = require("../controllers/anime.controller");
const router = express_1.default.Router();
router.post("/create-anime", anime_controller_1.createAnime);
router.get("/get-animes", anime_controller_1.getAnimes);
router.get("/:id", anime_controller_1.getAnimeById);
router.delete("/delete-anime/:id", anime_controller_1.deleteAnime);
router.put("/update-anime/:id", anime_controller_1.updateAnime);
exports.default = router;
