import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().min(6, "El nombre debe tener al menos 6 caracteres"),
  legajo: z.number().int().positive("El legajo"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export const loginSchema = z.object({
  legajo: z.number(),
  password: z.string().min(1, "La contraseña es obligatoria"),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z
    .string()
    .min(6, "La nueva contraseña debe tener al menos 6 caracateres"),
});
