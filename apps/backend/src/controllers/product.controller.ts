import { Request, Response } from "express";
import prisma from "../config/database";
import cloudinary from "../config/cloudinary";

// GET /api/products  (with search, filter, pagination)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      size,
      color,
      page = "1",
      limit = "12",
      sort,
    } = req.query as Record<string, string>;

    const where: any = {};

    if (search) {
      where.name = { contains: search, mode: "insensitive" };
    }

    if (category) {
      where.category = { name: { equals: category, mode: "insensitive" } };
    }

    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price.gte = Number(minPrice);
      if (maxPrice) where.price.lte = Number(maxPrice);
    }

    if (size) {
      where.sizes = { has: size };
    }

    if (color) {
      where.colors = { has: color };
    }

    const pageNum = Math.max(Number(page) || 1, 1);
    const limitNum = Math.max(Number(limit) || 12, 1);

    let orderBy: any = { createdAt: "desc" };
    if (sort === "price-low") orderBy = { price: "asc" };
    else if (sort === "price-high") orderBy = { price: "desc" };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true },
        skip: (pageNum - 1) * limitNum,
        take: limitNum,
        orderBy,
      }),
      prisma.product.count({ where }),
    ]);

    res.json({
      products,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, reviews: { include: { user: { select: { name: true } } } } },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/products/slug/:slug
export const getProductBySlug = async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const product = await prisma.product.findUnique({
      where: { slug },
      include: { category: true, images: true, reviews: { include: { user: { select: { name: true } } } } },
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/products/:id/related
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await prisma.product.findUnique({ where: { id }, include: { category: true } });
    if (!product) return res.status(404).json({ message: "Product not found" });

    const related = await prisma.product.findMany({
      where: { categoryId: product.categoryId, id: { not: id }, isActive: true },
      include: { images: true, category: true },
      take: 8,
    });

    res.json(related);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// POST /api/products (admin)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, discount, stock, sizes, colors, categoryId } = req.body;

    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let imageUrls: string[] = [];

    const files = (req.files as Express.Multer.File[]) || [];
    if (files.length > 0) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        for (const file of files) {
          const uploadResult: any = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "bhaiya-g-garments" },
              (error, result) => (error ? reject(error) : resolve(result))
            );
            stream.end(file.buffer);
          });
          imageUrls.push(uploadResult.secure_url);
        }
      } else {
        imageUrls = files.map(() => `https://via.placeholder.com/500x600?text=Product+Image`);
      }
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
        description,
        price: Number(price),
        discount: discount ? Number(discount) : 0,
        stock: Number(stock),
        sizes: Array.isArray(sizes) ? sizes : sizes ? sizes.split(",") : [],
        colors: Array.isArray(colors) ? colors : colors ? colors.split(",") : [],
        categoryId,
        images: { create: imageUrls.map((url) => ({ url })) },
      },
      include: { images: true, category: true },
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// PUT /api/products/:id (admin)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, price, discount, stock, sizes, colors, categoryId } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: Number(price) }),
        ...(discount !== undefined && { discount: Number(discount) }),
        ...(stock !== undefined && { stock: Number(stock) }),
        ...(sizes && { sizes: Array.isArray(sizes) ? sizes : sizes.split(",") }),
        ...(colors && { colors: Array.isArray(colors) ? colors : colors.split(",") }),
        ...(categoryId && { categoryId }),
      },
    });

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// DELETE /api/products/:id (admin)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({ where: { id } });
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};

// GET /api/products/search-image
export const searchProductImage = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const pexelsApiKey = process.env.PEXELS_API_KEY;
    if (!pexelsApiKey) {
      return res.status(500).json({ message: "Pexels API key not configured" });
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query + " fashion clothing")}&per_page=1&orientation=portrait`,
      {
        headers: {
          Authorization: pexelsApiKey,
        },
      }
    );

    if (!response.ok) {
      return res.status(500).json({ message: "Failed to fetch image from Pexels" });
    }

    const data = await response.json() as { photos?: { src: { medium: string }; photographer: string }[] };

    if (data.photos && data.photos.length > 0) {
      const photo = data.photos[0];
      return res.json({
        url: photo.src.medium,
        alt: query,
        photographer: photo.photographer,
      });
    }

    return res.status(404).json({ message: "No image found" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
};
