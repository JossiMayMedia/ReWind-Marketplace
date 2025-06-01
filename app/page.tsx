import Link from "next/link";

export default function HomePage() {
  return (
    <main className="p-10 text-center">
      <h1 className="text-4xl font-bold">Welcome to ReWind Marketplace</h1>
      <p className="text-lg mt-4">Create your shop, sell your items, and earn—ReWind takes just 8% commission.</p>
      <div className="mt-6">
        <Link href="/dashboard" className="bg-green-600 text-white px-6 py-3 rounded">Go to Dashboard</Link>
      </div>
    </main>
  );
}
