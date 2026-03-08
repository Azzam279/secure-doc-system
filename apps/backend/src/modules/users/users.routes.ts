import { Router } from "express";
import { verifySession } from "../../middleware/session.middleware";
import { requireRole } from "../../middleware/rbac.middleware";
import dbPool from "../../config/db";

const router = Router();

router.get(
  "/",
  verifySession,
  requireRole("admin"),
  async (_, res) => {
    const pool = await dbPool();
    const users = await pool.query("SELECT id, email, role FROM users");
    res.json(users.rows);
  }
);

router.get("/me", verifySession, async (req: any, res) => {
  res.json({
    uid: req.user.uid,
    role: req.user.role || "user",
  });
});

/**
 * Register user into DB after Firebase signup
 */
router.post("/register", verifySession, async (req: any, res) => {
  try {
    const { email } = req.body;
    const firebaseUid = req.user.uid;
    const pool = await dbPool();

    // Check if already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE firebase_uid = $1",
      [firebaseUid]
    );

    if (existing.rows.length > 0) {
      return res.status(200).json({ message: "User already exists" });
    }

    await pool.query(
      `INSERT INTO users (firebase_uid, email, role)
       VALUES ($1, $2, 'user')`,
      [firebaseUid, email]
    );

    res.status(201).json({ message: "User registered" });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
