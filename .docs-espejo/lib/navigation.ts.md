// .docs-espejo/lib/navigation.ts.md
/\*\*

- @file .docs-espejo/lib/navigation.ts.md
- @description Documento Espejo y SSoT conceptual para el aparato de navegación.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Aparato de Navegación

## 1. Rol Estratégico y Propósito

El aparato `lib/navigation.ts` es la **Única Fuente de Verdad (SSoT) para todas las rutas y la estructura de navegación de la aplicación**. Su propósito estratégico es desacoplar la definición de las rutas de su uso en los componentes, eliminando por completo las cadenas de texto "mágicas" (`string literals`) para los `href`.

Esto proporciona:

- **Seguridad de Tipos:** El uso de `routes.home.path()` es verificado por el compilador, previniendo errores de enrutamiento en tiempo de compilación.
- **Mantenibilidad Centralizada:** Si una estructura de URL cambia (ej. `/store` a `/shop`), solo necesita ser modificada en este archivo, y el cambio se propagará de forma segura a toda la aplicación.
- **Claridad Arquitectónica:** Proporciona un mapa legible y centralizado de toda la arquitectura de páginas del sitio.

## 2. Arquitectura y Flujo de Ejecución

El aparato exporta un conjunto de herramientas cohesivas:

1.  **`RouteType` (Objeto-Enum):** Clasifica cada ruta (`Public`, `DevOnly`, etc.) para que el `middleware.ts` pueda aplicar lógica de control de acceso de forma programática.
2.  **`routes` (Objeto Constante):** Es el corazón del aparato. Cada clave es un identificador semántico de una ruta (ej. `home`, `campaign`). El valor es un objeto que contiene:
    - `path`: Una **función generadora** que construye la cadena de la URL final. Esta función recibe un objeto de parámetros (`locale`, `campaignId`, etc.) y devuelve la ruta formateada y localizada.
    - `type`: Una referencia a `RouteType` para el control de acceso.
3.  **`navigationManifest` (Objeto Constante):** Define la estructura de datos para menús estáticos (como el menú de desarrollo). Consume el objeto `routes` para construir sus `href`, garantizando que los menús nunca tengan enlaces rotos.

El flujo es unidireccional: los componentes importan `routes` para generar enlaces (`<Link href={routes.someRoute.path(...)} />`), y el `middleware` puede usar `RouteType` para proteger rutas.

## 3. Contrato de API

- `routes: const object`: El objeto principal con todas las definiciones de ruta.
- `RouteType: const object`: El enum para los tipos de ruta.
- `RouteParams: type`: El tipo para los parámetros de las funciones `path`.
- `NavLink: interface`: El contrato para los objetos de enlace en los manifiestos de menú.
- `navigationManifest: const object`: La estructura de datos para menús estáticos.

## 4. Zona de Melhorias Futuras

1.  **Generación de Breadcrumbs:** Crear una utilidad que, dado un `pathname`, utilice este manifiesto para generar automáticamente una estructura de datos de `breadcrumbs` (migas de pan).
2.  **Integración de Metadatos:** Ampliar el objeto `routes` para incluir metadatos de página (ej. `titleKey: "aboutPage.title"`), permitiendo generar las etiquetas `<title>` de forma dinámica y centralizada en el `layout.tsx`.
3.  **Componente `SafeLink`:** Desarrollar un componente wrapper sobre `next/link` que sea estrictamente tipado y solo acepte como `href` una llamada a una de las funciones `path` del objeto `routes`, llevando la seguridad de tipos al máximo nivel.
4.  **Generación de Sitemap Dinámica:** El script que genera el sitemap debería leer directamente desde este manifiesto para construir el `sitemap.xml`, garantizando que todas las rutas públicas estén siempre incluidas.
5.  **Manifiestos de Menú Dinámicos:** En lugar de un `navigationManifest` estático, crear funciones generadoras (ej. `getDevMenu(locale)`) que construyan los datos del menú, permitiendo una mayor flexibilidad futura (ej. menús basados en roles de usuario).
    // .docs-espejo/lib/navigation.ts.md
