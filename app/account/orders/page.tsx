import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function BuyerOrdersPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return <div>Not logged in</div>;

  const orders = await prisma.order.findMany({
    where: {
      buyerEmail: session.user.email,
    },
    include: {
      item: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Your Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow">
            <p><strong>Item:</strong> {order.item.title}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            {order.downloadUrl && (
              <p>
                <a href={order.downloadUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  Download Product
                </a>
              </p>
            )}
            {order.receiptUrl && (
              <p>
                <a href={order.receiptUrl} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                  View Receipt
                </a>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
