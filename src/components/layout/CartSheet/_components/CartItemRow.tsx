// RUTA: src/components/layout/CartSheet/_components/CartItemRow.tsx
/**
 * @file CartItemRow.tsx
 * @description Componente atómico para una fila de ítem del carrito.
 * @version 1.1.0 (Import Integrity Restoration)
 * @author RaZ Podestá - MetaShark Tech
 */
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";

import { Button, DynamicIcon, Price } from "@/components/ui"; // <-- AHORA VÁLIDO
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { useCartStore, type CartItem } from "@/shared/lib/stores/useCartStore";

interface CartItemRowProps {
  item: CartItem;
  locale: Locale;
}

export function CartItemRow({ item, locale }: CartItemRowProps) {
  const { updateQuantity, removeItem } = useCartStore();
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex items-center gap-4 py-4"
    >
      <div className="relative h-16 w-16 rounded-md overflow-hidden border">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-contain"
          sizes="64px"
        />
      </div>
      <div className="flex-1 space-y-1">
        <h4 className="text-sm font-semibold">{item.name}</h4>
        <Price
          amount={item.price}
          currencyCode={item.currency}
          locale={locale}
          className="text-sm text-muted-foreground"
        />
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label={`Reducir cantidad de ${item.name}`}
          >
            <DynamicIcon name="Minus" className="h-4 w-4" />
          </Button>
          <span className="text-sm w-4 text-center" aria-live="polite">
            {item.quantity}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="h-6 w-6"
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label={`Aumentar cantidad de ${item.name}`}
          >
            <DynamicIcon name="Plus" className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="text-muted-foreground"
        onClick={() => removeItem(item.id)}
        aria-label={`Eliminar ${item.name} del carrito`}
      >
        <DynamicIcon name="Trash2" className="h-4 w-4" />
      </Button>
    </motion.div>
  );
}
