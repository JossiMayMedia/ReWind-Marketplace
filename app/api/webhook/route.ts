import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { sendOrderEmail } from "@/lib/email";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new NextResponse(`Webhook Error: ${err}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const sessionObj = event.data.object as Stripe.Checkout.Session;
    const itemId = sessionObj.metadata?.itemId as string;
    const buyerEmail = sessionObj.customer_email as string;

    if (itemId && buyerEmail) {
      const order = await prisma.order.create({
        data: {
          itemId,
          buyerEmail,
        },
      });

      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: { shop: { include: { owner: true } } },
      });

      // Notify buyer
      await sendOrderEmail(
        buyerEmail,
        "ReWind Order Confirmation",
        orderConfirmationTemplate(item!.title)
      );

      // Notify seller
      if (item && item.shop.owner.email) {
        await sendOrderEmail(
          item.shop.owner.email,
          "New Order on ReWind",
          `<p>You have a new order for: <strong>${item.title}</strong></p>
           <p>Buyer Email: ${buyerEmail}</p>`
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
