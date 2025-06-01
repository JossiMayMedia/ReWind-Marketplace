import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { title, description, price, shopId } = await req.json();
  try {
    const item = await prisma.item.create({
      data: {
        title,
        description,
        price,
        shopId,
      },
    });
    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create item." }, { status: 500 });
  }
}
