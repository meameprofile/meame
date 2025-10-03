// .docs-espejo/lib/config/sections.config.ts.md
/\*\*

- @file .docs-espejo/lib/config/sections.config.ts.md
- @description Documento Espejo y SSoT conceptual para el aparato de configuración de secciones.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Registro de Secciones (`sections.config.ts`)

## 1. Rol Estratégico y Propósito

El aparato `lib/config/sections.config.ts` es la **Única Fuente de Verdad (SSoT)** para el inventario de todas las secciones de página disponibles en la aplicación. Su rol estratégico es implementar el **Patrón de Diseño de Registro (Registry Pattern)**.

Este registro desacopla al orquestador de renderizado (`SectionRenderer`) de los componentes de sección concretos. El `SectionRenderer` no necesita conocer cada sección; simplemente consulta este registro utilizando un nombre de sección (ej. `"Hero"`) para obtener dos piezas de información vitales:

1.  **El componente React** que debe renderizar.
2.  **La clave (`dictionaryKey`)** que debe usar para buscar el contenido de ese componente en el diccionario de i18n.

Este desacoplamiento es fundamental para el **Principio Abierto/Cerrado (SOLID)**: para añadir una nueva sección a la aplicación, solo necesitamos _extender_ este registro; no es necesario _modificar_ la lógica del `SectionRenderer`.

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada:** El aparato no tiene entradas dinámicas. Es una configuración estática.
2.  **Proceso:**
    - Importa todos los componentes de sección disponibles desde sus ubicaciones canónicas en `src/components/sections/`.
    - Define el objeto `sectionsConfig`, donde cada clave es el nombre del componente en `PascalCase`. Cada valor es un objeto que cumple con el contrato `SectionConfigEntry`, vinculando el componente a su `dictionaryKey` (en `camelCase`).
    - Deriva dinámicamente la constante `sectionNames` y el tipo `SectionName` a partir de las claves de `sectionsConfig`, garantizando que el registro sea la única fuente de verdad (principio DRY).
3.  **Salida:** Exporta `sectionsConfig`, `sectionNames` y `SectionName` para ser consumidos por otros aparatos del sistema, principalmente por `SectionRenderer.tsx` y los schemas de validación de temas de campaña.

## 3. Contrato de API

- **`sectionsConfig: Record<string, SectionConfigEntry>`**: El objeto de registro principal.
- **`sectionNames: string[]`**: Un array con los nombres de todas las secciones registradas.
- **`SectionName: type`**: Un tipo de unión de TypeScript que representa todos los nombres de sección válidos.

## 4. Zona de Melhorias Futuras

1.  **Carga Dinámica de Componentes:** Investigar si el registro podría almacenar rutas de archivo en lugar de componentes importados directamente, permitiendo a `SectionRenderer` usar `next/dynamic` para cargar componentes de sección bajo demanda y mejorar el code-splitting.
2.  **Generación Automática:** Explorar la posibilidad de un script de generación (`pnpm run gen:sections`) que escanee el directorio `src/components/sections` y genere automáticamente el objeto `sectionsConfig`, reduciendo aún más el mantenimiento manual.
3.  **Validación de `dictionaryKey`:** Implementar una validación en tiempo de build que asegure que cada `dictionaryKey` existe realmente en el `i18n.schema.ts` para prevenir errores de contenido en tiempo de ejecución.
    // .docs-espejo/lib/config/sections.config.ts.md
