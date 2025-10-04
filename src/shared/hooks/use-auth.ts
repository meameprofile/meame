// RUTA: src/shared/hooks/use-auth.ts
/**
 * @file use-auth.ts
 * @description Hook de cliente de élite para la gestión del estado de autenticación,
 *              ahora alineado con la Arquitectura de Contratos de Dominio Soberanos.
 * @version 3.0.0 (Sovereign Contract Aligned)
 * @author L.I.A. Legacy
 */
"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";
import type { User } from "@supabase/supabase-js";
import { logger } from "@/shared/lib/logging";

export function useAuth() {
  const traceId = useMemo(
    () => logger.startTrace("useAuth_Lifecycle_v3.0"),
    []
  );
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfilesRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    logger.info("[useAuth] Hook montado.", { traceId });

    const fetchUserProfile = async () => {
      const fetchTraceId = logger.startTrace("useAuth.fetchUserProfile");
      logger.traceEvent(fetchTraceId, "Iniciando obtención de perfil...");

      const result = await getCurrentUserProfile_Action();

      if (result.success) {
        setProfile(result.data);
        logger.success("[useAuth] Perfil de usuario obtenido.", {
          traceId: fetchTraceId,
        });
      } else {
        setProfile(null);
        logger.error("[useAuth] Fallo al obtener el perfil de usuario.", {
          error: result.error,
          traceId: fetchTraceId,
        });
      }
      logger.endTrace(fetchTraceId);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        logger.traceEvent(
          traceId,
          "Cambio de Auth detectado: SESIÓN ACTIVA. Obteniendo perfil..."
        );
        fetchUserProfile();
      } else {
        logger.traceEvent(
          traceId,
          "Cambio de Auth detectado: SESIÓN TERMINADA. Limpiando perfil."
        );
        setProfile(null);
      }
      setIsLoading(false);
    });

    const getInitialSession = async () => {
      setIsLoading(true);
      logger.traceEvent(traceId, "Obteniendo sesión inicial...");
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        await fetchUserProfile();
      }
      setIsLoading(false);
      logger.traceEvent(traceId, "Carga de sesión inicial completada.");
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
      logger.endTrace(traceId);
    };
  }, [supabase.auth, traceId]);

  return { user, profile, isLoading };
}
