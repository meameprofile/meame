# /src/.docs-espejo/lib/schemas/components/guarantee-section.schema.ts.md

/\*\*

- @file /src/.docs-espejo/lib/schemas/components/guarantee-section.schema.ts.md
- @description Manifiesto conceptual y SSoT para el contrato de datos del
-              componente GuaranteeSection.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

## 1. Rol Estratégico y Propósito

Este aparato de schema (`guarantee-section.schema.ts`) actúa como el **guardián de la integridad de los datos** para el componente de presentación `GuaranteeSection`. Su propósito fundamental es establecer un contrato estricto e inmutable que define la estructura exacta del contenido que la sección de garantía espera recibir.

Estratégicamente, este schema:

- **Previene Errores en Build:** Asegura que cualquier dato de contenido (desde un archivo `.json` o una futura API) que no cumpla con la estructura definida (ej. falta de `imageUrl` o `imageAlt`) provoque un fallo en el proceso de build, previniendo errores en producción.
- **Habilita la Seguridad de Tipos (Type Safety):** Define y exporta el tipo `Seal`, creando una Única Fuente de Verdad (SSoT) para la forma de los datos de un sello. Esto permite que el componente `GuaranteeSection.tsx` importe y utilice este tipo, eliminando la necesidad de tipos `any` implícitos y garantizando un código más robusto y autocomprobado.
- **Desacopla Datos de Presentación:** Refuerza la separación de intereses al definir la "forma" de los datos independientemente de cómo se visualizan.

## 2. Arquitectura y Flujo de Ejecución

Este aparato es un módulo de "código frío" (no se ejecuta en el lado del cliente) y participa en el flujo de datos del lado del servidor de la siguiente manera:

1.  **Definición del Contrato:**
    - `SealSchema`: Define la unidad atómica: un objeto con una ruta de imagen (`imageUrl`) y un texto alternativo (`imageAlt`). La validación `.startsWith('/')` en `imageUrl` impone una regla de negocio crítica para el correcto funcionamiento con el componente `<Image>` de Next.js.
    - `GuaranteeSectionLocaleSchema`: Ensambla las unidades atómicas (`SealSchema`) en la estructura que representa el contenido de toda la sección para un único idioma. La clave principal `guaranteeSection` se define como `.optional()` para permitir que los diccionarios de i18n se fusionen correctamente sin requerir que cada archivo defina esta sección.

2.  **Consumo en el Ensamblador:**
    - El schema `GuaranteeSectionLocaleSchema` es importado por el ensamblador de schemas global (`/lib/schemas/i18n.schema.ts`).
    - Allí, se fusiona con todos los demás schemas de componentes para construir el tipo `Dictionary` final de la aplicación.

3.  **Validación en Tiempo de Build/Request:**
    - Cuando se solicita una página de campaña, el orquestador `getCampaignData` carga el contenido JSON correspondiente.
    - El `campaign.data.processor.ts` utiliza el `i18nSchema` (que contiene este schema) para validar los datos fusionados. Si la validación falla, el proceso se detiene y se lanza un error.

## 3. Contrato de API

- **Exportaciones Principales:**
  - `GuaranteeSectionLocaleSchema` (Schema de Zod): Para ser consumido por el ensamblador `i18n.schema.ts`.
  - `Seal` (Tipo de TypeScript): Para ser importado y utilizado por componentes de React (`GuaranteeSection.tsx`) para tipar sus props y variables.

## 4. Zona de Melhorias Futuras

1.  **Validación de Dimensiones de Imagen:** Investigar la posibilidad de añadir una validación en el schema que asegure que las imágenes de los sellos tengan una relación de aspecto cuadrada (ej. 1:1) para mantener la consistencia visual.
2.  **Enlace Opcional por Sello:** Añadir un campo `href: z.string().url().optional()` al `SealSchema` para permitir que algunos sellos sean clickeables y enlacen a una página de certificación externa.
3.  **Categorización de Sellos:** Introducir un campo `category: z.enum(['quality', 'security', 'satisfaction']).optional()` para permitir filtrar o estilizar los sellos de manera diferente en la UI.
