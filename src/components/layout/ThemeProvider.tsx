// RUTA: components/layout/ThemeProvider.tsx
/**
 * @file ThemeProvider.tsx
 * @description Componente proveedor de tema de élite, que actúa como un wrapper
 *              soberano sobre `next-themes`. Es la SSoT para la gestión del estado
 *              del tema (claro/oscuro/sistema) en el lado del cliente.
 *              v2.0.0 (Holistic Integrity Restoration): Corregido y nivelado para
 *              resolver todos los errores de importación y tipo, y cumplir con
 *              la SSoT de nomenclatura y los 7 Pilares de Calidad.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

// --- [INICIO DE CORRECCIÓN DE ERROR TS1259] ---
import * as React from "react";
// --- [FIN DE CORRECCIÓN DE ERROR TS1259] ---
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
// --- [INICIO DE CORRECCIÓN DE ERRORES TS2307] ---
import { logger } from "@/shared/lib/logging";
// --- [FIN DE CORRECCIÓN DE ERRORES TS2307] ---

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  logger.trace(
    "[ThemeProvider] Proveedor de tema de cliente inicializado (v2.0)."
  );
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
