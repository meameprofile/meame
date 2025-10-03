// RUTA: src/app/[locale]/(public)/checkout/page.tsx
/**
 * @file page.tsx
 * @description Página de checkout (Server Shell), ahora con una separación de
 *              responsabilidades arquitectónicamente pura.
 * @version 5.0.0 (Server Shell Pattern)
 * @author L.I.A. Legacy
 */
import React from "react";
import { Container } from "@/components/ui";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import { createCheckoutSessionAction } from "@/shared/lib/actions/commerce/checkout.action";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { CheckoutFormContentSchema } from "@/shared/lib/schemas/components/commerce/checkout-form.schema";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const [{ dictionary, error: dictError }, checkoutResult] = await Promise.all([
    getDictionary(locale),
    createCheckoutSessionAction(),
  ]);

  const contentValidation = CheckoutFormContentSchema.safeParse(
    dictionary.checkoutForm
  );

  if (dictError || !contentValidation.success || !checkoutResult.success) {
    return (
      <DeveloperErrorDisplay
        context="CheckoutPage"
        errorMessage="No se pudo inicializar la sesión de checkout."
        errorDetails={
          dictError ||
          (!contentValidation.success ? contentValidation.error : null) ||
          (!checkoutResult.success ? checkoutResult.error : null)
        }
      />
    );
  }

  const content = contentValidation.data;
  const { clientSecret } = checkoutResult.data;

  if (!clientSecret) {
    return (
      <DeveloperErrorDisplay
        context="CheckoutPage"
        errorMessage="El clientSecret de Stripe no pudo ser generado."
      />
    );
  }

  return (
    <Container className="py-24 max-w-lg">
      <h1 className="text-3xl font-bold mb-8 text-center">{content.title}</h1>
      <CheckoutClient clientSecret={clientSecret} content={content} />
    </Container>
  );
}
