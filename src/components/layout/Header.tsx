// RUTA: src/components/layout/Header.tsx
/**
 * @file Header.tsx
 * @description "Server Shell" soberano para la cabecera, forjado con un Guardián de Resiliencia
 *              holístico y observabilidad de élite para una robustez de nivel de producción.
 * @version 42.1.0 (I18n Prop Decoupling): Se elimina la prop obsoleta 'supportedLocales'
 *              para alinear el componente con la arquitectura de internacionalización soberana.
 * @author RaZ Podestá - MetaShark Tech
 */
import "server-only";
import React from "react";
import { createServerClient } from "@/shared/lib/supabase/server";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { getBaviManifest } from "@/shared/lib/bavi";
import { getCart } from "@/shared/lib/commerce";
import { reshapeCartForStore } from "@/shared/lib/commerce/shapers";
import { logger } from "@/shared/lib/logging";
import HeaderClient, { type HeaderClientProps } from "./HeaderClient";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import type {
  BaviAsset,
  BaviVariant,
} from "@/shared/lib/schemas/bavi/bavi.manifest.schema";

// --- [INICIO DE REFACTORIZACIÓN DE CONTRATO v42.1.0] ---
// La prop 'supportedLocales' se elimina del contrato del "Server Shell".
type HeaderShellProps = Omit<
  HeaderClientProps,
  "user" | "profile" | "logoUrl" | "initialCart"
>;

export default async function Header({
  content,
  currentLocale,
  centerComponent,
  rightComponent,
}: HeaderShellProps) {
  // --- [FIN DE REFACTORIZACIÓN DE CONTRATO v42.1.0] ---
  const traceId = logger.startTrace("Header_Shell_v42.1");
  logger.startGroup(
    `[Header Shell] Orquestando obtención de datos para cabecera...`,
    traceId
  );

  const defaultLogoUrl = content.header.logoUrl;
  let logoUrl = defaultLogoUrl;

  try {
    logger.traceEvent(
      traceId,
      "Iniciando obtención de datos en paralelo (Supabase Auth, Profile, BAVI, Shopify Cart)..."
    );

    const supabase = createServerClient();
    const [userSession, profileResult, baviManifest, initialApiCart] =
      await Promise.all([
        supabase.auth.getUser(),
        getCurrentUserProfile_Action(),
        getBaviManifest(),
        getCart(),
      ]);

    logger.success("[Header Shell] Todas las fuentes de datos respondieron.", {
      traceId,
    });

    const user = userSession.data.user;
    const profile = user && profileResult.success ? profileResult.data : null;
    const initialCartForStore = reshapeCartForStore(initialApiCart);

    logger.traceEvent(traceId, "Resolviendo URL del logo desde la BAVI...");
    const logoAsset = baviManifest.assets.find(
      (a: BaviAsset) => a.assetId === "i-sybl-global-fitwell-logo-01"
    );
    const logoVariant = logoAsset?.variants.find(
      (v: BaviVariant) => v.state === "orig"
    );
    if (logoVariant?.publicId) {
      logoUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/f_auto,q_auto,h_56/${logoVariant.publicId}`;
      logger.traceEvent(
        traceId,
        "URL del logo resuelta desde la BAVI con éxito."
      );
    } else {
      logger.warn(
        "[Header Shell] Activo del logo no encontrado en la BAVI. Usando URL de fallback estática.",
        { assetId: "i-sybl-global-fitwell-logo-01", traceId }
      );
    }

    logger.success(
      "[Header Shell] Ensamblaje de datos completado. Delegando a HeaderClient...",
      { traceId }
    );
    return (
      <HeaderClient
        user={user}
        profile={profile}
        logoUrl={logoUrl}
        content={content}
        currentLocale={currentLocale}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
        initialCart={initialCartForStore}
      />
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido durante la obtención de datos del header.";
    logger.error(
      "[Header Shell] Fallo crítico durante la obtención de datos.",
      { error: errorMessage, traceId }
    );

    if (process.env.NODE_ENV === "development") {
      return (
        <DeveloperErrorDisplay
          context="Header Server Shell"
          errorMessage="No se pudieron obtener los datos necesarios para renderizar la cabecera. Una o más fuentes de datos (Supabase, BAVI, Shopify) fallaron."
          errorDetails={error instanceof Error ? error : errorMessage}
        />
      );
    }

    logger.warn(
      "[Header Shell] Renderizando en modo degradado debido a un error de obtención de datos.",
      { traceId }
    );
    return (
      <HeaderClient
        user={null}
        profile={null}
        logoUrl={defaultLogoUrl}
        content={content}
        currentLocale={currentLocale}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
        initialCart={[]}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
