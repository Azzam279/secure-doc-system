import { Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import dbPool from "../config/db";

export async function verifySession(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const sessionCookie = req.cookies.session;

    if (!sessionCookie) {
      return res.status(401).json({ message: "No session" });
    }

    const decoded = await firebaseAdmin
      .auth()
      .verifySessionCookie(sessionCookie, true); // check revocation

    // fetch role from database
    const pool = await dbPool();
    const result = await pool.query(
      "SELECT role FROM users WHERE firebase_uid = $1",
      [decoded.uid]
    );

    const role = result.rows[0]?.role ?? "user";

    req.user = {
      ...decoded,
      role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid session" });
  }
}
