import { Storage } from "@google-cloud/storage";
import fs from "fs";
import path from "path";

const keyFile = path.join(
  __dirname,
  "../../documents/storage-service-account.json"
);

export const storage = fs.existsSync(keyFile)
  ? new Storage({ keyFilename: keyFile })
  : new Storage();

export const bucket = storage.bucket(
  process.env.GCS_BUCKET as string
);
