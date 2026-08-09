import { Request, Response } from "express";

export const submitContact = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    console.log(`Contact form submission from ${name} (${email}, ${phone}): ${message}`);
    res.json({ message: "Message received successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
