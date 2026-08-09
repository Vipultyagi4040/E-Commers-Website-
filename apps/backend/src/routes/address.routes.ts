import express from "express";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "../controllers/address.controller";
import { protect } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect);
router.get("/", getAddresses);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
