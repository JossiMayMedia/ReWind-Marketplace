import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const shop = await prisma.shop.findUnique({ where: { id: params.id }, include: { items: true } });
  if (!shop) return NextResponse.json({ error: "Shop not found" }, { status: 404 });
  return NextResponse.json(shop);
}
