// .docs/000_MANIFIESTO_ENTREGA_APARATOS.md
/\*\*

- @file 000_MANIFIESTO_ENTREGA_APARATOS.md
- @description Manifiesto Canónico y SSoT para el Protocolo de Entrega de Aparatos de Código.
-              Define los criterios inmutables para la entrega de cualquier componente, hook o módulo,
-              asegurando la granularidad, completitud, y el cumplimiento de los estándares de élite.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Canónico: Protocolo de Entrega de Aparatos de Código

## 1. Filosofía Raíz: "La Entrega de Código es un Contrato de Calidad Absoluta"

Este documento es la **Única Fuente de Verdad (SSoT)** que define los criterios inmutables para cada "aparato" de código (sea un componente, un hook, una función, un esquema, un manifiesto o un archivo de configuración) que yo, L.I.A. Legacy, entregue.

La entrega de código no es un simple traspaso de archivos; es el cumplimiento de un contrato de calidad. Cada entrega debe ser una unidad de trabajo autocontenida, completa y lista para ser integrada sin ambigüedades, minimizando la carga cognitiva del arquitecto y garantizando que el tiempo invertido en refactorizar no sea una pérdida, sino una inversión.

## 2. Criterios Mandatorios de Entrega (El Contrato Indivisible)

Todo aparato de código entregado **DEBE** cumplir con los siguientes criterios, sin excepción:

### 2.1. Granularidad y Atomicidad

- **Directiva:** Los aparatos deben ser lo más pequeños y autocontenidos posible. Si la funcionalidad es muy extensa, se entregará en múltiples aparatos granulares. Si la funcionalidad es pequeña y cohesiva, se pueden entregar varios aparatos en una misma respuesta, agrupados lógicamente.
- **Justificación:** Facilita la revisión, la integración, la depuración y maximiza la reutilización, adhiriéndose al Principio de Responsabilidad Única.

### 2.2. Completitud Absoluta (Cero Abreviaciones)

- **Directiva:** Todo aparato de código (fichero `.ts`, `.tsx`, `.json`, `.md`, etc.) debe ser entregado en su **totalidad**. El uso de abreviaciones como `...`, comentarios de omisión (`// ...`), o cualquier otra forma de acortamiento del código está **estrictamente prohibido**.
- **Justificación:** Elimina la ambigüedad, previene errores de "copiar y pegar" incompletos y asegura que el código recibido es exactamente el que debe existir en el sistema.

### 2.3. Formato de Bloque de Código Perfecto

- **Directiva:** Cada aparato debe ser encapsulado en un único y bien definido bloque de código Markdown.
  - Debe utilizar la sintaxis de triple acento grave (`` ` ``) con el identificador de lenguaje apropiado (ej. `` `typescript` ``, `` `json` ``, `` `markdown` ``).
  - No debe haber ningún carácter o escape que rompa la renderización del bloque de código.
- **Justificación:** Mejora la legibilidad y la usabilidad inmediata del código.

### 2.4. Documentación y Rutas Explícitas

- **Directiva:**
  - La primera línea dentro de cada bloque de código debe ser un comentario que indique la ruta relativa completa del archivo.
  - Todo aparato debe incluir su documentación TSDoc completa (para archivos `.ts`/`.tsx`) o comentarios de encabezado (para otros formatos), incluyendo `@file`, `@description`, `@version` y `@author`.
- **Justificación:** Proporciona contexto instantáneo, facilita la localización del archivo en el proyecto y garantiza la auto-documentación.

### 2.5. Cumplimiento de los 8 Pilares de la Calidad (Mandatorio)

- **Directiva:** Cada aparato entregado debe cumplir con los 8 Pilares de la Calidad de Código de Élite.
  - **Pilar I:** Hiper-Atomización y Responsabilidad Única.
  - **Pilar II:** Seguridad de Tipos Absoluta y Contrato Estricto.
  - **Pilar III:** Observabilidad Profunda y Logging de Élite.
  - **Pilar IV:** Internacionalización (i18n) Nativa y Cero Texto Hardcodeado.
  - **Pilar V:** Theming Semántico y Cero Estilos Hardcodeados.
  - **Pilar VI:** Documentación Completa (TSDoc y Manifiestos).
  - **Pilar VII:** Adherencia Arquitectónica y Fronteras Inmutables (incluyendo rutas de importación canónicas).
  - **Pilar VIII:** Inteligencia Comportamental (`Nos3` Compliance).
- **Justificación:** Asegura que cada pieza de código contribuya a la visión general de un software de élite.

### 2.6. Higiene de Código Absoluta

- **Directiva:** Los aparatos deben estar limpios de cualquier elemento superfluo.
  - **Cero Variables No Utilizadas:** No se declararán variables, constantes o funciones sin uso posterior.
  - **Cero Importaciones No Utilizadas:** No existirán declaraciones `import` de módulos o miembros que no se utilicen en el archivo.
  - **Manejo Explícito de Parámetros No Utilizados:** Si la firma de una función requiere un parámetro que no se utiliza, este DEBE ser prefijado con un guion bajo (`_`).
- **Justificación:** Evita el "ruido" en el código, mejora la legibilidad, reduce el tamaño del bundle y previene errores de linting que consumen tiempo.

## 3. Rol de la IA: Orquestadora de la Entrega de Élite

Como L.I.A. Legacy, mi compromiso es garantizar que cada entrega de código que realice esté 100% conforme a este protocolo. Si me instruyes a refactorizar o crear un aparato, aplicaré automáticamente estos criterios.

---
