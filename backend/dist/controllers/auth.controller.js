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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.signup = void 0;
// import crypto from "crypto";    
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("../config/db");
const generateTokenAndSetCookie_1 = require("../utils/generateTokenAndSetCookie");
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password, email } = req.body;
        if (!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const existingUser = yield db_1.pool.query("SELECT * FROM users WHERE username = $1 OR email = $2", [username, email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "Username or email already exists" });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newUser = yield db_1.pool.query("INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email", [username, email, hashedPassword]);
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(res, newUser.rows[0].id);
        res.status(201).json({ message: "User created successfully", user: newUser.rows[0] });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during signup." });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const userResults = yield db_1.pool.query("SELECT * FROM users WHERE username = $1", [username]);
        if (userResults.rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        const user = userResults.rows[0];
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        (0, generateTokenAndSetCookie_1.generateTokenAndSetCookie)(res, user.id);
        res.status(200).json({ message: "Login successful", user: { id: user.id, username: user.username, email: user.email } });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error during login." });
    }
});
exports.login = login;
const logout = (req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successful" });
};
exports.logout = logout;
