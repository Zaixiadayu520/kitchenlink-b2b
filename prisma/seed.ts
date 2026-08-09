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
      data: {
        slug: "napkins-paper",
        nameEn: "Napkins & Paper",
        nameZh: "??? / ??",
        imageUrl: "/images/cat-napkins.jpg",
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: "thermal-paper",
        nameEn: "Thermal Paper",
        nameZh: "???",
        imageUrl: "/images/cat-thermal.jpg",
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: "menus-print",
        nameEn: "Menus & Print",
        nameZh: "????",
        imageUrl: "/images/cat-menus.jpg",
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: "lightbox-signage",
        nameEn: "Lightbox & Signage",
        nameZh: "?? / ????",
        imageUrl: "/images/cat-lightbox.jpg",
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        slug: "takeout-packaging",
        nameEn: "Takeout Packaging",
        nameZh: "???",
        imageUrl: "/images/cat-takeout.jpg",
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        slug: "tableware",
        nameEn: "Tableware & Utensils",
        nameZh: "??",
        imageUrl: "/images/cat-utensils.jpg",
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        slug: "kitchen-supplies",
        nameEn: "Kitchen Supplies",
        nameZh: "????",
        imageUrl: "/images/cat-kitchen.jpg",
        sortOrder: 7,
      },
    }),
  ]);

  const bySlug = Object.fromEntries(categories.map((c) => [c.slug, c.id]));

  const products = [
    {
      sku: "NAP-WHT-500",
      slug: "white-dinner-napkins-case",
      nameEn: "White Dinner Napkins",
      nameZh: "???????????",
      descriptionEn: "Bulk white napkins for dining rooms and takeout. Soft, absorbent, case packed.",
      descriptionZh: "???????????????????????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "20 x 500 pcs",
      wholesalePrice: 36.5,
      moq: 2,
      imageEmoji: "1F9FB",
      imageUrl: "/images/prod-napkins.jpg",
      featured: true,
      categoryId: bySlug["napkins-paper"],
    },
    {
      sku: "THM-80-50",
      slug: "thermal-receipt-rolls-80mm",
      nameEn: "Thermal Receipt Rolls 80mm",
      nameZh: "????? 80mm",
      descriptionEn: "POS thermal rolls for cashiers and online-order printers. Stable imaging, low dust.",
      descriptionZh: "??? / ??????? 80mm ????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "50 rolls",
      wholesalePrice: 42.0,
      moq: 1,
      imageEmoji: "1F9FE",
      imageUrl: "/images/prod-thermal.jpg",
      featured: true,
      categoryId: bySlug["thermal-paper"],
    },
    {
      sku: "MNU-A4-CLR",
      slug: "bilingual-menu-print-pack",
      nameEn: "Bilingual Menu Print Pack",
      nameZh: "??????????",
      descriptionEn: "Custom bilingual menu printing for Chinese restaurants. Laminated options available.",
      descriptionZh: "??????????????????????????????",
      unitEn: "set",
      unitZh: "?",
      packSize: "50 pcs / set",
      wholesalePrice: 89.0,
      moq: 1,
      imageEmoji: "1F4CB",
      imageUrl: "/images/cat-menus.jpg",
      featured: true,
      categoryId: bySlug["menus-print"],
    },
    {
      sku: "LBX-LED-24",
      slug: "led-menu-lightbox-24x36",
      nameEn: "LED Menu Lightbox 24x36",
      nameZh: "LED ???? 24x36",
      descriptionEn: "Bright LED lightbox for wall menu boards. Custom graphic insert available.",
      descriptionZh: "??? LED ???????????????????",
      unitEn: "unit",
      unitZh: "?",
      packSize: "24x36 in",
      wholesalePrice: 168.0,
      moq: 1,
      imageEmoji: "1F5BC",
      imageUrl: "/images/cat-lightbox.jpg",
      featured: true,
      categoryId: bySlug["lightbox-signage"],
    },
    {
      sku: "PKG-HNG-150",
      slug: "hinged-takeout-containers",
      nameEn: "Hinged Takeout Containers",
      nameZh: "?????",
      descriptionEn: "Microwave-safe hinged containers for high-volume takeout.",
      descriptionZh: "????????????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "150 pcs",
      wholesalePrice: 34.5,
      moq: 3,
      imageEmoji: "1F961",
      imageUrl: "/images/prod-takeout.jpg",
      featured: true,
      categoryId: bySlug["takeout-packaging"],
    },
    {
      sku: "UTN-CHOP-1000",
      slug: "bamboo-chopsticks-sleeved",
      nameEn: "Sleeved Bamboo Chopsticks",
      nameZh: "??????",
      descriptionEn: "Individually sleeved bamboo chopsticks for dine-in and delivery.",
      descriptionZh: "???????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "1000 pairs",
      wholesalePrice: 28.0,
      moq: 2,
      imageEmoji: "1F962",
      imageUrl: "/images/prod-chopsticks.jpg",
      featured: true,
      categoryId: bySlug["tableware"],
    },
    {
      sku: "KIT-GLOVE-M",
      slug: "foodservice-gloves-medium",
      nameEn: "Foodservice Gloves Medium",
      nameZh: "????????",
      descriptionEn: "Disposable prep gloves for kitchen stations.",
      descriptionZh: "?????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "10 x 100 pcs",
      wholesalePrice: 31.0,
      moq: 2,
      imageEmoji: "1F9E4",
      imageUrl: "/images/cat-kitchen.jpg",
      featured: false,
      categoryId: bySlug["kitchen-supplies"],
    },
    {
      sku: "NAP-DSP-300",
      slug: "dispenser-napkins-case",
      nameEn: "Dispenser Napkins",
      nameZh: "?????",
      descriptionEn: "Folded dispenser napkins for counter and dining service.",
      descriptionZh: "????????????????????",
      unitEn: "case",
      unitZh: "?",
      packSize: "16 x 300 pcs",
      wholesalePrice: 29.5,
      moq: 2,
      imageEmoji: "1F9FB",
      imageUrl: "/images/prod-napkins.jpg",
      featured: false,
      categoryId: bySlug["napkins-paper"],
    },
  ];

  for (const p of products) {
    const { imageEmoji, ...rest } = p;
    await prisma.product.create({
      data: {
        ...rest,
        imageEmoji: String.fromCodePoint(parseInt(imageEmoji, 16)),
      },
    });
  }

  console.log("Seed complete ? restaurant consumables catalog.");
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
