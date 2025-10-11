// RUTA: src/shared/lib/session.ts
/**
 * @file session.ts
 * @description SSoT para la configuración y gestión de sesiones encriptadas.
 *              v4.0.0 (Session ID Integration): Se enriquece el contrato de datos
 *              de la sesión para incluir un identificador único y persistente,
 *              mejorando la trazabilidad y la observabilidad.
 * @version 4.0.0
 *@author RaZ Podestá - MetaShark Tech
 */
import { getIronSession, type IronSession } from "iron-session";
import { cookies } from "next/headers";

import { logger } from "@/shared/lib/logging";

// SSoT del Contrato de Datos de la Sesión
export interface SessionData {
  id?: string; // <-- Propiedad añadida para un ID de sesión único y logueable
  isDevAuthenticated?: boolean;
}

// SSoT del Tipo de Sesión de la Aplicación
export type AppSession = IronSession<SessionData>;

// SSoT de la Configuración de la Sesión
export const sessionOptions = {
  cookieName: "dev_session",
  password: process.env.SESSION_PASSWORD as string,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
};

/**
 * @function getSession
 * @description Obtiene la sesión encriptada del usuario actual desde las cookies.
 *              Esta es la única función autorizada para acceder a los datos de la sesión.
 * @returns {Promise<AppSession>} La sesión del usuario.
 */
export function getSession(): Promise<AppSession> {
  logger.trace("[SessionManager] Obteniendo sesión de IronSession...");
  // Se tipa la función para que devuelva el tipo de sesión correcto.
  const session = getIronSession<SessionData>(cookies(), sessionOptions);
  logger.trace("[SessionManager] Sesión obtenida y lista para ser usada.");
  return session;
}
