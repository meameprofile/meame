// RUTA: src/components/layout/CartSheet/_components/CartEmptyState.tsx
/**
 * @file CartEmptyState.tsx
 * @description Componente de presentación puro para el estado vacío del carrito.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import { motion } from "framer-motion";
import React from "react";

import { Button, DynamicIcon } from "@/components/ui";

interface CartEmptyStateProps {
  onStartShopping: () => void;
  content: {
    emptyStateText: string;
    emptyStateButton: string;
  };
}

export function CartEmptyState({
  onStartShopping,
  content,
}: CartEmptyStateProps) {
  return (
    <motion.div
      key="empty-cart"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="flex flex-1 flex-col items-center justify-center gap-4 text-center py-20"
    >
      <DynamicIcon
        name="ShoppingCart"
        className="w-16 h-16 text-muted-foreground/30"
        aria-hidden="true"
      />
      <p className="text-muted-foreground">{content.emptyStateText}</p>
      <Button onClick={onStartShopping}>{content.emptyStateButton}</Button>
    </motion.div>
  );
}
