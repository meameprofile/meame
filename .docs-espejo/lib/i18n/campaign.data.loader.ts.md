// .docs-espejo/lib/i18n/campaign.data.loader.ts.md
/\*\*

- @file campaign.data.loader.ts.md
- @description Documento Espejo y SSoT conceptual para el aparato Campaign Data Loader.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Campaign Data Loader

## 1. Rol Estratégico

El `Campaign Data Loader` es un aparato de infraestructura crítica con una única responsabilidad: actuar como el **puente físico entre el sistema de archivos y la lógica de la aplicación**. Su función es localizar y cargar el contenido crudo de un activo de campaña específico (archivos de tema o de contenido JSON) desde el disco del servidor.

Es el primer paso en el pipeline de ensamblaje de datos de campaña, y su fiabilidad es fundamental para el funcionamiento de todo el motor de campañas. Opera exclusivamente en el servidor (`server-only`).

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada:** Recibe un `campaignId` y una `assetPath` relativa desde el orquestador (`campaign.i18n.ts`).
2.  **Construcción de Ruta:** Invoca a un helper interno para construir una ruta de archivo absoluta y segura, resolviéndola desde la raíz del proyecto hasta el activo solicitado dentro de `src/content/campaigns/`.
3.  **Lectura de Archivo:** Utiliza el módulo `fs/promises` de Node.js para leer de forma asíncrona el contenido del archivo como un buffer de texto UTF-8. Este método es robusto y adecuado para entornos de servidor.
4.  **Parseo de JSON:** Parsea la cadena de texto leída a un objeto JavaScript.
5.  **Salida:** Devuelve el objeto JavaScript parseado, tipado genéricamente como `T`.
6.  **Manejo de Errores:** Si la construcción de la ruta, la lectura del archivo o el parseo de JSON fallan, captura el error, lo enriquece con contexto (qué archivo y campaña fallaron) y lo relanza para que sea manejado por la capa superior.

## 3. Contrato de API

- **Función:** `loadCampaignAsset<T>(campaignId: string, assetPath: string): Promise<T>`
- **Parámetros:**
  - `campaignId: string`: El identificador del directorio de la campaña.
  - `assetPath: string`: La ruta relativa del activo desde la carpeta de la campaña.
- **Retorna:** `Promise<T>` - Una promesa que resuelve con el contenido del archivo JSON parseado.
- **Lanza (`@throws`):** Un `Error` si el archivo no se encuentra o no se puede parsear, incluyendo detalles del error original.

## 4. Zona de Melhorias Futuras

- **Implementar Cache de Nivel de Petición:** Para evitar leer el mismo archivo JSON del disco múltiples veces durante una única renderización de página compleja, se podría implementar un sistema de caché (ej. `React.cache` o un `Map` simple) que almacene los activos cargados durante el ciclo de vida de una petición.
- **Soporte para Múltiples Formatos:** Extender el loader para que pueda manejar otros formatos de archivo como YAML o Markdown (MDX), seleccionando el parser adecuado según la extensión del archivo.
- **Versión de Carga Segura:** Crear una variante `loadCampaignAssetSafe` que, en lugar de lanzar un error, devuelva `null` o un objeto de resultado `{ data: T | null, error: Error | null }`. Esto permitiría una degradación más elegante en la UI si un activo opcional no se encuentra.
- **Validación de Esquema Integrada:** El loader podría aceptar un schema de Zod opcional y realizar una validación básica del contenido justo después del parseo, lanzando un error más específico si la estructura del archivo no coincide con el contrato esperado.

// .docs-espejo/lib/i18n/campaign.data.loader.ts.md
