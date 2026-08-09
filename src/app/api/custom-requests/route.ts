import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const schema = z.object({
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  companyName: z.string().min(1),
  productNeed: z.string().min(3),
  quantity: z.string().min(1),
  targetPrice: z.string().optional(),
  deadline: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill required fields" }, { status: 400 });
  }

  const session = await getSession();
  await prisma.customRequest.create({
    data: {
      userId: session?.id,
      contactName: parsed.data.contactName,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone,
      companyName: parsed.data.companyName,
      productNeed: parsed.data.productNeed,
      quantity: parsed.data.quantity,
      targetPrice: parsed.data.targetPrice || null,
      deadline: parsed.data.deadline || null,
      notes: parsed.data.notes || null,
    },
  });

  return NextResponse.json({ ok: true });
}
