// dtos/register-user.dto.ts
import { z } from "zod";

export const RegisterUserSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    role: z.enum(["ADMIN", "USER"]).optional(),
    name: z.string(),
  })
  .strict();

export type RegisterUserDTO = z.infer<typeof RegisterUserSchema>;
