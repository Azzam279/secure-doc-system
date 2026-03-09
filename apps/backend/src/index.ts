import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import documentsRoutes from "./modules/documents/documents.routes";

import { apiRateLimiter } from "./middleware/rateLimit.middleware";
import { errorHandler } from "./middleware/error.middleware";

const app = express();

app.use(helmet());
app.use(cors({
  origin: process.env.WEB_URL,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(apiRateLimiter);

app.get("/health", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/documents", documentsRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log("Server closed");
  });
});
