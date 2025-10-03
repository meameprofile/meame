// RUTA: src/app/[locale]/(dev)/test-page/_components/TestPageClient.tsx
/**
 * @file TestPageClient.tsx
 * @description Componente de UI puro para la Vitrina de Resiliencia.
 *              v27.0.0 (Pure Presentation Shell): Refactorizado para ser un
 *              componente de presentación que recibe JSX renderizado,
 *              resolviendo la violación de la frontera Servidor-Cliente.
 * @version 27.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion } from "framer-motion";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Container,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";

// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
interface RenderedSection {
  name: string;
  jsx: React.ReactNode;
}

interface TestPageClientProps {
  content: NonNullable<Dictionary["devTestPage"]>;
  renderedSections: RenderedSection[];
}
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

export default function TestPageClient({
  content,
  renderedSections,
}: TestPageClientProps) {
  logger.info("[TestPageClient] Renderizando UI v27.0 (Pure Presentation).");

  return (
    <>
      <PageHeader
        content={{ title: content.title, subtitle: content.subtitle }}
      />
      <Container className="my-8">
        <div className="space-y-8">
          {renderedSections.map(({ name, jsx }) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-accent">{name}</CardTitle>
                </CardHeader>
                <CardContent>{jsx}</CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </>
  );
}
