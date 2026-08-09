import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

const MAX_BYTES = 900_000; // ~0.9MB, stored as data URL in DB for Vercel compatibility

export async function POST(req: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "未选择文件" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "只支持图片文件" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "图片请小于 900KB，或改用外链图片地址" },
      { status: 400 },
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const base64 = buffer.toString("base64");
  const imageUrl = `data:${file.type};base64,${base64}`;
  return NextResponse.json({ imageUrl });
}
