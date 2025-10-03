// RUTA: src/components/features/auth/_components/UserNavClient.tsx
/**
 * @file UserNavClient.tsx
 * @description Componente de cliente para la UI de UserNav, ahora con apertura por hover y MEA/UX.
 * @version 3.0.0 (Hover-to-Open & Elite UX)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import type { UserProfileData } from "@/shared/lib/actions/account/get-current-user-profile.action";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

type NavContent = NonNullable<Dictionary["userNav"]>;
type LoginContent = NonNullable<Dictionary["devLoginPage"]>;

interface UserNavClientProps {
  user: User | null;
  profile: UserProfileData | null;
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
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Has cerrado sesión.");
    router.refresh();
    router.push(`/${locale}/login`);
  };

  if (!user) {
    return (
      <Button asChild>
        <Link href={`/${locale}/login`}>{userNavContent.loginButton}</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-8 w-8 rounded-full group"
          >
            <Avatar className="h-8 w-8 transition-all duration-300 group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 group-hover:ring-offset-background">
              <AvatarImage
                src={user.user_metadata.avatar_url}
                alt={user.email ?? "User Avatar"}
              />
              <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-64"
          align="end"
          onMouseLeave={() => setIsOpen(false)}
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
          {profile && (
            <>
              <DropdownMenuSeparator />
              <LastSignInInfo
                profile={profile}
                content={loginContent.lastSignIn}
                locale={locale}
              />
            </>
          )}
          <DropdownMenuSeparator />
          <WorkspaceSwitcher />
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
        </DropdownMenuContent>
      </div>
    </DropdownMenu>
  );
}
