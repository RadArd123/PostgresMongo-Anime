import { Response } from 'express';
import { ExtendedRequest } from '../interfaces/request.types';
import { continueWatchingModel } from '../model/continueWatching.model';

export const addOrUpdateProgress = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "You must be authenticated" });
    }
    const userId = req.user.id;
    const { animeId, episodeId, progressSeconds, durationSeconds, completed } = req.body;

    if (!animeId || !episodeId) {
      return res.status(400).json({ message: "animeId and episodeId are required" });
    }

    const item = await continueWatchingModel.addOrUpdate(
      userId,
      Number(animeId),
      Number(episodeId),
      Number(progressSeconds || 0),
      Number(durationSeconds || 1440),
      Boolean(completed)
    );

    res.status(200).json({ message: "Progress updated successfully", item });
  } catch (err) {
    console.error("Error in addOrUpdateProgress:", err);
    res.status(500).json({ message: "Internal server error while updating watch progress" });
  }
};

export const getContinueWatching = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "You must be authenticated" });
    }
    const userId = req.user.id;
    const items = await continueWatchingModel.getByUserId(userId);
    res.status(200).json({ message: "Continue watching fetched successfully", items });
  } catch (err) {
    console.error("Error in getContinueWatching:", err);
    res.status(500).json({ message: "Internal server error while fetching continue watching" });
  }
};

export const removeContinueWatching = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "You must be authenticated" });
    }
    const userId = req.user.id;
    const { episodeId } = req.params;

    const item = await continueWatchingModel.remove(userId, Number(episodeId));
    res.status(200).json({ message: "Removed from continue watching", item });
  } catch (err) {
    console.error("Error in removeContinueWatching:", err);
    res.status(500).json({ message: "Internal server error while removing item" });
  }
};

export const markCompletedContinueWatching = async (req: ExtendedRequest, res: Response) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "You must be authenticated" });
    }
    const userId = req.user.id;
    const { episodeId } = req.params;

    const item = await continueWatchingModel.markCompleted(userId, Number(episodeId));
    res.status(200).json({ message: "Marked as completed", item });
  } catch (err) {
    console.error("Error in markCompletedContinueWatching:", err);
    res.status(500).json({ message: "Internal server error while marking completed" });
  }
};
