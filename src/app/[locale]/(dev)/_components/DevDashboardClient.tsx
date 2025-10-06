// RUTA: src/app/[locale]/(dev)/_components/DevDashboardClient.tsx
/**
 * @file DevDashboardClient.tsx
 * @description Orquestador de cliente para el dashboard del DCC, rediseñado
 *              con inspiración en Canva para una UX/UI de élite.
 * @version 5.0.0 (Layout Sovereignty Compliance): Se elimina el PageHeader,
 *              cuya responsabilidad ahora recae en el layout soberano.
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useMemo, useEffect } from "react";
import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { logger } from "@/shared/lib/logging";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DynamicIcon,
} from "@/components/ui";
import type { DevDashboardContentSchema } from "@/shared/lib/schemas/pages/dev-dashboard.schema";
import type { z } from "zod";

type Content = z.infer<typeof DevDashboardContentSchema>;

interface DevDashboardClientProps {
  content: Content;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 },
  },
};

const ToolCard = ({
  title,
  description,
  href,
}: {
  title: string;
  description: string;
  href: string;
}) => (
  <motion.div variants={itemVariants} className="h-full">
    <Link href={href} className="h-full block">
      <Card className="h-full transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  </motion.div>
);

export function DevDashboardClient({ content }: DevDashboardClientProps) {
  const traceId = useMemo(
    () => logger.startTrace("DevDashboardClient_Lifecycle_v5.0"),
    []
  );
  useEffect(() => {
    logger.info("[DevDashboardClient] Componente de presentación montado.", {
      traceId,
    });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  return (
    <div className="space-y-12">
      {/* PageHeader ha sido eliminado. El layout soberano se encarga del título. */}

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-primary/10 to-transparent">
            <CardHeader>
              <CardTitle className="text-2xl">
                {content.mainActions.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild size="lg">
                <Link href={content.tools.sdc.href}>
                  <DynamicIcon name="Plus" className="mr-2 h-5 w-5" />
                  {content.mainActions.campaignButton}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-12">
          <h2 className="text-2xl font-bold mb-6">{content.toolsTitle}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.values(content.tools).map((tool) => (
              <ToolCard key={tool.title} {...tool} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
