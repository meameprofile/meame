// RUTA: src/app/[locale]/account/page.tsx
/**
 * @file page.tsx
 * @description Página de Gestión de Cuenta del Usuario.
 * @version 2.0.0 (Holistic Elite Leveling & i18n Contract Sync)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { redirect, notFound } from "next/navigation";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { createServerClient } from "@/shared/lib/supabase/server";
import { ProfileForm } from "@/components/features/account/ProfileForm";
import { PasswordForm } from "@/components/features/account/PasswordForm";
import { DeleteAccountZone } from "@/components/features/account/DeleteAccountZone";
import { logger } from "@/shared/lib/logging";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

interface AccountPageProps {
  params: { locale: Locale };
}

export default async function AccountPage({
  params: { locale },
}: AccountPageProps): Promise<React.ReactElement> {
  logger.info("[AccountPage] Renderizando v2.0 (Elite).");

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  // Obtenemos el diccionario.
  const { dictionary, error: dictError } = await getDictionary(locale);
  const content = dictionary.profileForm;

  // Guardia de Resiliencia
  if (dictError || !content) {
    const errorMessage =
      "Fallo al cargar el contenido i18n para la página de cuenta.";
    logger.error(`[AccountPage] ${errorMessage}`, { error: dictError });
    if (process.env.NODE_ENV === "production") return notFound();
    return (
      <DeveloperErrorDisplay
        context="AccountPage"
        errorMessage={errorMessage}
        errorDetails={
          dictError || "La clave 'profileForm' falta en el diccionario."
        }
      />
    );
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Gestión de la Cuenta
        </h1>
        <p className="text-muted-foreground mt-1">
          Actualiza tu perfil, cambia tu contraseña y gestiona la seguridad de
          tu cuenta.
        </p>
      </header>

      <div className="space-y-12">
        {/* Se pasa la prop 'content' requerida */}
        <ProfileForm user={user} content={content} />
        <PasswordForm />
        <DeleteAccountZone />
      </div>
    </div>
  );
}
