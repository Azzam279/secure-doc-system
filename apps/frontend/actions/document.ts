"use server";

import { apiFetch } from "@/lib/api";
import { cookies } from "next/headers";

export async function requestSignedUrl(file: File) {
  const cookie = await cookies()
  const sessionCookie = cookie.get("session");
  if (!sessionCookie) {
    throw new Error("No session");
  }

  const { url, storagePath } = await apiFetch<{
    url: string;
    storagePath: string;
  }>("/documents/upload-url", {
    method: "POST",
    headers: {
      cookie: `${sessionCookie.name}=${sessionCookie.value}`,
    },
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type,
      fileSize: file.size,
    }),
    credentials: "include",
  });

  return { url, storagePath };
}

export async function saveMetadata(storagePath: string, file: File) {
  const cookie = await cookies()
  const sessionCookie = cookie.get("session");
  if (!sessionCookie) {
    throw new Error("No session");
  }

  await apiFetch("/documents", {
    method: "POST",
    headers: {
      cookie: `${sessionCookie.name}=${sessionCookie.value}`,
    },
    body: JSON.stringify({
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }),
    credentials: "include",
  });
}
