import { Response } from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "../config/database";
import { AuthRequest } from "../middleware/auth.middleware";

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay is not configured on the server");
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create  { orderId }
export const createPaymentOrder = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId } = req.body;

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(order.totalAmount * 100), // paise
      currency: "INR",
      receipt: order.id,
    });

    await prisma.payment.upsert({
      where: { orderId: order.id },
      update: { razorpayOrderId: razorpayOrder.id, amount: order.totalAmount },
      create: {
        orderId: order.id,
        razorpayOrderId: razorpayOrder.id,
        amount: order.totalAmount,
        status: "PENDING",
      },
    });

    res.json({ razorpayOrder, key: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    const message = (error as Error).message.includes("not configured")
      ? "Online payment is not available. Please use Cash on Delivery."
      : "Server error";
    res.status(message.includes("not available") ? 400 : 500).json({ message, error: (error as Error).message });
  }
};

// POST /api/payments/verify  { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature }
export const verifyPayment = async (req: AuthRequest, res: Response) => {
  try {
    const { orderId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || "")
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const isValid = generatedSignature === razorpay_signature;

    if (!isValid) {
      await prisma.payment.update({
        where: { orderId },
        data: { status: "FAILED" },
      });
      return res.status(400).json({ message: "Payment verification failed" });
    }

    await prisma.payment.update({
      where: { orderId },
      data: {
        status: "SUCCESS",
        razorpayPaymentId: razorpay_payment_id,
      },
    });

    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: "SUCCESS", status: "CONFIRMED" },
    });

    res.json({ message: "Payment verified successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
