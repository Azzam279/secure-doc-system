"use server";

import { apiFetch } from "@/lib/api";

export async function requestSignedUrl(file: File) {
  const { url, storagePath } = await apiFetch<{
    url: string;
    storagePath: string;
  }>("/documents/upload-url", {
    method: "POST",
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
  await apiFetch("/documents", {
    method: "POST",
    body: JSON.stringify({
      storagePath,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
    }),
    credentials: "include",
  });
}
