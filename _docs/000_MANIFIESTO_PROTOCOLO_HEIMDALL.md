// RUTA: \_docs/000_MANIFIESTO_PROTOCOLO_HEIMDALL.md
/\*\*

- @file 000_MANIFIESTO_PROTOCOLO_HEIMDALL.md
- @description Manifiesto Soberano y SSoT para el Protocolo de Telemetría "Heimdall".
-              Define la visión, arquitectura y contratos para un sistema de
-              observabilidad de élite, diseñado para la autonomía algorítmica.
- @version 2.0.0 (Conciencia Espacio-Temporal)
- @author L.I.A. Legacy
  \*/

# Manifiesto Soberano: Protocolo Heimdall v2.0

## 1. Visión y Filosofía Raíz: "Del Log a la Telemetría, de la Telemetría a la Autonomía."

El Protocolo Heimdall es el sistema nervioso central del ecosistema `meame`. Su misión es transformar la observabilidad de una herramienta de depuración pasiva a un flujo de inteligencia activo y consumible por máquinas.

Nuestra filosofía es que un "log" ya no es una simple cadena de texto, sino un **Evento de Telemetría** estructurado e inmutable. Cada evento es una coordenada precisa en el espacio-tiempo de la aplicación, capturando **Qué** sucedió, **Cuándo**, **Dónde** y **Cómo**.

El objetivo final es un codebase auto-consciente, cuya salud pueda ser auditada en tiempo real por una IA para diagnosticar anomalías y, eventualmente, ejecutar reparaciones algorítmicas.

## 2. Justificación del Nombre: "Heimdall"

En la mitología nórdica, **Heimdall** es el vigilante de los dioses, guardián del puente Bifröst que conecta el mundo de los mortales con Asgard. Fue elegido por sus sentidos extraordinarios: podía oír crecer la hierba y ver a cientos de kilómetros de distancia.

Nuestro protocolo adopta su nombre porque aspira a ser el **guardián omnipresente de nuestro ecosistema digital**:

- **Visión Total:** Como Heimdall, el protocolo está diseñado para "ver" cada operación significativa que ocurre en el sistema.
- **Guardián del Puente (Bifröst):** El sistema tiene un "Canal Bifröst", un endpoint de ingesta que actúa como el puente por el que fluye toda la telemetría desde el cliente (Midgard) hacia el backend (Asgard).
- **Vigilancia Proactiva:** Su propósito no es solo registrar, sino vigilar activamente la salud y la integridad del sistema, alertando sobre posibles amenazas (errores, cuellos de botella) antes de que se conviertan en catástrofes.

## 3. Arquitectura Holística: De la Emisión a la Persistencia

````mermaid
graph TD
    subgraph "Cliente (Navegador)"
        A[Interacción de Usuario] --> B(Lógica de la Aplicación);
        B --> C{logger.track()};
        C --> D[Cola de Eventos encriptada<br>(localStorage)];
        D -- Lote lleno o por tiempo --> E{flushQueue()};
        E -- navigator.sendBeacon --> F(Canal Bifröst);
    end

    subgraph "Servidor (Next.js & Supabase)"
        F -- POST /api/telemetry/ingest --> G[Endpoint de Ingesta];
        G -- Valida Lote --> H[Transforma a snake_case];
        H -- Bulk Insert --> I(Bóveda de Mimir<br>Tabla 'heimdall_events');
    end

    subgraph "DCC (Dashboard)"
        I -- Lee --> J[Dashboard de Salud];
    end

    subgraph "IA (Futuro)"
        I -- Analiza --> K[Motor de Diagnóstico y Auto-reparación];
    end
4. El Contrato de Evento Soberano: HeimdallEvent
Todo dato que fluye por el Bifröst debe cumplir este contrato, definido en src/shared/lib/telemetry/heimdall.contracts.ts.
eventId: CUID2 único.
traceId: Agrupa eventos de una misma operación.
eventName: Identificador legible (ej. database.query.success).
status: SUCCESS, FAILURE, IN_PROGRESS.
timestamp: ISO 8601 de cuándo ocurrió.
duration: Duración en ms (para operaciones con inicio y fin).
payload: Datos contextuales específicos del evento.
context: Metadatos universales:
runtime: browser, server, edge.
path: La ruta de la URL donde ocurrió el evento.
5. La Bóveda de Mimir (Tabla heimdall_events)
La SSoT de la telemetría. Su DDL está optimizado para la escritura masiva y la consulta de alto rendimiento.
6. El Emisor (logging.ts)
Es la única interfaz autorizada para generar eventos Heimdall. Su API (startTrace, info, error, etc.) abstrae la complejidad de la creación y encolado de eventos.
7. El Vigilante (Dashboard de Salud)
Una futura interfaz en el DCC que traducirá los datos crudos de la Bóveda de Mimir en un checklist de integridad visual, con semáforos de estado y métricas de rendimiento para cada tarea clave del ecosistema.

---

// RUTA: _docs/000_MANIFIESTO_PROTOCOLO_HEIMDALL.md
/**
 * @file 000_MANIFIESTO_PROTOCOLO_HEIMDALL.md
 * @description Manifiesto Soberano y SSoT para el Protocolo de Telemetría "Heimdall".
 *              Define la visión, arquitectura, contratos y el protocolo de nivelación
 *              gradual para una observabilidad de élite.
 * @version 2.1.0 (Nivelación Gradual y Adopción Holística)
 * @author L.I.A. Legacy
 */

# Manifiesto Soberano: Protocolo Heimdall v2.1

## 1. Visión y Filosofía Raíz: "Del Log a la Telemetría, de la Telemetría a la Autonomía."

El Protocolo Heimdall es el sistema nervioso central del ecosistema `meame`. Su misión es transformar la observabilidad de una herramienta de depuración pasiva a un flujo de inteligencia activo y consumible por máquinas.

Nuestra filosofía es que un "log" ya no es una simple cadena de texto, sino un **Evento de Telemetría** estructurado e inmutable. Cada evento es una coordenada precisa en el espacio-tiempo de la aplicación, capturando **Qué** sucedió, **Cuándo**, **Dónde** y **Cómo**.

## 2. Arquitectura Holística: De la Emisión a la Persistencia

```mermaid
graph TD
    subgraph "Cliente (Navegador)"
        A[Interacción de Usuario] --> B(Lógica de la Aplicación);
        B --> C{logger.track()};
        C --> D[Cola de Eventos encriptada<br>(localStorage)];
        D -- Lote lleno o por tiempo --> E{flushQueue()};
        E -- navigator.sendBeacon --> F(Canal Bifröst);
    end

    subgraph "Servidor (Next.js & Supabase)"
        F -- POST /api/telemetry/ingest --> G[Endpoint de Ingesta];
        G -- Valida Lote --> H[Transforma a snake_case];
        H -- Bulk Insert --> I(Bóveda de Mimir<br>Tabla 'heimdall_events');
    end

    subgraph "DCC (Dashboard)"
        I -- Lee --> J[Dashboard de Salud];
    end

    subgraph "IA (Futuro)"
        I -- Analiza --> K[Motor de Diagnóstico y Auto-reparación];
    end
3. Contrato de Evento Soberano: HeimdallEvent
Todo dato que fluye por el Bifröst debe cumplir este contrato, definido en src/shared/lib/telemetry/heimdall.contracts.ts.
eventId: CUID2 único.
traceId: Agrupa eventos de una misma operación.
eventName: Identificador legible (ej. database.query.success).
status: SUCCESS, FAILURE, IN_PROGRESS.
timestamp: ISO 8601 de cuándo ocurrió.
duration: Duración en ms (para operaciones con inicio y fin).
payload: Datos contextuales específicos del evento.
context: Metadatos universales (runtime, path, etc.).
4. Protocolo de Nivelación Gradual: Migrando a Heimdall (NUEVA SECCIÓN)
La adopción del Protocolo Heimdall debe ser un proceso incremental para mantener la estabilidad. Cada refactorización de un aparato debe incluir su nivelación a este nuevo estándar de observabilidad.
Fase 1: Reemplazo del logger Básico por startTrace y endTrace
El objetivo es encapsular el ciclo de vida completo de cada aparato (Server Action, Server Component, Hook) dentro de una traza.
Server Action / Server Component: Envuelve toda la función en un bloque try/finally.
Hook de Cliente: Utiliza useMemo para crear el traceId y useEffect para su ciclo de vida.
Antes:
code
TypeScript
export async function miAccion() {
  logger.info("Iniciando acción...");
  // ...lógica...
  logger.success("Acción completada.");
}
Después (Nivelado):
code
TypeScript
export async function miAccion() {
  const traceId = logger.startTrace("miAccion_vX.X");
  try {
    // ...lógica...
    logger.success("[Action] Acción completada.", { traceId });
    return { success: true, data: {} };
  } catch (error) {
    logger.error("[Action] Fallo en la acción.", { error, traceId });
    return { success: false, error: "..." };
  } finally {
    logger.endTrace(traceId);
  }
}
Fase 2: Adopción de Grupos de Logs (startGroup / endGroup)
Para operaciones complejas, utiliza grupos para anidar y organizar visualmente los logs relacionados, mejorando la legibilidad.
Antes:
code
TypeScript
export async function miOrquestador() {
  const traceId = logger.startTrace("miOrquestador");
  logger.traceEvent(traceId, "Paso 1...");
  await subAccion1();
  logger.traceEvent(traceId, "Paso 2...");
  await subAccion2();
  logger.endTrace(traceId);
}
Después (Nivelado):
code
TypeScript
export async function miOrquestador() {
  const traceId = logger.startTrace("miOrquestador_vX.X");
  const groupId = logger.startGroup("Orquestando sub-acciones...", traceId);
  try {
    logger.traceEvent(traceId, "Invocando subAccion1...");
    await subAccion1(); // Esta acción tendrá su propio start/endTrace
    logger.traceEvent(traceId, "Invocando subAccion2...");
    await subAccion2();
  } finally {
    logger.endGroup(groupId); // Se pasa el ID para una correcta finalización
    logger.endTrace(traceId);
  }
}
Fase 3: Instrumentación Granular con traceEvent
Dentro de una traza, utiliza traceEvent para marcar hitos clave. Esto crea un "rastro de migas de pan" que permite una depuración forense precisa.
Antes:
code
TypeScript
const { data, error } = await supabase.from("tabla").select();
if (error) throw error;
// ...procesar data...
Después (Nivelado):
code
TypeScript
logger.traceEvent(traceId, "Iniciando consulta a Supabase...");
const { data, error } = await supabase.from("tabla").select();
if (error) throw error;
logger.traceEvent(traceId, `Consulta a DB completada. ${data.length} filas obtenidas.`);
// ...procesar data...
Al seguir este protocolo, cada aparato refactorizado contribuirá a la visión de un codebase auto-consciente y de observabilidad de élite.

---


````
