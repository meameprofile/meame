// RUTA: src/components/features/user-intelligence/UserDetailClient.tsx
/**
 * @file UserDetailClient.tsx
 * @description Componente de cliente para la vista de detalle del perfil de usuario.
 *              v3.0.0 (Routing Contract Restoration & Elite Observability): Se
 *              corrige la referencia de ruta para alinearla con la SSoT de
 *              navigation.ts y se inyecta logging de intención de usuario.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Link from "next/link";
import React from "react";
import type { z } from "zod";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type { ProfiledUserDetail } from "@/shared/lib/actions/user-intelligence/user-intelligence.contracts";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { VisitorCampaignEventRow } from "@/shared/lib/schemas/analytics/analytics.contracts";
import type { UserIntelligenceDetailContentSchema } from "@/shared/lib/schemas/pages/dev-user-intelligence-detail.i18n.schema";

type Content = z.infer<typeof UserIntelligenceDetailContentSchema>;

interface UserDetailClientProps {
  user: ProfiledUserDetail;
  content: Content;
  locale: Locale;
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) => (
  <div>
    <p className="text-xs font-semibold text-muted-foreground">{label}</p>
    <p className="text-sm font-mono text-foreground break-all">
      {value || "N/A"}
    </p>
  </div>
);

export function UserDetailClient({
  user,
  content,
  locale,
}: UserDetailClientProps) {
  const handleNos3Click = () => {
    logger.info(
      `[UserDetailClient] Intención de usuario: Ver grabación de sesión para ${user.sessionId}`
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{content.summaryCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-4">
            <Avatar className="h-24 w-24 border-4 border-primary/50">
              <AvatarImage
                src={user.avatarUrl ?? undefined}
                alt={user.displayName}
              />
              <AvatarFallback className="text-3xl">
                <DynamicIcon
                  name={user.userType === "Registered" ? "UserRound" : "Ghost"}
                />
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-bold">{user.displayName}</h2>
              <Badge
                variant={
                  user.userType === "Registered" ? "default" : "secondary"
                }
              >
                {user.userType === "Registered" ? "Registrado" : "Anónimo"}
              </Badge>
            </div>
            <Button
              asChild
              variant="outline"
              className="w-full"
              onClick={handleNos3Click}
            >
              {/* --- [INICIO DE REFACTORIZACIÓN DE RUTA SOBERANA] --- */}
              <Link
                href={routes.nos3BySessionId.path({
                  locale,
                  sessionId: user.sessionId,
                })}
              >
                <DynamicIcon name="Play" className="mr-2 h-4 w-4" />
                {content.nos3Button}
              </Link>
              {/* --- [FIN DE REFACTORIZACIÓN DE RUTA SOBERANA] --- */}
            </Button>
          </CardContent>
        </Card>
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>{content.sessionCardTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <DetailItem label={content.labels.userId} value={user.userId} />
            <DetailItem
              label={content.labels.fingerprintId}
              value={user.fingerprintId}
            />
            <DetailItem label={content.labels.ipAddress} value={user.ip} />
            <DetailItem
              label={content.labels.country}
              value={user.geo?.countryCode}
            />
            <DetailItem label={content.labels.city} value={user.geo?.city} />
            <DetailItem
              label={content.labels.browser}
              value={`${user.userAgent?.browser?.name || "?"} ${
                user.userAgent?.browser?.version || ""
              }`}
            />
            <DetailItem
              label={content.labels.os}
              value={`${user.userAgent?.os?.name || "?"} ${
                user.userAgent?.os?.version || ""
              }`}
            />
            <DetailItem
              label={content.labels.device}
              value={
                user.userAgent?.device?.vendor ||
                user.userAgent?.device?.type ||
                "Desktop"
              }
            />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{content.activityCardTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{content.eventTableHeaders.event}</TableHead>
                <TableHead>{content.eventTableHeaders.campaign}</TableHead>
                <TableHead>{content.eventTableHeaders.timestamp}</TableHead>
                <TableHead>{content.eventTableHeaders.details}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {user.events.map((event: VisitorCampaignEventRow) => (
                <TableRow key={event.event_id}>
                  <TableCell className="font-medium">
                    {event.event_type}
                  </TableCell>
                  <TableCell>
                    {event.campaign_id} / {event.variant_id}
                  </TableCell>
                  <TableCell>
                    {new Date(event.created_at).toLocaleString(locale)}
                  </TableCell>
                  <TableCell>
                    <pre className="text-xs bg-muted p-2 rounded-md max-w-xs overflow-auto">
                      {JSON.stringify(event.payload, null, 2)}
                    </pre>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
