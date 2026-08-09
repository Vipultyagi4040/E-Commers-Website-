import express from "express";
import {
  getProducts,
  getProductById,
  getProductBySlug,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProductImage,
} from "../controllers/product.controller";
import { getProductReviews, createReview } from "../controllers/review.controller";
import { protect } from "../middleware/auth.middleware";
import { adminOnly } from "../middleware/admin.middleware";
import upload from "../middleware/upload.middleware";

const router = express.Router();

router.get("/", getProducts);
router.get("/slug/:slug", getProductBySlug);
router.get("/:id/reviews", getProductReviews);
router.post("/:id/reviews", protect, createReview);
router.get("/:id/related", getRelatedProducts);
router.get("/search-image", searchProductImage);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, upload.array("images", 5), createProduct);
router.put("/:id", protect, adminOnly, updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

export default router;
