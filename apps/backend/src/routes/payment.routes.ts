import express from "express";
import { createPaymentOrder, verifyPayment } from "../controllers/payment.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.post("/create", createPaymentOrder);
router.post("/verify", verifyPayment);

export default router;
