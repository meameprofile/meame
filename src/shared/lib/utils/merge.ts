// lib/utils/merge.ts
/**
 * @file merge.ts
 * @description Utilidad pura y atómica para la fusión profunda (deep merge) de objetos.
 *              v2.0.0 (Elite Refactor): Lógica simplificada, más robusta y segura
 *              a nivel de tipos, eliminando aserciones 'any'.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { logger } from "@/shared/lib/logging";

logger.trace("[Utilidad] Módulo de deepMerge (v2.0.0) cargado.");

const isObject = (item: unknown): item is Record<string, unknown> => {
  return item !== null && typeof item === "object" && !Array.isArray(item);
};

export function deepMerge<T extends object, U extends object>(
  target: T,
  source: U
): T & U {
  const output = { ...target } as T & U;

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      const targetValue = (target as Record<string, unknown>)[key];
      const sourceValue = source[key as keyof U];

      if (isObject(targetValue) && isObject(sourceValue)) {
        // La clave existe en ambos y ambos valores son objetos, fusionar recursivamente.
        (output as Record<string, unknown>)[key] = deepMerge(
          targetValue,
          sourceValue
        );
      } else {
        // Si no, la propiedad de `source` sobrescribe la de `target`.
        (output as Record<string, unknown>)[key] = sourceValue;
      }
    });
  }

  return output;
}
// lib/utils/merge.ts
