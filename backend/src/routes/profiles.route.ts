import express from "express";
import { getMyProfile, updateMyProfile, uploadProfileImage, getActivity } from "../controllers/profiles.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/me", verifyToken as express.RequestHandler, getMyProfile as express.RequestHandler);
router.get("/activity", verifyToken as express.RequestHandler, getActivity as express.RequestHandler);
router.put("/me", verifyToken as express.RequestHandler, updateMyProfile as express.RequestHandler);
router.post("/upload", verifyToken as express.RequestHandler, uploadProfileImage as express.RequestHandler);

export default router;
