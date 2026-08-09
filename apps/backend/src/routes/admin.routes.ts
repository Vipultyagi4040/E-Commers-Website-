import express from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";

const router = express.Router();

router.use(protect, adminOnly);
router.get("/stats", getDashboardStats);

export default router;
