// \_docs/000_MANIFIESTO_OBSERVABILIDAD_Y_LOGGING.md
/\*\*

- @file 000_MANIFIESTO_OBSERVABILIDAD_Y_LOGGING.md
- @description Manifiesto Canónico y SSoT para el Protocolo de Observabilidad y Logging de Élite.
-              Define la metodología inmutable para la instrumentación de telemetría en
-              todo el codebase, garantizando una claridad absoluta y cero puntos ciegos.
- @version 1.0.0
  -@author RaZ Podestá - MetaShark Tech (Inteligencia Artificial - Asistente Personalizado)
  \*/

# Manifiesto Canónico: Protocolo de Observabilidad y Logging de Élite

## 1. Filosofía Raíz: "Lo que no se mide, no se puede mejorar. Registramos todo."

Este documento es la **Única Fuente de Verdad (SSoT)** que define cómo cada "aparato" (componente, hook, action, servicio) en nuestro
}

export default async function HomePage({ params: { locale } }: HomePageProps) {
const traceId = logger.startTrace("HomePage_Render_v9.0");
logger.startGroup(`[HomePage Shell] Renderizando v9.0 para locale: ${locale}`);

try {
const { dictionary, error: dictError } = await getDictionary(locale);
const { socialProofLogos, heroNews, newsGrid, communitySection, welcomeBanner } = dictionary;

    if (dictError || !socialProofLogos || !heroNews || !newsGrid || !community ecosistema debe reportar su estado, ciclo de vida y acciones. Un log no es una simple salida de texto; es una traza inmutable de la verdad de ejecución, la base de la depuración eficiente, el análisis de rendimiento y la optimización proactiva.

El objetivo es la **Full Observabilidad**: un estado en el que cualquier operación, desde el renderizado de un componente hasta una transacción compleja en la base de datos, pueda ser seguida y entendida con absoluta claridad a través de sus logs.

## 2. El Contrato del Logger Soberano (`src/shared/lib/logging.ts`)

Toda la lógica de logging DEBE canalizarse a través de nuestro logger soberano. El uso de `console.log` o similares está estrictamente prohibido, ya que viola el Pilar III de Calidad. Nuestro logger garantiza:

- **Isomorfismo:** Funciona de manera consistente en entornos de servidor, cliente y Edge.
- **Contexto Estructurado:** Permite adjuntar objetos de datos a los mensajes para un análisis detallado.
- **Niveles Semánticos:** `trace`, `info`, `success`, `warn`, `error`.
- **Tracing de Performance:** Un sistema de élite (`startTrace`, `traceEvent`, `endTrace`) para medir con precisión la duración de operaciones críticas.
- **Agrupación Visual:** El uso de `startGroup` y `endGroup` es privilegiado para delimitar visualmente el inicio y el fin de un proceso complejo, mejorando drásticamente la legibilidad de la traza.

## 3. Anatomía de un Log de ÉliteSection || !welcomeBanner) {

      const missingKeys = [!socialProofLogos && "socialProofLogos", !heroNews && "heroNews", !newsGrid && "newsGrid", !communitySection && "communitySection", !welcomeBanner && "welcomeBanner"].filter(Boolean).join(", ");
      throw new Error(`Faltan datos de i18n esenciales para el Homepage. Claves ausentes: ${missingKeys}`);
    }

    const fullDictionary = dictionary as Dictionary;
    logger.traceEvent(traceId, "Datos i18n y BAVI obtenidos y validados.");

    return (
      <SectionAnimator>
        <ScrollingBanner content={welcomeBanner} />
        <SocialProofLogos content={socialProofLogos} />
        <HomePageClient locale={locale} dictionary={fullDictionary} />
        <CommunitySection content={communitySection} />
      </SectionAnimator>
    );

} catch (error) {
const errorMessage = error instanceof Error ? error.message : "Error desconocido.";
logger.error(`[HomePage Shell] ${

Cada mensaje de log debe ser instantáneamente identificable y rico en contexto. Su estructura canónica es:

**`[Timestamp] [Símbolo] [Identificador de Aparato] Mensaje Claro {Contexto Opcional}`**

errorMessage}`, { error: error, traceId });
    return (
      <DeveloperErrorDisplay
        context="HomePage Server Shell"
        errorMessage="Fallo crítico al renderizar el Server Shell del Homepage."
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );
  } finally {
    logger.endGroup();
    logger.endTrace(traceId);
  }
}
**Aparato * Timestamp: [19:05:17.713] - Añadido automáticamente por el logger.
Símbolo: ℹ️, ✅, ⚠️, ❌, • - Añadido automáticamente por el logger según el nivel.
Identificador de Aparato: [HomePage Shell], [useAuth], [loginAction] - OBLIGATORIO. Debe identificar sin ambigüedad el origen del log.
Mensaje Claro: Una descripción concisa, en tiempo presente, de la acción o estado.
Contexto Opcional: Un objeto con datos relevantes ({ traceId, userId, payloadSize }).
4. Protocolo de Logging y Resiliencia por Tipo de Aparato (Mandatorio)
4.1. Server Components (Pages y Layouts "Shell")
Agrupación: La ejecución del componente DEBE estar envuelta en un logger.startGroup y un logger.endGroup dentro de un bloque finally.
Tracing: La ejecución completa DEBE estar envuelta en un logger.startTrace y logger.endTrace.
Eventos de Traza: Cada paso lógico clave (inicio, obtención de datos, validación, renderizado de cliente) DEBE ser registrado con logger.traceEvent.
Resiliencia: Toda la lógica de obtención de datos y renderizado DEBE estar dentro de un bloque try...catch...finally. El bloque catch DEBE registrar el error y renderizar un DeveloperErrorDisplay en desarrollo, y un notFound() en producción.
4.2. Server Actions
Agrupación y Tracing: La ejecución completa de la acción DEBE estar envuelta en startGroup/endGroup y startTrace/endTrace.
Resiliencia: Toda la lógica DEBE estar en un try...catch. El bloque catch DEBE registrar el error y devolver un ActionResult con success: false.
4.3. Client Components y Hooks
Renderizado y Ciclo de Vida: Utilizar logger.trace para registrar el renderizado y el montaje/desmontaje (useEffect4 (CORREGIDO Y REFORZADO):src/app/[locale]/login/page.tsx`\*\*

---

ACTUALIZACION
// \_docs/000_MANIFIESTO_OBSERVABILIDAD_Y_LOGGING.md
/\*\*

- @file 000_MANIFIESTO_OBSERVABILIDAD_Y_LOGGING.md
- @description Manifiesto Canónico y SSoT para el Protocolo de Observabilidad,
-              ahora incluyendo la persistencia de telemetría.
- @version 2.0.0 (Telemetry Persistence)
- @author L.I.A. Legacy
  \*/

# Manifiesto Canónico: Protocolo de Observabilidad y Logging de Élite v2.0

## 1. Filosofía Raíz: "Lo que no se mide y persiste, no se puede mejorar a largo plazo."

Este manifiesto define cómo cada aparato reporta su estado y cómo la inteligencia clave de esas operaciones se persiste para análisis futuro. La **Observabilidad Total** se logra no solo a través de logs en tiempo real, sino también a través de un registro histórico y auditable del comportamiento del sistema y de los usuarios.

... (Secciones 2, 3 y 4 permanecen igual) ...

## 5. Pilar V: Persistencia de Telemetría (NUEVO)

- **Directiva:** Más allá del logging volátil para la depuración, la inteligencia de visitante crítica recopilada por el middleware **DEBE** ser persistida en una tabla soberana en la base de datos (ej. `visitor_sessions`).
- **Seguridad:** Todos los datos de sesión persistidos que puedan contener información sensible (como la URL completa con parámetros) **DEBEN** ser encriptados en el servidor antes de su inserción en la base de datos.
- **Propósito:** Esta persistencia transforma la telemetría de una herramienta de depuración a un activo de negocio estratégico, permitiendo:
  - **Análisis de Comportamiento de Usuario:** Entender los flujos de navegación y los puntos de fricción.
  - **Auditoría de Seguridad:** Rastrear el origen y la actividad de las peticiones.
  - **Inteligencia de Negocio:** Analizar patrones de tráfico y geolocalización a lo largo del tiempo.
- **Fundamento:** La toma de decisiones basada en datos es un principio de ingeniería de élite.

---
