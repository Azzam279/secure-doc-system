"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { registerSchema } from "@/lib/schemas";
import { createSession } from "@/lib/auth-session";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async () => {
    setError(null);
    setLoading(true);

    try {
      registerSchema.parse(form);

      // Create Firebase user
      await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );

      await createSession();

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white w-96 p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-4"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-2 mb-6"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={register}
          className="w-full bg-blue-600 text-white rounded-lg p-2 hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Register"}
        </button>
      </div>
    </div>
  );
}
