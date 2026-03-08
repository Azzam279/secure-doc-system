import { Storage } from "@google-cloud/storage";
import path from "path";

export const storage = process.env.NODE_ENV === "production"
    ? new Storage()
    : new Storage({
        keyFilename: path.join(__dirname, "../../documents/simple-saas-488903-772e499db7ea.json"),
      });

export const bucket = storage.bucket(
  process.env.GCS_BUCKET as string
);
