import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

// POST /api/recently-viewed/:productId
export const addRecentlyViewed = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    await prisma.recentlyViewed.upsert({
      where: { userId_productId: { userId: req.user.id, productId } },
      update: { viewedAt: new Date() },
      create: { userId: req.user.id, productId },
    });
    res.json({ message: "Added to recently viewed" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/recently-viewed
export const getRecentlyViewed = async (req: AuthRequest, res: Response) => {
  try {
    const items = await prisma.recentlyViewed.findMany({
      where: { userId: req.user.id },
      include: { product: { include: { images: true, category: true } } },
      orderBy: { viewedAt: "desc" },
      take: 20,
    });
    res.json(items.map((item: { product: { id: string; name: string; price: number; discount: number; images: { url: string }[]; category: { name: string } } }) => item.product));
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
