// .docs-espejo/components/layout/SectionRenderer.tsx.md
/\*\*

- @file SectionRenderer.tsx.md
- @description Manifiesto Conceptual para el aparato orquestador SectionRenderer.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: `SectionRenderer.tsx`

## 1. Rol Estratégico

El `SectionRenderer` es la pieza central de la arquitectura de renderizado de páginas. Actúa como una **Fábrica de Secciones Dinámicas**, cuya única responsabilidad es traducir una configuración de layout (un array de nombres de sección) en una página web completamente renderizada.

Su rol estratégico es **desacoplar completamente la estructura de una página de su implementación de código**. Permite que los equipos de marketing o contenido definan y reordenen layouts en archivos de configuración (`theme.json`) sin requerir ninguna modificación en el código React de las páginas.

## 2. Arquitectura y Flujo de Ejecución

Este aparato implementa el **Patrón de Registro** y el **Principio Abierto/Cerrado (SOLID)**.

1.  **Entrada:** Recibe un `sectionName` (ej. `"Hero"`) de su componente padre (la página).
2.  **Consulta:** Utiliza `sectionName` para buscar la entrada correspondiente en la SSoT de configuración `lib/config/sections.config.ts`.
3.  **Resolución:** De la entrada del registro, obtiene dos piezas clave de metadatos:
    - `component`: El componente de React que debe ser renderizado (ej. el import de `Hero.tsx`).
    - `dictionaryKey`: La clave (`"hero"`) necesaria para encontrar el contenido correcto en el objeto `Dictionary` global.
4.  **Inyección de Dependencias:** Extrae el objeto de contenido relevante del `Dictionary` (`dictionary['hero']`).
5.  **Renderizado:** Invoca al `component` resuelto y le pasa su `content` a través de un **contrato de props unificado y estricto**. Todo componente de sección renderizado por este aparato recibe una única prop `content`.

Este flujo asegura que el `SectionRenderer` permanezca cerrado a modificaciones, mientras que el sistema permanece abierto a extensiones (se pueden añadir nuevas secciones simplemente actualizando el registro en `sections.config.ts`).

## 3. Contrato de API

- **Entradas (`props`):**
  - `sectionName: SectionName`: El identificador de la sección a renderizar.
  - `dictionary: Dictionary`: El objeto de contenido completo para el idioma actual.
  - `locale: string`: El código del idioma actual.
- **Salidas:**
  - Un elemento `React.ReactElement` (el componente de sección renderizado).
  - `null` si la sección no está configurada o no tiene contenido en el diccionario.

## 4. Zona de Melhorias Futuras

1.  **Error Boundaries de Desarrollo:** Envolver el `<ComponentToRender />` en un `ErrorBoundary` de React (activo solo en desarrollo) para capturar errores de renderizado dentro de una sección específica y mostrar un mensaje de error visualmente claro en la UI, en lugar de romper toda la página.
2.  **Métricas de Rendimiento:** Integrar la API de `performance.mark` y `performance.measure` para registrar (en desarrollo) el tiempo de renderizado de cada sección, ayudando a identificar cuellos de botella en el rendimiento.
3.  **Lazy Loading de Secciones:** Para páginas muy largas, investigar el uso de `next/dynamic` para cargar de forma diferida los componentes de sección que están "below the fold" (fuera del viewport inicial), mejorando el First Contentful Paint (FCP).
    // .docs-espejo/components/layout/SectionRenderer.tsx.md
