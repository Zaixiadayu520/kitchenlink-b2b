import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

const patchSchema = z.object({
  sku: z.string().min(1).optional(),
  nameZh: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  descriptionZh: z.string().optional(),
  descriptionEn: z.string().optional(),
  unitZh: z.string().min(1).optional(),
  unitEn: z.string().min(1).optional(),
  packSize: z.string().min(1).optional(),
  wholesalePrice: z.coerce.number().positive().optional(),
  moq: z.coerce.number().int().positive().optional(),
  imageEmoji: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
  categoryId: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;
  const body = await req.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  const data = { ...parsed.data };
  if (data.slug) data.slug = slugify(data.slug, "prod");

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { category: true },
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "更新失败（SKU/链接可能冲突）" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;

  const inOrders = await prisma.orderItem.count({ where: { productId: id } });
  if (inOrders > 0) {
    // Soft delete if referenced by orders
    await prisma.product.update({ where: { id }, data: { active: false } });
    return NextResponse.json({ ok: true, softDeleted: true });
  }

  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
