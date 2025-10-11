// RUTA: src/components/features/campaign-suite/_components/WizardSidebar.tsx
/**
 * @file WizardSidebar.tsx
 * @description Barra lateral de navegación soberana para la SDC, inspirada en Canva.
 * @version 1.1.0 (Absolute Type Safety)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import {
  Button,
  DynamicIcon,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui";
import type { LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import { logger } from "@/shared/lib/logging";
import { cn } from "@/shared/lib/utils/cn";

// --- [INICIO DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS v1.1.0] ---
// Se define un contrato de datos estricto para los ítems de la barra lateral.
interface SidebarItem {
  id: string;
  icon: LucideIconName; // <-- La propiedad 'icon' ahora está fuertemente tipada.
  label: string;
  href: string;
}

const sidebarItems: readonly SidebarItem[] = [
  {
    id: "design",
    icon: "LayoutTemplate",
    label: "Diseño",
    href: "/creator/campaign-suite",
  },
  {
    id: "assets",
    icon: "LibraryBig",
    label: "Activos (BAVI)",
    href: "/dev/bavi",
  },
  { id: "brand", icon: "Palette", label: "Marca / Tema", href: "#" }, // Placeholder
  { id: "apps", icon: "AppWindow", label: "Apps", href: "#" }, // Placeholder
];
// --- [FIN DE REFACTORIZACIÓN DE SEGURIDAD DE TIPOS v1.1.0] ---

export function WizardSidebar() {
  logger.trace("[WizardSidebar] Renderizando barra lateral de la SDC v1.1.");
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-full w-20 flex-col items-center border-r bg-background py-4">
      <Link href="/dev" className="mb-8" aria-label="Volver al Dashboard">
        <DynamicIcon
          name="Home"
          className="h-8 w-8 text-primary transition-transform hover:scale-110"
        />
      </Link>
      <nav className="flex flex-col items-center gap-4">
        <TooltipProvider>
          {sidebarItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  asChild
                  variant={pathname.includes(item.href) ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-12 w-12 transition-all duration-200",
                    pathname.includes(item.href) && "text-primary"
                  )}
                >
                  <Link href={item.href}>
                    {/* TypeScript ahora sabe que 'item.icon' es un LucideIconName válido. */}
                    <DynamicIcon name={item.icon} className="h-6 w-6" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>
    </aside>
  );
}
