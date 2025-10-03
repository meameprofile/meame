// RUTA: src/components/layout/HeaderClient.tsx
/**
 * @file HeaderClient.tsx
 * @description Componente de Cliente Soberano para cabeceras, ahora con seguridad de tipos absoluta.
 * @version 46.0.0 (Absolute Type Safety)
 *@author L.I.A. Legacy
 */
"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type User } from "@supabase/supabase-js";
import { motion, type Variants } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import { type Locale, supportedLocales } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { UserProfileData } from "@/shared/lib/actions/account/get-current-user-profile.action";
import { Container, Button } from "@/components/ui";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/NavigationMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { CartTrigger } from "./CartTrigger";
import { CartSheet } from "./CartSheet";
import { UserNavClient } from "@/components/features/auth/components/UserNavClient";
import { NotificationBell } from "@/components/features/notifications/NotificationBell/NotificationBell";
import { DeveloperErrorDisplay } from "../features/dev-tools";
import { useCartStore, type CartItem } from "@/shared/lib/stores/useCartStore";
// --- [INICIO DE REFACTORIZACIÓN POR INTEGRIDAD DE TIPOS] ---
import type { NavLink } from "@/shared/lib/schemas/components/header.schema";
// --- [FIN DE REFACTORIZACIÓN POR INTEGRIDAD DE TIPOS] ---

export interface HeaderClientProps {
  user: User | null;
  profile: UserProfileData | null;
  logoUrl: string;
  content: {
    header: NonNullable<Dictionary["header"]>;
    languageSwitcher: NonNullable<Dictionary["languageSwitcher"]>;
    cart: NonNullable<Dictionary["cart"]>;
    userNav: NonNullable<Dictionary["userNav"]>;
    notificationBell: NonNullable<Dictionary["notificationBell"]>;
    devLoginPage: NonNullable<Dictionary["devLoginPage"]>;
  };
  currentLocale: Locale;
  supportedLocales: readonly string[];
  centerComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  initialCart: CartItem[];
}

const headerVariants: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function HeaderClient({
  user,
  profile,
  logoUrl,
  content,
  currentLocale,
  centerComponent,
  rightComponent,
  initialCart,
}: HeaderClientProps): React.ReactElement | null {
  const traceId = useMemo(
    () => logger.startTrace("HeaderClient_Lifecycle_v46.0"),
    []
  );
  const pathname = usePathname();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { initialize: initializeCart } = useCartStore();

  useEffect(() => {
    logger.info("[HeaderClient] Componente montado y listo.", { traceId });
    if (!useCartStore.getState().isInitialized) {
      initializeCart(initialCart);
    }
    return () => logger.endTrace(traceId);
  }, [traceId, initializeCart, initialCart]);

  const handleCartOpen = useCallback(() => {
    logger.traceEvent(traceId, "Acción de usuario: Abrir panel del carrito.");
    setIsCartOpen(true);
  }, [traceId]);

  const {
    header,
    languageSwitcher,
    cart,
    userNav,
    notificationBell,
    devLoginPage,
  } = content;

  if (
    !header ||
    !languageSwitcher ||
    !cart ||
    !userNav ||
    !notificationBell ||
    !devLoginPage
  ) {
    const errorMsg =
      "Contrato de UI violado: La prop 'content' para HeaderClient está incompleta.";
    logger.error(`[Guardián] ${errorMsg}`, {
      traceId,
      receivedContent: content,
    });
    return process.env.NODE_ENV === "development" ? (
      <header className="py-3 border-b border-destructive">
        <Container>
          <DeveloperErrorDisplay
            context="HeaderClient"
            errorMessage={errorMsg}
          />
        </Container>
      </header>
    ) : null;
  }

  const isPublicView = !centerComponent;

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className="py-3 sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b"
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4 flex-shrink-0 w-1/3">
            <Link
              href={`/${currentLocale}`}
              className="flex items-center gap-3 group"
            >
              <Image
                src={logoUrl}
                alt={header.logoAlt}
                width={150}
                height={28}
                priority
              />
            </Link>
          </div>
          <div className="flex-grow w-1/3 flex items-center justify-center">
            {centerComponent ? (
              centerComponent
            ) : (
              <NavigationMenu>
                <NavigationMenuList>
                  {header.navLinks.map(
                    (
                      link: NavLink // <-- TIPO EXPLÍCITO AÑADIDO
                    ) => (
                      <NavigationMenuItem key={link.href}>
                        <Link
                          href={`/${currentLocale}${link.href}`}
                          legacyBehavior
                          passHref
                        >
                          <NavigationMenuLink
                            className={navigationMenuTriggerStyle()}
                            active={
                              pathname === `/${currentLocale}${link.href}`
                            }
                          >
                            {link.label}
                          </NavigationMenuLink>
                        </Link>
                      </NavigationMenuItem>
                    )
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            )}
          </div>
          <div className="flex items-center justify-end gap-2 sm:gap-4 flex-shrink-0 w-1/3">
            {rightComponent}
            <LanguageSwitcher
              currentLocale={currentLocale}
              supportedLocales={supportedLocales}
              content={languageSwitcher}
            />

            {isPublicView && (
              <>
                <CartTrigger onClick={handleCartOpen} content={cart} />
                <CartSheet
                  isOpen={isCartOpen}
                  onOpenChange={setIsCartOpen}
                  content={cart}
                  locale={currentLocale}
                />
              </>
            )}

            <NotificationBell content={notificationBell} />
            <UserNavClient
              user={user}
              profile={profile}
              userNavContent={userNav}
              loginContent={devLoginPage}
              locale={currentLocale}
            />

            {isPublicView && !user && (
              <Button asChild variant="ghost" size="sm">
                <Link href={`/${currentLocale}/login?view=signup`}>
                  {header.signUpButton.label}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Container>
    </motion.header>
  );
}
