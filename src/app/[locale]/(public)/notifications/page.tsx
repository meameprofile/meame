// RUTA: src/app/[locale]/notifications/page.tsx
/**
 * @file page.tsx
 * @description Página de historial completo de notificaciones del usuario.
 * @version 2.1.0 (Architectural Import Fix)
 * @author RaZ Podestá - MetaShark Tech
 */
import { redirect } from "next/navigation";
import React from "react";

import { PageHeader } from "@/components/layout";
import { Card, CardContent, Container, DynamicIcon } from "@/components/ui";
import { getNotificationsAction } from "@/shared/lib/actions/notifications/getNotifications.action";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { type Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { createServerClient } from "@/shared/lib/supabase/server";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// La importación ahora apunta a la SSoT correcta en la capa de layout.
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---

interface NotificationsPageProps {
  params: { locale: Locale };
}

export default async function NotificationsPage({
  params: { locale },
}: NotificationsPageProps): Promise<React.ReactElement> {
  logger.info("[NotificationsPage] Renderizando v2.1 (Import Fix).");

  const supabase = createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/login`);
  }

  const [{ dictionary }, notificationsResult] = await Promise.all([
    getDictionary(locale),
    getNotificationsAction(),
  ]);

  const content = dictionary.notificationBell;

  return (
    <>
      <PageHeader
        content={{
          title: content?.notificationsLabel || "Notificaciones",
          subtitle:
            "Un registro de todas las actividades importantes de tu cuenta.",
        }}
      />
      <Container className="py-12 max-w-3xl">
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {notificationsResult.success &&
              notificationsResult.data.length > 0 ? (
                notificationsResult.data.map((notification) => (
                  <li
                    key={notification.id}
                    className="flex items-start gap-4 p-4"
                  >
                    <DynamicIcon
                      name="Bell"
                      className="h-5 w-5 mt-1 text-muted-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(notification.created_at).toLocaleString(
                          locale
                        )}
                      </p>
                    </div>
                  </li>
                ))
              ) : (
                <li className="p-8 text-center text-muted-foreground">
                  {content?.noNotificationsText ||
                    "Tu historial de notificaciones está vacío."}
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
