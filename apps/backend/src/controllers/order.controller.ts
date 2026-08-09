import { Response } from "express";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";
import { sendOrderConfirmation, sendStatusUpdate } from "../utils/email";

// POST /api/orders  { address }  -> creates order from current cart
export const createOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { address } = req.body;
    if (!address) return res.status(400).json({ message: "Address is required" });

    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } },
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalAmount = cart.items.reduce((sum, item) => {
      const price = item.product.price * (1 - item.product.discount / 100);
      return sum + price * item.quantity;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: req.user.id,
        totalAmount,
        address,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price * (1 - item.product.discount / 100),
          })),
        },
      },
      include: { items: true },
    });

    // reduce stock
    for (const item of cart.items) {
      await prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // clear cart
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user) {
      sendOrderConfirmation(user.email, order.id, totalAmount);
    }

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/orders  (logged in user's own orders)
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } }, payment: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/orders/all  (admin)
export const getAllOrders = async (_req: AuthRequest, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      include: { items: { include: { product: true } }, user: { select: { name: true, email: true, phone: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/orders/:id  (own order)
export const getOrderById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } }, payment: true, user: { select: { name: true, email: true, phone: true } } },
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// PUT /api/orders/:id/status  (admin or own order)  { status }
export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });

    const orderWithUser = await prisma.order.findUnique({
      where: { id },
      include: { user: { select: { email: true } } },
    });

    if (orderWithUser?.user) {
      sendStatusUpdate(orderWithUser.user.email, order.id, status);
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
