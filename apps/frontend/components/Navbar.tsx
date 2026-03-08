"use client";

import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { apiFetch } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const logout = async () => {
    await apiFetch(
      "/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    await signOut(auth);

    router.push("/login");
  };

  return (
    <header className="flex justify-end items-center h-16 bg-white border-b p-6">
      <button
        onClick={logout}
        className="text-sm font-medium text-white bg-red-500 px-4 py-2 rounded cursor-pointer hover:bg-red-600"
      >
        Logout
      </button>
    </header>
  );
}
