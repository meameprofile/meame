// RUTA: src/shared/lib/ai/index.ts
/**
 * @file index.ts (Barrel File)
 * @description Fachada pública para la Capa de Integración de IA Soberana.
 *              v3.0.0 (Architectural Purity): Se refactoriza para exportar
 *              funciones de acción y módulos de datos puros por separado.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

// Se agrupan las exportaciones de acciones en un objeto 'gemini' para
// mantener la API de consumo (gemini.generateText) intacta.
import * as geminiClient from "./gemini.client";
export const gemini = geminiClient;

// Se exportan los módulos de datos puros.
export * from "./gemini.schemas";
export * from "./models.config";
