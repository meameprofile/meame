// RUTA: src/app/select-language/page.tsx
/**
 * @file page.tsx
 * @description Página de selección de idioma, ahora blindada con un guardián de
 *              contrato de datos para una resiliencia y seguridad de tipos de élite.
 * @version 4.0.0 (Elite Contract Guardian)
 * @author L.I.A. Legacy
 */
import React from "react";
import { logger } from "@/shared/lib/logging";
import { LanguageSelectorClient } from "./_components/LanguageSelectorClient";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/";
import { getDictionary } from "@/shared/lib/i18n/i18n";
import { defaultLocale } from "@/shared/lib/i18n/i18n.config";
import { SelectLanguagePageContentSchema } from "@/shared/lib/schemas/pages/select-language.schema";

export default async function SelectLanguagePage() {
  logger.info(
    "[SelectLanguagePage] Renderizando v4.0 (Elite Contract Guardian)."
  );

  // Se obtiene el diccionario usando el locale por defecto como base.
  const { dictionary, error: dictError } = await getDictionary(defaultLocale);

  // --- [INICIO DE GUARDIÁN DE CONTRATO DE ÉLITE] ---
  // 1. Se valida la estructura del contenido contra el schema soberano.
  const contentValidation = SelectLanguagePageContentSchema.safeParse(
    dictionary.selectLanguage
  );

  // 2. Se comprueba tanto el error de carga como el fallo de validación.
  if (dictError || !contentValidation.success) {
    const errorDetails = dictError || contentValidation.error;
    logger.error(
      "[Guardián] Fallo al cargar o validar el contenido para SelectLanguagePage.",
      { error: errorDetails }
    );
    return (
      <DeveloperErrorDisplay
        context="SelectLanguagePage"
        errorMessage="No se pudo cargar o validar el contenido de la página de selección de idioma."
        errorDetails={errorDetails}
      />
    );
  }
  // --- [FIN DE GUARDIÁN DE CONTRATO DE ÉLITE] ---

  // 3. Se pasa el objeto `validation.data` ya validado y tipado al componente cliente.
  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <LanguageSelectorClient content={contentValidation.data} />
    </div>
  );
}
