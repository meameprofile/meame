// .docs-espejo/components/dev/utils/route-menu.generator.ts.md
/\*\*

- @file .docs-espejo/components/dev/utils/route-menu.generator.ts.md
- @description Documento Espejo y SSoT conceptual para el generador del menú de desarrollo.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Generador del Menú de Rutas de Desarrollo

## 1. Rol Estratégico y Propósito

El aparato `route-menu.generator.ts` es un **constructor de modelo de vista (View Model Builder)**. Su única responsabilidad, en estricto cumplimiento del PRU, es consumir múltiples fuentes de verdad (SSoT) y transformarlas en una estructura de datos simple y optimizada, lista para ser renderizada por un componente de presentación puro (`DevRouteMenu.tsx`).

Su propósito estratégico es **aislar la lógica de construcción de datos de la lógica de presentación**, una piedra angular de la arquitectura de componentes de este proyecto.

## 2. Arquitectura y Flujo de Ejecución

Este aparato expone una única función pura, `generateDevRoutes`, cuyo flujo es el siguiente:

1.  **Entradas (Dependencias):**
    - `dictionary`: El objeto de contenido i18n, que proporciona las etiquetas de texto para los enlaces y grupos.
    - `locale`: El idioma actual, necesario para generar las URLs correctamente localizadas.

2.  **Proceso (Consumo de SSoT):**
    - Internamente, importa y consume la SSoT de rutas (`lib/navigation.ts`) para obtener las plantillas de URL correctas (`routes.home.path`, `routes.store.path`, etc.).
    - También consume la SSoT de configuración del productor (`config/producer.config.ts`) para obtener valores como el `LANDING_ID` por defecto.
    - Construye un array de objetos (`RouteGroup[]`) que representa la estructura jerárquica del menú.

3.  **Salida (Contrato):**
    - Devuelve un `RouteGroup[]`, una estructura de datos predecible y fuertemente tipada que el componente `DevRouteMenu.tsx` puede iterar y renderizar sin necesidad de realizar ninguna lógica adicional.

## 3. Contrato de API

- **Función:** `generateDevRoutes(dictionary, locale)`
- **Parámetros:**
  - `dictionary: NonNullable<Dictionary["devRouteMenu"]>`
  - `locale: Locale`
- **Retorno:** `RouteGroup[]`

## 4. Zona de Melhorias Futuras

1.  **Generación Dinámica de Grupos:** En lugar de codificar los grupos estáticamente en la función, se podría derivar la estructura de grupos desde un manifiesto de navegación más rico, como `navigationManifest` en `lib/navigation.ts`, haciendo el generador aún más adaptable a cambios futuros.
2.  **Filtrado por Permisos/Roles:** Extender la lógica para aceptar un parámetro opcional de `rol` de usuario. El generador podría filtrar las rutas y devolver solo aquellas a las que el rol tiene acceso.
3.  **Validación de Iconos:** Implementar una comprobación en tiempo de desarrollo que verifique si todos los `iconName` especificados en la función existen realmente en el `lucideIconNames` enum, para prevenir errores de iconos rotos.
4.  **Soporte para Indicadores de Estado:** Modificar la estructura de `RouteItem` para incluir una propiedad opcional `status?: 'new' | 'updated' | 'deprecated'`, permitiendo a la UI renderizar insignias visuales en el menú para destacar cambios.
    // .docs-espejo/components/dev/utils/route-menu.generator.ts.md
