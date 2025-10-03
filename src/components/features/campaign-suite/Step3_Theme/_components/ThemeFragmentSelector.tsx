// app/[locale]/(dev)/dev/campaign-suite/_components/Step3_Theme/_components/ThemeFragmentSelector.tsx
/**
 * @file ThemeFragmentSelector.tsx
 * @description Aparato de UI atómico y reutilizable para un selector de fragmentos de tema.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Label } from "@/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { logger } from "@/shared/lib/logging";

interface ThemeFragmentSelectorProps {
  label: string;
  value: string | null;
  onValueChange: (value: string) => void;
  placeholder: string;
  options: string[];
  isDisabled: boolean;
}

export function ThemeFragmentSelector({
  label,
  value,
  onValueChange,
  placeholder,
  options,
  isDisabled,
}: ThemeFragmentSelectorProps): React.ReactElement {
  logger.trace(
    `[ThemeFragmentSelector] Renderizando selector para: "${label}"`
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select
        value={value ?? ""}
        onValueChange={onValueChange}
        disabled={isDisabled}
      >
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
// app/[locale]/(dev)/dev/campaign-suite/_components/Step3_Theme/_components/ThemeFragmentSelector.tsx
