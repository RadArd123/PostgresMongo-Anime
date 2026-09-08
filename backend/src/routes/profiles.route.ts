import express from "express";
import { getMyProfile, updateMyProfile, uploadProfileImage, getActivity } from "../controllers/profiles.controller";
import { verifyToken } from "../middleware/verifyToken";
import { cleanupUploadTempFiles, imageUpload, validateImageUploads } from "../middleware/imageUpload";
import { uploadLimiter } from "../middleware/rateLimits";

const router = express.Router();

router.get("/me", verifyToken as express.RequestHandler, getMyProfile as express.RequestHandler);
router.get("/activity", verifyToken as express.RequestHandler, getActivity as express.RequestHandler);
router.put("/me", verifyToken as express.RequestHandler, updateMyProfile as express.RequestHandler);
router.post(
  "/upload",
  verifyToken as express.RequestHandler,
  uploadLimiter,
  imageUpload,
  cleanupUploadTempFiles,
  validateImageUploads,
  uploadProfileImage as express.RequestHandler
);

export default router;
