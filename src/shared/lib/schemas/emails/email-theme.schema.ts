// RUTA: src/shared/lib/schemas/emails/email-theme.schema.ts
/**
 * @file email-theme.schema.ts
 * @description SSoT para el contrato de datos de un tema de estilo de correo electrónico.
 *              Define la estructura que todos los archivos de tema de correo deben seguir.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";

// Define un objeto de estilo de React como un record genérico para máxima flexibilidad.
const EmailStyleSchema = z.record(
  z.string(),
  z.union([z.string(), z.number()])
);

// Define el contrato completo para un tema de correo electrónico.
export const EmailThemeSchema = z.object({
  main: EmailStyleSchema,
  container: EmailStyleSchema,
  logo: EmailStyleSchema,
  heading: EmailStyleSchema,
  paragraph: EmailStyleSchema,
  itemText: EmailStyleSchema,
  totalText: EmailStyleSchema,
  hr: EmailStyleSchema,
});

// Exporta el tipo inferido para un consumo seguro en toda la aplicación.
export type EmailTheme = z.infer<typeof EmailThemeSchema>;
// RUTA: src/shared/lib/schemas/emails/email-theme.schema.ts
