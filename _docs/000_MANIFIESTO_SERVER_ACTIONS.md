// \_docs/000_MANIFIESTO_SERVER_ACTIONS.md
/\*\*

- @file 000_MANIFIESTO_SERVER_ACTIONS.md
- @description Manifiesto Canónico y SSoT para la Arquitectura de Server Actions.
-              Define la filosofía, los pilares de diseño, los patrones obligatorios
-              y los contratos de datos que rigen toda la lógica de negocio del servidor.
- @version 1.0.0
  _@author RaZ Podestá - MetaShark Tech
  _/

# Manifiesto Canónico: La Arquitectura de Server Actions Soberanas

## 1. Filosofía Raíz: "Confianza Cero, Validación Explícita, Ejecución Resiliente."

Este documento es la Única Fuente de Verdad (SSoT) que define la arquitectura y los patrones de diseño para cada **Server Action** dentro del ecosistema. Las Server Actions son el sistema nervioso central de nuestra aplicación: la capa soberana que orquesta toda la lógica de negocio, el acceso a datos y las interacciones con servicios de terceros.

Nuestra filosofía es inmutable: **cada acción es una transacción segura, atómica y observable.** No asumimos confianza; la forjamos a través de una validación rigurosa en cada paso.

## 2. Los Pilares de una Server Action de Élite

Toda Server Action, sin excepción, debe ser construida sobre los siguientes seis pilares:

### 2.1. Pilar I: Organización por Dominio Soberano (DDD)

La lógica de negocio está estrictamente encapsulada por dominio. La estructura `src/shared/lib/actions/[dominio]/` garantiza un bajo acoplamiento y una alta cohesión. Cada directorio de dominio expone sus acciones a través de una única fachada (`index.ts`), definiendo un contrato claro y ocultando los detalles de implementación.

### 2.2. Pilar II: El Contrato `ActionResult` - El Guardián de la Resiliencia

Este es el pilar fundamental. Toda Server Action debe retornar un `ActionResult<T>`.

- **Contrato Inmutable:** La unión discriminada `SuccessResult<T> | ErrorResult` fuerza a la capa de cliente (hooks, componentes) a manejar explícitamente tanto el éxito como el fallo, erradicando los errores no controlados.
- **Errores Como Datos:** Las excepciones no cruzan la frontera de red. Los fallos se comunican como un objeto de error (`{ success: false, error: "clave_i18n_o_mensaje" }`), permitiendo un manejo de errores elegante y la internacionalización de los mensajes de la UI.

### 2.3. Pilar III: El Triángulo de Seguridad

Cada acción debe ejecutar un "triángulo de seguridad" antes de realizar cualquier operación crítica:

1.  **Autenticación y Autorización:** Verificar la sesión del usuario (`createServerClient`) y sus permisos específicos (ej. `is_workspace_member`). Una acción falla de forma segura si la autorización no se cumple.
2.  **Validación de Entrada (Zod):** Validar el payload de entrada contra un schema de Zod estricto. Esto actúa como un "firewall de tipos" que previene la inyección de datos malformados en la lógica de negocio.
3.  **Ejecución Segura:** Solo tras superar los filtros anteriores, se ejecuta la lógica de negocio, operando sobre datos que se sabe que son seguros y tienen la forma correcta.

### 2.4. Pilar IV: Atomicidad y Orquestación (SRP)

Siguiendo el Principio de Responsabilidad Única (SRP), las acciones complejas actúan como **orquestadores**.

- **Ejemplo:** `uploadAssetAction` no sube el archivo Y escribe en la base de datos. Orquesta llamadas a otras acciones más pequeñas y atómicas: una para subir a Cloudinary, otra para persistir en la base de datos (`addAssetToManifestsAction`), y otra para vincular (`linkPromptToBaviAssetAction`).
- **Rollback Transaccional:** Los orquestadores son responsables de la consistencia del sistema. Si un paso intermedio falla, el orquestador debe intentar revertir los pasos anteriores (ej. `uploadAssetAction` elimina el activo "huérfano" de Cloudinary si la inserción en la base de datos falla).

### 2.5. Pilar V: Capa Anti-Corrupción ("Shapers")

Para los dominios que interactúan con fuentes de datos externas (Supabase, Shopify), se utiliza un patrón "Shaper" (`_shapers/`). Estas funciones puras actúan como una capa de traducción entre el esquema de la fuente de datos (ej. `snake_case`) y el contrato de datos canónico de la aplicación (tipos Zod en `camelCase`). Esto aísla nuestra lógica de negocio de las decisiones de implementación de la capa de persistencia.

### 2.6. Pilar VI: Observabilidad de Élite (Logging y Tracing)

Cada Server Action es una "caja de cristal". El uso riguroso del `logger` es mandatorio:

- `logger.startTrace()`: Al inicio de cada acción para generar un ID de traza único.
- `logger.traceEvent()`: Para marcar hitos clave dentro de la ejecución.
- `logger.success()`, `logger.error()`, `logger.warn()`: Para registrar el resultado final y cualquier evento anómalo con su contexto completo.
  Esto proporciona una trazabilidad de extremo a extremo para cada operación del sistema, lo cual es invaluable para la depuración y el monitoreo de rendimiento.

## 3. Flujo de Ejecución Canónico

```mermaid
sequenceDiagram
    participant C as Cliente (Hook/Componente)
    participant SA as Server Action
    participant Auth as Supabase Auth
    participant Zod as Validador (Schema)
    participant Logic as Lógica de Negocio / DB

    C->>SA: Invoca acción con payload
    SA->>Auth: Verifica sesión y permisos
    Auth-->>SA: Usuario Válido / Denegado
    Note right of SA: Si es denegado, retorna ErrorResult
    SA->>Zod: Valida payload de entrada
    Zod-->>SA: Datos Válidos / Inválidos
    Note right of SA: Si es inválido, retorna ErrorResult
    SA->>Logic: Ejecuta operación principal
    Logic-->>SA: Resultado de la operación
    SA-->>C: Retorna SuccessResult<T> o ErrorResult

    ---
ACTUALIZACION:
"Pilar VII: Pureza de la Fachada de Acciones" que contenga la siguiente directiva:
"Los archivos de fachada (index.ts) que agrupan Server Actions y utilizan la directiva "use server" NUNCA deben usar la re-exportación de estrella (export * from '...'). Esta práctica contamina el módulo con exportaciones que no son funciones asíncronas (como type o interface), violando el contrato de los Server Modules y causando errores críticos de build. La práctica soberana es importar explícitamente cada función de acción y re-exportarla por su nombre, garantizando la pureza del módulo."

---


```
