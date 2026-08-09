// @ts-ignore
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOrderConfirmation = async (to: string, orderId: string, total: number) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`Order confirmation for ${to}: Order #${orderId}, Total: ₹${total}`);
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Bhaiya G Garments <support@bhaiyag.com>",
      to,
      subject: `Order Confirmed - #${orderId.slice(0, 8)}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>#${orderId.slice(0, 8)}</strong> has been confirmed.</p>
        <p><strong>Total Amount:</strong> ₹${total.toFixed(0)}</p>
        <p>We will notify you when your order is shipped.</p>
        <p>Thank you for shopping with Bhaiya G Readymade Garments!</p>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};

export const sendStatusUpdate = async (to: string, orderId: string, status: string) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log(`Status update for ${to}: Order #${orderId} is now ${status}`);
      return;
    }

    await transporter.sendMail({
      from: process.env.SMTP_FROM || "Bhaiya G Garments <support@bhaiyag.com>",
      to,
      subject: `Order Update - #${orderId.slice(0, 8)}`,
      html: `
        <h2>Order Status Updated</h2>
        <p>Your order <strong>#${orderId.slice(0, 8)}</strong> status has been updated to <strong>${status}</strong>.</p>
        <p>Thank you for shopping with Bhaiya G Readymade Garments!</p>
      `,
    });
  } catch (error) {
    console.error("Email send error:", error);
  }
};
