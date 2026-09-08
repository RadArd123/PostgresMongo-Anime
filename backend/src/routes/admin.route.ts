import express from "express";
import { getAdminStats, getUsers, toggleAdmin, deleteUser } from "../controllers/admin.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";
import { createUser, updateUser, updateMedia } from '../controllers/adminCrud.controller';
import { validateBody, validateId } from '../middleware/validate';
import { signupSchema } from '../schemas/auth.schemas';
import { imageUpload, cleanupUploadTempFiles, validateImageUploads } from '../middleware/imageUpload';
import { uploadLimiter } from '../middleware/rateLimits';

const router = express.Router();
router.use(verifyToken, isAdmin);
router.post('/users', validateBody(signupSchema), createUser);
router.put('/users/:id', validateId(), validateBody(signupSchema.omit({ password: true })), updateUser);
router.put('/media/:kind/:id', validateId(), uploadLimiter, imageUpload, cleanupUploadTempFiles, validateImageUploads, updateMedia);

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', validateId(), toggleAdmin);
router.delete('/users/:id', validateId(), deleteUser);

export default router;
