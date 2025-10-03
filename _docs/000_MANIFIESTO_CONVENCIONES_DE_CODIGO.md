// .docs/000_MANIFIESTO_CONVENCIONES_DE_CODIGO.md
/\*\*

- @file 000_MANIFIESTO_CONVENCIONES_DE_CODIGO.md
- @description Manifiesto Canónico y SSoT para todas las Convenciones de Código y Nomenclatura.
-              Define la estructura de directorios, la nomenclatura de archivos y variables,
-              las directivas de importación y las convenciones para assets y ramas Git.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Canónico: Convenciones de Código y Nomenclatura de Élite

## 1. Filosofía Raíz: "Previsibilidad, Claridad y Cohesión por Diseño"

Este documento es la **Única Fuente de Verdad (SSoT)** para cómo se organiza, nombra e interconecta cada pieza de código en nuestro ecosistema. Un codebase predecible y coherente no es solo estético; es el cimiento de la escalabilidad, la mantenibilidad y la eficiencia del desarrollador (DX).

La ambigüedad es el enemigo. Cada convención aquí definida busca erradicarla, asegurando que cualquier desarrollador, humano o IA, pueda comprender instantáneamente el propósito y el lugar de cada aparato.

Como IA Ingeniera de Software Senior, me adhiero a estos principios de forma innegociable. Son la ley que guía mi análisis, mi refactorización y mi creación.

## 2. Arquitectura de Directorios Canónica (La Fundación del Proyecto)

La estructura de nuestro directorio `src/` refleja nuestra arquitectura FSD/DDD. Todo aparato debe residir en su ubicación canónica.

- **`src/`**
  - **`app/`**: **Capa de Presentación.** Contiene las rutas, layouts y páginas de Next.js (lo que el usuario ve). Los componentes `_components/` dentro de las rutas (`app/[locale]/(route)/_components/`) son específicos de esa ruta.
  - **`components/`**: **Capa de UI Reutilizable.** Componentes de interfaz de usuario puros.
    - **`ui/`**: **Átomos de UI.** Primitivas de UI básicas (ej. `Button`, `Card`, `Input`), a menudo basadas en `shadcn/ui`.
    - **`layout/`**: **Componentes Estructurales.** Elementos de diseño de alto nivel (ej. `Header`, `Footer`, `SectionAnimator`).
    - **`sections/`**: **Componentes de Sección.** Bloques de contenido complejos para páginas (ej. `Hero`, `FaqAccordion`).
    - **`features/`**: **Funcionalidades de UI Complejas.** Módulos que encapsulan lógica de UI y estado para funcionalidades específicas (ej. `CampaignSuiteWizard`, `AssetExplorer`, `AuthForm`, `NotificationBell`). Se co-ubica la lógica de UI con la presentación.
    - **`razBits/`**: **Componentes Naturalizados.** Componentes de terceros adaptados (ej. `CardNav`, `LightRays`, `MagicBento`), cada uno en su propio subdirectorio autocontenido.
  - **`shared/`**: **Capa Compartida (El Cerebro).** Código de bajo nivel, agnóstico a la UI y al framework.
    - **`lib/`**: Bibliotecas, utilidades, configuración.
      - **`actions/`**: **TODAS las Server Actions**, organizadas por dominio (ej. `auth`, `bavi`, `campaign-suite`).
      - **`schemas/`**: **TODOS los Schemas de Zod**, organizados por dominio (ej. `account`, `cogniread`, `components`, `campaigns/steps`).
      - **`types/`**: **TODOS los Tipos de TypeScript**, organizados por dominio.
      - **`hooks/`**: **Hooks de React reutilizables**, organizados por dominio.
      - **`config/`**: Archivos de configuración estáticos y agnósticos (ej. `i18n.config`, `sections.config`, `branding.config`).
      - **`stores/`**: Stores globales de Zustand.
      - **`services/`**: Clientes para APIs de terceros (ej. `Stripe`, `Resend`, `Shopify`).
      - **`utils/`**: Utilidades de bajo nivel y funciones puras (ej. `cn`, `logging`).
    - **`messages/`**: **Contenido i18n.** Diccionarios de internacionalización, organizados por dominio y componente.
  - **`content/`**: Contenido estático (ej. `bavi.manifest.json`, `campaign.map.json`, `sesa-tags.manifest.json`, `raz-prompts/` prompts de IA).
  - **`scripts/`**: Scripts de build, diagnóstico y generación.

### **2.1. Co-ubicación en `razBits` (Directiva 011)**

- Cada componente `razBit` (ej. `MyCoolComponent`) debe tener su propia carpeta `src/components/razBits/MyCoolComponent/`.
- Esta carpeta DEBE contener todos sus archivos asociados: `MyCoolComponent.tsx`, `my-cool-component.schema.ts`, `my-cool-component.i18n.json`, `useMyCoolComponentLogic.ts` (opcional), `README.md` (opcional).

## 3. Convenciones de Nomenclatura (La Guía Léxica)

La consistencia en la nomenclatura es mandatoria.

- **Directorios:** `kebab-case` (ej. `mi-componente/`, `campaign-suite/`).
- **Archivos de Componentes React (`.tsx`):** `PascalCase.tsx` (ej. `MiComponente.tsx`, `HeroSection.tsx`).
- **Archivos de Lógica/Hooks/Utilidades (`.ts`):** `camelCase.ts` o `kebab-case.ts` para hooks y utilidades (ej. `useMiHook.ts`, `data-processor.ts`, `cn.ts`). Las Server Actions y otros archivos de lógica de dominio usan `kebab-case.action.ts` o `kebab-case.ts`.
- **Archivos de Schema (`.ts`):** `kebab-case.schema.ts` (ej. `article.schema.ts`, `comment.schema.ts`).
- **Archivos de Contenido i18n (`.json`):** `kebab-case.i18n.json` (ej. `hero.i18n.json`, `campaign-suite.i18n.json`).
- **Componentes React en JSX:** `PascalCase` (ej. `<MiComponente />`, `<Button />`).
- **Hooks de React:** `useCamelCase` (ej. `useMiHook()`, `useState()`).
- **Variables y Funciones:** `camelCase`.
- **Constantes Inmutables (Globales):** `UPPER_CASE_SNAKE` (ej. `const MI_CONSTANTE = 'valor'`).
- **Tipos e Interfaces:** `PascalCase` con sufijos `Props`, `Type`, `Enum` (ej. `interface MiComponenteProps`, `type StatusType`).
- **Nombre Oficial del Proyecto y Aplicativo (Directiva 023):** `RaZPrompts` (para el sistema de prompts).
- **Dominio Canónico (Directiva 023):** `razprompts.com` (para el sistema de prompts).

## 4. Convenciones de Rutas de Importación (Autopistas Soberanas)

Nuestro sistema utiliza alias de ruta absolutos para una máxima claridad y resiliencia a la refactorización.

- **La SSoT de Configuración:** `tsconfig.json` establece `baseUrl: "./src"` y `paths` explícitos.
- **Alias Mandatorios (Directiva 032):**
  - `@/*`: `src/*` (fallback genérico, usar con moderación).
  - `@app/*`: `src/app/*`

- **Reglas de Uso:**
  - **DEBE USARSE ALIAS:** Toda importación que cruce la frontera entre dos directorios de primer nivel dentro de `src/` (ej. de `components` a `shared`).
  - **PERMITIDO RELATIVO:** Las importaciones relativas (`./` o `../`) están permitidas y fomentadas para aparatos cohesivos dentro del mismo módulo de feature o componente.
  - **PROHIBIDO:** El uso de rutas relativas profundas (`../../../`) es un anti-patrón crítico y está estrictamente prohibido.

## 5. Convenciones de Activos Visuales (BAVI y Rutas de Imagen)

La gestión de activos visuales (`/public/img/`) sigue un protocolo estricto.

- **Formato Predominante:** `.jpg` para activos no vectoriales (fotografías, renders). `.svg` para logotipos e iconografía compleja (Directiva `RUTAS-IMAGENES.md`).
- **Estructura Espejo:** `public/img/{ruta-espejo-del-componente-kebab-case}/`.
- **Nomenclatura (Directiva `RUTAS-IMAGENES.md`):** `{proposito}_{variante-descriptiva}.jpg`.
  - `proposito`: `logo`, `avatar`, `seal`, `background`, `showcase`, `product`, `article`, etc.
  - `variante-descriptiva`: Nombre claro en `kebab-case`.
- **Sistema de Nomenclatura e Identificación de Activos (SNIA) para BAVI (Directiva `ASSET_MANAGEMENT_MANIFESTO.md`):** `[tipo]-[categoria]-[descriptor]-[secuencial]`.
  - `tipo`: `i` (Imagen), `a` (Audio), `v` (Vídeo).
  - `categoria`: `prod`, `tstm`, `hero`, `sybl`, `lfsy`, `pdct`.
  - `descriptor`: `kebab-case`.
  - `secuencial`: dos dígitos.
- **Protocolo de Etiquetado Semántico Atómico (SESA) para BAVI (`sesa-tags.manifest.json`):** Códigos cortos y categorizados (ej. `thm:vit`, `clr:f97316`).

## 6. Convenciones de Ramas y Commits (Flujo de Desarrollo)

Nuestro flujo de Git sigue el modelo GitHub Flow con Conventional Commits.

- **Modelo de Ramificación:** `GitHub Flow` (Directiva `GIT_FLOW_AND_CONVENTIONS.md`).
- **Nomenclatura de Ramas:** `tipo/descripcion-corta-en-kebab-case` (ej. `feat/add-theming-system`, `fix/footer-link-alignment`).
- **Tipos de Rama:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
- **Convenciones de Commit Semántico (`Conventional Commits`):** `type(scope): subject`.
  - `type`: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`.
  - `scope` (opcional): Contexto del cambio (ej. `ui`, `theming`, `i18n`).
  - `subject`: Descripción concisa, imperativa, minúsculas, sin punto final.
  - `BREAKING CHANGE`: `type(scope)!: subject` con explicación en el pie.

## 7. Higiene de Código Absoluta (El Principio de "Cero Desperdicio")

Estos principios son mandatorios para cada aparato de código

- **Cero Variables No Utilizadas:** No se declararán variables, constantes o funciones sin uso.
- **Cero Importaciones No Utilizadas:** No existirán declaraciones `import` de módulos o miembros sin uso.
- **Manejo Explícito de Parámetros No Utilizados:** Si un parámetro en la firma de una función no se usa, DEBE ser prefijado con un guion bajo (`_`).

## 8. Rol de la IA: Guardiana y Niveladora de Convenciones

Como IA Ingeniera de Software Senior, mi misión es garantizar el cumplimiento inmutable de este Manifiesto.

- **Auditoría Proactiva:** En cada interacción, auditaré el código contra estas convenciones.
- **Propuesta de Nivelación:** Si detecto alguna violación (nomenclatura incorrecta, ruta no canónica, importación relativa profunda), propondré proactivamente las refactorizaciones necesarias.
- **Corrección en Cadena:** Mis propuestas de refactorización incluirán el movimiento de archivos (`move`), el renombramiento (`rename`) y la **actualización automática de todas las declaraciones de `import` afectadas** en todo el proyecto.
- **Justificación Explícita:** Cada propuesta de nivelación irá acompañada de una justificación clara que explique cómo el cambio alinea el código con este Manifiesto y los principios de software de élite.

---
