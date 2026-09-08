import { Response } from 'express';
import { ExtendedRequest } from '../interfaces/request.types';
import { chatModel } from '../model/chat.model';
import { getIO } from '../config/socket';
import { createNotification } from '../utils/notificationHelper';
import { pool } from '../config/db';

export const sendMessage = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "You must be authenticated to send messages" });
      return;
    }
    const userId = req.user.id;
    const { message, animeId } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      res.status(400).json({ message: "Message cannot be empty" });
      return;
    }

    const newMessage = await chatModel.addMessage(userId, message.trim(), animeId ? Number(animeId) : null);

    // Broadcast in real-time to all connected sockets
    try {
      getIO().emit('new_message', newMessage);
    } catch (socketErr) {
      console.warn("Socket broadcast error:", socketErr);
    }

    // ── @mention detection ────────────────────────────────────────
    const mentionRegex = /@(\w+)/g;
    const mentions = [...message.matchAll(mentionRegex)].map((m) => m[1]);

    if (mentions.length > 0) {
      const senderResult = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
      const senderUsername = senderResult.rows[0]?.username || 'Cineva';

      for (const mentionedUsername of mentions) {
        // Don't notify yourself
        if (mentionedUsername.toLowerCase() === senderUsername.toLowerCase()) continue;

        const userResult = await pool.query(
          'SELECT id FROM users WHERE LOWER(username) = LOWER($1)',
          [mentionedUsername]
        );

        if (userResult.rows.length > 0) {
          const mentionedUserId = userResult.rows[0].id;
          try {
            await createNotification(getIO(), {
              userId: mentionedUserId,
              type: 'chat_mention',
              title: `Mențiune în Live Chat 💬`,
              message: `${senderUsername} te-a menționat: "${message.trim().slice(0, 100)}${message.length > 100 ? '...' : ''}"`,
              actionUrl: '/chat',
              senderId: userId,
            });
          } catch (notifErr) {
            console.warn('Mention notification error:', notifErr);
          }
        }
      }
    }
    // ─────────────────────────────────────────────────────────────

    res.status(201).json({ message: "Message sent successfully", chatMessage: newMessage });
  } catch (err) {
    console.error("Error in sendMessage:", err);
    res.status(500).json({ message: "Internal server error while sending message" });
  }
};


export const getMessages = async (req: ExtendedRequest, res: Response) => {
  try {
    const messages = await chatModel.getRecentMessages(100);
    res.status(200).json({ message: "Messages fetched successfully", messages });
  } catch (err) {
    console.error("Error in getMessages:", err);
    res.status(500).json({ message: "Internal server error while fetching chat messages" });
  }
};

export const removeMessage = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      res.status(401).json({ message: "You must be authenticated" });
      return;
    }
    const userId = req.user.id;
    const isAdmin = Boolean(req.user.isAdmin);
    const { id } = req.params;

    const deletedId = await chatModel.deleteMessage(Number(id), userId, isAdmin);

    if (!deletedId) {
      res.status(403).json({ message: "You do not have permission to delete this message or message not found" });
      return;
    }

    // Broadcast delete event in real-time
    try {
      getIO().emit('delete_message', deletedId);
    } catch (socketErr) {
      console.warn("Socket broadcast error:", socketErr);
    }

    res.status(200).json({ message: "Message deleted successfully", id: deletedId });
  } catch (err) {
    console.error("Error in removeMessage:", err);
    res.status(500).json({ message: "Internal server error while deleting message" });
  }
};
