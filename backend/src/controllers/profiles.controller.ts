import { Request, Response } from "express";
import { profileModel } from "../model/profiles.model";
import { ExtendedRequest } from "../interfaces/request.types";
import { Profile } from "../interfaces/profiles.types";

export const getMyProfile = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const profile = await profileModel.getProfile(userId);
        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile not found" });
        }

        // Log the user's daily visit
        await profileModel.logActivity(userId);

        res.status(200).json({ success: true, profile });
    } catch (error: any) {
        console.error("Error in getMyProfile:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const updateMyProfile = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const { status, avatar_url, banner_url, bio } = req.body as Profile;

        const updatedProfile = await profileModel.updateProfile(userId, status, avatar_url, banner_url, bio);
        
        res.status(200).json({ success: true, message: "Profile updated successfully", profile: updatedProfile });
    } catch (error: any) {
        console.error("Error in updateMyProfile:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const getActivity = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        const activity = await profileModel.getUserActivity(userId);
        res.status(200).json({ success: true, activity });
    } catch (error: any) {
        console.error("Error in getActivity:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};

export const uploadProfileImage = async (req: ExtendedRequest, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        
        // TODO: Implement upload profile image logic here
        res.status(200).json({ success: true, message: "Image uploaded successfully (placeholder)" });
    } catch (error: any) {
        console.error("Error in uploadProfileImage:", error);
        res.status(500).json({ success: false, message: error.message || "Internal server error" });
    }
};
