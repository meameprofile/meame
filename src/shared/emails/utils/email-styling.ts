// RUTA: src/shared/emails/utils/email-styling.ts
/**
 * @file email-styling.ts
 * @description Motor de carga y validación para temas de estilo de correo electrónico.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import { promises as fs } from "fs";
import path from "path";

import { logger } from "@/shared/lib/logging";
import {
  EmailThemeSchema,
  type EmailTheme,
} from "@/shared/lib/schemas/emails/email-theme.schema";

/**
 * @function getEmailStyles
 * @description Carga un archivo de tema de correo electrónico desde el sistema de
 *              archivos, lo valida contra el `EmailThemeSchema` y lo devuelve.
 * @param {string} [themeName="default"] - El nombre del tema a cargar.
 * @returns {Promise<EmailTheme>} El objeto de estilos validado.
 * @throws {Error} Si el archivo de tema no se encuentra o no es válido.
 */
export async function getEmailStyles(
  themeName = "default"
): Promise<EmailTheme> {
  const filePath = path.join(
    process.cwd(),
    "src/shared/emails/themes",
    `${themeName}.email-theme.json`
  );

  try {
    const fileContent = await fs.readFile(filePath, "utf-8");
    const jsonData = JSON.parse(fileContent);

    // Validar los datos contra el schema soberano.
    const validatedTheme = EmailThemeSchema.parse(jsonData);
    logger.trace(
      `[EmailStyling] Tema de correo '${themeName}' cargado y validado.`
    );
    return validatedTheme;
  } catch (error) {
    logger.error(
      `[EmailStyling] Fallo crítico al cargar o validar el tema '${themeName}'.`,
      { error, path: filePath }
    );
    // En un caso real, podríamos tener un tema de fallback hardcodeado aquí.
    // Por ahora, lanzamos un error para hacer que los fallos sean obvios.
    throw new Error(`No se pudo cargar el tema de correo: ${themeName}`);
  }
}
// RUTA: src/shared/emails/utils/email-styling.ts
