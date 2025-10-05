// RUTA: src/app/[locale]/(public)/checkout/CheckoutClient.tsx
/**
 * @file CheckoutClient.tsx
 * @description Componente "Client Core" para la página de checkout.
 *              Encapsula el Stripe Elements provider y el formulario de pago.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "@/components/features/commerce/CheckoutForm";
import type { z } from "zod";
import type { CheckoutFormContentSchema } from "@/shared/lib/schemas/components/commerce/checkout-form.schema";

type Content = z.infer<typeof CheckoutFormContentSchema>;

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CheckoutClientProps {
  clientSecret: string;
  content: Content;
}

export function CheckoutClient({ clientSecret, content }: CheckoutClientProps) {
  return (
    <Elements options={{ clientSecret }} stripe={stripePromise}>
      <CheckoutForm content={content} />
    </Elements>
  );
}
