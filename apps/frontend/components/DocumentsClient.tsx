"use client";

import { useState } from "react";
import { Document } from "@/types/document";
import FileUploader from "./FileUploader";
import DocumentTable from "./DocumentTable";

export default function DocumentsClient({
  initialDocuments,
}: {
  initialDocuments: Document[];
}) {
  const [documents, setDocuments] = useState(initialDocuments);

  const addOptimisticDocument = (file: File) => {
    setDocuments((prev) => [
      {
        file_name: file.name,
        mime_type: file.type,
        file_size: file.size,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  return (
    <div>
      <FileUploader onUploadStart={addOptimisticDocument} />
      <DocumentTable documents={documents} onDelete={removeDocument} />
    </div>
  );
}
