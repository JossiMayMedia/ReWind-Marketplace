import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { sendOrderEmail } from "@/lib/email";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { status, receiptUrl, downloadUrl } = await req.json();
  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status, receiptUrl, downloadUrl },
    include: {
      item: { include: { shop: { include: { owner: true } } } },
    },
  });

  const buyerEmail = order.buyerEmail;
  if (buyerEmail) {
    await sendOrderEmail(
      buyerEmail,
      "ReWind Order Update",
      `<p>Your order status is now <strong>${status}</strong>.</p>
       ${downloadUrl ? `<p>Download: <a href='${downloadUrl}'>${downloadUrl}</a></p>` : ""}
       ${receiptUrl ? `<p>Receipt: <a href='${receiptUrl}'>${receiptUrl}</a></p>` : ""}`
    );
  }

  const sellerEmail = order.item.shop.owner.email;
  if (sellerEmail) {
    await sendOrderEmail(
      sellerEmail,
      "Order Updated on ReWind",
      `<p>Order for <strong>${order.item.title}</strong> was updated.</p>
       <p>Status: ${status}</p>`
    );
  }

  return NextResponse.json(order);
}
