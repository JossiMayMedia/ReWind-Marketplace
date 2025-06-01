import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
  const { name } = await req.json();
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const shop = await prisma.shop.create({ data: { name, ownerId: user.id } });
  return NextResponse.json(shop);
}
