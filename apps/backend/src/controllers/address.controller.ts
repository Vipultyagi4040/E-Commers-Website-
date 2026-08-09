import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/addresses
export const getAddresses = async (req: AuthRequest, res: Response) => {
  try {
    const addresses = await prisma.address.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// POST /api/addresses
export const createAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, phone, address, city, state, pincode, isDefault } = req.body;

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: { userId: req.user.id, fullName, phone, address, city, state, pincode, isDefault },
    });
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// PUT /api/addresses/:id
export const updateAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { fullName, phone, address, city, state, pincode, isDefault } = req.body;

    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }

    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: req.user.id },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: { fullName, phone, address, city, state, pincode, isDefault },
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// DELETE /api/addresses/:id
export const deleteAddress = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const address = await prisma.address.findUnique({ where: { id } });
    if (!address || address.userId !== req.user.id) {
      return res.status(404).json({ message: "Address not found" });
    }
    await prisma.address.delete({ where: { id } });
    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
