import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";

export async function getServerUser() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session");

  if (!session) return null;

  const res = await apiFetch('/users/me', {
    headers: {
      Cookie: `session=${session.value}`,
    },
    cache: "no-store",
  });

  return res;
}
