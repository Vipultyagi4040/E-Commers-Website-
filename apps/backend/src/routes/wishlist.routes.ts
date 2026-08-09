import express from "express";
import { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } from "../controllers/wishlist.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.get("/", getWishlist);
router.post("/:productId", addToWishlist);
router.delete("/:productId", removeFromWishlist);
router.get("/check/:productId", checkWishlist);

export default router;
