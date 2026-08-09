import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";
import { slugify } from "@/lib/slug";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return NextResponse.json({ categories });
}

const createSchema = z.object({
  nameZh: z.string().min(1),
  nameEn: z.string().min(1),
  slug: z.string().optional(),
  sortOrder: z.coerce.number().int().optional(),
});

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid category data" }, { status: 400 });
  }

  let slug = (parsed.data.slug || slugify(parsed.data.nameEn || parsed.data.nameZh, "cat")).slice(0, 64);
  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) slug = `${slug}-${Date.now().toString(36).slice(-4)}`;

  const category = await prisma.category.create({
    data: {
      nameZh: parsed.data.nameZh,
      nameEn: parsed.data.nameEn,
      slug,
      sortOrder: parsed.data.sortOrder ?? 0,
    },
  });
  return NextResponse.json({ category });
}
