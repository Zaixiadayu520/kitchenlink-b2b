import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  note: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Please log in with a wholesale account" }, { status: 401 });
  }
  if (session.role !== "WHOLESALE" && session.role !== "ADMIN") {
    return NextResponse.json({ error: "Account pending approval" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid order sheet" }, { status: 400 });
  }

  const products = await prisma.product.findMany({
    where: { id: { in: parsed.data.items.map((i) => i.productId) }, active: true },
  });
  const byId = Object.fromEntries(products.map((p) => [p.id, p]));

  let total = 0;
  const lines = [];
  for (const item of parsed.data.items) {
    const p = byId[item.productId];
    if (!p) continue;
    if (item.quantity < p.moq) {
      return NextResponse.json(
        { error: `MOQ not met for ${p.sku}: min ${p.moq}` },
        { status: 400 },
      );
    }
    total += p.wholesalePrice * item.quantity;
    lines.push({
      productId: p.id,
      quantity: item.quantity,
      unitPrice: p.wholesalePrice,
    });
  }

  if (lines.length === 0) {
    return NextResponse.json({ error: "No valid products" }, { status: 400 });
  }

  const order = await prisma.order.create({
    data: {
      userId: session.id,
      note: parsed.data.note || null,
      totalAmount: total,
      status: "SUBMITTED",
      items: { create: lines },
    },
  });

  return NextResponse.json({ ok: true, orderId: order.id });
}
