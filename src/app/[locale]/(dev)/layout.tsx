// RUTA: src/app/[locale]/(dev)/layout.tsx
/**
 * @file layout.tsx
 * @description Layout Soberano y Guardián del DCC, re-forjado con una
 *              arquitectura visual de élite, guardián de autenticación y
 *              seguridad de tipos absoluta.
 * @version 17.0.0 (Sovereign Reforge & Elite UX)
 * @author L.I.A. Legacy
 */
import "server-only";
import React, { Suspense } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/shared/lib/supabase/server";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import HeaderClient from "@/components/layout/HeaderClient";
import {
  DynamicIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import { DevThemeSwitcher } from "@/components/features/dev-tools/DevThemeSwitcher";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";
import DevToolsDropdown from "@/components/features/dev-tools/DevToolsDropdown";
import { getCart } from "@/shared/lib/commerce/cart";
import { reshapeCartForStore } from "@/shared/lib/commerce/shapers";
import { BentoCardData } from "@/components/razBits/MagicBento/magic-bento.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { getCurrentUserProfile_Action } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { loadAllThemeFragmentsAction } from "@/shared/lib/actions/campaign-suite";
import type { LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import type { DevRouteMenuContent } from "@/shared/lib/schemas/components/dev/dev-route-menu.schema";
import Loading from "./loading";

// --- SUB-COMPONENTES DE UI ATÓMICOS Y CON ESTILO ---
interface SidebarTool {
  name: string;
  href: string;
  icon: LucideIconName;
}
const DCCSidebar = ({ tools }: { tools: SidebarTool[] }) => (
  <aside className="w-16 bg-card border-r flex flex-col items-center py-4 space-y-2">
    <TooltipProvider delayDuration={0}>
      {tools.map((tool) => (
        <Tooltip key={tool.name}>
          <TooltipTrigger asChild>
            <Link
              href={tool.href}
              className="p-3 rounded-lg text-muted-foreground transition-all duration-200 ease-in-out hover:bg-primary/10 hover:text-primary hover:scale-110"
            >
              <DynamicIcon name={tool.icon} className="h-6 w-6" />
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{tool.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </TooltipProvider>
  </aside>
);

const DCCSubNav = ({ dictionary }: { dictionary: DevRouteMenuContent }) => (
  <div className="w-64 bg-background border-r p-6">
    <h2 className="font-bold text-lg mb-4 text-foreground">
      Navegación Rápida
    </h2>
    <DevToolsDropdown dictionary={dictionary} />
  </div>
);

// --- ORQUESTADOR DE DATOS (SE EJECUTA DESPUÉS DEL GUARDIÁN DE AUTH) ---
async function DevLayoutDataOrchestrator({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: Locale;
}) {
  const traceId = logger.startTrace(`DevLayout_Orchestrator_v17.0:${locale}`);
  logger.startGroup(`[DCC Orchestrator] Ensamblando UI para [${locale}]...`);

  try {
    const [
      dictionaryResult,
      fragmentsResult,
      cartResult,
      profileResult,
      userSession,
    ] = await Promise.all([
      getDictionary(locale),
      loadAllThemeFragmentsAction(),
      getCart(),
      getCurrentUserProfile_Action(),
      createServerClient().auth.getUser(),
    ]);

    const { dictionary, error } = dictionaryResult;
    const requiredKeys: (keyof Dictionary)[] = [
      "header",
      "toggleTheme",
      "languageSwitcher",
      "userNav",
      "notificationBell",
      "devLoginPage",
      "cart",
      "devRouteMenu",
      "suiteStyleComposer",
      "devDashboardPage",
    ];
    const missingKeys = requiredKeys.filter((key) => !dictionary[key]);
    if (
      error ||
      missingKeys.length > 0 ||
      !dictionary.devDashboardPage?.magicBento
    ) {
      if (!dictionary.devDashboardPage?.magicBento)
        missingKeys.push("devDashboardPage.magicBento");
      throw new Error(
        `Faltan datos de i18n esenciales. Claves ausentes: ${missingKeys.join(", ")}`
      );
    }

    const {
      header,
      toggleTheme,
      languageSwitcher,
      userNav,
      notificationBell,
      devLoginPage,
      cart,
      devRouteMenu,
      suiteStyleComposer,
      devDashboardPage,
    } = dictionary;
    if (!fragmentsResult.success) throw new Error(fragmentsResult.error);

    const initialCart = reshapeCartForStore(cartResult);
    const headerContent = {
      header,
      toggleTheme,
      languageSwitcher,
      userNav,
      notificationBell,
      devLoginPage,
      cart,
    };
    const toolMetadata: Record<string, { href: string; icon: LucideIconName }> =
      {
        "La Forja (SDC)": {
          href: `/${locale}/creator/campaign-suite`,
          icon: "LayoutTemplate",
        },
        "El Arsenal (BAVI)": {
          href: `/${locale}/dev/bavi`,
          icon: "LibraryBig",
        },
        "La Bóveda (RaZPrompts)": {
          href: `/${locale}/dev/raz-prompts`,
          icon: "BrainCircuit",
        },
        "El Motor (CogniRead)": {
          href: `/${locale}/dev/cogniread`,
          icon: "BookOpenCheck",
        },
        "El Sistema Nervioso (Nos3)": {
          href: `/${locale}/dev/nos3`,
          icon: "Video",
        },
        "El Laboratorio": {
          href: `/${locale}/dev/test-page`,
          icon: "TestTube",
        },
      };
    const devToolsForSidebar: SidebarTool[] =
      devDashboardPage.magicBento.cards.map((card: BentoCardData) => ({
        name: card.title,
        href: toolMetadata[card.title]?.href || `/${locale}/dev`,
        icon: toolMetadata[card.title]?.icon || "HelpCircle",
      }));

    return (
      <>
        <HeaderClient
          user={userSession.data.user}
          profile={profileResult.success ? profileResult.data : null}
          logoUrl={header.logoUrl}
          content={headerContent}
          currentLocale={locale}
          supportedLocales={["es-ES", "it-IT", "en-US", "pt-BR"]}
          centerComponent={<DevToolsDropdown dictionary={devRouteMenu} />}
          rightComponent={
            <DevThemeSwitcher
              allThemeFragments={fragmentsResult.data}
              content={suiteStyleComposer}
            />
          }
          initialCart={initialCart}
        />
        <div className="flex" style={{ height: "calc(100vh - 81px)" }}>
          <DCCSidebar tools={devToolsForSidebar} />
          <DCCSubNav dictionary={devRouteMenu} />
          <main className="flex-1 overflow-y-auto bg-muted/20 p-8">
            {children}
          </main>
        </div>
      </>
    );
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido.";
    logger.error("[DCC Orchestrator] Fallo crítico al renderizar el layout.", {
      error: errorMessage,
      traceId,
    });
    return (
      <DeveloperErrorDisplay
        context="DevLayout Orchestrator"
        errorMessage="No se pudo construir el layout del DCC."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}

// --- LAYOUT PRINCIPAL (GUARDIÁN DE AUTENTICACIÓN) ---
export default async function DevLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: Locale };
}) {
  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logger.warn(
      "[Auth Guardian] Usuario no autenticado detectado en el layout del DCC. Redirigiendo a la página de login..."
    );
    const redirectUrl = `/${locale}/login`;
    return redirect(redirectUrl);
  }

  return (
    <Suspense fallback={<Loading />}>
      <DevLayoutDataOrchestrator locale={locale}>
        {children}
      </DevLayoutDataOrchestrator>
    </Suspense>
  );
}
