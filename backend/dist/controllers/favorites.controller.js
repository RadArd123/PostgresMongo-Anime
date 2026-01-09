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
exports.addFavorites = void 0;
const db_1 = require("../config/db");
const addFavorites = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { anime_id } = req.body;
        if (!anime_id) {
            return res.status(400).json({ message: "anime_id is required" });
        }
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const newFavorite = yield db_1.pool.query(`INSERT INTO favorites (user_id, anime_id) 
             VALUES ($1, $2)
             RETURNING *`, [req.user.id, anime_id]);
        res.status(201).json({ message: "Favorite added successfully", favorites: newFavorite.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error while adding favorite" });
    }
});
exports.addFavorites = addFavorites;
