import admin from "firebase-admin";
import fs from "fs";
import path from "path";

const serviceAccountPath = path.join(
  __dirname,
  "../../documents/firebase-adminsdk.json"
);

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.GCS_BUCKET,
    });
  } else {
    // Cloud Run / production
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.GCS_BUCKET,
    });
  }
}

export const firebaseAdmin = admin;
