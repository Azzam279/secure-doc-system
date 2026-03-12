import { Router } from "express";
import { verifySession } from "../../middleware/session.middleware";
import { bucket } from "../../config/storage";
import { validateFileInput } from "../../utils/fileValidation";
import sanitize from "sanitize-filename";
import crypto from "crypto";
import dbPool from "../../config/db";

const router = Router();

router.post("/upload-url", verifySession, async (req: any, res) => {
  try {
    const { fileName, mimeType, fileSize } = req.body ?? {};

    if (!fileName || !mimeType || typeof fileSize !== "number") {
      return res.status(400).json({ message: "Invalid upload request body" });
    }

    validateFileInput(mimeType, fileSize);

    const safeName = sanitize(fileName);
    const uniqueId = crypto.randomUUID();
    const storagePath = `${req.user.uid}/${uniqueId}-${safeName}`;

    const file = bucket.file(storagePath);

    const [url] = await file.getSignedUrl({
      version: "v4",
      action: "write",
      expires: Date.now() + 15 * 60 * 1000,
      contentType: mimeType,
      // extensionHeaders: {
      //   "x-goog-if-generation-match": "0",
      // },
    });

    return res.json({ url, storagePath });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const status =
      message === "Invalid file type" ||
      message === "File too large" ||
      message === "Invalid upload request body"
        ? 400
        : 500;
    console.error("Error generating signed URL:", err);
    return res.status(status).json({ message });
  }
});

router.post("/", verifySession, async (req: any, res) => {
  const { storagePath, fileName, fileSize, mimeType } = req.body;
  const pool = await dbPool();

  await pool.query(
    `INSERT INTO documents 
     (user_id, file_name, storage_path, file_size, mime_type)
     VALUES (
       (SELECT id FROM users WHERE firebase_uid = $1),
       $2, $3, $4, $5
     )`,
    [req.user.uid, fileName, storagePath, fileSize, mimeType]
  );

  res.status(201).json({ message: "Document saved" });
});

router.get("/", verifySession, async (req: any, res) => {
  const pool = await dbPool();
  const docs = await pool.query(
    `SELECT id, file_name, mime_type, file_size, created_at
     FROM documents
     WHERE user_id = (
       SELECT id FROM users WHERE firebase_uid = $1
     )
      ORDER BY created_at DESC`,
    [req.user.uid]
  );

  res.json(docs.rows);
});

router.get("/:id/download", verifySession, async (req: any, res) => {
  const pool = await dbPool();
  const doc = await pool.query(
    "SELECT storage_path FROM documents WHERE id = $1",
    [req.params.id]
  );

  if (!doc.rows.length) {
    return res.status(404).json({ message: "File not found" });
  }

  const file = bucket.file(doc.rows[0].storage_path);

  const [url] = await file.getSignedUrl({
    version: "v4",
    action: "read",
    expires: Date.now() + 15 * 60 * 1000,
  });

  res.json({ url });
});

router.delete("/:id", verifySession, async (req: any, res) => {
  const pool = await dbPool();
  const doc = await pool.query(
    "SELECT storage_path FROM documents WHERE id = $1",
    [req.params.id]
  );

  if (!doc.rows.length) {
    return res.status(404).json({ message: "Not found" });
  }

  await bucket.file(doc.rows[0].storage_path).delete();

  await pool.query(
    "DELETE FROM documents WHERE id = $1",
    [req.params.id]
  );

  res.json({ success: true });
});

export default router;
