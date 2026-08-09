const DEMO_IMAGES: Record<string, string[]> = {
  men: [
    "https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=600&h=800&fit=crop",
  ],
  women: [
    "https://images.unsplash.com/photo-1595777467614-66f4b3e75684?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1610039035531-11e2596496e5?w=600&h=800&fit=crop",
  ],
  kids: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a3199d5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop",
  ],
  shirt: [
    "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1598033129183-c4f50c736c10?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&h=800&fit=crop",
  ],
  kurti: [
    "https://images.unsplash.com/photo-1610039035531-11e2596496e5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594761051556-eae2c7f5a4b7?w=600&h=800&fit=crop",
  ],
  dress: [
    "https://images.unsplash.com/photo-1595777467614-66f4b3e75684?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop",
  ],
  jeans: [
    "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=800&fit=crop",
  ],
  "t-shirt": [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1503341504253-dff47f9d8a6c?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop",
  ],
  top: [
    "https://images.unsplash.com/photo-1562157873-818bc0726f68?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1434389677669-e08b4cda3a38?w=600&h=800&fit=crop",
  ],
  suit: [
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1507680434567-5739c80be1ac?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?w=600&h=800&fit=crop",
  ],
  saree: [
    "https://images.unsplash.com/photo-1610039035531-11e2596496e5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1614252369475-531eba835eb2?w=600&h=800&fit=crop",
  ],
  lehenga: [
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1610039035531-11e2596496e5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594761051556-eae2c7f5a4b7?w=600&h=800&fit=crop",
  ],
  jacket: [
    "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1544923246-77307dd270cb?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=800&fit=crop",
  ],
  trouser: [
    "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=800&fit=crop",
  ],
  kurta: [
    "https://images.unsplash.com/photo-1610039035531-11e2596496e5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1594761051556-eae2c7f5a4b7?w=600&h=800&fit=crop",
  ],
  baby: [
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1519689680058-324335eb6361?w=600&h=800&fit=crop",
  ],
  girl: [
    "https://images.unsplash.com/photo-1622290291468-a28f7a3199d5?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop",
  ],
  boy: [
    "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=600&h=800&fit=crop",
    "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=600&h=800&fit=crop",
  ],
};

const FALLBACK =
  "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&h=800&fit=crop";

function pickImage(keyword: string): string {
  const entries = DEMO_IMAGES[keyword];
  if (!entries || entries.length === 0) return FALLBACK;
  let hash = 0;
  for (let i = 0; i < keyword.length; i++) {
    hash = keyword.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % entries.length;
  return entries[index];
}

export function getProductImage(product: { name?: string; category?: { name?: string }; images?: { url?: string }[] }): string {
  const dbImage = product.images && product.images.length > 0 ? product.images[0]?.url : null;
  if (dbImage && !dbImage.includes("placehold.co")) {
    return dbImage;
  }

  const name = (product.name || "").toLowerCase();
  const categoryName = (product.category?.name || "").toLowerCase();

  const keywords = [
    categoryName,
    name,
    ...name.split(" "),
    ...categoryName.split(" "),
  ];

  for (const keyword of keywords) {
    if (!keyword) continue;
    const image = pickImage(keyword);
    if (image !== FALLBACK) return image;
  }

  return FALLBACK;
}

export function getCategoryImage(categoryName: string): string {
  const name = categoryName.toLowerCase();
  const image = pickImage(name);
  if (image !== FALLBACK) return image;

  const keywords = name.split(" ");
  for (const keyword of keywords) {
    const img = pickImage(keyword);
    if (img !== FALLBACK) return img;
  }

  return FALLBACK;
}

const imageCache = new Map<string, string>();

export async function fetchProductImage(productName: string, categoryName?: string): Promise<string> {
  const cacheKey = `${productName}-${categoryName || ""}`.toLowerCase();
  
  if (imageCache.has(cacheKey)) {
    return imageCache.get(cacheKey)!;
  }

  try {
    const query = `${productName} ${categoryName || ""}`.trim();
    const response = await fetch(`/api/products/search-image?query=${encodeURIComponent(query)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.url) {
        imageCache.set(cacheKey, data.url);
        return data.url;
      }
    }
  } catch {
    // silently fail
  }

  return getProductImage({ name: productName, category: categoryName ? { name: categoryName } : undefined });
}

export { FALLBACK };
