import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  applicationId: z.string(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  const app = await prisma.wholesaleApplication.findUnique({
    where: { id: parsed.data.applicationId },
  });
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let userId = app.userId;
  if (!userId) {
    const existing = await prisma.user.findUnique({ where: { email: app.email } });
    if (existing) {
      userId = existing.id;
    } else {
      const temp = Math.random().toString(36).slice(2, 10) + "A1";
      const created = await prisma.user.create({
        data: {
          email: app.email,
          passwordHash: await hashPassword(temp),
          name: app.contactName,
          phone: app.phone,
          companyName: app.companyName,
          businessType: app.businessType,
          role: "WHOLESALE",
        },
      });
      userId = created.id;
    }
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { role: "WHOLESALE", companyName: app.companyName, phone: app.phone },
    }),
    prisma.wholesaleApplication.update({
      where: { id: app.id },
      data: { status: "ACCEPTED", userId },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
