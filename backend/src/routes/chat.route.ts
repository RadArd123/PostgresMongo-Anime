import express from 'express';
import { sendMessage, getMessages, removeMessage } from '../controllers/chat.controller';
import { verifyToken } from '../middleware/verifyToken';

const router = express.Router();

router.get('/messages', getMessages);
router.post('/send', verifyToken, sendMessage);
router.delete('/delete/:id', verifyToken, removeMessage);

export default router;
