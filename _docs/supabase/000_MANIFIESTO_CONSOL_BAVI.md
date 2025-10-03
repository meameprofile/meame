// \_docs/000_MANIFIESTO_CONSOL_BAVI.md
/\*\*

- @file 000_MANIFIESTO_CONSOL_BAVI.md
- @description Manifiesto Canónico y SSoT Consolidado para la Biblioteca de Activos Visuales Integrada (BAVI).
-              Define su visión, arquitectura, modelos de datos, protocolos de identificación y etiquetado,
-              tecnologías, integraciones con el ecosistema y proyecciones futuras.
- @version 1.0.0
  -@author RaZ Podestá - MetaShark Tech (Inteligencia Artificial - Asistente Personalizado)
  \*/

# Manifiesto Consolidado: Biblioteca de Activos Visuales Integrada (BAVI)

## 1. Filosofía Raíz: "Activos como Datos, Entrega como Servicio, Ecosistema Inteligente."

**BAVI** es el sistema nervioso visual de nuestro ecosistema. Su misión es transformar la gestión tradicional de archivos multimedia en un **ecosistema de activos centralizado, inteligente y agnóstico al proveedor**. Cada activo no es solo una imagen o un vídeo; es un dato rico en metadatos, versionable, optimizado y listo para ser descubierto y servido de forma programática.

La filosofía se basa en el principio de que la **SSoT programática** de nuestros activos reside en sus metadatos (manifiestos y base de datos), delegando la entrega física y la optimización a servicios de terceros de élite.

## 2. Arquitectura de Datos y Almacenamiento (SSoT Centralizada)

La BAVI utiliza una arquitectura híbrida que combina manifiestos de archivos JSON con una tabla dedicada en Supabase, delegando el almacenamiento binario a Cloudinary.

### 2.1. El Manifiesto Central (`content/bavi/bavi.manifest.json`)

Esta es la SSoT programática de los **metadatos estructurales** de nuestros activos. Define qué es un activo y cómo se organiza su información esencial.

- **Estructura del Manifiesto:**
  ```json
  {
    "assets": [
      {
        "assetId": "i-hero-vitality-mujer-01",
        "provider": "cloudinary",
        "tags": {
          /* Para FILTRADO ESTRUCTURADO (SESA) */ "thm": "vit",
          "clr": ["f97316", "22c55e"],
          "cnt": "ppl",
          "ori": "lsc",
          "sty": "pht",
          "bg": "grd"
        },
        "variants": [
          {
            "versionId": "v1-orig",
            "publicId": "webvork/assets/i-hero-vitality-mujer-01/v1-original",
            "state": "orig",
            "dimensions": { "width": 4096, "height": 2730 }
          },
          {
            /* Ejemplo de variante optimizada */ "versionId": "v2-enh-16-9",
            "publicId": "webvork/assets/i-hero-vitality-mujer-01/v2-enhanced-16-9",
            "state": "enh",
            "dimensions": { "width": 1920, "height": 1080 }
          }
        ],
        "metadata": {
          "altText": {
            /* Contenido i18n para accesibilidad */
            "it-IT": "Donna sorridente che si gode una giornata di sole...",
            "es-ES": "Mujer sonriente disfrutando de un día soleado...",
            "en-US": "Smiling woman enjoying a sunny day..."
          },
          "promptId": "clxzyxwvut0987654321abcd" /* Enlace a RaZPrompts */
        }
      }
    ]
  }
  2.2. La Tabla public.bavi_assets (Supabase - PostgreSQL)
  Actúa como el registro persistente de todos los activos, incluyendo la propiedad del usuario/workspace y permitiendo consultas rápidas y seguras.
  Columnas Clave:
  id (UUID): Clave primaria, corresponde al assetId del manifiesto.
  workspace_id (UUID): Vínculo con el equipo propietario.
  user_id (UUID): El usuario que generó el activo.
  asset_manifest (JSONB): Almacena una copia del objeto de activo completo del bavi.manifest.json para facilitar las consultas.
  created_at (TIMESTAMPTZ), updated_at (TIMESTAMPTZ).
  Seguridad: Implementa Row Level Security (RLS), garantizando que los usuarios solo puedan acceder a los activos de sus propios workspace_id.
  2.3. El Índice de Búsqueda (content/bavi/bavi.search-index.json)
  Optimizado para la búsqueda de texto libre (folksonomía), desacoplado del manifiesto principal para una mayor eficiencia.
  Reglas de Normalización (Mandatorias): Palabras clave en minúsculas, singular y sin palabras de relleno.
  Estructura:
  code
  JSON
  {
  "version": "1.0.0",
  "index": {
    "i-hero-vitality-mujer-01": [
      "mujer",
      "sonrisa",
      "sol",
      "parque",
      "vitalidad",
      "alegria",
      "verano"
    ],
    "i-prod-curcumin-envase-01": [
      "producto",
      "envase",
      "frasco",
      "curcumina",
      "suplemento"
    ]
  }
  }
  ```

3. Protocolos de Identificación y Etiquetado
   3.1. Sistema de Nomenclatura e Identificación de Activos (SNIA)
   Identificador único y estructurado para cada activo.
   Fórmula del ID: [tipo]-[categoria]-[descriptor]-[secuencial]
   [tipo] (1 letra): i (Imagen), a (Audio), v (Vídeo).
   [categoria] (4 letras): prod (Producto), tstm (Testimonio), hero (Hero), sybl (Símbolo), lfsy (Estilo de Vida), pdct (Podcast).
   [descriptor] (kebab-case): Slug corto y legible.
   [secuencial] (2 dígitos): Número secuencial (ej. 01, 02).
   3.2. Protocolo de Etiquetado Semántico Atómico (SESA)
   Para filtrado estructurado y de alto rendimiento. Las etiquetas son códigos cortos que se traducen en la capa de presentación.
   SSoT de Conversión (content/bavi/sesa-tags.manifest.json):
   code
   JSON
   {
   "version": "1.0.0",
   "categories": {
   "thm": {
   "label": "Tema de Campaña",
   "codes": { "sci": "Scientific", "vit": "Vitality" }
   },
   "clr": {
   "label": "Color Dominante",
   "description": "Hexadecimal sin '#'",
   "codes": {}
   },
   "cnt": {
   "label": "Contenido Principal",
   "codes": { "ppl": "Persona", "prd": "Producto" }
   },
   "ori": {
   "label": "Orientación",
   "codes": { "lsc": "Horizontal", "prt": "Vertical" }
   },
   "sty": {
   "label": "Estilo Visual",
   "codes": { "pht": "Fotografía", "ill": "Ilustración" }
   },
   "bg": {
   "label": "Tipo de Fondo",
   "codes": { "sld": "Sólido", "grd": "Gradiente" }
   }
   }
   }
4. Tecnologías y Flujo de Gestión (Cloudinary como DAM de Élite)
   Cloudinary es el proveedor principal para el almacenamiento, procesamiento y entrega de activos.
   4.1. Configuración y Credenciales
   Variables de Entorno: NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME (cliente), CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET (servidor).
   4.2. Ingesta de Activos (Server Actions)
   uploadAssetToCloudinaryAction(formData): Sube archivos a Cloudinary.
   Parámetros Clave: public_id (nuestro assetId), folder (webvork/assets/[assetId]/[versionState]), tags (folksonomía), context (taxonomía SESA), quality_analysis: true, colors: true.
   addAssetVariantToManifestAction(assetData): Actualiza bavi.manifest.json y bavi.search-index.json (de forma atómica) y la tabla public.bavi_assets en Supabase.
   4.3. Renderizado Optimizado (next-cloudinary y <CldImage>)
   Componente: Uso exclusivo del componente <CldImage> para el renderizado de imágenes.
   Optimización Automática: format="auto" y quality="auto" son mandatorios para servir formatos modernos (AVIF/WebP) y la mejor compresión.
   Transformaciones Inteligentes: gravity="auto" o gravity="face" para recortes inteligentes, y soporte para efectos con IA (effect="improve").
5. Simbiosis Inquebrantable con el Ecosistema
   La BAVI se integra profundamente con otros dominios.
   Con RaZPrompts (Directiva 024_ECOSYSTEM_INTEGRATION_PROTOCOL.md):
   Conexión Inmutable: Todo activo visual generado por IA en BAVI DEBE tener una conexión a su promptId en RaZPrompts, y viceversa.
   Flujo: RaZPrompts -> uploadAssetAction (BAVI) -> publicId (Cloudinary) -> baviAssetId (RaZPrompts y bavi.manifest.json).
   Con la SDC (Suite de Diseño de Campañas):
   Explorador de Activos (AssetExplorer.tsx): Un modal que reemplaza los ImageUploader tradicionales. Permite buscar y seleccionar activos curados de la BAVI, filtrando por SESA tags y palabras clave.
   Valor: Acelera la creación de campañas y asegura la consistencia visual.
   Con CogniRead:
   baviHeroImageId: Los artículos de CogniRead se vinculan a la BAVI para sus imágenes destacadas, garantizando visuales optimizados y contextuales.
6. Compromiso de Calidad (8 Pilares)
   Cada aparato que compone la BAVI (schemas, acciones, componentes de UI) cumple rigurosamente con los 8 Pilares de Calidad definidos en 000_MANIFIESTO_PILARES_DE_CALIDAD.md.
7. Proyecciones Futuras
   Auto-Tagging por IA: Integración con APIs de Visión (Google Vision, Cloudinary AI) para generar automáticamente palabras clave y etiquetas SESA para los activos subidos.
   Búsqueda Semántica/Visual: Búsqueda por similitud conceptual o visual más allá de las palabras clave.
   Soporte Multimedia Avanzado: Extensión completa para la gestión y optimización de activos de vídeo y audio, incluyendo variantes de formato y duración.
   Sistema de Relevancia: Ponderación de palabras clave en bavi.search-index.json para mejorar la relevancia de los resultados.
   Stemming y Tolerancia a Errores: Implementación de técnicas de procesamiento de lenguaje natural para mejorar la resiliencia de la búsqueda.

---
