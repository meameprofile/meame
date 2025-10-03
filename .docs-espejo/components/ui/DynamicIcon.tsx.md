// .docs-espejo/components/ui/DynamicIcon.tsx.md
/\*\*

- @file .docs-espejo/components/ui/DynamicIcon.tsx.md
- @description Documento Espejo y SSoT conceptual para el aparato DynamicIcon.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Aparato DynamicIcon

## 1. Rol Estratégico y Propósito

El aparato `DynamicIcon` es la **Única Fuente de Verdad (SSoT) y el único punto de entrada autorizado** para renderizar cualquier icono de la librería `lucide-react` en toda la aplicación.

Su propósito estratégico es triple:

1.  **Rendimiento (Performance):** Implementa la carga dinámica (`next/dynamic`) para cada icono. Esto significa que el código de un icono solo se carga en el cliente si ese icono se va a renderizar, mejorando drásticamente el tamaño del _bundle_ inicial y el rendimiento de carga de la página.
2.  **Seguridad de Tipos (Type Safety):** Expone una API que consume el tipo `LucideIconName` (generado automáticamente desde `src/config/lucide-icon-names.ts`). Esto garantiza que solo se puedan solicitar iconos que realmente existen, previniendo errores de tipeo y fallos en tiempo de ejecución. Convierte la selección de iconos en una operación verificada por el compilador.
3.  **Resiliencia y Consistencia (Resilience & Consistency):** Centraliza la lógica de renderizado, incluyendo estados de carga (`loading`) y de error (`fallback`). Si un icono no se encuentra, renderiza un icono de `HelpCircle` por defecto, evitando que la UI se rompa y proporcionando feedback visual inmediato durante el desarrollo.

## 2. Arquitectura y Flujo de Ejecución

El flujo de lógica del componente es lineal y robusto:

1.  **Entrada:** Recibe una prop `name` de tipo `LucideIconName` (ej. "LayoutDashboard").
2.  **Conversión:** La función pura interna `pascalToKebab` convierte el nombre de `PascalCase` al formato `kebab-case` (ej. "layout-dashboard") que la librería `lucide-react` utiliza para las claves de sus módulos de iconos.
3.  **Validación y Fallback:** Verifica si la clave `kebab-case` resultante existe en el manifiesto `dynamicIconImports`.
    - **Si existe:** Procede a usar esa clave.
    - **Si no existe:** Emite una advertencia en la consola de desarrollo y establece la clave del icono de fallback (`help-circle`) como la clave a cargar.
4.  **Carga Dinámica:** Invoca a `next/dynamic` con la función de importación correspondiente a la clave validada. `next/dynamic` gestiona el _code-splitting_ y proporciona un estado de carga (`loading`) mientras el módulo del icono se descarga.
5.  **Renderizado:** Renderiza el componente del icono cargado, pasándole todas las `LucideProps` adicionales (`className`, `size`, `color`, etc.).

## 3. Contrato de API

- **`name: LucideIconName`**: **(Requerida)** El nombre del icono en `PascalCase`. Debe ser una de las claves del tipo `LucideIconName`.
- **`...props: LucideProps`**: Acepta todas las demás props que un componente de `lucide-react` aceptaría, como `className`, `size`, `color`, `strokeWidth`, etc.

## 4. Zona de Melhorias Futuras

1.  **Generación de Sprites SVG:** Para grupos de iconos que siempre se cargan juntos (ej., en el `Header`), se podría implementar un script de build que genere un sprite SVG. Esto reduciría el número de peticiones de red de múltiples iconos a una sola.
2.  **Prop de Fallback Personalizada:** Añadir una prop opcional `fallbackName?: LucideIconName` para permitir al consumidor del componente especificar un icono de fallback diferente al `HelpCircle` por defecto.
3.  **Presets de Tamaño:** Introducir una prop `sizePreset?: 'sm' | 'md' | 'lg'` que mapee a valores numéricos de `size` predefinidos en el sistema de diseño, promoviendo una mayor consistencia visual.
4.  **Integración con Storybook/Ladle:** Crear historias para este componente que permitan visualizar todos los iconos disponibles y probar sus diferentes props (`size`, `color`, etc.) en un entorno aislado.
5.  **Optimización de Carga Predictiva:** Investigar el uso de `IntersectionObserver` para pre-cargar iconos que están a punto de entrar en el viewport, mejorando la experiencia de usuario percibida.
    // .docs-espejo/components/ui/DynamicIcon.tsx.md
