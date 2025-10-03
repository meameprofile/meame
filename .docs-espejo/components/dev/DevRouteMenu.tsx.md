// .docs-espejo/components/dev/DevRouteMenu.tsx.md
/\*\*

- @file .docs-espejo/components/dev/DevRouteMenu.tsx.md
- @description Documento Espejo y SSoT conceptual para el componente de menú DevRouteMenu.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Aparato DevRouteMenu

## 1. Rol Estratégico y Propósito

`DevRouteMenu` es un **componente de presentación puro (Dumb Component)**. Su única y exclusiva responsabilidad es renderizar la interfaz de usuario (UI) de un menú desplegable a partir de una estructura de datos que recibe a través de sus `props`.

Su propósito estratégico es desacoplar completamente la **apariencia** del menú de la **lógica** que define su contenido. Este componente no sabe de dónde vienen las rutas ni cómo se construyen; simplemente las muestra. Esta separación es fundamental para cumplir con el Principio de Responsabilidad Única (PRU) y para crear una arquitectura de UI mantenible y testable.

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada (Contrato de API):** El componente recibe una única prop, `routeGroups`, que es un array de objetos `RouteGroup`. Esta estructura de datos está pre-procesada y optimizada para el renderizado.
2.  **Composición de Componentes:** Utiliza el sistema de componentes atómicos `DropdownMenu` (`@/components/ui/DropdownMenu`) como base para construir la estructura del menú. Esto asegura la consistencia visual y de comportamiento con otros menús de la aplicación.
3.  **Renderizado Iterativo:** El componente mapea el array `routeGroups` y sus `items` internos para renderizar dinámicamente cada grupo, etiqueta, ítem y separador.
4.  **Navegación:** Cada ítem del menú se envuelve en un componente `<Link>` de Next.js para gestionar la navegación del lado del cliente de manera eficiente.
5.  **Iconografía Dinámica:** Utiliza el componente SSoT `DynamicIcon` para renderizar los iconos, garantizando rendimiento y seguridad de tipos.

## 3. Contrato de API

- **`routeGroups: RouteGroup[]`**: **(Requerida)** La estructura de datos que define el contenido y la jerarquía del menú.

## 4. Zona de Melhorias Futuras

1.  **Indicadores de Estado:** Mejorar la interfaz `RouteItem` para incluir un campo opcional `status?: 'new' | 'beta'`. El componente podría entonces renderizar una pequeña insignia (`Badge`) junto al nombre del enlace para comunicar visualmente el estado de una herramienta.
2.  **Soporte para Submenús:** Extender la estructura de datos y la lógica de renderizado para permitir la creación de submenús anidados, utilizando un componente como `DropdownMenuSub` si el sistema base lo permite.
3.  **Atajos de Teclado (Keyboard Shortcuts):** Integrar la capacidad de mostrar atajos de teclado junto a cada `DropdownMenuItem`, similar a las aplicaciones de escritorio, para mejorar la accesibilidad y la productividad del desarrollador.
4.  **Búsqueda/Filtro Integrado:** Añadir un campo de búsqueda en la parte superior del `DropdownMenuContent` que permita al desarrollador filtrar rápidamente la lista de rutas disponibles.
    // .docs-espejo/components/dev/DevRouteMenu.tsx.md
