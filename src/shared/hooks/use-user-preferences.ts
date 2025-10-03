// RUTA: shared/hooks/use-user-preferences.ts
/**
 * @file use-user-preferences.ts
 * @description Hook Soberano para la gestión de preferencias de usuario persistentes.
 *              Es "SSR-safe", garantizando que localStorage solo se acceda en el cliente.
 * @version 1.2.0 (Elite Linter Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useCallback } from "react";
import { logger } from "@/shared/lib/logging";
import {
  UserPreferencesSchema,
  type UserPreferences,
} from "@/shared/lib/schemas/entities/user-preferences.schema";

const PREFERENCES_STORAGE_KEY = "user-preferences";

export const useUserPreferences = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({});

  useEffect(() => {
    try {
      const storedItem = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedItem) {
        const parsed = JSON.parse(storedItem);
        const validation = UserPreferencesSchema.safeParse(parsed);
        if (validation.success) {
          setPreferences(validation.data);
          logger.info(
            "Preferencias de usuario cargadas desde localStorage.",
            validation.data
          );
        } else {
          logger.warn("Datos de preferencias en localStorage son inválidos.", {
            errors: validation.error,
          });
        }
      }
    } catch (error) {
      logger.warn("No se pudieron leer las preferencias del localStorage.", {
        error,
      });
    }
  }, []);

  const setPreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      setPreferences((prev) => {
        const newPrefs = { ...prev, [key]: value };
        try {
          localStorage.setItem(
            PREFERENCES_STORAGE_KEY,
            JSON.stringify(newPrefs)
          );
          logger.trace(
            "Preferencias de usuario persistidas en localStorage",
            newPrefs
          );
        } catch (error) {
          logger.error("Fallo al guardar las preferencias en localStorage.", {
            error,
          });
        }
        return newPrefs;
      });
    },
    []
  );

  return { preferences, setPreference };
};
