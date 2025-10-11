// RUTA: src/components/ui/DynamicIcon.tsx
/**
 * @file DynamicIcon.tsx
 * @description SSoT para el renderizado dinámico de iconos, ahora con integridad de tipo absoluta.
 *              Consume el tipo 'LucideIconName' desde su SSoT canónica, eliminando
 *              la declaración local y previniendo desalineamientos arquitectónicos.
 * @version 19.0.0 (Absolute Type Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import type { LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports";
import dynamic from "next/dynamic";
import { memo } from "react";
import type { FunctionComponent } from "react";

// --- [INICIO DE REFACTORIZACIÓN SOBERANA] ---
// Se importa el tipo desde su SSoT canónica.
import { type LucideIconName } from "@/shared/lib/config/lucide-icon-names";
// --- [FIN DE REFACTORIZACIÓN SOBERANA] ---
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

const DYNAMIC_ICON_CONFIG = {
  DEFAULT_SIZE: 24,
  DEFAULT_PROPS: { strokeWidth: 2, "aria-hidden": true, focusable: false },
  FALLBACK_ICON_NAME: "HelpCircle",
};

const pascalToKebab = (str: string): string => {
  return str
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/([A-Z])([A-Z][a-z])/g, "$1-$2")
    .toLowerCase();
};

interface DynamicIconProps extends LucideProps {
  name: LucideIconName;
}

const DynamicIconComponent: FunctionComponent<DynamicIconProps> = ({
  name,
  className,
  ...props
}) => {
  const kebabCaseName = pascalToKebab(name);
  const fallbackKebabCaseName = pascalToKebab(
    DYNAMIC_ICON_CONFIG.FALLBACK_ICON_NAME
  );

  const iconToLoad = (
    Object.keys(dynamicIconImports).includes(kebabCaseName)
      ? kebabCaseName
      : fallbackKebabCaseName
  ) as keyof typeof dynamicIconImports;

  if (
    iconToLoad === fallbackKebabCaseName &&
    kebabCaseName !== fallbackKebabCaseName
  ) {
    logger.warn(
      `[DynamicIcon] Icono "${name}" no encontrado en el manifiesto. Usando fallback.`
    );
  }

  const LucideIcon = dynamic(dynamicIconImports[iconToLoad], {
    loading: () => (
      <div
        style={{
          width: props.size ?? DYNAMIC_ICON_CONFIG.DEFAULT_SIZE,
          height: props.size ?? DYNAMIC_ICON_CONFIG.DEFAULT_SIZE,
        }}
        className="animate-pulse bg-muted/50 rounded-md"
      />
    ),
  });

  return (
    <LucideIcon
      {...DYNAMIC_ICON_CONFIG.DEFAULT_PROPS}
      {...props}
      className={cn("lucide-icon", className)}
    />
  );
};

export const DynamicIcon = memo(DynamicIconComponent);
