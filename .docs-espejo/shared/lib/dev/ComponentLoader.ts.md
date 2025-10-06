// RUTA: \_docs/.docs-espejo/shared/lib/dev/ComponentLoader.ts.md
/\*\*

- @file ComponentLoader.ts.md
- @description Manifiesto Conceptual Espejo del aparato `ComponentLoader`.
-              Define su rol como motor de carga dinámica para el Developer Command
-              Center (DCC) y su posición crítica en la frontera Cliente-Servidor.
- @version 1.0.0
- @author L.I.A. Legacy
  \*/

# Manifiesto Conceptual Espejo: ComponentLoader.ts

## 1. Visión y Propósito Soberano

El `ComponentLoader.ts` es un **aparato soberano y de servidor** que actúa como el motor de carga dinámica para el **Component Canvas** del DCC. Su única y exclusiva misión es resolver, importar, ensamblar las props de mock y retornar cualquier componente registrado en el `ComponentRegistry.ts` para su inspección visual aislada.

Este aparato es la piedra angular que permite al DCC ser una herramienta de desarrollo ágil, pero su poder conlleva una responsabilidad arquitectónica crítica: es un módulo **`"server-only"`** por diseño y su mal uso es la causa raíz de fallos fatales en el build.

## 2. Anatomía Arquitectónica y Flujo de Ejecución

El `ComponentLoader` expone una única función soberana: `loadComponentAndProps`. Su flujo de ejecución es el siguiente:

1.  **Recepción del Nombre:** La función recibe un `componentName` (string) como único argumento.
2.  **Consulta al Registro:** Consulta el `ComponentRegistry.ts` (la SSoT de los componentes de desarrollo) para obtener la entrada (`ComponentRegistryEntry`) correspondiente al `componentName`. Si no se encuentra, la operación falla inmediatamente, previniendo errores en cascada.
3.  **Generación de Props de Mock:** Invoca a `getFallbackProps` para generar un conjunto de datos de mock estructurados y de alta fidelidad, específicos para el componente solicitado.
4.  **Importación Dinámica (`import()`):** Utiliza la función `import()` nativa de Node.js para cargar dinámicamente el módulo del componente basándose en la `componentPath` obtenida del registro. **Este es el paso que lo define como un módulo de servidor.**
5.  **Resolución del Componente:** Analiza el módulo importado para encontrar el componente exportado, ya sea como `export default` o como una exportación nombrada.
6.  **Retorno del Contrato:** Devuelve un objeto `ComponentLoadResult` que contiene:
    - `ComponentToRender`: El componente de React listo para ser renderizado.
    - `componentProps`: El objeto de props de mock.
    - `entry`: La entrada del registro original para metadatos adicionales.

## 3. Contrato de API y Consumidores

- **Función Exportada:** `async function loadComponentAndProps(componentName: string): Promise<ComponentLoadResult>`
- **Consumidor Principal:** El único consumidor legítimo y diseñado para este aparato es el Server Component `ComponentCanvas.tsx` (`/src/components/features/dev-tools/ComponentCanvas.tsx`). Cualquier otro uso es un anti-patrón.

## 4. Directiva Crítica de Seguridad Arquitectónica: El Guardián de la Frontera `"server-only"`

Este aparato es un **módulo de servidor puro**. Su código contiene la directiva `"server-only"` y utiliza APIs (como la importación dinámica de `import()`) que solo están disponibles en el entorno de Node.js.

### El Anti-Patrón: Contaminación por "Barrel File"

El riesgo más crítico asociado con este aparato es su importación indirecta desde un Componente de Cliente. Esto ocurre a través de la siguiente cadena de contaminación:

1.  Un **Componente de Cliente** (`"use client"`) importa un componente `X` desde un "barrel file" (ej. `.../dev-tools/index.ts`).
2.  Ese **"barrel file"** exporta tanto el componente `X` como otros aparatos del módulo, incluyendo `ComponentCanvas.tsx`.
3.  `ComponentCanvas.tsx` (un Server Component) importa `loadComponentAndProps` desde `ComponentLoader.ts`.
4.  `ComponentLoader.ts` es un **Módulo de Servidor**.

**Resultado:** El compilador de Next.js, al intentar empaquetar el Componente de Cliente del paso 1, sigue la cadena de importación a través del "barrel file" e intenta incluir `ComponentLoader.ts` en el bundle del cliente, lo que resulta en un **fallo de build fatal**.

### **Regla Arquitectónica Inmutable:**

**NINGÚN Componente de Cliente (`"use client"`) debe importar, ni directa ni indirectamente, NADA desde un "barrel file" (`index.ts`) que a su vez exporte `ComponentLoader.ts` o cualquier otro módulo que dependa de él.** Las importaciones desde Componentes de Cliente a componentes dentro del dominio `dev-tools` deben ser **quirúrgicas y directas** al archivo específico del componente deseado (ej. `.../dev-tools/DeveloperErrorDisplay.tsx`).

## 5. Relaciones con el Ecosistema

- **Depende de:**
  - `ComponentRegistry.ts`: Para obtener los metadatos del componente a cargar.
  - `utils/component-props.ts`: Para generar los datos de mock.
  - `logging.ts`: Para la observabilidad de su ejecución.
- **Consumido por:**
  - `ComponentCanvas.tsx`: Su único cliente directo y soberano.
- **Relación de Riesgo Indirecta:**
  - `dev-tools/index.ts`: El "barrel file" que, si se consume incorrectamente, causa la contaminación de fronteras.

## 6. Cumplimiento de los Pilares de Calidad

- ✅ **Pilar I (SRP):** Cumplimiento total. Su única responsabilidad es cargar componentes.
- ✅ **Pilar II (Type Safety):** Cumplimiento total. Utiliza tipos estrictos y contratos definidos.
- ✅ **Pilar III (Observability):** Cumplimiento total. Está instrumentado con `logger` para trazar su ejecución.
- ✅ **Pilar VII (Arquitectura):** El aparato en sí mismo cumple con la arquitectura al declararse correctamente como `"server-only"`. El riesgo reside en el consumo incorrecto por parte de otros aparatos, lo cual se aborda en la Directiva de Seguridad de este documento.

---
