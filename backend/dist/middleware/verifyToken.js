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
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.token;
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error("JWT_SECRET is not defined in environment");
            return res.status(500).json({ success: false, message: "Internal server error" });
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        if (!decoded) {
            return res.status(401).json({ success: false, message: "Unauthorized-invalid token" });
        }
        req.user = {
            id: decoded.id
        };
        next();
    }
    catch (err) {
        console.log("Error verifying token", err);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
});
exports.verifyToken = verifyToken;
