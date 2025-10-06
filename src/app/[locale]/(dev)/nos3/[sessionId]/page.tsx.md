// RUTA: src/app/[locale]/(dev)/nos3/[sessionId]/page.tsx
/\*\*

- @file page.tsx
- @description Página de servidor soberana ("Server Shell") para el reproductor de sesiones de `nos3`.
-              Forjada con un Guardián de Resiliencia holístico, observabilidad de élite
-              y una arquitectura de importación canónica.
- @version 4.0.0 (Elite & Architecturally Aligned)
  _@author RaZ Podestá - MetaShark Tech
  _/
  import "server-only";
  import React from "react";
  import { PageHeader } from "@/components/layout/PageHeader";
  import { Container } from "@/components/ui";
  import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";
  import { logger } from "@/shared/lib/logging";
  import { getSessionEventsAction } from "@/shared/lib/actions/nos3";
  import { SessionPlayerClient } from "@/components/features/nos3/components";
  import { notFound } from "next/navigation";

interface Nos3PlayerPageProps {
params: { sessionId: string };
}

export default async function Nos3PlayerPage({ params }: Nos3PlayerPageProps) {
const { sessionId } = params;
const traceId = logger.startTrace(`Nos3PlayerPage_v4.0:${sessionId}`);
logger.startGroup(
`[Nos3Player Shell] Ensamblando datos para la sesión: ${sessionId}`
);

try {
// --- [INICIO] GUARDIÁN DE RESILIENCIA Y OBTENCIÓN DE DATOS ---
logger.traceEvent(traceId, "Invocando 'getSessionEventsAction'...");
const eventsResult = await getSessionEventsAction(sessionId);

    if (!eventsResult.success) {
      // Si la Server Action falla, lanzamos un error para ser capturado
      // por el bloque catch, centralizando el manejo de errores.
      throw new Error(eventsResult.error);
    }

    if (!eventsResult.data || eventsResult.data.length === 0) {
      // Si la acción es exitosa pero no devuelve eventos, lo consideramos
      // un caso de "no encontrado" en lugar de un error.
      logger.warn(
        `[Guardián] No se encontraron eventos para la sesión ${sessionId}. Renderizando 404.`,
        { traceId }
      );
      return notFound();
    }
    // --- [FIN] GUARDIÁN DE RESILIENCIA Y OBTENCIÓN DE DATOS ---

    logger.success(
      `[Nos3Player Shell] Datos obtenidos. Delegando ${eventsResult.data.length} eventos al componente de cliente.`,
      { traceId }
    );

    return (
      <>
        <PageHeader
          content={{
            title: `Reproduciendo Sesión`,
            subtitle: `ID: ${sessionId}`,
          }}
        />
        <Container className="py-8">
          <SessionPlayerClient events={eventsResult.data} />
        </Container>
      </>
    );

} catch (error) {
const errorMessage =
error instanceof Error ? error.message : "Error desconocido.";
logger.error(
`[Nos3Player Shell] Fallo crítico irrecuperable al renderizar la página del reproductor.`,
{ error: errorMessage, sessionId, traceId }
);

    // En producción, un error aquí también debería llevar a un 404 o una página de error genérica.
    if (process.env.NODE_ENV === "production") {
      return notFound();
    }

    // En desarrollo, mostramos el error detallado para una depuración inmediata.
    return (
      <DeveloperErrorDisplay
        context="Nos3PlayerPage Server Shell"
        errorMessage={`No se pudieron cargar los datos para la sesión ${sessionId}.`}
        errorDetails={error instanceof Error ? error : errorMessage}
      />
    );

} finally {
logger.endGroup();
logger.endTrace(traceId);
}
}
