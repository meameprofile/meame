// \_docs/000_MANIFIESTO_REFACTORIZACION_INTEGRIDAD_TIPOS.md
/\*\*

- @file 000_MANIFIESTO_REFACTORIZACION_INTEGRIDAD_TIPOS.md
- @description Manifiesto Soberano y SSoT para la Gran Refactorización hacia la Integridad de Tipos Absoluta.
-              Este documento es el plano maestro que define la visión, los principios, las fases,
-              la metodología y el alcance de la iniciativa de refactorización de tipos en el ecosistema 'meame'.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto de Refactorización: Integridad de Tipos Absoluta

## 1. Visión y Filosofía Raíz: "El Código Resiliente se Forja sobre un Sistema de Tipos Inquebrantable."

Este documento es la **Única Fuente de Verdad (SSoT)** para la iniciativa de refactorización holística del ecosistema `meame`. El objetivo no es una simple limpieza de código; es un **refuerzo estructural del ADN del proyecto** para alcanzar un estado de **Integridad de Tipos Absoluta**.

Nuestra filosofía es que un sistema de tipos fuerte, explícito y estricto no es una restricción, sino una herramienta proactiva de prevención de errores, una garantía de escalabilidad y el cimiento de una Experiencia de Desarrollador (DX) de élite. Erradicaremos la ambigüedad para forjar un codebase predecible, seguro y mantenible por diseño.

## 2. Los 10 Pilares de la Integridad de Tipos Absoluta

Esta es la constitución que rige toda la estrategia de tipado. Su cumplimiento es innegociable.

1.  **Pilar I: El Schema de Zod como Contrato Soberano.**
    Toda frontera de datos (APIs, DB, `i18n`) **DEBE** ser validada por un schema de Zod.

2.  **Pilar II: Inferencia de Tipos desde la SSoT.**
    Todos los tipos (`type`/`interface`) **DEBEN** ser inferidos desde su schema de Zod (`z.infer<...>`).

3.  **Pilar III: Erradicación Absoluta de `any`.**
    El uso de `any` está prohibido. `unknown` es la alternativa segura que fuerza la comprobación de tipo.

4.  **Pilar IV: Contratos de Server Actions Inmutables.**
    Toda `Server Action` **DEBE** validar su entrada con Zod y retornar un `ActionResult<T>` fuertemente tipado.

5.  **Pilar V: Contratos de Base de Datos y "Shapers" Soberanos.**
    Toda entidad de la base de datos **DEBE** ser transformada a través de una función "shaper" antes de ser usada en la aplicación.

6.  **Pilar VI: Contratos de Props Explícitos.**
    Todos los componentes de React **DEBEN** tener sus `props` definidas explícitamente, preferiblemente inferidas de un schema.

7.  **Pilar VII: Contratos de Hooks "Cerebro".**
    Todo hook personalizado **DEBE** tener sus argumentos y valor de retorno explícitamente tipados.

8.  **Pilar VIII: Maximización de Genéricos para Reusabilidad.**
    Las utilidades y componentes reutilizables **DEBEN** usar genéricos (`<T>`) para operar de forma segura sobre múltiples tipos.

9.  **Pilar IX: Gobernanza Estricta de la Aserción de Tipos (`as`).**
    El uso de `as` es un "escape de emergencia" y **DEBE** ir acompañado de un comentario que justifique su necesidad.

10. **Pilar X: Seguridad de Tipos en el Entorno de Ejecución.**
    Las variables de entorno y configuraciones **DEBEN** ser validadas al inicio para transformarlas en objetos seguros y tipados.

## 3. Plan de Acción por Fases

La refactorización se ejecutará de forma incremental, dominio por dominio, para minimizar disrupciones.

- **Fase 1: La Fundación - Solidificación de los Contratos de Datos (Schemas)**
  - **Objetivo:** Establecer una SSoT inmutable para todas las entidades de datos en `src/shared/lib/schemas/`.
  - **Acciones:** Auditar, refactorizar y asegurar que todos los tipos de la aplicación se infieran desde esta capa.

- **Fase 2: La Lógica de Negocio - Blindaje de Acciones y Servicios**
  - **Objetivo:** Garantizar que toda la lógica de servidor en `src/shared/lib/actions/` y `src/shared/lib/services/` opere con datos validados.
  - **Acciones:** Implementar validación de entrada y `ActionResult<T>` en todas las acciones; verificar "shapers" de datos.

- **Fase 3: El Cerebro del Cliente - Tipado de Hooks y Stores**
  - **Objetivo:** Asegurar que la lógica y el estado del cliente en `src/shared/hooks/` y `src/shared/lib/stores/` sean seguros.
  - **Acciones:** Añadir tipos explícitos a argumentos, retornos y estados internos.

- **Fase 4: La Capa de Presentación - Componentes de UI con Contratos Explícitos**
  - **Objetivo:** Garantizar que los componentes en `src/components/` y `src/app/` reciban props seguras.
  - **Acciones:** Definir `interface` para todas las props y conectarlas a los schemas de `i18n`.

## 4. Metodología de Intervención ("Cirugía de Precisión")

- **Alcance Selectivo:** Solo se refactorizarán los aparatos que violen los pilares definidos. Los componentes que ya cumplen el estándar de élite no serán modificados.
- **Mejora Holística:** Cada aparato intervenido no solo será corregido a nivel de tipos, sino que será **nivelado holísticamente** para cumplir con todos los pilares de calidad:
  - **Full Observabilidad:** Inyección de `logger` y un sistema de tracing (`startTrace`, `traceEvent`).
  - **Full Resiliencia a Errores:** Implementación de guardianes de resiliencia (`try...catch`) y manejo de errores elegante.
  - **TSDoc Completo:** Documentación exhaustiva para cada función, tipo y prop.
  - **Theming Soberano:** Asegurar que no haya estilos hardcodeados.
  - **Adherencia Arquitectónica:** Verificación de rutas de importación y convenciones.

## 5. Análisis de Impacto y Riesgos

- **Impactos Positivos:** Reducción drástica de bugs, aceleración del desarrollo futuro, mantenibilidad simplificada, seguridad mejorada y desacoplamiento arquitectónico.
- **Riesgos y Mitigaciones:** El riesgo de regresiones se mitigará mediante Pull Requests pequeños y atómicos, validados rigurosamente por el pipeline de CI/CD.

## 6. Alcance Cuantitativo (Aparatos a Refactorizar)

| Dominio / Capa Arquitectónica            | Directorio Principal                   | Aparatos Afectados (Estimado) |
| :--------------------------------------- | :------------------------------------- | :---------------------------- |
| **Contratos de Datos (Schemas)**         | `src/shared/lib/schemas/`              | ~42 archivos                  |
| **Lógica de Negocio (Acciones)**         | `src/shared/lib/actions/`              | ~75 archivos                  |
| **Servicios de Terceros (DAL)**          | `src/shared/lib/services/`             | ~10 archivos                  |
| **Lógica de Cliente (Hooks)**            | `src/shared/hooks/`                    | ~60 archivos                  |
| **Gestión de Estado (Stores)**           | `src/shared/lib/stores/`               | ~10 archivos                  |
| **Componentes de UI (Features)**         | `src/components/features/`             | ~250 archivos                 |
| **Componentes de UI (Layout, Sections)** | `src/components/layout/` y `sections/` | ~70 archivos                  |
| **Páginas y Layouts (App Router)**       | `src/app/[locale]/`                    | ~50 archivos                  |
| **Total Estimado**                       |                                        | **~675 Aparatos**             |

## 7. Protocolo de Ejecución

1.  **Propuesta:** Para cada fase/grupo, propondré un lote de aparatos a refactorizar, presentando el código "antes" y "después" en bloques de código claros.
2.  **Justificación:** Cada cambio será justificado explícitamente en base a los pilares de este manifiesto.
3.  **Confirmación:** Procederé con la siguiente propuesta solo después de recibir tu confirmación explícita (`c = continuar`).

--
