// .docs-espejo/lib/i18n/campaign.i18n.ts.md
/\*\*

- @file campaign.i18n.ts.md
- @description Documento Espejo y SSoT conceptual para el Orquestador de Datos de Campaña.
- @version 2.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Orquestador de Datos de Campaña

## 1. Rol Estratégico

El aparato `campaign.i18n.ts` es el **orquestador de nivel superior** para el ensamblaje de todos los datos necesarios para renderizar una página de campaña. Su responsabilidad es gestionar el flujo completo de obtención de datos, desde la resolución de la variante hasta la entrega de un objeto de datos final, validado y listo para la UI.

Implementa la arquitectura MACS (Metodología de Activos de Campaña Soberanos) y actúa como la fachada principal para que los componentes de página (`page.tsx`) soliciten los datos de una campaña.

## 2. Arquitectura y Flujo de Ejecución (Refactorizada)

El flujo de ejecución sigue un pipeline claro y secuencial, donde cada paso delega la responsabilidad a un aparato atómico especializado:

1.  **Entrada:** Recibe `campaignId`, `locale`, y `variantId`.
2.  **Paso 1: Resolver (Delegación a `Resolver`)**
    - Invoca a `resolveCampaignAssets` para interpretar el `campaign.map.json` y obtener las rutas de los archivos de tema y contenido para la `variantId` especificada.
3.  **Paso 2: Cargar (Delegación Paralela)**
    - Invoca una nueva función interna atomizada, `loadCampaignCoreAssets`, que a su vez utiliza el `Loader` para cargar en paralelo los archivos de tema y contenido de la campaña.
    - Simultáneamente, invoca a `getGlobalDictionary` para cargar el diccionario base del portal. La ejecución en paralelo (`Promise.all`) optimiza el tiempo de carga.
4.  **Paso 3: Procesar (Delegación a `Procesador`)**
    - Una vez que todos los datos han sido cargados, invoca a `processCampaignData`.
    - El `Procesador` fusiona el diccionario global con el contenido específico de la campaña y valida tanto el diccionario fusionado como el tema contra sus respectivos schemas de Zod.
5.  **Salida:** Devuelve una `Promise<CampaignData>` que resuelve con un objeto `{ dictionary, theme }` completamente ensamblado, validado y listo para ser consumido por el `SectionRenderer`.

## 3. Contrato de API

- **Función Principal:** `getCampaignData(campaignId: string, locale: string, variantId: string): Promise<CampaignData>`
- **Tipo de Retorno (`CampaignData`):** `{ dictionary: Dictionary; theme: CampaignTheme; }`

## 4. Zona de Melhorias Futuras

- **Cache de Datos Procesados:** Implementar un sistema de caché (ej. `React.cache`) para el objeto `CampaignData` final. La clave de caché podría ser una combinación de `campaignId-variantId-locale`. Esto evitaría re-ensamblar los mismos datos para la misma campaña en múltiples peticiones durante el mismo build.
- **Gestión de Fallbacks de Variantes:** Si una `variantId` no se encuentra, el orquestador podría intentar cargar una variante por defecto (ej. "01") en lugar de lanzar un error, permitiendo una degradación más elegante.
- **Inyección de Dependencias:** Refactorizar el orquestador como una clase o usar un contenedor de inyección de dependencias para gestionar sus colaboradores (`resolver`, `loader`, `processor`), facilitando las pruebas unitarias y el "mocking".

// .docs-espejo/lib/i18n/campaign.i18n.ts.md
