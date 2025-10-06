// RUTA: src/components/features/auth/components/UserNavClient.tsx
"use client";
import React, { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { createClient } from "@/shared/lib/supabase/client";
import { LastSignInInfo } from "./LastSignInInfo";
import { WorkspaceSwitcher } from "./WorkspaceSwitcher";
import type { User } from "@supabase/supabase-js";
import type { ProfilesRow } from "@/shared/lib/schemas/account/account.contracts";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
type NavContent = NonNullable<Dictionary["userNav"]>;
type LoginContent = NonNullable<Dictionary["devLoginPage"]>;

interface UserNavClientProps {
  user: User | null;
  profile: ProfilesRow | null;
  userNavContent: NavContent;
  loginContent: LoginContent;
  locale: Locale;
}

export function UserNavClient({
  user,
  profile,
  userNavContent,
  loginContent,
  locale,
}: UserNavClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("UserNavClient_Lifecycle_v11.1"),
    []
  );
  useEffect(() => {
    logger.info("[UserNavClient] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = useCallback(async () => {
    const actionTraceId = logger.startTrace("userNav.logout");
    await supabase.auth.signOut();
    toast.info("Has cerrado sesión.");
    router.refresh();
    router.push(`/${locale}/login`);
    logger.success("[UserNavClient] Cierre de sesión completado.", {
      traceId: actionTraceId,
    });
  }, [supabase.auth, router, locale]);

  if (!userNavContent || !loginContent) {
    logger.error(
      "[Guardián] Prop de contenido i18n faltante en UserNavClient.",
      { traceId }
    );
    return (
      <DeveloperErrorDisplay
        context="UserNavClient"
        errorMessage="Contrato de UI violado: Faltan las props 'userNavContent' o 'loginContent'."
      />
    );
  }

  if (!user) {
    logger.trace(
      "[UserNavClient] No hay usuario, renderizando botón de login."
    );
    return (
      <Button asChild>
        <Link href={`/${locale}/login`}>{userNavContent.loginButton}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <motion.div
        onHoverStart={() => setIsOpen(true)}
        onHoverEnd={() => setIsOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full group"
          >
            <Avatar className="h-8 w-8 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-background">
              <AvatarImage
                src={profile?.provider_avatar_url || profile?.avatar_url || ""}
                alt={profile?.full_name || user.email!}
              />
              <AvatarFallback>
                {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <AnimatePresence>
          {isOpen && (
            <DropdownMenuContent
              asChild
              forceMount
              className="w-64"
              align="end"
            >
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
              >
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.full_name || userNavContent.sessionLabel}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />
                <LastSignInInfo
                  profile={profile}
                  content={loginContent.lastSignIn}
                  locale={locale}
                />

                <DropdownMenuSeparator />
                <WorkspaceSwitcher content={userNavContent.workspaceSwitcher} />
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={`/${locale}/account`}>Mi Cuenta</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive-foreground"
                >
                  {userNavContent.logoutButton}
                </DropdownMenuItem>
              </motion.div>
            </DropdownMenuContent>
          )}
        </AnimatePresence>
      </motion.div>
    </DropdownMenu>
  );
}
