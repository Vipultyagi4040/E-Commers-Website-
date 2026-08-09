import express from "express";
import { getProductReviews, createReview } from "../controllers/review.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.get("/:productId/reviews", getProductReviews);
router.post("/:productId/reviews", protect, createReview);

export default router;
