import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

const schema = z.object({
  contactName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(5),
  companyName: z.string().min(1),
  businessType: z.enum(["restaurant", "supermarket", "distributor"]),
  cityState: z.string().min(1),
  monthlyVolume: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(req: Request) {
  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please fill required fields" }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  let user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    const tempPassword = Math.random().toString(36).slice(2, 10);
    user = await prisma.user.create({
      data: {
        email,
        passwordHash: await hashPassword(tempPassword),
        name: parsed.data.contactName,
        phone: parsed.data.phone,
        companyName: parsed.data.companyName,
        businessType: parsed.data.businessType,
        role: "PENDING",
      },
    });
  }

  await prisma.wholesaleApplication.create({
    data: {
      userId: user.id,
      contactName: parsed.data.contactName,
      email,
      phone: parsed.data.phone,
      companyName: parsed.data.companyName,
      businessType: parsed.data.businessType,
      cityState: parsed.data.cityState,
      monthlyVolume: parsed.data.monthlyVolume || null,
      message: parsed.data.message || null,
    },
  });

  return NextResponse.json({ ok: true });
}
