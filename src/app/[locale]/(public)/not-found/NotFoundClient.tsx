// RUTA: app/[locale]/not-found/NotFoundClient.tsx
/**
 * @file NotFoundClient.tsx
 * @description Componente de Cliente de élite para la página 404.
 * @version 3.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { LightRays } from "@/components/razBits/LightRays/LightRays";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";

type NotFoundContent = NonNullable<Dictionary["notFoundPage"]>;

interface NotFoundClientProps {
  content: NotFoundContent;
  locale: Locale;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", damping: 15, stiffness: 100 },
  },
};

export function NotFoundClient({
  content,
  locale,
}: NotFoundClientProps): React.ReactElement {
  logger.info("[NotFoundClient] Renderizando página 404 de élite (v3.1).");

  return (
    <div className="relative h-screen overflow-hidden">
      <LightRays
        config={{
          raysColor: "primary",
          raysOrigin: "top-center",
          raysSpeed: 0.3,
          lightSpread: 0.8,
          rayLength: 1.5,
          mouseInfluence: 0.02,
        }}
        className="absolute inset-0 z-0 opacity-20"
      />
      <Container className="relative z-10 flex h-full items-center justify-center text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            variants={itemVariants}
            className="text-base font-semibold text-primary"
          >
            404
          </motion.p>
          <motion.h1
            variants={itemVariants}
            className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
          >
            {content.title}
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="mt-6 text-base leading-7 text-muted-foreground"
          >
            {content.description}
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="mt-10 flex items-center justify-center gap-x-6"
          >
            <Button asChild>
              <Link href={`/${locale}`}>{content.buttonText}</Link>
            </Button>
          </motion.div>
        </motion.div>
      </Container>
    </div>
  );
}
