// RUTA: src/components/features/raz-prompts/components/PromptCard.tsx
/**
 * @file PromptCard.tsx
 * @description Componente de presentación para visualizar un prompt, con seguridad
 *              de tipos absoluta y cumplimiento de contratos soberanos.
 * @version 8.0.0 (Absolute Type Safety)
 *@author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import { CldImage } from "next-cloudinary";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { TiltCard } from "@/components/ui/TiltCard";
import type { EnrichedRaZPromptsEntry } from "@/shared/lib/actions/raz-prompts";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
// --- [INICIO DE REFACTORIZACIÓN POR INTEGRIDAD DE TIPOS] ---
import type { SesaOption } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
// --- [FIN DE REFACTORIZACIÓN POR INTEGRIDAD DE TIPOS] ---

type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];
type VaultContent = NonNullable<Dictionary["promptVault"]>;

interface PromptCardProps {
  prompt: EnrichedRaZPromptsEntry;
  onViewDetails: (promptId: string) => void;
  sesaOptions: SesaOptions;
  content: Pick<VaultContent, "viewDetailsButton" | "noImageYet">;
  variants: Variants;
}

export function PromptCard({
  prompt,
  onViewDetails,
  sesaOptions,
  content,
  variants,
}: PromptCardProps): React.ReactElement {
  logger.trace(`[PromptCard] Renderizando v8.0 para: ${prompt.title}`);

  const latestVersion = prompt.versions[prompt.versions.length - 1];
  const formattedDate = new Date(prompt.createdAt).toLocaleDateString();

  const getTagLabel = (
    category: keyof RaZPromptsSesaTags,
    value: string | undefined
  ) => {
    if (!value || !sesaOptions || !sesaOptions[category]) return value || null;
    return (
      // Se añade la anotación de tipo explícita para erradicar 'any'.
      sesaOptions[category]?.find((opt: SesaOption) => opt.value === value)
        ?.label || value
    );
  };

  return (
    <motion.div variants={variants} className="h-full">
      <TiltCard className="h-full">
        <Card className="h-full flex flex-col transition-all duration-300 ease-in-out hover:border-primary hover:shadow-2xl hover:shadow-primary/20">
          <CardHeader>
            <CardTitle className="text-lg line-clamp-1">
              {prompt.title}
            </CardTitle>
            <CardDescription className="flex items-center text-xs text-muted-foreground">
              <DynamicIcon name="BrainCircuit" className="h-3 w-3 mr-1.5" />
              {getTagLabel("ai", prompt.tags.ai)}
              <span className="mx-2">·</span>
              <DynamicIcon name="Clock" className="h-3 w-3 mr-1.5" />
              {formattedDate}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted/30 mb-4 group">
              {prompt.primaryImageUrl ? (
                <CldImage
                  src={prompt.primaryImageUrl}
                  alt={`Visualización para: ${prompt.title}`}
                  fill
                  className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  format="auto"
                  quality="auto"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm p-4">
                  <DynamicIcon name="ImageOff" className="h-8 w-8 mb-2" />
                  <span>{content.noImageYet}</span>
                </div>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {latestVersion.basePromptText}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap items-center justify-between pt-0 gap-2">
            <div className="flex flex-wrap gap-1">
              <Badge variant="secondary">
                {getTagLabel("sty", prompt.tags.sty)}
              </Badge>
              <Badge variant="secondary">
                {getTagLabel("fmt", prompt.tags.fmt)}
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(prompt.promptId)}
            >
              <DynamicIcon name="Eye" className="h-4 w-4 mr-2" />
              {content.viewDetailsButton}
            </Button>
          </CardFooter>
        </Card>
      </TiltCard>
    </motion.div>
  );
}
