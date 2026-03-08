import { z } from "zod";

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024),
  type: z.enum([
    "application/pdf",
    "image/png",
    "image/jpeg",
  ]),
});
