"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";

export async function createSession(idToken: string) {
  const res = await apiFetch<Response>(
    "/auth/session",
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ idToken }),
    },
    true
  );

  const data = await res.json();

  const cookieHeader = res.headers.get("set-cookie");
  const cookie = await cookies();
  if (cookieHeader) {
    cookie.set({
      name: "session",
      value: cookieHeader.split(";")[0].split("=")[1],
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
    });
  }

  return data;
}
