import express from 'express';
import { checkAuth, login, logout, signup, deleteAccount } from '../controllers/auth.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.post('/signup', signup); 
router.post("/login", login);
router.post("/logout", logout);
router.get("/check-auth", verifyToken, checkAuth);
router.delete("/delete-account", verifyToken, deleteAccount);

export default router;
