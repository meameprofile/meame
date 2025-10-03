// components/forms/HiddenFormFields.tsx
/**
 * @file HiddenFormFields.tsx
 * @description Aparato atómico de presentación, con la única responsabilidad de
 *              renderizar todos los campos de formulario ocultos necesarios para la
 *              atribución de tracking y la integración con el sistema del productor.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 * @see .docs/development/TODO.md - Tarefa 2.3
 * @principle Principio de Responsabilidad Única (PRU)
 */
import React from "react";
import { logger } from "@/shared/lib/logging";

/**
 * @component HiddenFormFields
 * @description Renderiza el payload de datos ocultos para el formulario de pedido.
 *              Esta es una pieza crucial de la clonación de la lógica del productor,
 *              garantizando que el sistema de ellos reciba todos los datos necesarios
 *              de forma transparente. El script 'webvork.js' inyectado globalmente
 *              encontrará estos campos por su atributo 'name' y llenará sus valores.
 * @returns {React.ReactElement} Un fragmento JSX con los inputs ocultos.
 */
export function HiddenFormFields(): React.ReactElement {
  logger.info(
    "[Observabilidad] Renderizando HiddenFormFields (Payload de Tracking)"
  );

  return (
    <>
      {/*
        Estos campos son una réplica exacta y completa de los campos encontrados en la página del productor.
        El script `webvork.js` (que será injetado globalmente) encontrará estes inputs
        pelo seu atributo 'name' e preencherá seus valores dinamicamente.
      */}
      <input name="lang" type="hidden" defaultValue="it" />
      <input name="ym" type="hidden" defaultValue="default" />
      <input name="utm_source" type="hidden" />
      <input name="utm_medium" type="hidden" />
      <input name="utm_campaign" type="hidden" />
      <input name="utm_content" type="hidden" />
      <input name="utm_term" type="hidden" />
      <input name="referer" type="hidden" />
      <input name="guid" type="hidden" />
      <input name="first_guid" type="hidden" />
      <input name="landing_id" type="hidden" />
      <input name="prelanding_id" type="hidden" />
      <input name="offer_id" type="hidden" />
      <input name="url" type="hidden" />
      <input name="shopwindow_id" type="hidden" />
      <input name="cookie_enabled" type="hidden" />
    </>
  );
}
// components/forms/HiddenFormFields.tsx
