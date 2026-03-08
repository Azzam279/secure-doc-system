"use client";

import { Document } from "@/types/document";
import { apiFetch } from "@/lib/api";

export default function DocumentTable({
  documents,
  onDelete,
}: {
  documents: Document[]
  onDelete: (id: string) => void
}) {
  const downloadFile = async (id?: string) => {
    if (!id) return;

    const res = await apiFetch(
      `/documents/${id}/download`,
      {
        credentials: "include",
      }
    );

    window.open((res as { url: string }).url, "_blank");
  };

  const previewFile = async (id?: string) => {
    if (!id) return;

    const res = await apiFetch(
      `/documents/${id}/download`,
      {
        credentials: "include",
      }
    );

    window.open((res as { url: string }).url, "_blank");
  };

  const deleteFile = async (id?: string) => {
    if (!id) return;

    const confirmDelete = confirm("Delete this document?");

    if (!confirmDelete) return;

    await apiFetch(
      `/documents/${id}`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    // update UI immediately
    onDelete(id);
  };

  if (!documents.length) {
    return (
      <div className="bg-white p-6 rounded-lg shadow mt-6">
        <p className="text-gray-500">No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg mt-6 overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="p-4 text-sm font-semibold">Name</th>
            <th className="p-4 text-sm font-semibold">Type</th>
            <th className="p-4 text-sm font-semibold">Size</th>
            <th className="p-4 text-sm font-semibold">Uploaded</th>
            <th className="p-4 text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => (
            <tr
              key={doc.id ?? i}
              className="border-b hover:bg-gray-50 transition"
            >
              <td className="p-4">{doc.file_name}</td>
              <td className="p-4 text-gray-600">
                {doc.mime_type}
              </td>
              <td className="p-4 text-gray-600">
                {(doc.file_size / 1024).toFixed(1)} KB
              </td>
              <td className="p-4 text-gray-600">
                {doc.created_at
                  ? new Date(doc.created_at).toLocaleDateString()
                  : "-"}
              </td>
              <td className="p-4 flex gap-3">
                <button
                  onClick={() => previewFile(doc.id)}
                  className="text-green-600 hover:underline text-sm cursor-pointer"
                >
                  Preview
                </button>
                <button
                  onClick={() => downloadFile(doc.id)}
                  className="text-blue-600 hover:underline text-sm cursor-pointer"
                >
                  Download
                </button>
                <button
                  onClick={() => deleteFile(doc.id)}
                  className="text-red-600 hover:underline text-sm cursor-pointer"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
