import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

const patchSchema = z.object({
  nameZh: z.string().min(1).optional(),
  nameEn: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  sortOrder: z.coerce.number().int().optional(),
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
  if (data.slug) data.slug = slugify(data.slug, "cat");

  try {
    const category = await prisma.category.update({ where: { id }, data });
    return NextResponse.json({ category });
  } catch {
    return NextResponse.json({ error: "Update failed (slug may be taken)" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { error } = await requireAdmin();
  if (error) return error;
  const { id } = await ctx.params;

  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    return NextResponse.json(
      { error: `该品类下还有 ${count} 个商品，请先删除或移走商品` },
      { status: 400 },
    );
  }

  await prisma.category.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
