import express from "express";
import { getAdminStats, getUsers, toggleAdmin, deleteUser } from "../controllers/admin.controller";
import { verifyToken } from "../middleware/verifyToken";
import { isAdmin } from "../middleware/isAdmin";

const router = express.Router();

router.get("/stats", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, getAdminStats as express.RequestHandler);
router.get("/users", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, getUsers as express.RequestHandler);
router.put("/users/:id/role", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, toggleAdmin as express.RequestHandler);
router.delete("/users/:id", verifyToken as express.RequestHandler, isAdmin as express.RequestHandler, deleteUser as express.RequestHandler);

export default router;
