// RUTA: scripts/_shims/actions.types.ts
/**
 * @file actions.types.ts (Shim)
 * @description Implementación de reemplazo (shim) de los tipos de acción,
 *              segura para el entorno de scripts de Node.js.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
/* eslint-env node */

export type SuccessResult<T> = { success: true; data: T };
export type ErrorResult = { success: false; error: string };
export type ActionResult<T> = SuccessResult<T> | ErrorResult;
