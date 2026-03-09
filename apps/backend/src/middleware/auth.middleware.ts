import { Request, Response, NextFunction } from "express";
import { firebaseAdmin } from "../config/firebase";
import dbPool from "../config/db";

export async function verifyToken(
  req: any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).send("Unauthorized");
    }

    const decoded = await firebaseAdmin.auth().verifyIdToken(token);

    if (decoded.aud !== process.env.FIREBASE_PROJECT_ID) {
      throw new Error("Invalid token audience");
    }

    if (!decoded.iss.includes(process.env.FIREBASE_PROJECT_ID!)) {
      throw new Error("Invalid token issuer");
    }

    const pool = await dbPool();
    const result = await pool.query(
      "SELECT role FROM users WHERE firebase_uid = $1",
      [decoded.uid]
    );

    req.user = {
      uid: decoded.uid,
      role: result.rows[0]?.role || "user",
    };

    next();
  } catch (err) {
    return res.status(403).send("Invalid token");
  }
}
