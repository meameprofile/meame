// RUTA: src/shared/hooks/use-auth.ts
/**
 * @file use-auth.ts
 * @description Hook de cliente de élite, ahora con manejo de estado resiliente y
 *              observabilidad completa para la obtención del perfil de usuario.
 * @version 2.1.0 (Resilient Profile Fetching)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/shared/lib/supabase/client";
import {
  getCurrentUserProfile_Action,
  type UserProfileData,
} from "@/shared/lib/actions/account/get-current-user-profile.action";
import type { User } from "@supabase/supabase-js";
import { logger } from "@/shared/lib/logging";

export function useAuth() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const traceId = logger.startTrace("useAuth.fetchUserProfile");
      logger.traceEvent(traceId, "Iniciando obtención de perfil de usuario...");

      const result = await getCurrentUserProfile_Action();

      // --- INICIO DEL GUARDIÁN DE RESILIENCIA VERBOSO ---
      if (result.success) {
        setProfile(result.data);
        logger.success(
          "[useAuth] Perfil de usuario obtenido y actualizado en el estado.",
          { traceId }
        );
      } else {
        // En caso de fallo, el perfil se setea a null y se loguea el error.
        setProfile(null);
        logger.error("[useAuth] Falló la obtención del perfil de usuario.", {
          error: result.error,
          traceId,
        });
      }
      logger.endTrace(traceId);
      // --- FIN DEL GUARDIÁN DE RESILIENCIA VERBOSO ---
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        logger.trace(
          "[useAuth] Cambio de estado de autenticación: SESIÓN ACTIVA. Obteniendo perfil..."
        );
        fetchUserProfile();
      } else {
        logger.trace(
          "[useAuth] Cambio de estado de autenticación: SESIÓN TERMINADA. Limpiando perfil."
        );
        setProfile(null);
      }
      setIsLoading(false);
    });

    const getInitialSession = async () => {
      setIsLoading(true);
      logger.trace(
        "[useAuth] Obteniendo sesión inicial al montar el componente..."
      );
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      if (sessionUser) {
        await fetchUserProfile();
      }
      setIsLoading(false);
      logger.trace("[useAuth] Carga de sesión inicial completada.");
    };

    getInitialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth]);

  return { user, profile, isLoading };
}
