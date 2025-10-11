// RUTA: src/app/[locale]/(dev)/bavi/_components/AssetEditorControls.tsx
/**
 * @file AssetEditorControls.tsx
 * @description Panel de controles para el editor de activos, ahora con un contrato
 *              de tipos soberano y absoluto.
 * @version 2.0.0 (Absolute Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { ScrollArea } from "@/components/ui/ScrollArea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Separator } from "@/components/ui/Separator";
import { Slider } from "@/components/ui/Slider";
import { Switch } from "@/components/ui/Switch";
import type { AssetTransformations } from "@/shared/hooks/bavi/useAssetEditor";

interface AssetEditorControlsProps {
  transformations: AssetTransformations;
  // --- [INICIO DE REFACTORIZACIÓN DE INTEGRIDAD DE TIPOS v2.0.0] ---
  // El tipo 'any' ha sido erradicado. La firma ahora es genérica y segura.
  onTransformChange: <K extends keyof AssetTransformations>(
    key: K,
    value: AssetTransformations[K]
  ) => void;
  // --- [FIN DE REFACTORIZACIÓN DE INTEGRIDAD DE TIPOS v2.0.0] ---
  onSave: () => void;
  isSaving: boolean;
  downloadUrl: string;
}

export function AssetEditorControls({
  transformations,
  onTransformChange,
  onSave,
  isSaving,
  downloadUrl,
}: AssetEditorControlsProps) {
  return (
    <>
      <ScrollArea className="flex-grow p-4">
        <div className="space-y-6">
          {/* Dimensiones */}
          <div>
            <h4 className="font-semibold mb-2">Dimensiones</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="width">Ancho</Label>
                <Input
                  id="width"
                  type="number"
                  placeholder="Auto"
                  value={transformations.width || ""}
                  onChange={(e) =>
                    onTransformChange(
                      "width",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>
              <div>
                <Label htmlFor="height">Alto</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Auto"
                  value={transformations.height || ""}
                  onChange={(e) =>
                    onTransformChange(
                      "height",
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Calidad y Formato */}
          <div>
            <h4 className="font-semibold mb-2">Formato y Calidad</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Calidad</Label>
                <Slider
                  defaultValue={[100]}
                  max={100}
                  step={1}
                  onValueChange={([val]) =>
                    onTransformChange("quality", val === 100 ? "auto" : val)
                  }
                />
              </div>
              <div>
                <Label>Formato</Label>
                <Select
                  value={transformations.format}
                  onValueChange={(val: "auto" | "jpg" | "png") =>
                    onTransformChange("format", val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto</SelectItem>
                    <SelectItem value="jpg">JPG</SelectItem>
                    <SelectItem value="png">PNG</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Mejoras IA */}
          <div>
            <h4 className="font-semibold mb-2">Mejoras con IA</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="improve">Mejora Automática</Label>
                <Switch
                  id="improve"
                  checked={transformations.improve}
                  onCheckedChange={(checked) =>
                    onTransformChange("improve", checked)
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="bg-removal">Eliminar Fondo</Label>
                <Switch
                  id="bg-removal"
                  checked={transformations.removeBackground}
                  onCheckedChange={(checked) =>
                    onTransformChange("removeBackground", checked)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>
      <footer className="p-4 border-t flex justify-end gap-2 flex-shrink-0 mt-auto">
        <Button asChild variant="secondary">
          <a href={downloadUrl} target="_blank" download rel="noreferrer">
            <DynamicIcon name="Download" className="mr-2 h-4 w-4" /> Descargar
          </a>
        </Button>
        <Button onClick={onSave} disabled={isSaving}>
          {isSaving && (
            <DynamicIcon
              name="LoaderCircle"
              className="mr-2 h-4 w-4 animate-spin"
            />
          )}
          Guardar como Variante
        </Button>
      </footer>
    </>
  );
}
