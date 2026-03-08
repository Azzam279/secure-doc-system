"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r shadow-sm">
      <div className="p-6 text-xl font-bold border-b h-16">
        Dashboard
      </div>
      <nav className="flex flex-col gap-2 p-4">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded hover:bg-gray-100"
        >
          Home
        </Link>
        <Link
          href="/admin"
          className="px-4 py-2 rounded hover:bg-gray-100"
        >
          Admin
        </Link>
      </nav>
    </aside>
  );
}
