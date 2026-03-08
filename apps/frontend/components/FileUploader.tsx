"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { fileSchema } from "@/lib/schemas";
import { apiFetch } from "@/lib/api";

export default function FileUploader({
  onUploadStart,
}: {
  onUploadStart?: (file: File) => void;
}) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadWithProgress = (
    url: string,
    file: File,
    onProgress: (percent: number) => void
  ) => {
    return new Promise<void>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open("PUT", url);

      xhr.setRequestHeader("Content-Type", file.type);

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round(
            (event.loaded / event.total) * 100
          );

          onProgress(percent);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) resolve();
        else reject(new Error("Upload failed"));
      };

      xhr.onerror = reject;

      xhr.send(file);
    });
  }

  const uploadFile = async (selectedFile: File) => {
    setFile(selectedFile);
    if (!selectedFile) return;

    fileSchema.parse({
      name: selectedFile.name,
      size: selectedFile.size,
      type: selectedFile.type,
    });

    setUploading(true);
    setProgress(0);

    try {
      // Request signed URL
      const { url, storagePath } = await apiFetch<{
        url: string;
        storagePath: string;
      }>("/documents/upload-url", {
        method: "POST",
        body: JSON.stringify({
          fileName: selectedFile.name,
          mimeType: selectedFile.type,
          fileSize: selectedFile.size,
        }),
        credentials: "include",
      });

      // optimistic update
      onUploadStart?.(selectedFile);

      // Upload to GCS with progress tracking
      await uploadWithProgress(url, selectedFile, setProgress)

      // Save metadata
      await apiFetch("/documents", {
        method: "POST",
        body: JSON.stringify({
          storagePath,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          mimeType: selectedFile.type,
        }),
        credentials: "include",
      });

      // reset state
      setFile(null);
      setProgress(0);

      // clear the input field
      if (inputRef.current) {
        inputRef.current.value = "";
      }

      router.refresh();
      alert("Upload successful");
    } catch (err: unknown) {
      console.error('Error during upload:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (uploading) return

    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h2 className="text-lg font-semibold mb-4">
        Upload Document
      </h2>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-10 rounded-lg text-center cursor-pointer
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}`}
        onClick={() => inputRef.current?.click()}
      >
        {file ? (
          <p className="text-sm">{file.name}</p>
        ) : (
          <p className="text-gray-500">
            Drag & drop file here or click to upload
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          hidden
          disabled={uploading}
          onChange={(e) =>
            e.target.files && uploadFile(e.target.files[0])
          }
        />
      </div>
      {uploading && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-600 h-3 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm mt-2">{progress}%</p>
        </div>
      )}
    </div>
  );
}
