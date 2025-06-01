import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const { itemId } = await req.json();
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { shop: { include: { owner: true } } },
  });

  if (!item || !item.shop.owner.stripeAccountId) {
    return NextResponse.json({ error: "Invalid item or seller not onboarded" }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            description: item.description,
          },
          unit_amount: item.price,
        },
        quantity: 1,
      },
    ],
    payment_intent_data: {
      application_fee_amount: Math.round(item.price * 0.08),
      transfer_data: {
        destination: item.shop.owner.stripeAccountId,
      },
    },
    mode: "payment",
    success_url: `${process.env.NEXTAUTH_URL}/success`,
    cancel_url: `${process.env.NEXTAUTH_URL}/shop/${item.shopId}`,
    metadata: { itemId: item.id },
  });

  return NextResponse.json({ url: session.url });
}
