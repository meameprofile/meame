// RUTA: src/shared/lib/actions/auth/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública y SSoT para las Server Actions del dominio de Autenticación.
 *              v2.0.0 (Architectural Purity Restoration): Refactorizado para usar
 *              importaciones y exportaciones explícitas, resolviendo el error crítico de build
 *              "Only async functions are allowed to be exported in a 'use server' file".
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use server";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA v2.0.0] ---
// Se importan explícitamente SOLO las funciones de acción de cada módulo.
import {
  loginWithPasswordAction,
  signUpAction,
  sendPasswordResetAction,
} from "./auth.actions";
import { linkAnonymousSessionToUserAction } from "./linkAnonymousSessionToUser.action";

// Se re-exportan las funciones importadas individualmente.
export {
  loginWithPasswordAction,
  signUpAction,
  sendPasswordResetAction,
  linkAnonymousSessionToUserAction,
};
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA v2.0.0] ---
