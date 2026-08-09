import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

const getOrCreateWishlist = async (userId: string) => {
  let wishlist = await prisma.wishlist.findUnique({ where: { userId } });
  if (!wishlist) {
    wishlist = await prisma.wishlist.create({ data: { userId } });
  }
  return wishlist;
};

// GET /api/wishlist
export const getWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await getOrCreateWishlist(req.user.id);
    const fullWishlist = await prisma.wishlist.findUnique({
      where: { id: wishlist.id },
      include: { items: { include: { product: { include: { images: true, category: true } } } } },
    });
    res.json(fullWishlist);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// POST /api/wishlist/:productId
export const addToWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user.id);
    const item = await prisma.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
      update: {},
      create: { wishlistId: wishlist.id, productId },
      include: { product: { include: { images: true, category: true } } },
    });
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// DELETE /api/wishlist/:productId
export const removeFromWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user.id);
    await prisma.wishlistItem.deleteMany({
      where: { wishlistId: wishlist.id, productId },
    });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/wishlist/check/:productId
export const checkWishlist = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const wishlist = await getOrCreateWishlist(req.user.id);
    const item = await prisma.wishlistItem.findUnique({
      where: { wishlistId_productId: { wishlistId: wishlist.id, productId } },
    });
    res.json({ inWishlist: !!item });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
