// RUTA: src/components/layout/CartSheet/_components/CartSheetFooter.tsx
/**
 * @file CartSheetFooter.tsx
 * @description Componente de presentación puro para el pie de página del carrito.
 * @version 1.1.0 (Import Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import React from "react";
import { motion } from "framer-motion";
import { SheetFooter, SheetClose, Button, Price } from "@/components/ui"; // <-- AHORA VÁLIDO
import { useCartTotals } from "@/shared/lib/stores/useCartStore";
import type { Locale } from "@/shared/lib/i18n/i18n.config";

interface CartSheetFooterProps {
  locale: Locale;
  content: {
    subtotalLabel: string;
    checkoutButton: string;
    continueShoppingButton: string;
  };
}

export function CartSheetFooter({ locale, content }: CartSheetFooterProps) {
  const { cartTotal } = useCartTotals();
  return (
    <SheetFooter className="px-6 py-4 bg-muted/50 mt-auto">
      <div className="w-full space-y-4">
        <div className="flex justify-between text-base font-semibold">
          <p>{content.subtotalLabel}</p>
          <motion.div
            key={cartTotal}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Price
              amount={cartTotal}
              currencyCode="EUR"
              locale={locale}
              className="text-lg"
            />
          </motion.div>
        </div>
        <Button size="lg" className="w-full">
          {content.checkoutButton}
        </Button>
        <SheetClose asChild>
          <Button variant="link" className="w-full">
            {content.continueShoppingButton}
          </Button>
        </SheetClose>
      </div>
    </SheetFooter>
  );
}
