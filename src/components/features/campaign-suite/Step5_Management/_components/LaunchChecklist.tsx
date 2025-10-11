// RUTA: src/components/features/campaign-suite/Step5_Management/_components/LaunchChecklist.tsx
/**
 * @file LaunchChecklist.tsx
 * @description Componente de UI atómico y gamificado para el checklist de pre-lanzamiento.
 * @version 2.0.0 (MEA/UX Injection & Elite Compliance)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";
import { motion, type Variants } from "framer-motion";
import React from "react";

import { DynamicIcon } from "@/components/ui";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/Card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/Tooltip";
import { logger } from "@/shared/lib/logging";
import type { ChecklistItem } from "@/shared/lib/utils/campaign-suite/draft.validator";
import { cn } from "@/shared/lib/utils/cn";

interface LaunchChecklistProps {
  items: ChecklistItem[];
  title: string;
}

const listVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

export function LaunchChecklist({ items, title }: LaunchChecklistProps) {
  logger.trace("[LaunchChecklist] Renderizando checklist v2.0.");

  const completedCount = items.filter((item) => item.isCompleted).length;
  const totalCount = items.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="h-full">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            Asegúrate de que todos los puntos estén completos para publicar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3"
          >
            {items.map((item) => (
              <TooltipProvider key={item.id} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.div
                      variants={itemVariants}
                      className="flex items-center gap-3 p-2 rounded-md transition-colors hover:bg-muted"
                    >
                      <DynamicIcon
                        name={item.isCompleted ? "CircleCheck" : "CircleDashed"}
                        className={cn(
                          "h-5 w-5 flex-shrink-0",
                          item.isCompleted
                            ? "text-green-500"
                            : "text-muted-foreground"
                        )}
                      />
                      <span
                        className={cn(
                          "text-sm",
                          item.isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {item.label}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.helpText}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </motion.div>
          <div className="mt-6">
            <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-green-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            <p className="text-xs text-right mt-2 text-muted-foreground">
              {completedCount} de {totalCount} tareas completadas
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
