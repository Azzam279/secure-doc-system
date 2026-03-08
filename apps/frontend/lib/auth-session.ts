import { auth } from "./firebase";
import { apiFetch } from "@/lib/api";

export async function createSession(token: string | null = null) {
  const user = auth.currentUser;

  if (!user) throw new Error("User not authenticated");

  const idToken = token ?? await user.getIdToken();

  await apiFetch(
    "/auth/session",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    }
  );
}
