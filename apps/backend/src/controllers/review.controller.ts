import { Request, Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/products/:id/reviews
export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const reviews = await prisma.review.findMany({
      where: { productId: id },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// POST /api/products/:id/reviews
export const createReview = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    if (!rating || !comment) {
      return res.status(400).json({ message: "Rating and comment are required" });
    }

    const review = await prisma.review.create({
      data: {
        productId: id,
        userId: req.user.id,
        rating: Number(rating),
        comment,
      },
      include: { user: { select: { name: true } } },
    });

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
