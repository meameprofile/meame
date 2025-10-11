// RUTA: src/shared/lib/actions/telemetry/telemetry.contracts.ts
/**
 * @file telemetry.contracts.ts
 * @description SSoT para los contratos de datos del dominio de Telemetría.
 *              Este aparato fue forjado para resolver un fallo crítico de build
 *              al desacoplar los schemas de las Server Actions.
 * @version 1.0.0 (Sovereign Contract Decoupling)
 * @author L.I.A. Legacy
 */
import "server-only";
import { z } from "zod";

// Contrato de datos SSoT, alineado con la salida de la RPC v1.1
export const TaskHealthSummarySchema = z.object({
  task_id: z.string(),
  task_name: z.string(),
  task_status: z.enum(["SUCCESS", "FAILURE"]),
  duration_ms: z.number().nullable(),
  task_timestamp: z.string().datetime(),
  user_id: z.string().uuid().nullable(),
  workspace_id: z.string().uuid().nullable(),
});

export type TaskHealthSummary = z.infer<typeof TaskHealthSummarySchema>;
