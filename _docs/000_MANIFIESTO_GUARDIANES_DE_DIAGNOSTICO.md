// \_docs/000_MANIFIESTO_GUARDIANES_DE_DIAGNOSTICO.md
/\*\*

- @file 000_MANIFIESTO_GUARDIANES_DE_DIAGNOSTICO.md
- @description Manifiesto Canónico y SSoT para la creación de scripts de diagnóstico.
-              Define la arquitectura, contratos y principios para todo el arsenal de auditoría.
- @version 1.0.0
- @author L.I.A. Legacy
  \*/

# Manifiesto Canónico: Creación de Guardianes de Diagnóstico

## 1. Filosofía Raíz: "Visibilidad Total, Cero Suposiciones."

Este documento es la Única Fuente de Verdad (SSoT) que rige la creación de cualquier script de diagnóstico dentro del ecosistema. Un script de diagnóstico no es una simple consulta; es un **Guardián de la Integridad**, una sonda que nos proporciona una radiografía precisa y accionable de un dominio de servicio específico (Supabase, Cloudinary, etc.).

El objetivo es crear un arsenal de herramientas consistentes, robustas y auto-documentadas que permitan a cualquier desarrollador (humano o IA) auditar el estado del sistema con un único comando.

## 2. Arquitectura Soberana por Dominio

Cada servicio externo (dominio) auditado **DEBE** tener su propio directorio dentro de `scripts/`. La estructura dentro de cada dominio debe ser **plana y predecible**.

### 2.1. El Patrón de Tres Guardianes

Cada dominio se compondrá de, al menos, los siguientes tres scripts guardianes:

1.  **`connect.ts`**: El Guardián de la Conexión.
2.  **`schema.ts`**: El Guardián del Esquema (o `schema-all.ts` para diagnósticos consolidados).
3.  **`content.ts`**: El Guardián del Contenido (Censor).

**Excepción de Granularidad (Supabase):** Para dominios complejos como Supabase, los guardianes de esquema y contenido pueden ser divididos por entidad para un análisis más quirúrgico (ej. `schema-profiles.ts`, `content-bavi.ts`).

## 3. Contrato de Código Inmutable para cada Guardián

Todo script de diagnóstico **DEBE** adherirse a los siguientes contratos:

### 3.1. Encabezado de Ejecución y Documentación

La primera línea del archivo **DEBE** ser un comentario con el comando `pnpm tsx` exacto para ejecutar ese script, seguido del bloque de documentación TSDoc.

````typescript
// pnpm tsx scripts/run-with-env.ts scripts/dominio/script.ts
/**
 * @file script.ts
 * @description Descripción clara del propósito del guardián.
 * @version 1.0.0
 * @author Tu Nombre o L.I.A. Legacy
 */```

### 3.2. Principios de Calidad

*   **Resiliencia:** Toda la lógica principal debe estar envuelta en un bloque `try...catch...finally`. El script debe fallar de forma controlada (`process.exit(1)`) y generar siempre un informe, incluso en caso de error.
*   **Observabilidad:** Debe utilizar el `scriptLogger` soberano de `_utils/logger.ts` para informar de cada paso de su ejecución, incluyendo trazas, éxitos y errores.
*   **Reutilización:** Debe consumir los aparatos base de `_utils/` (`env.ts`, `logger.ts`, `types.ts`, `supabaseClient.ts`) siempre que sea posible.

## 4. Contrato de Informes Consumibles por IA

Cada Guardián **DEBE** generar un informe `.json` en el directorio `reports/{dominio}/`.

### 4.1. Estructura del Informe

Todo informe **DEBE** contener, como mínimo, las siguientes claves de nivel superior:

*   `reportMetadata`: Objeto con información sobre el script que generó el informe.
*   `instructionsForAI`: Un array de strings con instrucciones claras en lenguaje natural sobre cómo interpretar el informe.
*   `auditStatus`: `"SUCCESS"` o `"FAILED"`.
*   `schemaDetails` o `contentDetails`: El payload de datos principal del informe.
*   `summary`: Una conclusión legible por humanos sobre el resultado de la auditoría.

**Ejemplo de `reportMetadata`:**
```json
"reportMetadata": {
  "script": "scripts/supabase/schema-profiles.ts",
  "targetTable": "profiles",
  "purpose": "Diagnóstico estructural completo de la tabla 'profiles'.",
  "generatedAt": "2025-10-03T05:15:00.000Z"
}
5. Orquestación en package.json
Para cada dominio, se DEBEN crear los siguientes scripts en package.json:
"diag:{dominio}:connect"
"diag:{dominio}:schema"
"diag:{dominio}:content"
"diag:{dominio}": Un script consolidado que ejecuta los tres anteriores en secuencia.
Este manifiesto asegura que, a medida que el proyecto crezca, nuestro arsenal de diagnóstico se mantendrá coherente, robusto y de élite.

---
````
