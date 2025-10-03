// RUTA: src/components/features/nos3/_components/SessionListClient.tsx
/**
 * @file SessionListClient.tsx
 * @description Componente de cliente de élite para mostrar la lista de sesiones
 *              grabadas, ahora con MEA/UX y arquitectura soberana.
 * @version 3.0.0 (Holistic Elite Leveling & MEA/UX)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
// --- [INICIO DE CORRECCIÓN ARQUITECTÓNICA] ---
// Se importa el tipo y la acción desde la SSoT soberana.
import type { SessionMetadata } from "@/shared/lib/actions/nos3/list-sessions.action";
// --- [FIN DE CORRECCIÓN ARQUITECTÓNICA] ---
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { routes } from "@/shared/lib/navigation";

type SessionListContent = NonNullable<Dictionary["nos3Dashboard"]>;

interface SessionListClientProps {
  sessions: SessionMetadata[];
  content: Pick<
    SessionListContent,
    | "tableHeaders"
    | "reproduceButton"
    | "emptyStateTitle"
    | "emptyStateDescription"
  >;
  locale: Locale;
}

const tableVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export function SessionListClient({
  sessions,
  content,
  locale,
}: SessionListClientProps): React.ReactElement {
  logger.info("[SessionListClient] Renderizando v3.0 (Elite & MEA).");

  if (sessions.length === 0) {
    return (
      <div className="text-center py-16 text-muted-foreground">
        <DynamicIcon name="VideoOff" className="h-12 w-12 mx-auto mb-4" />
        <h3 className="font-semibold text-lg text-foreground">
          {content.emptyStateTitle}
        </h3>
        <p className="text-sm">{content.emptyStateDescription}</p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{content.tableHeaders.sessionId}</TableHead>
          <TableHead>{content.tableHeaders.startTime}</TableHead>
          <TableHead className="text-right">
            {content.tableHeaders.actions}
          </TableHead>
        </TableRow>
      </TableHeader>
      <motion.tbody variants={tableVariants} initial="hidden" animate="visible">
        {sessions.map(({ sessionId, startTime }) => (
          <motion.tr
            key={sessionId}
            variants={rowVariants}
            className="hover:bg-muted/50"
          >
            <TableCell className="font-mono text-xs">{sessionId}</TableCell>
            <TableCell>
              {new Date(startTime).toLocaleString(locale, {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="outline" size="sm">
                <Link
                  href={routes.nos3SessionPlayer.path({ locale, sessionId })}
                >
                  <DynamicIcon name="Play" className="mr-2 h-4 w-4" />
                  {content.reproduceButton}
                </Link>
              </Button>
            </TableCell>
          </motion.tr>
        ))}
      </motion.tbody>
    </Table>
  );
}
// RUTA: src/components/features/nos3/_components/SessionListClient.tsx
