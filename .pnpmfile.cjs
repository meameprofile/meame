// RUTA: .pnpmfile.cjs
/* eslint-env node */

/**
 * @file .pnpmfile.cjs
 * @description Manifiesto de Hooks de PNPM y SSoT para la anulación de
 *              comportamientos de dependencias. Este archivo es el guardián
 *              de la seguridad y la integridad del proceso de instalación.
 * @version 1.1.0 (Build Integrity Enforcement)
 * @author RaZ Podestá - MetaShark Tech
 */

/**
 * @see https://pnpm.io/pnpmfile
 */
module.exports = {
  hooks: {
    readPackage(pkg, context) {
      // Pilar III: Observabilidad del proceso de instalación.
      context.log(
        `[PNPM Hook] Analizando dependencia: ${pkg.name}@${pkg.version}`
      );

      // --- [INICIO DE REFACTORIZACIÓN DE RESILIENCIA DE BUILD] ---
      // Guardián de Integridad para SWC: Se autoriza explícitamente la
      // ejecución de sus scripts de build para garantizar que el binario
      // nativo correcto siempre se instale en el entorno de Vercel.
      if (pkg.name === "@swc/core") {
        context.log(
          `[PNPM Hook] AUTORIZANDO explícitamente los scripts de build para @swc/core para garantizar un build determinista.`
        );
        pkg.pnpm = {
          ...pkg.pnpm,
          neverBuilt: false,
        };
      }
      // --- [FIN DE REFACTORIZACIÓN DE RESILIENCIA DE BUILD] ---

      return pkg;
    },
  },
};
