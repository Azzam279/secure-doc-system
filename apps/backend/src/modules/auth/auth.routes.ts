import { Router } from "express";
import { firebaseAdmin } from "../../config/firebase";
import dbPool from "../../config/db";

const router = Router();

/**
 * Create session cookie
 */
router.post("/session", async (req, res) => {
  try {
    const { idToken } = req.body;
    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
    const pool = await dbPool();

    const decoded = await firebaseAdmin
      .auth()
      .verifyIdToken(idToken);

    const sessionCookie = await firebaseAdmin
      .auth()
      .createSessionCookie(idToken, { expiresIn });

    // Ensure user exists in DB
    const existing = await pool.query(
      "SELECT id FROM users WHERE firebase_uid = $1",
      [decoded.uid]
    );

    if (existing.rows.length === 0) {
      await pool.query(
        `INSERT INTO users (firebase_uid, email, role)
         VALUES ($1, $2, 'user')`,
        [decoded.uid, decoded.email]
      );
    }

    res.cookie("session", sessionCookie, {
      httpOnly: true, // Prevent XSS token theft
      secure: process.env.NODE_ENV === "production", // Only HTTPS
      // sameSite: "strict",
      maxAge: expiresIn,
    });

    res.status(200).json({ message: "Session created" });
  } catch (error) {
    console.log('error:', error)
    res.status(401).json({ message: "Unauthorized", error: error instanceof Error ? error.message : "Unknown error" });
  }
});

/**
 * Logout
 */
router.post("/logout", async (_, res) => {
  res.clearCookie("session");
  res.status(200).json({ message: "Logged out" });
});

export default router;
