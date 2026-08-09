import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: [{ featured: "desc" }, { nameEn: "asc" }],
  });
  return NextResponse.json({ products });
}

const createSchema = z.object({
  sku: z.string().min(1),
  nameZh: z.string().min(1),
  nameEn: z.string().min(1),
  descriptionZh: z.string().default(""),
  descriptionEn: z.string().default(""),
  unitZh: z.string().min(1),
  unitEn: z.string().min(1),
  packSize: z.string().min(1),
  wholesalePrice: z.coerce.number().positive(),
  moq: z.coerce.number().int().positive().default(1),
  imageEmoji: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().min(1),
  slug: z.string().optional(),
});

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "请检查商品必填项" }, { status: 400 });
  }

  let slug = (parsed.data.slug || slugify(parsed.data.nameEn || parsed.data.sku, "prod")).slice(0, 64);
  const exists = await prisma.product.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  try {
    const product = await prisma.product.create({
      data: {
        sku: parsed.data.sku.trim(),
        slug,
        nameZh: parsed.data.nameZh,
        nameEn: parsed.data.nameEn,
        descriptionZh: parsed.data.descriptionZh || parsed.data.nameZh,
        descriptionEn: parsed.data.descriptionEn || parsed.data.nameEn,
        unitZh: parsed.data.unitZh,
        unitEn: parsed.data.unitEn,
        packSize: parsed.data.packSize,
        wholesalePrice: parsed.data.wholesalePrice,
        moq: parsed.data.moq,
        imageEmoji: parsed.data.imageEmoji || "📦",
        imageUrl: parsed.data.imageUrl || null,
        featured: parsed.data.featured ?? false,
        active: parsed.data.active ?? true,
        categoryId: parsed.data.categoryId,
      },
      include: { category: true },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "创建失败（SKU 可能重复）" }, { status: 400 });
  }
}
