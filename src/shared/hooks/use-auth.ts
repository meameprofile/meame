// RUTA: src/shared/hooks/use-auth.ts
/**
 * @file use-auth.ts
 * @description Hook de cliente de élite para la gestión del estado de autenticación.
 * @version 5.0.0 (Holistic Elite Leveling)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import { createClient } from "@/shared/lib/supabase/client";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { linkAnonymousSessionToUserAction } from "@/shared/lib/actions/auth/linkAnonymousSessionToUser.action";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";
import type { User } from "@supabase/supabase-js";
import { logger } from "@/shared/lib/logging";

const FINGERPRINT_COOKIE = "visitor_fingerprint";

interface AuthState {
  user: User | null;
  profile: ProfilesRow | null;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const traceId = useMemo(
    () => logger.startTrace("useAuth_Lifecycle_v5.0"),
    []
  );
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfilesRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleSessionLink = useCallback(async () => {
    const linkTraceId = logger.startTrace("useAuth.handleSessionLink");
    try {
      const fingerprintId = Cookies.get(FINGERPRINT_COOKIE);
      if (fingerprintId) {
        logger.traceEvent(
          linkTraceId,
          "Fingerprint anónimo encontrado. Invocando acción de vinculación..."
        );
        const result = await linkAnonymousSessionToUserAction({
          fingerprintId,
        });
        if (!result.success) {
          logger.warn("[useAuth] La vinculación de la sesión anónima falló.", {
            error: result.error,
            traceId: linkTraceId,
          });
        } else {
          logger.success(
            "[useAuth] Vinculación de sesión anónima completada.",
            { traceId: linkTraceId }
          );
        }
      } else {
        logger.traceEvent(
          linkTraceId,
          "No se encontró fingerprint. Omitiendo vinculación."
        );
      }
    } catch (error) {
      logger.error("[useAuth] Error en handleSessionLink.", {
        error,
        traceId: linkTraceId,
      });
    } finally {
      logger.endTrace(linkTraceId);
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    const fetchTraceId = logger.startTrace("useAuth.fetchUserProfile");
    try {
      const result = await getCurrentUserProfile_Action();
      if (result.success) {
        setProfile(result.data);
        logger.success("[useAuth] Perfil de usuario obtenido.", {
          traceId: fetchTraceId,
        });
      } else {
        setProfile(null);
        logger.warn("[useAuth] No se pudo obtener el perfil de usuario.", {
          error: result.error,
          traceId: fetchTraceId,
        });
      }
    } catch (error) {
      logger.error("[useAuth] Fallo crítico al obtener el perfil.", {
        error,
        traceId: fetchTraceId,
      });
      setProfile(null);
    } finally {
      logger.endTrace(fetchTraceId);
    }
  }, []);

  useEffect(() => {
    logger.info("[useAuth] Hook montado. Suscribiéndose a cambios de estado.", {
      traceId,
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const authTraceId = logger.startTrace(`onAuthStateChange:${event}`);
      const sessionUser = session?.user ?? null;
      const hadUserBefore = !!user;

      setUser(sessionUser);

      if (sessionUser) {
        logger.traceEvent(
          authTraceId,
          `Evento: ${event} para ${sessionUser.email}.`
        );
        await fetchUserProfile();
        if (event === "SIGNED_IN" && !hadUserBefore) {
          await handleSessionLink();
        }
      } else {
        logger.traceEvent(authTraceId, `Evento: ${event}. Sesión terminada.`);
        setProfile(null);
      }

      setIsLoading(false);
      logger.endTrace(authTraceId);
    });

    const getInitialSession = async () => {
      setIsLoading(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchUserProfile();
      }
      setIsLoading(false);
    };

    getInitialSession();

    return () => {
      logger.info("[useAuth] Hook desmontado. Cancelando suscripción.", {
        traceId,
      });
      subscription.unsubscribe();
      logger.endTrace(traceId);
    };
  }, [supabase.auth, traceId, fetchUserProfile, handleSessionLink, user]);

  return { user, profile, isLoading };
}
