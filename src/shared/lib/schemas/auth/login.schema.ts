// RUTA: shared/lib/schemas/auth/login.schema.ts
/**
 * @file login.schema.ts
 * @description SSoT para el contrato de datos del formulario de login.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

export const LoginSchema = z.object({
  email: z
    .string()
    .email("Por favor, introduce una dirección de email válida."),
  password: z.string().min(1, "La contraseña no puede estar vacía."),
});

export type LoginFormData = z.infer<typeof LoginSchema>;
