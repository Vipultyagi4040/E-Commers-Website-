import express from "express";
import { validateCoupon } from "../controllers/coupon.controller";

const router = express.Router();

router.post("/validate/:code", validateCoupon);
router.get("/validate/:code", validateCoupon);

export default router;
