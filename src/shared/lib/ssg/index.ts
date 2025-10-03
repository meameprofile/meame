// RUTA: src/shared/lib/ssg/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para el módulo del Motor de Forja (SSG).
 * @version 2.0.0 (Path Realignment)
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace(
  "[ssg/index.ts] Módulo 'ssg' (Motor de Forja) cargado y listo para usar."
);

export * from "./engine";
export * from "./generators";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// La ruta ahora apunta directamente al módulo en el directorio 'ssg'.
export * from "./componentCopier";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
export * from "./packager";
export * from "./programmatic-builder";
