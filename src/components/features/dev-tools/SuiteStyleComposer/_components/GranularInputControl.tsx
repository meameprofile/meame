// RUTA: src/components/features/dev-tools/SuiteStyleComposer/_components/GranularInputControl.tsx
/**
 * @file GranularInputControl.tsx
 * @description Aparato hiper-atómico para un control de input granular individual.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { logger } from "@/shared/lib/logging";

interface GranularInputControlProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  unit?: string;
  type?: "text" | "number";
}

export function GranularInputControl({
  id,
  label,
  value,
  onChange,
  placeholder,
  unit,
  type = "text",
}: GranularInputControlProps): React.ReactElement {
  logger.trace(`[GranularInputControl] Renderizando para: ${id}`);
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-grow"
        />
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
    </div>
  );
}
