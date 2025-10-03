// RUTA: scripts/_utils/types.ts
/**
 * @file types.ts
 * @description SSoT para los contratos de tipos de los scripts.
 * @version 1.0.0 (Sovereign & Granular)
 * @author L.I.A. Legacy
 */

/**
 * @type SuccessResult<T>
 * @description Representa el resultado de una operación de script exitosa.
 */
export type SuccessResult<T> = { success: true; data: T };

/**
 * @type ErrorResult
 * @description Representa el resultado de una operación de script fallida.
 */
export type ErrorResult = { success: false; error: string };

/**
 * @type ScriptActionResult<T>
 * @description Contrato de retorno soberano para todos los scripts que
 *              pueden tener un resultado exitoso o fallido.
 */
export type ScriptActionResult<T> = SuccessResult<T> | ErrorResult;
