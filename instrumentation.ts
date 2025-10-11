// RUTA: instrumentation.ts
/**
 * @file instrumentation.ts
 * @description Hook de instrumentación para Next.js, usado para Aura/Nos3/Heimdall.
 * @version 1.0.0
 */
export async function register() {
  if (process.env.NEXT_PUBLIC_HEIMDALL_ENABLED) {
    console.log("Heimdall: Initializing observability...");
    // Inicializa rrweb para Nos3 o analytics para Aura
  }
}
