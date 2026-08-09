import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

// GET /api/admin/stats
export const getDashboardStats = async (_req: AuthRequest, res: Response) => {
  try {
    const [totalProducts, totalOrders, totalCustomers, revenueResult, lowStock] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count({ where: { role: "CUSTOMER" } }),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { paymentStatus: "SUCCESS" },
      }),
      prisma.product.findMany({ where: { stock: { lte: 5 } }, take: 10 }),
    ]);

    res.json({
      totalProducts,
      totalOrders,
      totalCustomers,
      totalRevenue: revenueResult._sum.totalAmount || 0,
      lowStockItems: lowStock,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
