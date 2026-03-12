"use client";

import { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, googleProvider } from "@/lib/firebase";
import { createSession } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false)

  const login = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password);

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const idToken = await user.getIdToken();
      await createSession(idToken)

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false)
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);

      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
      const idToken = await user.getIdToken();
      await createSession(idToken)

      router.push("/dashboard");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={(e) => login(e)} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded mb-3 cursor-pointer hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button
          onClick={loginWithGoogle}
          className="w-full border p-2 rounded cursor-pointer hover:bg-gray-100"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}
