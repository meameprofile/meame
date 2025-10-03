// RUTA: src/components/features/cogniread/_components/ArticleList.tsx
/**
 * @file ArticleList.tsx
 * @description Componente de cliente de élite para mostrar una tabla de artículos de CogniRead.
 *              Inyectado con MEA/UX a través de animaciones de entrada en cascada
 *              y construido para cumplir con los 7 Pilares de Calidad.
 * @version 4.0.0 (Elite Forging & MEA Injection)
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
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui";
import type { CogniReadArticle } from "@/shared/lib/schemas/cogniread/article.schema";
import { routes } from "@/shared/lib/navigation";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

interface ArticleListProps {
  articles: CogniReadArticle[];
  locale: Locale;
}

const tableVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05, // Anima la entrada de cada fila con un ligero retraso
    },
  },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export function ArticleList({
  articles,
  locale,
}: ArticleListProps): React.ReactElement {
  logger.info("[ArticleList] Renderizando v4.0 (Elite Forging).");

  const getStatusVariant = (status: CogniReadArticle["status"]) => {
    switch (status) {
      case "published":
        return "default";
      case "draft":
        return "secondary";
      case "archived":
        return "outline";
      default:
        return "secondary";
    }
  };

  if (articles.length === 0) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No se han encontrado análisis de estudios. ¡Crea el primero!
      </p>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Estado</TableHead>
          <TableHead>Título del Estudio</TableHead>
          <TableHead>Última Actualización</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <motion.tbody variants={tableVariants} initial="hidden" animate="visible">
        {articles.map((article) => (
          <motion.tr
            key={article.articleId}
            variants={rowVariants}
            className="hover:bg-muted/50"
          >
            <TableCell>
              <Badge variant={getStatusVariant(article.status)}>
                {article.status}
              </Badge>
            </TableCell>
            <TableCell className="font-medium">
              {article.studyDna.originalTitle}
            </TableCell>
            <TableCell>
              {new Date(article.updatedAt).toLocaleString(locale)}
            </TableCell>
            <TableCell className="text-right">
              <Button asChild variant="ghost" size="sm">
                <Link
                  href={`${routes.cogniReadEditor.path({ locale })}?id=${article.articleId}`}
                >
                  <DynamicIcon name="Pencil" className="mr-2 h-4 w-4" />
                  Editar
                </Link>
              </Button>
            </TableCell>
          </motion.tr>
        ))}
      </motion.tbody>
    </Table>
  );
}
// RUTA: src/components/features/cogniread/_components/ArticleList.tsx
