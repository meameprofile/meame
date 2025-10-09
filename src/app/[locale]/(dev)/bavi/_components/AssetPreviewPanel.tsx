// RUTA: src/app/[locale]/(dev)/bavi/_components/AssetPreviewPanel.tsx
/**
 * @file AssetPreviewPanel.tsx
 * @description Panel lateral para la vista previa y gestión de un activo BAVI seleccionado.
 * @version 2.0.0 (Holistically Functional & Type-Safe)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CldImage } from "next-cloudinary";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Separator } from "@/components/ui/Separator";
import { Badge } from "@/components/ui/Badge";
import { ScrollArea } from "@/components/ui/ScrollArea";
import type { BaviAsset } from "@/shared/lib/schemas/bavi/bavi.manifest.schema";
import type { RaZPromptsSesaTags } from "@/shared/lib/schemas/raz-prompts/atomic.schema";
import type { SesaOption } from "@/shared/lib/schemas/raz-prompts/prompt-creator.i18n.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type SesaOptions = NonNullable<Dictionary["promptCreator"]>["sesaOptions"];

interface AssetPreviewPanelProps {
  asset: BaviAsset | null;
  onClose: () => void;
  onEdit: (asset: BaviAsset) => void;
  sesaOptions: SesaOptions;
}

export function AssetPreviewPanel({
  asset,
  onClose,
  onEdit,
  sesaOptions,
}: AssetPreviewPanelProps) {
  const getTagLabel = (category: keyof RaZPromptsSesaTags, value: string) => {
    if (!sesaOptions || !sesaOptions[category]) return value;
    const options = sesaOptions[category] as SesaOption[];
    return options.find((opt) => opt.value === value)?.label || value;
  };

  return (
    <AnimatePresence>
      {asset && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="absolute top-0 right-0 h-full w-full max-w-sm md:max-w-md lg:max-w-lg bg-card border-l shadow-2xl z-20 flex flex-col"
        >
          <header className="p-4 border-b flex items-center justify-between flex-shrink-0">
            <h2 className="text-lg font-semibold text-foreground truncate">
              {asset.assetId}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <DynamicIcon name="X" className="h-4 w-4" />
            </Button>
          </header>

          <ScrollArea className="flex-grow">
            <div className="p-4">
              <div className="relative w-full aspect-video rounded-md overflow-hidden bg-muted/20 mb-4">
                <CldImage
                  src={asset.variants[0].publicId}
                  alt={asset.metadata?.altText?.["es-ES"] || asset.assetId}
                  fill
                  className="object-contain"
                  sizes="50vw"
                  format="auto"
                  quality="auto"
                />
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Metadatos
                  </h3>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Descripción:</strong> {asset.description || "N/A"}
                    </p>
                    <p>
                      <strong>Prompt ID:</strong> {asset.promptId || "N/A"}
                    </p>
                    <p>
                      <strong>Fecha de Creación:</strong>{" "}
                      {new Date(asset.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                    Etiquetas SESA
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {asset.tags &&
                      Object.entries(asset.tags).map(([key, value]) => (
                        <Badge key={key} variant="secondary">
                          {getTagLabel(key as keyof RaZPromptsSesaTags, value)}
                        </Badge>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <footer className="p-4 border-t flex justify-end gap-2 flex-shrink-0 mt-auto">
            <Button variant="outline">
              <DynamicIcon name="Download" className="mr-2 h-4 w-4" /> Descargar
            </Button>
            <Button onClick={() => onEdit(asset)}>
              <DynamicIcon name="Pencil" className="mr-2 h-4 w-4" /> Editar
            </Button>
          </footer>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
