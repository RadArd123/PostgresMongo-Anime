"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const initDB_1 = require("./data/initDB");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const anime_route_1 = __importDefault(require("./routes/anime.route"));
const episodes_route_1 = __importDefault(require("./routes/episodes.route"));
const favorites_route_1 = __importDefault(require("./routes/favorites.route"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_route_1.default);
app.use('/api/animes', anime_route_1.default);
app.use('/api/episodes', episodes_route_1.default);
app.use('/api/favorites', favorites_route_1.default);
(0, initDB_1.initDB)().then(() => {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
});
