// .docs-espejo/lib/i18n/campaign.map.resolver.ts.md
/\*\*

- @file campaign.map.resolver.ts.md
- @description Documento Espejo y SSoT conceptual para el Campaign Map Resolver.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Campaign Map Resolver

## 1. Rol Estratégico

El `Campaign Map Resolver` es el **navegador jefe** del motor de campañas. Su única responsabilidad es interpretar el manifiesto de mapeo (`campaign.map.json`) para una campaña dada y determinar, de forma inequívoca, las rutas a los archivos de `tema` y `contenido` para una `variante` específica.

Actúa como una capa de abstracción crucial que desacopla por completo la lógica de la aplicación de la estructura física de los archivos de activos.

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada:** Recibe un `campaignId` y un `variantId`.
2.  **Delegación de Carga:** En lugar de leer el archivo por sí mismo, invoca al `Campaign Data Loader` (`loadCampaignAsset`), delegándole la responsabilidad de cargar el archivo `campaign.map.json` desde el disco. Esto respeta los principios DRY y de Responsabilidad Única.
3.  **Validación por Contrato:** Una vez recibido el contenido del mapa, lo valida rigurosamente contra el `CampaignMapSchema` de Zod. Si la estructura del archivo es incorrecta, el proceso falla inmediatamente con un error detallado, previniendo fallos impredecibles más adelante.
4.  **Resolución de Variante:** Accede al objeto `variants` del mapa validado y busca una entrada con la clave `variantId`.
5.  **Salida:**
    - **Éxito:** Si la variante existe, devuelve el objeto `CampaignVariantMap` que contiene las rutas relativas a los archivos de tema y contenido.
    - **Fallo:** Si la variante no se encuentra, lanza un error específico y claro.

## 3. Contrato de API

- **Función:** `resolveCampaignAssets(campaignId: string, variantId: string): Promise<CampaignVariantMap>`
- **Parámetros:**
  - `campaignId: string`: El ID del directorio de la campaña.
  - `variantId: string`: La clave de la variante a resolver (ej. "01", "02").
- **Retorna:** `Promise<CampaignVariantMap>` - Una promesa que resuelve con el objeto de la variante encontrada, que contiene las rutas de los activos.
- **Lanza (`@throws`):** Un `Error` si el archivo `campaign.map.json` es inválido o si la `variantId` no existe en el mapa.

## 4. Zona de Melhorias Futuras

- **Cache de Mapas Validados:** Para optimizar el rendimiento en builds grandes con muchas páginas de campaña, los mapas de campaña ya cargados y validados podrían ser cacheados en memoria (usando `React.cache`) para evitar lecturas y validaciones redundantes durante el mismo proceso de build.
- **Soporte para Múltiples Archivos de Mapa:** Evolucionar la función para que pueda aceptar una ruta de archivo de mapa opcional, permitiendo configuraciones más complejas o tests A/B con diferentes mapas sin modificar la estructura de directorios.
- **Integración con un CMS Headless:** Refactorizar el resolver para que, en lugar de leer un archivo local, pueda hacer una petición a un CMS (ej. Contentful, Strapi) para obtener el mapa de la campaña, haciendo la gestión de contenido completamente dinámica.

// .docs-espejo/lib/i18n/campaign.map.resolver.ts.md
