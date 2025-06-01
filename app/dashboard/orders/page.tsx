"use client";
import { useEffect, useState } from "react";

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("/api/my-orders")
      .then((res) => res.json())
      .then(setOrders);
  }, []);

  const updateOrder = async (id, updates) => {
    await fetch(`/api/order/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    const updated = orders.map((o) => (o.id === id ? { ...o, ...updates } : o));
    setOrders(updated);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Seller Orders</h1>
      <ul className="space-y-4">
        {orders.map((order) => (
          <li key={order.id} className="border p-4 rounded shadow space-y-2">
            <p><strong>Item:</strong> {order.item.title}</p>
            <p><strong>Buyer Email:</strong> {order.buyerEmail}</p>
            <label className="block">
              <span className="text-sm">Status:</span>
              <select
                value={order.status}
                onChange={(e) => updateOrder(order.id, { status: e.target.value })}
                className="border px-2 py-1 rounded"
              >
                <option value="pending">Pending</option>
                <option value="shipped">Shipped</option>
                <option value="completed">Completed</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm">Download URL:</span>
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                defaultValue={order.downloadUrl || ""}
                onBlur={(e) => updateOrder(order.id, { downloadUrl: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-sm">Receipt URL:</span>
              <input
                type="text"
                className="border px-2 py-1 rounded w-full"
                defaultValue={order.receiptUrl || ""}
                onBlur={(e) => updateOrder(order.id, { receiptUrl: e.target.value })}
              />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
