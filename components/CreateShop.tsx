"use client";
import { useState } from "react";

export default function CreateShop() {
  const [name, setName] = useState("");

  const createShop = async () => {
    await fetch("/api/shop", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
  };

  return (
    <div className="p-4">
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Shop name"
        className="border p-2 rounded"
      />
      <button onClick={createShop} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Create Shop
      </button>
    </div>
  );
}
