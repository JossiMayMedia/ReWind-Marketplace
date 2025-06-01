"use client";
import { useState } from "react";

export default function CreateItem({ shopId }: { shopId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = async () => {
    await fetch("/api/item", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, price: parseInt(price), shopId }),
    });
    setTitle("");
    setDescription("");
    setPrice("");
  };

  return (
    <div className="p-4 border rounded shadow mt-6">
      <h3 className="text-lg font-semibold mb-2">Add New Item</h3>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="block w-full border p-2 rounded mb-2"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="block w-full border p-2 rounded mb-2"
      ></textarea>
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Price in cents"
        className="block w-full border p-2 rounded mb-2"
      />
      <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
        Create Item
      </button>
    </div>
  );
}
