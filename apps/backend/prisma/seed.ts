import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "vipultyagi1414@gmail.com" },
    update: {},
    create: {
      name: "Bhaiya G Admin",
      email: "vipultyagi1414@gmail.com",
      phone: "9999999999",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const customer = await prisma.user.upsert({
    where: { email: "test@example.com" },
    update: {},
    create: {
      name: "Test Customer",
      email: "test@example.com",
      phone: "9876543210",
      password: hashedPassword,
      role: "CUSTOMER",
    },
  });

  console.log("Users created:", admin.email, customer.email);

  const categories = [
    { name: "Men", slug: "men", subcategories: ["Shirts", "T-Shirts", "Jeans", "Trousers", "Jackets", "Kurta"] },
    { name: "Women", slug: "women", subcategories: ["Kurtis", "Dresses", "Tops", "Sarees"] },
    { name: "Kids", slug: "kids", subcategories: ["Boys", "Girls", "Baby Wear"] },
  ];

  const categoryMap: Record<string, string> = {};
  for (const cat of categories) {
    const parent = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { name: cat.name, slug: cat.slug },
    });
    categoryMap[cat.slug] = parent.id;
    for (const subName of cat.subcategories) {
      const sub = await prisma.category.upsert({
        where: { slug: `${cat.slug}-${subName.toLowerCase().replace(/\s+/g, "-")}` },
        update: {},
        create: {
          name: subName,
          slug: `${cat.slug}-${subName.toLowerCase().replace(/\s+/g, "-")}`,
          parentId: parent.id,
        },
      });
      categoryMap[`${cat.slug}-${subName.toLowerCase().replace(/\s+/g, "-")}`] = sub.id;
    }
  }

  const products = [
    // Men - Shirts
    { name: "Classic Black Cotton Shirt", cat: "men-shirts", price: 999, discount: 10, stock: 50, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"], desc: "Premium quality cotton shirt, perfect for daily wear." },
    { name: "Royal Blue Formal Shirt", cat: "men-shirts", price: 1299, discount: 15, stock: 30, sizes: ["M", "L", "XL", "XXL"], colors: ["Blue", "Light Blue"], desc: "Elegant formal shirt for office and special occasions." },
    { name: "White Linen Casual Shirt", cat: "men-shirts", price: 1499, discount: 20, stock: 25, sizes: ["S", "M", "L"], colors: ["White"], desc: "Breathable linen fabric for summer comfort." },
    { name: "Red Checkered Shirt", cat: "men-shirts", price: 899, discount: 5, stock: 40, sizes: ["M", "L", "XL"], colors: ["Red", "Maroon"], desc: "Trendy checkered pattern for casual outings." },
    { name: "Navy Blue Striped Shirt", cat: "men-shirts", price: 1199, discount: 12, stock: 35, sizes: ["S", "M", "L", "XL"], colors: ["Navy", "Blue"], desc: "Classic striped design for a smart look." },
    { name: "Grey Slim Fit Shirt", cat: "men-shirts", price: 1399, discount: 18, stock: 20, sizes: ["M", "L", "XL"], colors: ["Grey"], desc: "Modern slim fit shirt for a sleek appearance." },
    { name: "Yellow Party Wear Shirt", cat: "men-shirts", price: 1599, discount: 25, stock: 15, sizes: ["S", "M", "L", "XL"], colors: ["Yellow", "Gold"], desc: "Stand out in this vibrant party wear shirt." },
    { name: "Green Printed Shirt", cat: "men-shirts", price: 1099, discount: 10, stock: 30, sizes: ["M", "L", "XL"], colors: ["Green", "Olive"], desc: "Unique printed design for fashion-forward men." },
    // Men - T-Shirts
    { name: "Basic Black T-Shirt", cat: "men-t-shirts", price: 499, discount: 0, stock: 100, sizes: ["S", "M", "L", "XL", "XXL"], colors: ["Black", "White", "Grey"], desc: "Essential cotton t-shirt for everyday wear." },
    { name: "Graphic Print T-Shirt", cat: "men-t-shirts", price: 699, discount: 10, stock: 80, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"], desc: "Bold graphic print for street style." },
    { name: "Polo Neck T-Shirt", cat: "men-t-shirts", price: 899, discount: 15, stock: 60, sizes: ["M", "L", "XL"], colors: ["Navy", "Red", "Green"], desc: "Classic polo neck for smart casual look." },
    { name: "Oversized Fit T-Shirt", cat: "men-t-shirts", price: 799, discount: 5, stock: 70, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Grey"], desc: "Trendy oversized fit for modern style." },
    { name: "Striped T-Shirt Pack of 2", cat: "men-t-shirts", price: 1199, discount: 20, stock: 50, sizes: ["M", "L", "XL"], colors: ["Multi"], desc: "Pack of 2 stylish striped t-shirts." },
    { name: "V-Neck Casual T-Shirt", cat: "men-t-shirts", price: 599, discount: 0, stock: 90, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White", "Blue"], desc: "Comfortable v-neck for daily casual wear." },
    { name: "Sports Dry Fit T-Shirt", cat: "men-t-shirts", price: 999, discount: 10, stock: 75, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Blue", "Red"], desc: "Moisture-wicking fabric for workouts." },
    { name: "Vintage Wash T-Shirt", cat: "men-t-shirts", price: 849, discount: 8, stock: 55, sizes: ["M", "L", "XL"], colors: ["Vintage Blue", "Vintage Black"], desc: "Vintage wash finish for retro look." },
    // Men - Jeans
    { name: "Classic Blue Denim Jeans", cat: "men-jeans", price: 1499, discount: 20, stock: 40, sizes: ["28", "30", "32", "34", "36"], colors: ["Blue"], desc: "Timeless denim jeans for everyday wear." },
    { name: "Slim Fit Black Jeans", cat: "men-jeans", price: 1799, discount: 25, stock: 30, sizes: ["30", "32", "34"], colors: ["Black"], desc: "Slim fit black jeans for a sleek look." },
    { name: "Ripped Jeans", cat: "men-jeans", price: 1599, discount: 15, stock: 25, sizes: ["28", "30", "32", "34"], colors: ["Blue", "Black"], desc: "Trendy ripped jeans for edgy style." },
    { name: "Stretchable Jeans", cat: "men-jeans", price: 1399, discount: 10, stock: 45, sizes: ["30", "32", "34", "36"], colors: ["Dark Blue"], desc: "Comfortable stretchable denim for all-day wear." },
    { name: "Cargo Jeans", cat: "men-jeans", price: 1699, discount: 18, stock: 20, sizes: ["30", "32", "34"], colors: ["Khaki", "Olive"], desc: "Utility cargo jeans with multiple pockets." },
    { name: "Stone Wash Jeans", cat: "men-jeans", price: 1899, discount: 22, stock: 18, sizes: ["28", "30", "32", "34"], colors: ["Light Blue"], desc: "Stone wash finish for vintage appeal." },
    { name: "Jogger Jeans", cat: "men-jeans", price: 1299, discount: 12, stock: 35, sizes: ["S", "M", "L", "XL"], colors: ["Grey", "Black"], desc: "Casual jogger style jeans for comfort." },
    { name: "Bootcut Jeans", cat: "men-jeans", price: 1499, discount: 15, stock: 28, sizes: ["30", "32", "34"], colors: ["Blue"], desc: "Classic bootcut for a timeless silhouette." },
    // Men - Trousers
    { name: "Formal Black Trousers", cat: "men-trousers", price: 1299, discount: 10, stock: 40, sizes: ["30", "32", "34", "36"], colors: ["Black"], desc: "Sharp formal trousers for office wear." },
    { name: "Beige Chinos", cat: "men-trousers", price: 1199, discount: 8, stock: 50, sizes: ["30", "32", "34"], colors: ["Beige", "Khaki"], desc: "Versatile chinos for casual and semi-formal." },
    { name: "Navy Formal Trousers", cat: "men-trousers", price: 1399, discount: 15, stock: 35, sizes: ["30", "32", "34", "36"], colors: ["Navy"], desc: "Professional navy trousers for formal occasions." },
    { name: "Grey Casual Trousers", cat: "men-trousers", price: 999, discount: 5, stock: 60, sizes: ["30", "32", "34"], colors: ["Grey"], desc: "Comfortable casual trousers for daily wear." },
    { name: "Olive Cargo Trousers", cat: "men-trousers", price: 1499, discount: 12, stock: 30, sizes: ["30", "32", "34"], colors: ["Olive"], desc: "Rugged cargo trousers for adventure." },
    { name: "White Linen Trousers", cat: "men-trousers", price: 1599, discount: 18, stock: 25, sizes: ["30", "32", "34"], colors: ["White"], desc: "Lightweight linen trousers for summer." },
    { name: "Black Jogger Pants", cat: "men-trousers", price: 899, discount: 10, stock: 70, sizes: ["S", "M", "L", "XL"], colors: ["Black", "Grey"], desc: "Comfortable joggers for casual wear." },
    { name: "Brown Corduroy Trousers", cat: "men-trousers", price: 1699, discount: 20, stock: 20, sizes: ["30", "32", "34"], colors: ["Brown"], desc: "Textured corduroy for winter warmth." },
    // Men - Jackets
    { name: "Leather Biker Jacket", cat: "men-jackets", price: 3499, discount: 25, stock: 15, sizes: ["M", "L", "XL"], colors: ["Black"], desc: "Genuine leather jacket for bold style." },
    { name: "Denim Jacket", cat: "men-jackets", price: 1999, discount: 15, stock: 25, sizes: ["S", "M", "L", "XL"], colors: ["Blue", "Black"], desc: "Classic denim jacket for layering." },
    { name: "Puffer Jacket", cat: "men-jackets", price: 2499, discount: 20, stock: 20, sizes: ["M", "L", "XL", "XXL"], colors: ["Black", "Navy"], desc: "Warm puffer jacket for winter." },
    { name: "Bomber Jacket", cat: "men-jackets", price: 2199, discount: 18, stock: 22, sizes: ["M", "L", "XL"], colors: ["Green", "Black"], desc: "Trendy bomber jacket for casual outings." },
    { name: "Hooded Jacket", cat: "men-jackets", price: 1799, discount: 12, stock: 30, sizes: ["S", "M", "L", "XL"], colors: ["Grey", "Black", "Navy"], desc: "Comfortable hooded jacket for everyday wear." },
    { name: "Windbreaker", cat: "men-jackets", price: 1599, discount: 10, stock: 35, sizes: ["S", "M", "L", "XL"], colors: ["Red", "Blue", "Black"], desc: "Lightweight windbreaker for outdoor activities." },
    { name: "Suede Jacket", cat: "men-jackets", price: 2999, discount: 22, stock: 12, sizes: ["M", "L", "XL"], colors: ["Tan", "Brown"], desc: "Premium suede jacket for sophisticated look." },
    { name: "Quilted Jacket", cat: "men-jackets", price: 2299, discount: 16, stock: 18, sizes: ["M", "L", "XL"], colors: ["Black", "Navy"], desc: "Elegant quilted jacket for cold weather." },
    // Men - Kurta
    { name: "White Cotton Kurta", cat: "men-kurta", price: 999, discount: 10, stock: 50, sizes: ["S", "M", "L", "XL"], colors: ["White"], desc: "Classic white kurta for festivals." },
    { name: "Embroidered Kurta", cat: "men-kurta", price: 1799, discount: 20, stock: 25, sizes: ["M", "L", "XL"], colors: ["White", "Cream"], desc: "Intricately embroidered kurta for special occasions." },
    { name: "Linen Kurta", cat: "men-kurta", price: 1299, discount: 15, stock: 35, sizes: ["S", "M", "L", "XL"], colors: ["Beige", "White"], desc: "Breathable linen kurta for summer." },
    { name: "Black Party Wear Kurta", cat: "men-kurta", price: 2199, discount: 25, stock: 20, sizes: ["M", "L", "XL"], colors: ["Black", "Navy"], desc: "Stylish kurta for parties and events." },
    { name: "Printed Kurta", cat: "men-kurta", price: 1199, discount: 12, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["Multi"], desc: "Colorful printed kurta for casual wear." },
    { name: "Silk Blend Kurta", cat: "men-kurta", price: 2499, discount: 22, stock: 15, sizes: ["M", "L", "XL"], colors: ["Gold", "Maroon"], desc: "Luxurious silk blend for weddings." },
    { name: "Short Kurta", cat: "men-kurta", price: 899, discount: 8, stock: 45, sizes: ["S", "M", "L"], colors: ["White", "Cream"], desc: "Modern short kurta for daily wear." },
    { name: "Pathani Suit Kurta", cat: "men-kurta", price: 1899, discount: 18, stock: 22, sizes: ["M", "L", "XL"], colors: ["Black", "Grey"], desc: "Traditional Pathani style kurta set." },
    // Women - Kurtis
    { name: "Cotton Printed Kurti", cat: "women-kurtis", price: 799, discount: 10, stock: 60, sizes: ["S", "M", "L", "XL"], colors: ["Pink", "Blue", "Yellow"], desc: "Comfortable cotton kurti for daily wear." },
    { name: "Designer Anarkali Kurti", cat: "women-kurtis", price: 1999, discount: 25, stock: 20, sizes: ["S", "M", "L"], colors: ["Red", "Green", "Blue"], desc: "Elegant Anarkali for special occasions." },
    { name: "Embroidered Kurti", cat: "women-kurtis", price: 1499, discount: 15, stock: 30, sizes: ["S", "M", "L", "XL"], colors: ["White", "Cream"], desc: "Beautiful embroidery work for festive look." },
    { name: "Rayon Straight Cut Kurti", cat: "women-kurtis", price: 999, discount: 12, stock: 45, sizes: ["S", "M", "L"], colors: ["Navy", "Maroon", "Black"], desc: "Trendy straight cut kurti for office." },
    { name: "Floral Print Kurti", cat: "women-kurtis", price: 899, discount: 10, stock: 50, sizes: ["S", "M", "L", "XL"], colors: ["Pink", "Blue"], desc: "Playful floral prints for summer." },
    { name: "Silk Kurti", cat: "women-kurtis", price: 2499, discount: 30, stock: 15, sizes: ["S", "M", "L"], colors: ["Gold", "Red"], desc: "Luxurious silk kurti for parties." },
    { name: "Cotton Straight Kurti", cat: "women-kurtis", price: 799, discount: 8, stock: 55, sizes: ["S", "M", "L", "XL"], colors: ["Multi"], desc: "Everyday cotton kurti in various prints." },
    { name: "Layered Kurti", cat: "women-kurtis", price: 1599, discount: 20, stock: 25, sizes: ["S", "M", "L"], colors: ["Black", "White"], desc: "Fashionable layered kurti for modern women." },
    // Women - Dresses
    { name: "Floral Maxi Dress", cat: "women-dresses", price: 1499, discount: 20, stock: 25, sizes: ["S", "M", "L"], colors: ["Pink", "Blue"], desc: "Flowy maxi dress for summer outings." },
    { name: "Little Black Dress", cat: "women-dresses", price: 1799, discount: 15, stock: 20, sizes: ["S", "M", "L"], colors: ["Black"], desc: "Timeless LBD for every occasion." },
    { name: "Cotton A-Line Dress", cat: "women-dresses", price: 999, discount: 10, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["White", "Yellow", "Pink"], desc: "Comfortable A-line dress for casual wear." },
    { name: "Evening Gown", cat: "women-dresses", price: 3499, discount: 30, stock: 10, sizes: ["S", "M", "L"], colors: ["Red", "Black", "Navy"], desc: "Stunning gown for evening events." },
    { name: "Shirt Dress", cat: "women-dresses", price: 1299, discount: 12, stock: 30, sizes: ["S", "M", "L"], colors: ["Blue", "White", "Striped"], desc: "Casual shirt dress for effortless style." },
    { name: "Wrap Dress", cat: "women-dresses", price: 1199, discount: 10, stock: 35, sizes: ["S", "M", "L"], colors: ["Floral", "Solid"], desc: "Flattering wrap dress for all body types." },
    { name: "Midi Dress", cat: "women-dresses", price: 1399, discount: 15, stock: 28, sizes: ["S", "M", "L"], colors: ["Pastel"], desc: "Elegant midi dress for brunch dates." },
    { name: "Cocktail Dress", cat: "women-dresses", price: 2299, discount: 25, stock: 15, sizes: ["S", "M", "L"], colors: ["Black", "Red"], desc: "Glamorous cocktail dress for parties." },
    // Women - Tops
    { name: "Silk Blouse", cat: "women-tops", price: 1299, discount: 15, stock: 35, sizes: ["S", "M", "L"], colors: ["White", "Cream", "Pink"], desc: "Elegant silk blouse for formal wear." },
    { name: "Cotton T-Shirt", cat: "women-tops", price: 599, discount: 5, stock: 80, sizes: ["S", "M", "L", "XL"], colors: ["White", "Black", "Grey"], desc: "Basic cotton tee for everyday comfort." },
    { name: "Off Shoulder Top", cat: "women-tops", price: 899, discount: 10, stock: 50, sizes: ["S", "M", "L"], colors: ["White", "Pink", "Blue"], desc: "Trendy off-shoulder top for summer." },
    { name: "Crop Top", cat: "women-tops", price: 699, discount: 8, stock: 60, sizes: ["S", "M", "L"], colors: ["Black", "White", "Pastel"], desc: "Stylish crop top for casual outings." },
    { name: "Peplum Top", cat: "women-tops", price: 1099, discount: 12, stock: 40, sizes: ["S", "M", "L"], colors: ["Red", "Black", "Navy"], desc: "Flattering peplum top for office wear." },
    { name: "Cold Shoulder Top", cat: "women-tops", price: 799, discount: 10, stock: 45, sizes: ["S", "M", "L"], colors: ["Pink", "Blue", "White"], desc: "Fashionable cold shoulder design." },
    { name: "Lace Top", cat: "women-tops", price: 1199, discount: 15, stock: 30, sizes: ["S", "M", "L"], colors: ["White", "Black", "Red"], desc: "Delicate lace top for special occasions." },
    { name: "Graphic Print Top", cat: "women-tops", price: 699, discount: 5, stock: 55, sizes: ["S", "M", "L"], colors: ["Multi"], desc: "Fun graphic prints for casual style." },
    // Women - Sarees
    { name: "Silk Saree", cat: "women-sarees", price: 2999, discount: 25, stock: 15, sizes: ["Free Size"], colors: ["Red", "Green", "Blue"], desc: "Premium silk saree for weddings." },
    { name: "Cotton Saree", cat: "women-sarees", price: 999, discount: 10, stock: 40, sizes: ["Free Size"], colors: ["Multi"], desc: "Comfortable cotton saree for daily wear." },
    { name: "Georgette Saree", cat: "women-sarees", price: 1499, discount: 15, stock: 25, sizes: ["Free Size"], colors: ["Pink", "Blue", "Yellow"], desc: "Flowy georgette saree for parties." },
    { name: "Banarasi Saree", cat: "women-sarees", price: 3499, discount: 30, stock: 10, sizes: ["Free Size"], colors: ["Red", "Gold"], desc: "Traditional Banarasi silk for festivals." },
    { name: "Chiffon Saree", cat: "women-sarees", price: 1299, discount: 12, stock: 30, sizes: ["Free Size"], colors: ["Pastel"], desc: "Lightweight chiffon for elegant drape." },
    { name: "Kanjivaram Saree", cat: "women-sarees", price: 4999, discount: 35, stock: 8, sizes: ["Free Size"], colors: ["Gold", "Red"], desc: "Luxurious Kanjivaram for weddings." },
    { name: "Linen Saree", cat: "women-sarees", price: 1599, discount: 18, stock: 20, sizes: ["Free Size"], colors: ["Natural", "White"], desc: "Eco-friendly linen saree for summer." },
    { name: "Bandhani Saree", cat: "women-sarees", price: 1999, discount: 22, stock: 18, sizes: ["Free Size"], colors: ["Multi"], desc: "Traditional Bandhani tie-dye art." },
    // Kids - Boys
    { name: "Boys Party Wear Shirt", cat: "kids-boys", price: 699, discount: 10, stock: 40, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Red", "White"], desc: "Smart shirt for boys parties." },
    { name: "Boys Casual T-Shirt", cat: "kids-boys", price: 499, discount: 5, stock: 60, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Multi"], desc: "Comfortable tee for daily play." },
    { name: "Boys Denim Jeans", cat: "kids-boys", price: 899, discount: 12, stock: 35, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Black"], desc: "Durable denim for active boys." },
    { name: "Boys Kurta Pyjama Set", cat: "kids-boys", price: 999, discount: 15, stock: 30, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["White", "Cream", "Yellow"], desc: "Traditional wear for festivals." },
    { name: "Boys Hoodie", cat: "kids-boys", price: 799, discount: 10, stock: 40, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Grey", "Black"], desc: "Warm hoodie for winter." },
    { name: "Boys Sports Set", cat: "kids-boys", price: 699, discount: 8, stock: 50, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Multi"], desc: "Active wear set for sports." },
    { name: "Boys Blazer", cat: "kids-boys", price: 1499, discount: 20, stock: 20, sizes: ["6-7Y", "8-9Y", "10-11Y"], colors: ["Navy", "Black"], desc: "Formal blazer for special events." },
    { name: "Boys Dhoti Kurta Set", cat: "kids-boys", price: 899, discount: 12, stock: 25, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["White", "Cream"], desc: "Traditional dhoti kurta for functions." },
    // Kids - Girls
    { name: "Girls Frock Dress", cat: "kids-girls", price: 799, discount: 10, stock: 45, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Pink", "Yellow", "White"], desc: "Cute frock for little girls." },
    { name: "Girls Lehenga Choli", cat: "kids-girls", price: 1499, discount: 20, stock: 20, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Pink", "Red", "Green"], desc: "Traditional lehenga for festivals." },
    { name: "Girls Casual Top", cat: "kids-girls", price: 499, discount: 5, stock: 55, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Multi"], desc: "Comfortable tops for daily wear." },
    { name: "Girls Jeans and Top Set", cat: "kids-girls", price: 899, discount: 12, stock: 30, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Pink", "Blue"], desc: "Trendy set for casual outings." },
    { name: "Girls Ethnic Wear Set", cat: "kids-girls", price: 1299, discount: 15, stock: 25, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Red", "Yellow", "Green"], desc: "Traditional ethnic set for functions." },
    { name: "Girls Hoodie Dress", cat: "kids-girls", price: 999, discount: 10, stock: 35, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Pink", "Purple", "Grey"], desc: "Cozy hoodie dress for winter." },
    { name: "Girls Party Wear Frock", cat: "kids-girls", price: 1199, discount: 18, stock: 22, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["White", "Pink", "Gold"], desc: "Elegant frock for parties." },
    { name: "Girls Skirt and Top Set", cat: "kids-girls", price: 699, discount: 8, stock: 40, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Multi"], desc: "Cute skirt set for summer." },
    // Kids - Baby Wear
    { name: "Baby Onesie Set", cat: "kids-baby-wear", price: 599, discount: 10, stock: 50, sizes: ["0-3M", "3-6M", "6-12M", "12-18M"], colors: ["Pink", "Blue", "Yellow", "White"], desc: "Soft cotton onesies for newborns." },
    { name: "Baby Romper", cat: "kids-baby-wear", price: 499, discount: 8, stock: 45, sizes: ["0-3M", "3-6M", "6-12M"], colors: ["Multi"], desc: "Cute rompers for baby boys and girls." },
    { name: "Baby Winter Set", cat: "kids-baby-wear", price: 899, discount: 15, stock: 30, sizes: ["0-3M", "3-6M", "6-12M"], colors: ["Pink", "Blue", "Grey"], desc: "Warm winter wear set for babies." },
    { name: "Baby Cotton Suit", cat: "kids-baby-wear", price: 699, discount: 10, stock: 40, sizes: ["0-3M", "3-6M", "6-12M", "12-18M"], colors: ["White", "Cream"], desc: "Soft cotton suit for daily wear." },
    { name: "Baby Party Wear", cat: "kids-baby-wear", price: 1099, discount: 18, stock: 20, sizes: ["3-6M", "6-12M", "12-18M"], colors: ["Pink", "Blue", "Gold"], desc: "Elegant outfit for special occasions." },
    { name: "Baby Sleep Suit", cat: "kids-baby-wear", price: 599, discount: 5, stock: 55, sizes: ["0-3M", "3-6M", "6-12M"], colors: ["Multi"], desc: "Cozy sleep suit for peaceful sleep." },
    { name: "Baby Swaddle Set", cat: "kids-baby-wear", price: 399, discount: 0, stock: 60, sizes: ["0-3M", "3-6M"], colors: ["Pastel"], desc: "Soft swaddles for newborn comfort." },
    { name: "Baby Gift Set", cat: "kids-baby-wear", price: 1499, discount: 20, stock: 15, sizes: ["0-3M", "3-6M"], colors: ["Multi"], desc: "Complete gift set for newborns." },
    // Additional Men - Shirts
    { name: "Brown Casual Shirt", cat: "men-shirts", price: 1099, discount: 10, stock: 35, sizes: ["M", "L", "XL"], colors: ["Brown", "Tan"], desc: "Relaxed fit casual shirt for weekends." },
    { name: "White Party Wear Shirt", cat: "men-shirts", price: 1699, discount: 20, stock: 18, sizes: ["S", "M", "L", "XL"], colors: ["White"], desc: "Crisp white shirt for evening events." },
    { name: "Blue Linen Shirt", cat: "men-shirts", price: 1399, discount: 15, stock: 28, sizes: ["M", "L", "XL"], colors: ["Light Blue"], desc: "Premium linen for hot days." },
    { name: "Maroon Festive Shirt", cat: "men-shirts", price: 1299, discount: 12, stock: 25, sizes: ["S", "M", "L"], colors: ["Maroon"], desc: "Rich maroon for festive occasions." },
    // Additional Men - T-Shirts
    { name: "Blue Polo T-Shirt", cat: "men-t-shirts", price: 799, discount: 10, stock: 65, sizes: ["S", "M", "L", "XL"], colors: ["Blue", "White"], desc: "Classic polo for smart casual." },
    { name: "Red Henley T-Shirt", cat: "men-t-shirts", price: 899, discount: 12, stock: 50, sizes: ["M", "L", "XL"], colors: ["Red", "Black"], desc: "Stylish henley for modern men." },
    { name: "White Basic T-Shirt Pack of 3", cat: "men-t-shirts", price: 1299, discount: 25, stock: 80, sizes: ["S", "M", "L", "XL"], colors: ["White"], desc: "Essential pack of 3 white tees." },
    { name: "Black Graphic T-Shirt", cat: "men-t-shirts", price: 749, discount: 8, stock: 70, sizes: ["S", "M", "L", "XL"], colors: ["Black"], desc: "Cool graphic design on black tee." },
    // Additional Men - Jeans
    { name: "Light Blue Slim Jeans", cat: "men-jeans", price: 1599, discount: 18, stock: 32, sizes: ["30", "32", "34"], colors: ["Light Blue"], desc: "Trendy slim fit in light wash." },
    { name: "Black Stretch Jeans", cat: "men-jeans", price: 1499, discount: 15, stock: 38, sizes: ["30", "32", "34"], colors: ["Black"], desc: "All-black stretch denim." },
    { name: "Blue Regular Fit Jeans", cat: "men-jeans", price: 1399, discount: 12, stock: 42, sizes: ["28", "30", "32", "34"], colors: ["Blue"], desc: "Classic regular fit for everyone." },
    // Additional Men - Trousers
    { name: "Charcoal Formal Trousers", cat: "men-trousers", price: 1399, discount: 15, stock: 32, sizes: ["30", "32", "34"], colors: ["Charcoal"], desc: "Sharp charcoal for formal meetings." },
    { name: "Khaki Chinos", cat: "men-trousers", price: 1199, discount: 10, stock: 45, sizes: ["30", "32", "34"], colors: ["Khaki"], desc: "Versatile khaki for smart casual." },
    { name: "Navy Cargo Pants", cat: "men-trousers", price: 1399, discount: 12, stock: 28, sizes: ["30", "32", "34"], colors: ["Navy"], desc: "Functional cargo pants for outdoors." },
    // Additional Men - Jackets
    { name: "Grey Hoodie Jacket", cat: "men-jackets", price: 1899, discount: 15, stock: 25, sizes: ["M", "L", "XL"], colors: ["Grey"], desc: "Cozy hoodie jacket for chilly evenings." },
    { name: "Red Sports Jacket", cat: "men-jackets", price: 1999, discount: 18, stock: 20, sizes: ["S", "M", "L"], colors: ["Red", "Black"], desc: "Lightweight jacket for sports." },
    { name: "Black Leather Jacket", cat: "men-jackets", price: 3999, discount: 30, stock: 10, sizes: ["M", "L", "XL"], colors: ["Black"], desc: "Premium leather for statement style." },
    // Additional Men - Kurta
    { name: "Indigo Dyed Kurta", cat: "men-kurta", price: 1399, discount: 15, stock: 28, sizes: ["S", "M", "L", "XL"], colors: ["Indigo"], desc: "Hand-dyed indigo kurta." },
    { name: "Cotton Blend Kurta", cat: "men-kurta", price: 1199, discount: 12, stock: 35, sizes: ["M", "L", "XL"], colors: ["White", "Cream"], desc: "Comfortable blend for daily wear." },
    // Additional Women - Kurtis
    { name: "Pink Cotton Kurti", cat: "women-kurtis", price: 799, discount: 10, stock: 50, sizes: ["S", "M", "L"], colors: ["Pink"], desc: "Soft pink kurti for daily wear." },
    { name: "Blue Embroidered Kurti", cat: "women-kurtis", price: 1399, discount: 18, stock: 25, sizes: ["S", "M", "L"], colors: ["Blue", "White"], desc: "Beautiful embroidery on blue base." },
    { name: "Green Straight Kurti", cat: "women-kurtis", price: 899, discount: 10, stock: 40, sizes: ["S", "M", "L", "XL"], colors: ["Green"], desc: "Vibrant green for festive vibes." },
    { name: "Yellow A-Line Kurti", cat: "women-kurtis", price: 999, discount: 12, stock: 35, sizes: ["S", "M", "L"], colors: ["Yellow"], desc: "Cheerful yellow A-line kurti." },
    // Additional Women - Dresses
    { name: "Red Fit and Flare Dress", cat: "women-dresses", price: 1599, discount: 20, stock: 22, sizes: ["S", "M", "L"], colors: ["Red"], desc: "Flattering fit and flare for parties." },
    { name: "Blue Denim Dress", cat: "women-dresses", price: 1299, discount: 15, stock: 28, sizes: ["S", "M", "L"], colors: ["Blue"], desc: "Casual denim dress for weekends." },
    { name: "White Summer Dress", cat: "women-dresses", price: 1199, discount: 12, stock: 32, sizes: ["S", "M", "L"], colors: ["White"], desc: "Light and breezy for summer." },
    { name: "Black Formal Dress", cat: "women-dresses", price: 1899, discount: 22, stock: 18, sizes: ["S", "M", "L"], colors: ["Black"], desc: "Sleek black dress for office parties." },
    // Additional Women - Tops
    { name: "Blue Denim Top", cat: "women-tops", price: 899, discount: 10, stock: 40, sizes: ["S", "M", "L"], colors: ["Blue"], desc: "Casual denim top for layering." },
    { name: "Red Ruffle Top", cat: "women-tops", price: 999, discount: 12, stock: 35, sizes: ["S", "M", "L"], colors: ["Red", "Pink"], desc: "Feminine ruffle details." },
    { name: "Green Cotton Top", cat: "women-tops", price: 699, discount: 8, stock: 50, sizes: ["S", "M", "L"], colors: ["Green"], desc: "Fresh green cotton for summer." },
    // Additional Women - Sarees
    { name: "Pink Silk Saree", cat: "women-sarees", price: 2799, discount: 22, stock: 12, sizes: ["Free Size"], colors: ["Pink"], desc: "Elegant pink silk for weddings." },
    { name: "White Georgette Saree", cat: "women-sarees", price: 1399, discount: 15, stock: 22, sizes: ["Free Size"], colors: ["White"], desc: "Pure white georgette for elegance." },
    { name: "Purple Cotton Saree", cat: "women-sarees", price: 1199, discount: 12, stock: 28, sizes: ["Free Size"], colors: ["Purple"], desc: "Soft purple cotton for daily wear." },
    // Additional Kids - Boys
    { name: "Boys Checks Shirt", cat: "kids-boys", price: 599, discount: 8, stock: 45, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Red"], desc: "Classic checks for school." },
    { name: "Boys Polo T-Shirt", cat: "kids-boys", price: 599, discount: 8, stock: 55, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Navy", "Red", "Green"], desc: "Smart polo for school and play." },
    { name: "Boys Winter Jacket", cat: "kids-boys", price: 1499, discount: 20, stock: 22, sizes: ["4-5Y", "6-7Y", "8-9Y", "10-11Y"], colors: ["Blue", "Black"], desc: "Warm jacket for cold weather." },
    // Additional Kids - Girls
    { name: "Girls Printed Frock", cat: "kids-girls", price: 699, discount: 10, stock: 40, sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"], colors: ["Multi"], desc: "Fun prints for playful days." },
    { name: "Girls Ethnic Kurta Set", cat: "kids-girls", price: 999, discount: 15, stock: 28, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Pink", "Yellow"], desc: "Traditional kurta set for festivals." },
    { name: "Girls Denim Jacket", cat: "kids-girls", price: 1199, discount: 15, stock: 25, sizes: ["4-5Y", "6-7Y", "8-9Y"], colors: ["Blue", "Pink"], desc: "Cute denim jacket for layering." },
    // Additional Kids - Baby Wear
    { name: "Baby Bibs Set", cat: "kids-baby-wear", price: 299, discount: 0, stock: 80, sizes: ["0-12M"], colors: ["Multi"], desc: "Pack of 5 soft cotton bibs." },
    { name: "Baby Cap and Booties Set", cat: "kids-baby-wear", price: 499, discount: 10, stock: 50, sizes: ["0-3M", "3-6M", "6-12M"], colors: ["Pink", "Blue"], desc: "Adorable cap and booties set." },
    { name: "Baby Mittens and Socks", cat: "kids-baby-wear", price: 349, discount: 5, stock: 60, sizes: ["0-6M"], colors: ["Pastel"], desc: "Soft mittens and socks for newborns." },
    { name: "Boys Checkered Shirt", cat: "men-shirts", price: 1099, discount: 12, stock: 30, sizes: ["M", "L", "XL"], colors: ["Blue", "White"], desc: "Classic checkered pattern." },
    { name: "Men Printed T-Shirt", cat: "men-t-shirts", price: 749, discount: 8, stock: 65, sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"], desc: "Bold prints for casual wear." },
    { name: "Women Embroidered Top", cat: "women-tops", price: 1299, discount: 15, stock: 30, sizes: ["S", "M", "L"], colors: ["White", "Cream"], desc: "Delicate embroidery details." },
    { name: "Kids Boys Dungaree", cat: "kids-boys", price: 899, discount: 12, stock: 25, sizes: ["2-3Y", "4-5Y", "6-7Y"], colors: ["Blue", "Green"], desc: "Cute dungaree for little boys." },
    { name: "Kids Girls Gown", cat: "kids-girls", price: 1099, discount: 15, stock: 20, sizes: ["2-3Y", "4-5Y", "6-7Y"], colors: ["Pink", "Purple"], desc: "Flowy gown for princesses." },
    { name: "Premium Silk Blend Kurti", cat: "women-kurtis", price: 1899, discount: 20, stock: 35, sizes: ["S", "M", "L", "XL"], colors: ["Maroon", "Navy", "Green"], desc: "Elegant silk blend kurti with intricate embroidery. Perfect for festivals and special occasions." },
    { name: "Men Slim Fit Denim Jeans", cat: "men-jeans", price: 1599, discount: 15, stock: 40, sizes: ["30", "32", "34", "36"], colors: ["Blue", "Black", "Grey"], desc: "Premium denim jeans with comfortable stretch fabric." },
  ];

  const categoryImageMap: Record<string, string> = {
    "men-shirts": "mens-shirt",
    "men-t-shirts": "mens-tshirt",
    "men-jeans": "mens-jeans",
    "men-trousers": "mens-trousers",
    "men-jackets": "mens-jacket",
    "men-kurta": "mens-kurta",
    "women-kurtis": "womens-kurti",
    "women-dresses": "womens-dress",
    "women-tops": "womens-top",
    "women-sarees": "womens-saree",
    "kids-boys": "boys-clothes",
    "kids-girls": "girls-dress",
    "kids-baby-wear": "baby-clothes",
  };

  for (const p of products) {
    const categoryId = categoryMap[p.cat];
    if (!categoryId) continue;
    const slug = p.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    const displayName = p.name.length > 25 ? p.name.substring(0, 25) + "..." : p.name;
    const imageUrl = `https://placehold.co/600x800/1a1a1a/c9a24b?text=${encodeURIComponent(displayName)}`;
    await prisma.product.upsert({
      where: { slug },
      update: {},
      create: {
        name: p.name,
        slug,
        description: p.desc,
        price: p.price,
        discount: p.discount,
        stock: p.stock,
        sizes: p.sizes,
        colors: p.colors,
        categoryId,
        images: {
          create: [{ url: imageUrl }],
        },
      },
    });
  }

  console.log(`Seeded ${products.length} products successfully`);

  const coupon1 = await prisma.coupon.upsert({
    where: { code: "WELCOME10" },
    update: {},
    create: {
      code: "WELCOME10",
      discountType: "PERCENTAGE",
      discountValue: 10,
      minOrderAmount: 500,
      maxDiscount: 200,
      startDate: new Date("2024-01-01"),
      expiryDate: new Date("2026-12-31"),
      usageLimit: 1000,
      isActive: true,
    },
  });

  const coupon2 = await prisma.coupon.upsert({
    where: { code: "FESTIVE20" },
    update: {},
    create: {
      code: "FESTIVE20",
      discountType: "PERCENTAGE",
      discountValue: 20,
      minOrderAmount: 1000,
      maxDiscount: 500,
      startDate: new Date("2024-01-01"),
      expiryDate: new Date("2026-12-31"),
      usageLimit: 500,
      isActive: true,
    },
  });

  console.log("Coupons created:", coupon1.code, coupon2.code);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
