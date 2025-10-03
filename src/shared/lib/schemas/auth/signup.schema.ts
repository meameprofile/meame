// RUTA: src/shared/lib/schemas/auth/signup.schema.ts
/**
 * @file signup.schema.ts
 * @description SSoT para el contrato de datos del formulario de registro.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const SignUpSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "El nombre completo debe tener al menos 3 caracteres."),
    email: z
      .string()
      .email("Por favor, introduce una dirección de email válida."),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"], // Asocia el error al campo de confirmación
  });

export type SignUpFormData = z.infer<typeof SignUpSchema>;
