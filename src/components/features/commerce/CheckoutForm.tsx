// RUTA: src/components/features/commerce/CheckoutForm.tsx
/**
 * @file CheckoutForm.tsx
 * @description Componente de cliente de élite que envuelve y gestiona el
 *              Stripe Payment Element. Ahora es 100% data-driven y está
 *              inyectado con MEA/UX.
 * @version 3.0.0 (Holistic Elite Leveling & i18n)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { motion } from "framer-motion";
import React, { useState } from "react";
import type { z } from "zod";

import { Button } from "@/components/ui/Button";
import { DotsWave } from "@/components/ui/Loaders/DotsWave";
import { logger } from "@/shared/lib/logging";
import type { CheckoutFormContentSchema } from "@/shared/lib/schemas/components/commerce/checkout-form.schema";

// --- [INICIO DE REFACTORIZACIÓN DE ÉLITE: CONTRATO SOBERANO] ---
type Content = z.infer<typeof CheckoutFormContentSchema>;

interface CheckoutFormProps {
  content: Content;
}
// --- [FIN DE REFACTORIZACIÓN DE ÉLITE] ---

export function CheckoutForm({ content }: CheckoutFormProps) {
  logger.info("[CheckoutForm] Renderizando v3.0 (Data-Driven).");
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setErrorMessage(null);
    logger.trace("[CheckoutForm] Iniciando confirmación de pago...");

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/order/confirmation`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setErrorMessage(error.message || content.unexpectedError);
    } else {
      setErrorMessage(content.unexpectedError);
    }
    setIsLoading(false);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onSubmit={handleSubmit}
    >
      <PaymentElement />
      <Button
        disabled={isLoading || !stripe || !elements}
        className="w-full mt-6"
        size="lg"
      >
        {isLoading && <DotsWave className="mr-2 h-4 w-4" />}
        {isLoading ? content.processingButton : content.payButton}
      </Button>
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-destructive text-sm text-center font-semibold mt-4"
        >
          {errorMessage}
        </motion.div>
      )}
    </motion.form>
  );
}
