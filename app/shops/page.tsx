import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ShopListPage() {
  const shops = await prisma.shop.findMany({
    include: { items: true },
  });

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-6">Browse Shops</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <div key={shop.id} className="border rounded p-4 shadow">
            <h2 className="text-xl font-semibold mb-2">{shop.name}</h2>
            <ul className="list-disc list-inside">
              {shop.items.map((item) => (
                <li key={item.id}>{item.title} – ${(item.price / 100).toFixed(2)}</li>
              ))}
            </ul>
            <Link href={`/shop/${shop.id}`} className="text-blue-600 mt-2 inline-block">View Shop</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
