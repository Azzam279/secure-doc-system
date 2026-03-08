import admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = require("../../documents/simple-saas-37763-firebase-adminsdk-fbsvc-167c2854c6.json")
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.GCS_BUCKET,
  });
}

export const firebaseAdmin = admin;
