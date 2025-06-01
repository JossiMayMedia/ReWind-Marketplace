import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const days = Number(url.searchParams.get("days") || "30");
  const sinceDate = new Date();
  sinceDate.setDate(sinceDate.getDate() - days);

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ orders: [], topItems: [] });
  }

  // Find the seller's shop
  const shop = await prisma.shop.findFirst({
    where: { owner: { email: session.user.email } },
    include: { items: true },
  });
  if (!shop) return NextResponse.json({ orders: [], topItems: [] });

  // Get orders from last N days for this shop
  const orders = await prisma.order.findMany({
    where: {
      item: { shopId: shop.id },
      createdAt: { gte: sinceDate },
    },
    include: { item: true },
  });

  // Aggregate sales per item
  const salesCount = {};
  orders.forEach((order) => {
    salesCount[order.itemId] = (salesCount[order.itemId] || 0) + 1;
  });

  // Get top selling items
  const topItems = shop.items
    .map((item) => ({
      id: item.id,
      title: item.title,
      sales: salesCount[item.id] || 0,
    }))
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  return NextResponse.json({ orders, topItems });
}
