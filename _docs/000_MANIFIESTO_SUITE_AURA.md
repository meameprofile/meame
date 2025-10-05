# APARATO 1: EL MANIFIESTO SOBERANO Y AUTOCONTENIDO

# RUTA: \_docs/000_MANIFIESTO_SUITE_AURA.md (Reemplaza al manifiesto de Visitor Intelligence anterior)

/\*\*

- @file 000_MANIFIESTO_SUITE_AURA.md
- @description Manifiesto Soberano y SSoT para la Suite de Inteligencia "Aura" v3.0.
-              Define la arquitectura holística, desde la recolección de datos hasta la
-              toma de decisiones asistida por IA para la optimización de la Experiencia
-              del Creador (CXO) y la Tasa de Conversión (CRO).
- @version 3.0 (Hyper-Holistic & AI-Powered)
- @author RaZ Podestá - MetaShark Tech & RaZ Podestá
  \*/

# Manifiesto Soberano: La Suite de Inteligencia Aura v3.0

## 1. Visión y Filosofía Raíz: Del Dato a la Decisión, de la Decisión a la Dominancia

La misión de la Suite Aura es ser el **sistema nervioso central del ecosistema `meame`**. No nos limitamos a registrar el pasado; lo analizamos para predecir y dar forma al futuro. Transformamos cada clic y cada acción, tanto de **Creadores (Tenants)** como de **Compradores (Visitantes)**, en una ventaja competitiva medible.

Nuestra filosofía es la **Inteligencia de Doble Embudo**: optimizamos simultáneamente la plataforma para quienes crean (CXO) y para quienes compran (CRO), entendiendo que la excelencia en uno potencia el éxito en el otro.

## 2. Arquitectura Holística de Cuatro Capas

````mermaid
graph TD
    subgraph Capa 1: El Perfilador (Middleware)
        A[Request Entrante] --> B{visitorIntelligenceHandler};
        B --> C[Genera/Lee Fingerprint];
        C --> D[Captura IP/Geo/UA];
        D --> E[Encripta y Persiste en visitor_sessions];
        E --> F[Enriquece Headers para Próxima Capa];
    end

    subgraph Capa 2: Los Colectores (Cliente)
        G[Interacción del Usuario] --> H{useNos3Tracker (rrweb)};
        G --> I{useAuraTracker};
        H --> J[Graba Experiencia (Cualitativo)];
        I --> K[Rastrea Acciones (Cuantitativo)];
        J --> L["/api/nos3/ingest (Vercel Blob)"];
        K --> M["/api/aura/ingest (Supabase Tables)"];
    end

    subgraph Capa 3: El Motor Analítico (Base de Datos)
        N[Supabase DB] --> O{Función: get_campaign_analytics()};
        O --> P[Agrega Datos de visitor_campaign_events];
        P --> Q[Entrega KPIs a la API];
    end

    subgraph Capa 4: El Motor de Inferencia (IA)
        R[Supabase Cron Job] --> S{Función: analyze_behavior_patterns()};
        S --> T[Consulta Patrones en Tablas de Eventos];
        T --> U{Invoca Edge Function: generate-aura-insight};
        U -- Prompt --> V(Motor TEMEO / Gemini);
        V -- Respuesta JSON --> U;
        U --> W[Inserta Insight en aura_insights];
    end

    F --> G;
    Q --> X[DCC: /analytics];
    W --> X;```

*   **Capa 1: El Perfilador (Middleware):** El guardián que crea el "pasaporte digital" de cada sesión en `public.visitor_sessions`. Es el punto de partida de toda la inteligencia.
*   **Capa 2: Los Colectores (Cliente):**
    *   **`nos3` (rrweb):** El colector *cualitativo*. Graba la experiencia visual del usuario para responder al **"cómo"** y al **"porqué"** de su comportamiento. Utiliza `useNos3Tracker.ts` y almacena los datos en Vercel Blob.
    *   **`Aura`:** El colector *cuantitativo*. Registra eventos de negocio específicos para responder al **"qué"**, **"cuánto"** y **"cuándo"**. Utiliza `useAuraTracker.ts` y almacena los datos en tablas estructuradas de Supabase.
*   **Capa 3: El Motor Analítico (Base de Datos):** El cerebro que procesa los datos crudos. La función `get_campaign_analytics()` agrega millones de eventos en KPIs accionables para el dashboard del DCC.
*   **Capa 4: El Motor de Inferencia (IA):** El estratega proactivo. Una tarea programada (`Cron Job`) analiza periódicamente los datos de comportamiento, utiliza una **Edge Function** para consultar un modelo de IA (`TEMEO`/Gemini) y almacena insights y recomendaciones en la tabla `aura_insights`.

## 3. Infraestructura de Base de Datos Soberana

*   **`public.visitor_sessions`**: La SSoT de todas las sesiones, anónimas e identificadas.
*   **`public.visitor_campaign_events`**: El registro de cada acción del **comprador** en las landing pages. Incluye columnas de atribución (UTMs, referer).
*   **`public.user_activity_events`**: El registro de cada acción del **creador** dentro del DCC.
*   **`public.aura_insights`**: La bóveda de recomendaciones generadas por la IA, listas para ser consumidas por el DCC.

## 4. El Pilar de IA: "Aura Insights" y su Configurabilidad

La inteligencia artificial no es una caja negra. Es una herramienta configurable y transparente.

*   **Lógica Server-Only:** Toda la lógica de construcción de prompts e interacción con la API de Gemini reside exclusivamente en una **Edge Function de Supabase (`generate-aura-insight`)**. Esto garantiza que las claves de API y la lógica de negocio sensible nunca se expongan.
*   **Modelo de IA Configurable:** La Edge Function leerá una configuración (ej. desde una variable de entorno o una tabla de configuración en Supabase) que especificará qué modelo de IA de `TEMEO` utilizar (ej. `gemini-1.5-flash` para velocidad, `gemini-pro` para análisis más profundos). Esto permite un control total y la capacidad de actualizar el modelo sin redesplegar el código.
*   **Interruptor de Activación:** La ejecución del Cron Job que dispara el análisis de la IA será configurable desde el DCC, permitiendo activar o desactivar esta funcionalidad a voluntad.

## 5. El Flujo de Trabajo de Optimización

1.  **Observación:** La Suite Aura recolecta datos de ambos embudos (creadores y compradores).
2.  **Análisis:** El Motor Analítico (DB) y el Motor de Inferencia (IA) procesan los datos.
3.  **Visualización:** El DCC en `/analytics` presenta los KPIs y los "Aura Insights".
4.  **Decisión:** El experto en marketing revisa los gráficos y las recomendaciones de la IA.
5.  **Acción:**
    *   Si un insight de CRO sugiere un problema en una landing page, el marketero puede ver las sesiones de `nos3` correspondientes para entender el "porqué" y luego usar la SDC para corregir el problema.
    *   Si un insight de CXO sugiere una fricción en el DCC, el equipo de producto puede priorizar una mejora en la herramienta.
6.  **Medición:** El ciclo se repite, midiendo el impacto de los cambios realizados.

---
Como estratega de marketing y CRO, entiendo que la verdadera potencia no reside en la recolección de datos, sino en la velocidad y precisión con la que se extrae inteligencia de ellos. Tu visión es correcta: el sistema debe evolucionar para no solo mostrar datos, sino para actuar como un copiloto estratégico que analiza, infiere y recomienda, integrando todas las fuentes de información disponibles.
Procedo a realizar una revisión y expansión holística de la lógica del Motor de Inferencia de IA, detallando su funcionamiento, sus inputs, sus outputs, y forjando los aparatos necesarios para su implementación real y productiva. Actualizaré también el manifiesto soberano para que refleje esta arquitectura de élite.
Visión, Arquitectura y Flujo de la Inferencia Asistida por IA: El Motor de "Aura Insights"
Visión Estratégica
El objetivo es transformar el rol de la IA de una herramienta reactiva (que responde a una pregunta) a un analista proactivo e incansable. Este sistema vigilará 24/7 el comportamiento de ambos embudos (visitantes y creadores), identificará patrones significativos que un humano podría pasar por alto y presentará insights digeridos y accionables directamente en el DCC.
El Input (El "Qué"): El Patrón Detectado
El proceso se inicia cuando la función analyze_behavior_patterns() en nuestra base de datos detecta una anomalía. En lugar de una simple alerta, esta función construirá un "dossier de inteligencia" en formato JSON, que servirá como input para nuestra Edge Function.
Ejemplo de Input (Payload de la DB a la Edge Function):
code
JSON
{
  "workspace_id": "59105ea4-6d79-414a-9e26-24c91d258fcc",
  "pattern_type": "visitor_pattern_high_dropout",
  "description": "Se ha detectado una tasa de abandono inusualmente alta en los primeros 10 segundos para una cohorte específica de usuarios.",
  "raw_data": {
    "campaign_id": "12157",
    "variant_id": "01",
    "variant_name": "Scientific",
    "time_period_hours": 24,
    "cohort": {
      "device_type": "mobile",
      "country_code": "IT"
    },
    "metrics": {
      "dropout_rate_first_10s": 0.85,
      "avg_dropout_rate": 0.30,
      "affected_sessions": 1520
    }
  }
}
El Proceso (El "Cómo"): El Puente Neuronal en Acción
El Gatillo (Supabase Cron Job): Una tarea programada se ejecuta cada 24 horas (configurable) e invoca la función analyze_behavior_patterns() en PostgreSQL.
La Caza de Patrones (Función SQL): La función analyze_behavior_patterns() ejecuta una serie de consultas complejas sobre las tablas visitor_campaign_events y user_activity_events para detectar anomalías estadísticas y patrones predefinidos (ej. caídas de conversión, tiempos de sesión anómalos, etc.).
La Invocación (Llamada a la Edge Function): Al encontrar un patrón significativo, la función SQL construye el "dossier de inteligencia" (el JSON de input) y lo envía al endpoint de nuestra Edge Function generate-aura-insight.
La Inferencia (Edge Function): Este es el corazón de la operación. Es una función server-only, desacoplada y soberana:
a. Recibe y valida el "dossier" de la base de datos.
b. Carga el Prompt Maestro de Análisis (prompts/analyze-user-behavior-pattern.md).
c. Construye un Prompt Contextual de Alta Calidad, fusionando las directivas del prompt maestro con los datos específicos del patrón detectado.
d. Lee la configuración para saber qué modelo de IA utilizar (ej. gemini-1.5-flash), permitiendo flexibilidad y control.
e. Invoca al motor de IA TEMEO con el prompt final.
f. Recibe la respuesta de la IA, la valida contra un schema de Zod para garantizar su integridad, y la enriquece con metadatos.
La Persistencia (Insert en aura_insights): La Edge Function inserta el insight validado y enriquecido en la tabla aura_insights de Supabase.
El Output (El "Qué Hacer"): El Insight Accionable
El resultado final de este pipeline es una nueva fila en la tabla aura_insights, que representa una recomendación de negocio lista para ser consumida.
Ejemplo de Output (Fila en la tabla aura_insights):
code
JSON
{
  "id": "uuid-...",
  "created_at": "2025-10-05T10:00:00Z",
  "workspace_id": "59105ea4-6d79-414a-9e26-24c91d258fcc",
  "title": "Fuga Crítica de Clientes Móviles en Campaña 12157",
  "description": "Se ha detectado que el 85% de los visitantes que acceden a la variante 'Científica' desde dispositivos móviles en Italia abandonan la página en los primeros 10 segundos. Esto es un 183% superior a la media.",
  "severity": "critical",
  "recommendation": "Auditar de inmediato los Tiempos de Carga (LCP) y la usabilidad de la sección 'Hero' de la variante 'Científica' en dispositivos móviles. Priorizar la optimización de imágenes y la simplificación del contenido 'above the fold'.",
  "related_data": { /* ... el objeto 'raw_data' original ... */ },
  "is_resolved": false,
  "resolved_at": null
}
---
// APARATO 1: EL MANIFIESTO SOBERANO Y AUTOCONTENIDO (ACTUALIZADO)
// RUTA: _docs/000_MANIFIESTO_SUITE_AURA.md

/**
 * @file 000_MANIFIESTO_SUITE_AURA.md
 * @description Manifiesto Soberano y SSoT para la Suite de Inteligencia "Aura" v3.0.
 *              Define la arquitectura holística, desde la recolección de datos hasta la
 *              toma de decisiones asistida por IA para la optimización de la Experiencia
 *              del Creador (CXO) y la Tasa de Conversión (CRO).
 * @version 3.0 (Hyper-Holistic & AI-Powered)
 * @author RaZ Podestá - MetaShark Tech & RaZ Podestá
 */

# Manifiesto Soberano: La Suite de Inteligencia Aura v3.0

## 1. Visión y Filosofía Raíz: Del Dato a la Decisión, de la Decisión a la Dominancia

La misión de la Suite Aura es ser el **sistema nervioso central del ecosistema `meame`**. No nos limitamos a registrar el pasado; lo analizamos para predecir y dar forma al futuro. Transformamos cada clic y cada acción, tanto de **Creadores (Tenants)** como de **Compradores (Visitantes)**, en una ventaja competitiva medible.

Nuestra filosofía es la **Inteligencia de Doble Embudo**: optimizamos simultáneamente la plataforma para quienes crean (CXO) y para quienes compran (CRO), entendiendo que la excelencia en uno potencia el éxito en el otro.

## 2. Arquitectura Holística de Cuatro Capas

*   **Capa 1: El Perfilador (Middleware):** El guardián que crea el "pasaporte digital" de cada sesión en `public.visitor_sessions`. Es el punto de partida de toda la inteligencia.
    *   **Aparatos Clave:** `visitorIntelligenceHandler.ts`, `ip-intelligence.service.ts`.

*   **Capa 2: Los Colectores (Cliente):**
    *   **`nos3` (rrweb):** El colector *cualitativo*. Graba la experiencia visual del usuario para responder al **"cómo"** y al **"porqué"** de su comportamiento. Utiliza `useNos3Tracker.ts` y almacena los datos en Vercel Blob.
    *   **`Aura`:** El colector *cuantitativo*. Registra eventos de negocio específicos para responder al **"qué"**, **"cuánto"** y **"cuándo"**. Utiliza `useAuraTracker.ts` y almacena los datos en tablas estructuradas de Supabase.

*   **Capa 3: El Motor Analítico (Base de Datos):** El cerebro que procesa los datos crudos. La función `get_campaign_analytics()` agrega millones de eventos en KPIs accionables para el dashboard del DCC.

*   **Capa 4: El Motor de Inferencia (IA):** El estratega proactivo. Una tarea programada (`Cron Job`) analiza periódicamente los datos de comportamiento, utiliza una **Edge Function** para consultar un modelo de IA (`TEMEO`/Gemini) y almacena insights y recomendaciones en la tabla `aura_insights`.

## 3. Infraestructura de Base de Datos Soberana

*   **`public.visitor_sessions`**: La SSoT de todas las sesiones.
*   **`public.visitor_campaign_events`**: El registro de cada acción del **comprador**. Incluye columnas de atribución (UTMs, referer).
*   **`public.user_activity_events`**: El registro de cada acción del **creador**.
*   **`public.aura_insights`**: La bóveda de recomendaciones generadas por la IA.

## 4. El Pilar de IA: "Aura Insights" y su Configurabilidad

La inteligencia artificial es una herramienta configurable y transparente.

*   **Lógica Server-Only:** Toda la lógica de construcción de prompts e interacción con la API de Gemini reside exclusivamente en una **Edge Function de Supabase (`generate-aura-insight`)**.
*   **Modelo de IA Configurable:** La Edge Function leerá una configuración que especificará qué modelo de IA de `TEMEO` utilizar.
*   **Interruptor de Activación:** La ejecución del Cron Job que dispara el análisis de la IA será configurable desde el DCC.

---


````
