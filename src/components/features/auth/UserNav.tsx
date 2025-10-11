// RUTA: src/components/features/auth/UserNav.tsx
/**
 * @file UserNav.tsx
 * @description Componente soberano para la UI de sesión del usuario.
 *              v4.0.0 (Conditional Rendering & Elite Compliance): Ahora consume
 *              el hook de autenticación para renderizar condicionalmente el menú
 *              de usuario o un botón de inicio de sesión.
 * @version 4.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Skeleton } from "@/components/ui/Skeleton";
import { useAuth } from "@/shared/hooks/use-auth";
import { logger } from "@/shared/lib/logging";
import type { UserNavContentSchema } from "@/shared/lib/schemas/components/auth/user-nav.schema";
import { createClient } from "@/shared/lib/supabase/client";

// --- SSoT del Contrato de Contenido ---
type Content = z.infer<typeof UserNavContentSchema>;

interface UserNavProps {
  content?: Content;
}

export function UserNav({ content }: UserNavProps): React.ReactElement {
  logger.info("[UserNav] Renderizando v4.0 (Conditional).");
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh();
    router.push("/");
  };

  // --- Guardia de Resiliencia ---
  if (!content) {
    logger.error(
      "[UserNav] Contenido i18n no proporcionado. Renderizado nulo."
    );
    return <></>;
  }

  if (isLoading) {
    return <Skeleton className="h-10 w-24 rounded-md" />;
  }

  if (!user) {
    return (
      <Button asChild>
        <Link href="/login">{content.loginButton}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.user_metadata.avatar_url}
              alt={user.email ?? "User Avatar"}
            />
            <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {content.sessionLabel}
            </p>
            <p className="text-xs leading-none text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
          {content.logoutButton}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
