// \_docs/000_MANIFIESTO_REACT_HOOKS.md
/\*\*

- @file 000_MANIFIESTO_REACT_HOOKS.md
- @description Manifiesto Canónico y SSoT para la Arquitectura de Hooks de React.
-              Define la filosofía, los patrones de diseño y los principios que
-              rigen toda la lógica y gestión de estado del lado del cliente.
- @version 1.0.0
  _@author RaZ Podestá - MetaShark Tech (Inteligencia Artificial - Asistente Personalizado)
  _/

# Manifiesto Canónico: La Arquitectura de Hooks - El Cerebro del Cliente

## 1. Filosofía Raíz: "Lógica Encapsulada, Componentes Declarativos, Estado Atómico."

Este documento es la Única Fuente de Verdad (SSoT) que rige la arquitectura de los **Hooks de React personalizados** (`src/shared/hooks/`). Esta capa es el "cerebro" del cliente, responsable de toda la lógica, la gestión de estado y los efectos secundarios.

Nuestra filosofía es la **Separación de Intereses Extrema**: los componentes de React deben ser aparatos de presentación puros y declarativos, delegando la complejidad a esta capa de hooks. Un componente _describe_ la UI; un hook _orquesta_ su comportamiento.

## 2. Patrones Arquitectónicos de Élite

Toda la lógica del lado del cliente se implementa a través de un conjunto de patrones de hooks soberanos y reutilizables.

### 2.1. Patrón 1: Stores Atómicos de Zustand (Estado Global Granular)

El estado global se gestiona a través de stores de Zustand pequeños y enfocados, siguiendo el Principio de Responsabilidad Única.

- **Atomicidad:** Cada dominio (`cart`, `workspace`) o incluso cada paso de un flujo complejo (`step0`, `step1` en la SDC) tiene su propio store. Esto previene re-renderizados innecesarios y simplifica la gestión del estado.
- **Persistencia Resiliente:** Se utiliza el middleware `persist` de Zustand para guardar el estado crítico (como los borradores de campaña) en `localStorage`. Esto crea una experiencia de usuario tolerante a fallos, donde el trabajo nunca se pierde.

### 2.2. Patrón 2: El Hook "Cerebro" (Orquestador de Lógica de Negocio)

Los hooks con el sufijo `-logic` o que encapsulan un flujo completo (ej. `usePromptCreator`, `useCampaignLifecycle`) actúan como el "cerebro" que conecta la UI con las Server Actions.

- **Encapsulación Total:** Gestionan la configuración de `react-hook-form`, la validación con `zodResolver`, el estado de carga (`useTransition`), la invocación de la Server Action y el feedback al usuario (`toast`).
- **Componentes Puros:** Este patrón permite que los componentes de formulario (`PromptCreatorForm`) sean completamente "tontos" (dumb components), recibiendo todo el estado y los manejadores de eventos como props.

### 2.3. Patrón 3: El Hook Orquestador de Efectos

Para gestionar múltiples efectos secundarios complejos, se utiliza un hook orquestador.

- **Ejemplo:** `useProducerLogic` es la SSoT para la lógica de tracking. No implementa el tracking directamente; su única responsabilidad es centralizar la lógica condicional (consentimiento de cookies, interacción del usuario) para activar o desactivar una cascada de hooks atómicos más pequeños (`useUtmTracker`, `useYandexMetrika`, `useNos3Tracker`).

### 2.4. Patrón 4: El Hook de Sincronización Inteligente (Caché de Datos)

Para datos que cambian con poca frecuencia pero deben estar actualizados, se utiliza una estrategia de caché inteligente.

- **Ejemplo:** `useCogniReadCache` implementa un motor de sincronización diferencial: 1. **Hidratación Instantánea:** Lee los datos de `localStorage` para un renderizado inmediato. 2. **Sincronización de Índice:** Obtiene un "índice de versiones" ligero del servidor. 3. **Obtención Delta:** Compara los índices y solicita **solo** los registros nuevos o modificados. 4. **Actualización Atómica:** Actualiza el estado de la UI y la caché de `localStorage`.
  Este patrón proporciona una experiencia de usuario casi nativa, minimizando las solicitudes de red.

### 2.5. Patrón 5: Encapsulación de Lógica de UI Compleja

Para interacciones de UI muy complejas (WebGL, animaciones avanzadas), la lógica se aísla en su propio hook.

- **Ejemplo:** `use-light-rays`, `use-bento-grid-interaction` y `use-cinematic-renderer` encapsulan toda la lógica de bajo nivel (Three.js, OGL, GSAP), permitiendo que los componentes de React que los consumen (`<LightRays />`, `<MagicBentoGrid />`) sigan siendo simples componentes declarativos.

## 3. Principios Inmutables

- **Unidireccionalidad:** El flujo de datos es estrictamente unidireccional: `Server Component -> Client Component -> Hook -> Server Action -> Base de Datos`.
- **Reglas de los Hooks:** Se respeta de forma inmutable el contrato de los Hooks de React. Todas las llamadas a hooks se realizan en el nivel superior de los componentes de función.
- **Observabilidad:** Cada hook de lógica de negocio está instrumentado con el `logger` para trazar su ciclo de vida, acciones y el resultado de las operaciones asíncronas.

---
