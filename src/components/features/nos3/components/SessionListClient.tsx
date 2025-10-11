// RUTA: src/components/features/nos3/components/SessionListClient.tsx
/**
 * @file SessionListClient.tsx
 * @description Componente de cliente de élite para la lista de sesiones grabadas.
 *              v3.1.0 (Routing Contract Restoration): Se corrige el nombre de la
 *              ruta a 'nos3BySessionId' para alinear con la SSoT de 'navigation.ts'.
 * @version 3.1.0
 * @author L.I.A. Legacy
 */
"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import type { SessionMetadata } from "@/shared/lib/actions/nos3/list-sessions.action";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import { routes } from "@/shared/lib/navigation";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

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
  logger.info(
    "[SessionListClient] Renderizando v3.1 (Routing Contract Restored)."
  );

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
                {/* --- [INICIO DE REFACTORIZACIÓN DE CONTRATO DE RUTA v3.1.0] --- */}
                <Link href={routes.nos3BySessionId.path({ locale, sessionId })}>
                  {/* --- [FIN DE REFACTORIZACIÓN DE CONTRATO DE RUTA v3.1.0] --- */}
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
