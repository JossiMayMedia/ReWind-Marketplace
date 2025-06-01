"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function ShopDetailPage() {
  const params = useParams();
  const [shop, setShop] = useState(null);

  useEffect(() => {
    fetch(`/api/shop/${params.id}`)
      .then((res) => res.json())
      .then((data) => setShop(data));
  }, [params.id]);

  const handleBuy = async (itemId) => {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (!shop) return <div className="p-10">Loading...</div>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{shop.name}</h1>
      <ul className="grid gap-4">
        {shop.items.map((item) => (
          <li key={item.id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">{item.title}</h2>
            <p className="text-gray-700 mb-2">{item.description}</p>
            <p className="font-bold mb-4">${(item.price / 100).toFixed(2)}</p>
            <button
              className="bg-green-600 text-white px-4 py-2 rounded"
              onClick={() => handleBuy(item.id)}
            >
              Buy Now
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
