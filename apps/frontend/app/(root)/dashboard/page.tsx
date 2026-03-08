import { getServerUser } from "@/lib/server-user";
import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";
import { Document } from "@/types/document";
import DocumentsClient from "@/components/DocumentsClient";

export default async function DashboardPage() {
  const user = await getServerUser() as { uid?: string; role?: string } | null;

  const cookieStore = await cookies();
  const session = cookieStore.get("session");
  if (!session) return null;

  const docs = await apiFetch<Document[]>('/documents', {
    headers: {
      Cookie: `session=${session.value}`,
    },
    cache: "no-store",
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <p>User ID: {user?.uid}</p>
      <p>Role: {user?.role}</p>
      <br />

      <DocumentsClient initialDocuments={docs} />
    </div>
  );
}
