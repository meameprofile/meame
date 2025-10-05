// RUTA: src/components/features/user-intelligence/UserIntelligenceClient.tsx
/**
 * @file UserIntelligenceClient.tsx
 * @description Componente de cliente para el dashboard de Inteligencia de Usuarios.
 * @version 2.1.0 (SSoT Path Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { UserIntelligenceTable } from "./UserIntelligenceTable";
import type { ProfiledUser } from "@/shared/lib/actions/user-intelligence/getProfiledUsers.action";
// --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE RUTA v2.1.0] ---
import type { UserIntelligenceContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence.i18n.schema";
// --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE RUTA v2.1.0] ---
import type { z } from "zod";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

type Content = z.infer<typeof UserIntelligenceContentSchema>;

interface UserIntelligenceClientProps {
  initialData: {
    users: ProfiledUser[];
    total: number;
  };
  content: Content;
  locale: Locale;
}

export function UserIntelligenceClient({
  initialData,
  content,
  locale,
}: UserIntelligenceClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <UserIntelligenceTable
      data={initialData.users}
      total={initialData.total}
      page={page}
      limit={limit}
      onPageChange={handlePageChange}
      content={content}
      locale={locale}
    />
  );
}
