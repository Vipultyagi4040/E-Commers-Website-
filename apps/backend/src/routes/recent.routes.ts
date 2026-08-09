import express from "express";
import { addRecentlyViewed, getRecentlyViewed } from "../controllers/recent.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.post("/:productId", addRecentlyViewed);
router.get("/", getRecentlyViewed);

export default router;
