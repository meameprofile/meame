---

ACTUALIZACION DE MANIFIESTO
/\*\*

- @file 000_MANIFIESTO_CONSOL_BAVI.md
- @description Manifiesto Canónico y SSoT Definitivo para la Biblioteca de Activos Visuales Integrada (BAVI).
-              Define su visión, arquitectura de datos resiliente, protocolos de identificación y etiquetado,
-              y el plan de acción para garantizar la integridad referencial en todo el ecosistema.
- @version 2.0.0
-@author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Consolidado: Biblioteca de Activos Visuales Integrada (BAVI)

## 1. Filosofía Raíz: "Activos como Datos, Entrega como Servicio, Ecosistema Inteligente."

**BAVI** es el sistema nervioso visual de nuestro ecosistema. Su misión es transformar la gestión tradicional de archivos multimedia en un **ecosistema de activos centralizado, inteligente y agnóstico al proveedor**. Cada activo no es solo una imagen o un vídeo; es una entidad soberana con un genoma completo: metadatos, taxonomía, historial de versiones y vínculos con otros dominios.

Nuestra filosofía se basa en el principio de que la **integridad de los datos es innegociable**. Un activo no puede existir en un estado ambiguo o incompleto.

## 2. Arquitectura de Datos y Almacenamiento (SSoT Centralizada y Resiliente)

La BAVI utiliza una arquitectura híbrida que combina manifiestos de archivos JSON con una base de datos relacional en Supabase, delegando el almacenamiento binario a Cloudinary de élite.

### 2.1. Diagnóstico de Desalineamiento Histórico

Análisis previos de la base de datos revelaron una inconsistencia crítica: la existencia de "activos huérfanos" en la tabla `bavi_assets` sin sus correspondientes registros en `bavi_variants`. Esto violaba el contrato de la aplicación (`BaviAssetSchema`), que exige que cada activo tenga al menos una variante. La arquitectura definida a continuación erradica esta clase de errores.

### 2.2. El Contrato Inmutable: La Relación Asset-Variant

Un `Asset` (en `bavi_assets`) es el contenedor conceptual. Una `Variant` (en `bavi_variants`) es la manifestación física de ese activo. Por definición, **un activo no puede existir sin al menos una variante**. Esta relación es forzada a nivel de base de datos a través de una **restricción de clave foránea (FOREIGN KEY)**.

### 2.3. Estructura de la Base de Datos (Supabase - PostgreSQL)

Las siguientes tablas son la SSoT para la persistencia y la seguridad de los activos.

- **Tabla `public.bavi_assets`:**
  - `asset_id` (`TEXT`, Clave Primaria): El identificador único SNIA del activo.
  - `workspace_id` (`UUID`, Foreign Key): Vínculo con el equipo propietario.
  - `user_id` (`UUID`, Foreign Key): El usuario que generó el activo.
  - `provider` (`TEXT`): El proveedor de almacenamiento (ej. "cloudinary").
  - `prompt_id` (`TEXT`, Nullable): Enlace opcional a RaZPrompts.
  - `tags` (`JSONB`, Nullable): Datos de taxonomía SESA para filtrado estructurado.
  - `metadata` (`JSONB`, Nullable): Metadatos como `altText` i18n.
  - `created_at`, `updated_at` (`TIMESTAMPTZ`).

- **Tabla `public.bavi_variants`:**
  - `variant_id` (`TEXT`, Clave Primaria Compuesta con `asset_id`): ID de la versión (ej. "v1-orig").
  - `asset_id` (`TEXT`, Foreign Key a `bavi_assets.asset_id` con `ON DELETE CASCADE`): Garantiza la integridad referencial.
  - `public_id` (`TEXT`): El identificador público en el proveedor (ej. la ruta en Cloudinary).
  - `state` (`TEXT`): Estado de la variante (ej. "orig", "enh").
  - `width`, `height` (`INTEGER`).

- **Seguridad:** Ambas tablas implementan **Row Level Security (RLS)**, garantizando que los usuarios solo puedan acceder y modificar los activos pertenecientes a sus `workspace_id`.

## 3. Protocolos de Identificación y Etiquetado

### 3.1. Sistema de Nomenclatura e Identificación de Activos (SNIA)

Identificador único y estructurado para cada activo.

- **Fórmula del ID:** `[tipo]-[categoria]-[descriptor]-[secuencial]`
  - `[tipo]` (1 letra): `i` (Imagen), `a` (Audio), `v` (Vídeo).
  - `[categoria]` (4 letras): `prod` (Producto), `tstm` (Testimonio), `hero` (Hero), `sybl` (Símbolo), `lfsy` (Estilo de Vida), `pdct` (Podcast).
  - `[descriptor]` (kebab-case): Slug corto y legible.
  - `[secuencial]` (2 dígitos): Número secuencial.

### 3.2. Protocolo de Etiquetado Semántico Atómico (SESA)

Para filtrado estructurado y de alto rendimiento. Los códigos cortos se traducen en la capa de presentación.

- **SSoT de Conversión (`content/bavi/sesa-tags.manifest.json`):** Define las categorías (`thm`, `clr`, `cnt`, etc.) y sus posibles valores.

## 4. Flujo de Gestión y Simbiosis con el Ecosistema

- **Ingesta de Activos:** Toda ingesta se realiza a través de `uploadAssetAction`, que orquesta la subida a Cloudinary y la creación **atómica** de registros en `bavi_assets` y `bavi_variants`, garantizando que no se creen activos huérfanos.
- **Integración con RaZPrompts:** Todo activo generado por IA DEBE tener un `promptId` que lo vincule a su genoma creativo en RaZPrompts.
- **Consumo en SDC y CogniRead:** El `AssetExplorer`, el editor de CogniRead y otros aparatos consumen la BAVI a través de `getBaviAssetsAction`, que ahora devuelve entidades de activos completas y validadas, con la garantía de que cada una posee al menos una variante.

---

// RUTA: \_docs/000_MANIFIESTO_CONSOL_BAVI.md
/\*\*

- @file 000_MANIFIESTO_CONSOL_BAVI.md
- @description Manifiesto Canónico y SSoT Definitivo para la Biblioteca de Activos Visuales Integrada (BAVI).
- @version 2.0.0 (Consolidado)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Consolidado: Biblioteca de Activos Visuales Integrada (BAVI)

## 1. Filosofía Raíz: "Activos como Datos, Entrega como Servicio, Ecosistema Inteligente."

**BAVI** es el sistema nervioso visual de nuestro ecosistema. Su misión es transformar la gestión tradicional de archivos multimedia en un ecosistema de activos centralizado, inteligente y agnóstico al proveedor. Cada activo es una entidad soberana con un genoma completo: metadatos, taxonomía, historial de versiones y vínculos con otros dominios.

## 2. Arquitectura de Datos (SSoT en Supabase)

La persistencia de BAVI se basa en dos tablas interconectadas para garantizar la integridad referencial.

- **Tabla `public.bavi_assets`:** El contenedor conceptual del activo.
  - `asset_id` (TEXT, PK): Identificador único SNIA.
  - `workspace_id` (UUID, FK): Vínculo al equipo propietario.
  - ... (otras columnas de metadatos como `prompt_id`, `tags`, `metadata`).
- **Tabla `public.bavi_variants`:** La manifestación física del activo.
  - `variant_id` (TEXT, PK compuesta con `asset_id`).
  - `asset_id` (TEXT, FK a `bavi_assets.asset_id` con `ON DELETE CASCADE`): **Esta restricción es innegociable y previene los activos huérfanos.**
  - `public_id` (TEXT): La ruta del archivo en el proveedor (ej. Cloudinary).
  - ... (otras columnas como `width`, `height`).

## 3. Protocolos de Identificación y Etiquetado

- **SNIA (Sistema de Nomenclatura e Identificación de Activos):** Define la fórmula `[tipo]-[categoria]-[descriptor]-[secuencial]` para todos los `asset_id`.
- **SESA (Protocolo de Etiquetado Semántico Atómico):** Utiliza códigos cortos y categorizados para un filtrado estructurado de alto rendimiento, definidos en `content/bavi/sesa-tags.manifest.json`.

## 4. Flujo de Gestión

Toda la ingesta de activos se realiza a través de `Server Actions` que garantizan la creación **atómica** de registros en ambas tablas (`bavi_assets` y `bavi_variants`), asegurando que ningún activo pueda existir sin al menos una variante.

---
