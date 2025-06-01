"use client";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const TIME_RANGES = [7, 30, 90];

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [items, setItems] = useState([]);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetch(`/api/dashboard-data?days=${days}`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(data.orders);
        setItems(data.topItems);
      });
  }, [days]);

  const salesByDate = {};
  const revenueByDate = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt).toISOString().slice(0, 10);
    salesByDate[date] = (salesByDate[date] || 0) + 1;
    revenueByDate[date] = (revenueByDate[date] || 0) + order.item.price;
  });

  const chartData = Object.keys(salesByDate)
    .sort()
    .map((date) => ({
      date,
      sales: salesByDate[date],
      revenue: Number(revenueByDate[date].toFixed(2)),
    }));

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Time range:</label>
        {TIME_RANGES.map((range) => (
          <button
            key={range}
            onClick={() => setDays(range)}
            className={`mr-2 px-3 py-1 rounded ${
              days === range ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            Last {range} days
          </button>
        ))}
      </div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8884d8"
              name="Sales"
              activeDot={{ r: 8 }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#82ca9d"
              name="Revenue ($)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Top Selling Items</h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="border p-3 rounded shadow flex justify-between"
          >
            <span>{item.title}</span>
            <span className="font-semibold">{item.sales} sales</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
