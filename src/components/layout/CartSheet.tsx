// RUTA: src/components/layout/CartSheet.tsx
/**
 * @file CartSheet.tsx
 * @description Orquestador de élite para el panel del carrito de compras.
 *              v5.0.0 (Hyper-Atomic & MEA/UX Injected): Refactorizado para
 *              componer aparatos atómicos y mejorar la experiencia de usuario.
 * @version 5.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/Sheet";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { useCartStore, type CartItem } from "@/shared/lib/stores/useCartStore";

import {
  CartEmptyState,
  CartItemRow,
  CartSheetFooter,
} from "./CartSheet/_components";

type CartContent = NonNullable<Dictionary["cart"]>;

interface CartSheetProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  content: CartContent;
  locale: Locale;
}

export function CartSheet({
  isOpen,
  onOpenChange,
  content,
  locale,
}: CartSheetProps) {
  logger.info("[CartSheet] Renderizando orquestador v5.0 (Hyper-Atomic).");
  const items = useCartStore((state) => state.items);
  const router = useRouter();

  const handleStartShopping = () => {
    onOpenChange(false);
    router.push(`/${locale}/store`);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>{content.sheetTitle}</SheetTitle>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6">
          <div className="divide-y">
            <AnimatePresence>
              {items.length > 0 ? (
                items.map((item: CartItem) => (
                  <CartItemRow key={item.id} item={item} locale={locale} />
                ))
              ) : (
                <CartEmptyState
                  onStartShopping={handleStartShopping}
                  content={content}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {items.length > 0 && (
          <CartSheetFooter locale={locale} content={content} />
        )}
      </SheetContent>
    </Sheet>
  );
}
