import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customRequest.deleteMany();
  await prisma.wholesaleApplication.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash("admin123", 10);
  await prisma.user.create({
    data: {
      email: "admin@kitchenlink.us",
      passwordHash,
      name: "KitchenLink Admin",
      companyName: "KitchenLink Wholesale",
      role: "ADMIN",
      locale: "zh",
    },
  });

  const demoHash = await bcrypt.hash("demo1234", 10);
  await prisma.user.create({
    data: {
      email: "demo@goldenwok.us",
      passwordHash: demoHash,
      name: "Zhang Wei",
      phone: "+1 (626) 555-0100",
      companyName: "Golden Wok Restaurant",
      businessType: "restaurant",
      role: "WHOLESALE",
      locale: "zh",
    },
  });

  const categories = await Promise.all([
    prisma.category.create({
      data: { slug: "sauces-seasonings", nameEn: "Sauces & Seasonings", nameZh: "酱料调味", sortOrder: 1 },
    }),
    prisma.category.create({
      data: { slug: "rice-noodles", nameEn: "Rice & Noodles", nameZh: "米面干货", sortOrder: 2 },
    }),
    prisma.category.create({
      data: { slug: "oils-fats", nameEn: "Cooking Oils", nameZh: "食用油脂", sortOrder: 3 },
    }),
    prisma.category.create({
      data: { slug: "frozen-proteins", nameEn: "Frozen Proteins", nameZh: "冷冻蛋白", sortOrder: 4 },
    }),
    prisma.category.create({
      data: { slug: "disposables", nameEn: "Disposables & Packaging", nameZh: "打包耗材", sortOrder: 5 },
    }),
    prisma.category.create({
      data: { slug: "beverages", nameEn: "Beverages & Tea", nameZh: "饮料茶叶", sortOrder: 6 },
    }),
  ]);

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    {
      sku: "SOY-001",
      slug: "premium-light-soy-sauce-case",
      nameEn: "Premium Light Soy Sauce",
      nameZh: "特级生抽",
      descriptionEn: "Restaurant-grade light soy. Clean saltiness for stir-fry and dipping.",
      descriptionZh: "餐饮级特级生抽，咸香干净，适合炒菜、蘸料与调味。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "6×1.8L",
      wholesalePrice: 28.5,
      moq: 2,
      imageEmoji: "🫙",
      featured: true,
      categoryId: bySlug["sauces-seasonings"],
    },
    {
      sku: "SOY-002",
      slug: "dark-soy-sauce-case",
      nameEn: "Dark Soy Sauce",
      nameZh: "老抽",
      descriptionEn: "Rich color for braising and red-braised dishes.",
      descriptionZh: "色泽浓郁，适合红烧、卤味与上色。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "6×1.8L",
      wholesalePrice: 26.0,
      moq: 2,
      imageEmoji: "🟤",
      featured: true,
      categoryId: bySlug["sauces-seasonings"],
    },
    {
      sku: "OYSTER-01",
      slug: "oyster-sauce-foodservice",
      nameEn: "Oyster Sauce Foodservice",
      nameZh: "蚝油（餐饮装）",
      descriptionEn: "Thick oyster sauce for wok stations and prep kitchens.",
      descriptionZh: "浓稠蚝油，适合后厨炒菜与酱汁配比。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "6×2.2kg",
      wholesalePrice: 42.0,
      moq: 1,
      imageEmoji: "🦪",
      featured: true,
      categoryId: bySlug["sauces-seasonings"],
    },
    {
      sku: "RICE-50",
      slug: "jasmine-rice-50lb",
      nameEn: "Jasmine Rice 50lb",
      nameZh: "茉莉香米 50磅",
      descriptionEn: "Fragrant long-grain jasmine rice for high-volume kitchens.",
      descriptionZh: "香软长粒茉莉香米，适合堂食与外卖高峰用量。",
      unitEn: "bag",
      unitZh: "袋",
      packSize: "50 lb",
      wholesalePrice: 38.9,
      moq: 5,
      imageEmoji: "🍚",
      featured: true,
      categoryId: bySlug["rice-noodles"],
    },
    {
      sku: "NOOD-01",
      slug: "egg-noodles-dry-case",
      nameEn: "Dry Egg Noodles",
      nameZh: "鸡蛋面（干面）",
      descriptionEn: "Dry egg noodles for lo mein and chow mein stations.",
      descriptionZh: "干鸡蛋面，适合捞面、炒面档口。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "30×400g",
      wholesalePrice: 34.5,
      moq: 2,
      imageEmoji: "🍜",
      featured: false,
      categoryId: bySlug["rice-noodles"],
    },
    {
      sku: "OIL-35",
      slug: "soybean-oil-35lb",
      nameEn: "Soybean Frying Oil 35lb",
      nameZh: "大豆油 35磅",
      descriptionEn: "High smoke-point frying oil for deep fryers.",
      descriptionZh: "高烟点炸油，适合炸炉与快炒。",
      unitEn: "pail",
      unitZh: "桶",
      packSize: "35 lb",
      wholesalePrice: 49.0,
      moq: 4,
      imageEmoji: "🫒",
      featured: true,
      categoryId: bySlug["oils-fats"],
    },
    {
      sku: "CHK-10",
      slug: "frozen-chicken-thigh-case",
      nameEn: "Frozen Boneless Chicken Thigh",
      nameZh: "冷冻去骨鸡腿肉",
      descriptionEn: "Boneless thigh meat for general Chinese cooking.",
      descriptionZh: "去骨鸡腿肉，适合宫保、黄焖与盖饭。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "40 lb",
      wholesalePrice: 78.0,
      moq: 1,
      imageEmoji: "🍗",
      featured: true,
      categoryId: bySlug["frozen-proteins"],
    },
    {
      sku: "PKG-01",
      slug: "takeout-containers-case",
      nameEn: "Plastic Takeout Containers",
      nameZh: "外卖打包盒",
      descriptionEn: "Microwave-safe hinged containers for takeout volume.",
      descriptionZh: "可微波翻盖打包盒，适合外卖高峰。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "150 pcs",
      wholesalePrice: 32.0,
      moq: 3,
      imageEmoji: "🥡",
      featured: false,
      categoryId: bySlug["disposables"],
    },
    {
      sku: "TEA-01",
      slug: "jasmine-tea-bag-bulk",
      nameEn: "Jasmine Tea Bags Bulk",
      nameZh: "茉莉花茶包（餐饮）",
      descriptionEn: "Complimentary tea service bags for dining rooms.",
      descriptionZh: "堂食奉茶用茶包，清香耐泡。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "1000 bags",
      wholesalePrice: 24.0,
      moq: 2,
      imageEmoji: "🍵",
      featured: false,
      categoryId: bySlug["beverages"],
    },
    {
      sku: "CHILI-01",
      slug: "chili-crisp-foodservice",
      nameEn: "Chili Crisp Foodservice",
      nameZh: "香辣脆油辣椒（餐饮）",
      descriptionEn: "Popular table condiment and wok finishing chili oil.",
      descriptionZh: "热门桌边调料与收汁香辣油。",
      unitEn: "case",
      unitZh: "箱",
      packSize: "12×7.4oz",
      wholesalePrice: 54.0,
      moq: 1,
      imageEmoji: "🌶️",
      featured: true,
      categoryId: bySlug["sauces-seasonings"],
    },
  ];

  for (const p of products) {
    await prisma.product.create({ data: p });
  }

  console.log("Seed complete.");
  console.log("Admin: admin@kitchenlink.us / admin123");
  console.log("Demo wholesale: demo@goldenwok.us / demo1234");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
