// RUTA: components/ui/ToggleTheme.tsx

/**
 * @file ToggleTheme.tsx
 * @description Componente de UI atómico y de élite para el conmutador de tema (claro/oscuro/sistema).
 *              v2.1.0 (Filename Correction): Se alinea la documentación TSDoc con
 *              el nombre de archivo canónico 'ToggleTheme.tsx', corrigiendo una
 *              violación crítica de la directiva de nomenclatura.
 * @version 2.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

/**
 * @interface ToggleThemeProps
 * @description Contrato de props para el componente ToggleTheme.
 */
interface ToggleThemeProps {
  /**
   * @prop content - El objeto de contenido i18n validado, que contiene todas
   *       las cadenas de texto necesarias para la UI del componente.
   */
  content: NonNullable<Dictionary["toggleTheme"]>;
}

/**
 * @function ToggleTheme
 * @description Componente de cliente que permite al usuario cambiar entre los
 *              modos de apariencia 'claro', 'oscuro' y 'sistema'.
 * @param {ToggleThemeProps} props - Las props del componente.
 * @returns {React.ReactElement}
 */
export function ToggleTheme({ content }: ToggleThemeProps): React.ReactElement {
  logger.info("[ToggleTheme] Renderizando conmutador de tema (v2.1 - Elite).");
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={content.toggleAriaLabel}
        >
          <DynamicIcon
            name="Sun"
            className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
          />
          <DynamicIcon
            name="Moon"
            className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
          />
          <span className="sr-only">{content.toggleAriaLabel}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          {content.light}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          {content.dark}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          {content.system}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
