import admin from "firebase-admin";

if (!admin.apps.length) {
  if (process.env.NODE_ENV === "production") {
    admin.initializeApp();
  } else {
    const serviceAccount = require("../../documents/firebase-adminsdk.json")
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.GCS_BUCKET,
    });
  }
}

export const firebaseAdmin = admin;
