// RUTA: src/shared/hooks/use-user-preferences.ts
/**
 * @file use-user-preferences.ts
 * @description Hook Soberano para la gestión de preferencias de usuario persistentes.
 * @version 2.0.0 (Elite Observability & Resilience)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { logger } from "@/shared/lib/logging";
import {
  UserPreferencesSchema,
  type UserPreferences,
} from "@/shared/lib/schemas/entities/user-preferences.schema";

const PREFERENCES_STORAGE_KEY = "user-preferences";

export const useUserPreferences = () => {
  const traceId = useMemo(
    () => logger.startTrace("useUserPreferences_v2.0"),
    []
  );
  const [preferences, setPreferences] = useState<UserPreferences>({});

  useEffect(() => {
    logger.info(
      "[UserPreferences] Hook montado, leyendo estado de localStorage.",
      { traceId }
    );
    try {
      const storedItem = localStorage.getItem(PREFERENCES_STORAGE_KEY);
      if (storedItem) {
        const parsed = JSON.parse(storedItem);
        const validation = UserPreferencesSchema.safeParse(parsed);
        if (validation.success) {
          setPreferences(validation.data);
          logger.success(
            "[UserPreferences] Preferencias cargadas y validadas desde localStorage.",
            { data: validation.data, traceId }
          );
        } else {
          logger.warn(
            "[Guardián] Datos de preferencias corruptos en localStorage. Se ignorarán.",
            { errors: validation.error.flatten(), traceId }
          );
          localStorage.removeItem(PREFERENCES_STORAGE_KEY);
        }
      } else {
        logger.traceEvent(
          traceId,
          "No se encontraron preferencias en localStorage."
        );
      }
    } catch (error) {
      logger.error("[Guardián] Fallo al leer preferencias del localStorage.", {
        error,
        traceId,
      });
    }
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const setPreference = useCallback(
    <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      const actionTraceId = logger.startTrace(`setPreference:${key}`);
      setPreferences((prev) => {
        const newPrefs = { ...prev, [key]: value };
        try {
          localStorage.setItem(
            PREFERENCES_STORAGE_KEY,
            JSON.stringify(newPrefs)
          );
          logger.traceEvent(
            actionTraceId,
            "Preferencia persistida en localStorage.",
            newPrefs
          );
        } catch (error) {
          logger.error(
            "[Guardián] Fallo al guardar preferencias en localStorage.",
            { error, traceId: actionTraceId }
          );
        }
        logger.endTrace(actionTraceId);
        return newPrefs;
      });
    },
    []
  );

  return { preferences, setPreference };
};
