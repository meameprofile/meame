// RUTA: src/shared/lib/schemas/auth/forgot-password.schema.ts
/**
 * @file forgot-password.schema.ts
 * @description SSoT para el contrato de datos del formulario de recuperación de contraseña.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email("Por favor, introduce una dirección de email válida."),
});

export type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;
