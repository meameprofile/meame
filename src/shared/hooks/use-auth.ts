// RUTA: src/shared/hooks/use-auth.ts
/**
 * @file use-auth.ts
 * @description Hook de cliente de élite para la gestión del estado de autenticación,
 *              con observabilidad forense y lógica de "Sesión Ascendente" integrada.
 *              Este aparato es el Guardián de la Identidad del Cliente.
 * @version 5.0.0 (Holistic Elite Leveling)
 * @author L.I.A. Legacy
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

/**
 * @interface AuthState
 * @description Contrato de retorno soberano para el hook `useAuth`.
 */
interface AuthState {
  user: User | null;
  profile: ProfilesRow | null;
  isLoading: boolean;
}

/**
 * @function useAuth
 * @description Hook "cerebro" que gestiona el ciclo de vida completo de la
 *              autenticación del cliente. Se suscribe a los cambios de estado
 *              de Supabase Auth, obtiene el perfil de usuario asociado y orquesta
 *              la vinculación de la sesión anónima ("Sesión Ascendente").
 * @returns {AuthState} El estado de autenticación actual del usuario.
 */
export function useAuth(): AuthState {
  // Pilar III: Observabilidad Forense con Tracing
  const traceId = useMemo(
    () => logger.startTrace("useAuth_Lifecycle_v5.0"),
    []
  );
  const supabase = useMemo(() => createClient(), []);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfilesRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pilar I: Lógica Atómica y Encapsulada
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
          // No es un error crítico, pero lo registramos.
          logger.warn("[useAuth] La vinculación de la sesión anónima falló.", {
            error: result.error,
            traceId: linkTraceId,
          });
        } else {
          logger.success(
            "[useAuth] Vinculación de sesión anónima completada con éxito.",
            { traceId: linkTraceId }
          );
          // Opcional: Eliminar la cookie después de una vinculación exitosa para evitar reintentos.
          // Cookies.remove(FINGERPRINT_COOKIE);
        }
      } else {
        logger.traceEvent(
          linkTraceId,
          "No se encontró fingerprint anónimo. Omitiendo vinculación."
        );
      }
    } catch (error) {
      logger.error("[useAuth] Error inesperado en handleSessionLink.", {
        error,
        traceId: linkTraceId,
      });
    } finally {
      logger.endTrace(linkTraceId);
    }
  }, []);

  useEffect(() => {
    logger.info(
      "[useAuth] Hook montado. Suscribiéndose a cambios de estado de autenticación.",
      { traceId }
    );

    const fetchUserProfile = async () => {
      const fetchTraceId = logger.startTrace("useAuth.fetchUserProfile");
      try {
        const result = await getCurrentUserProfile_Action();
        if (result.success) {
          setProfile(result.data);
          logger.success("[useAuth] Perfil de usuario obtenido y aplicado.", {
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
        logger.error(
          "[useAuth] Fallo crítico al obtener el perfil de usuario.",
          { error, traceId: fetchTraceId }
        );
        setProfile(null);
      } finally {
        logger.endTrace(fetchTraceId);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const authTraceId = logger.startTrace(`onAuthStateChange:${_event}`);
      const sessionUser = session?.user ?? null;
      const hadUserBefore = !!user; // Estado anterior antes de la actualización

      setUser(sessionUser);

      if (sessionUser) {
        logger.traceEvent(
          authTraceId,
          `Evento de autenticación recibido: SESIÓN ACTIVA para ${sessionUser.email}.`
        );
        await fetchUserProfile();

        if (!hadUserBefore) {
          // Si esto representa un nuevo inicio de sesión
          await handleSessionLink();
        }
      } else {
        logger.traceEvent(
          authTraceId,
          "Evento de autenticación recibido: SESIÓN TERMINADA."
        );
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
      logger.info(
        "[useAuth] Hook desmontado. Cancelando suscripción de autenticación.",
        { traceId }
      );
      subscription.unsubscribe();
      logger.endTrace(traceId);
    };
  }, [supabase.auth, traceId, handleSessionLink, user]); // 'user' es necesario para detectar el cambio de estado de null a un objeto de usuario

  return { user, profile, isLoading };
}
