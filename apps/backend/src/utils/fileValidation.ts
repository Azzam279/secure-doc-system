export function validateFileInput(
  mimeType: string,
  fileSize: number
) {
  const allowedTypes = [
    "application/pdf",
    "image/png",
    "image/jpeg",
  ];

  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!allowedTypes.includes(mimeType)) {
    throw new Error("Invalid file type");
  }

  if (fileSize > maxSize) {
    throw new Error("File too large");
  }
}
