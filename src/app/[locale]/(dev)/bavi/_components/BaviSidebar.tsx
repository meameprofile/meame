// src/app/[locale]/(dev)/bavi/_components/BaviSidebar.tsx
/**
 * @file BaviSidebar.tsx
 * @description Componente de presentación para la barra de navegación lateral de la BAVI.
 * @version 2.0.0 (Elite Type Safety & Code Hygiene)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

import { DynamicIcon } from "@/components/ui/DynamicIcon";
import type { LucideIconName } from "@/shared/lib/config/lucide-icon-names";
import { cn } from "@/shared/lib/utils/cn";

const navItems = [
  { href: "/dev/bavi", icon: "LayoutGrid", label: "Assets" },
  { href: "#", icon: "Folder", label: "Folders" },
  { href: "#", icon: "BookCopy", label: "Collections" },
  { href: "#", icon: "ShieldCheck", label: "Moderation" },
];

export function BaviSidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link
            href="/dev/bavi"
            className="flex items-center gap-2 font-semibold"
          >
            <DynamicIcon name="LibraryBig" className="h-6 w-6 text-primary" />
            <span className="">BAVI</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
                  pathname.endsWith(item.href) && "bg-muted text-primary"
                )}
              >
                <DynamicIcon
                  name={item.icon as LucideIconName}
                  className="h-4 w-4"
                />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
