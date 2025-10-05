// \_docs/000_PROTOCOLO_NIVELACION_BASE_DE_DATOS.md
/\*\*

- @file 006_PROTOCOLO_NIVELACION_BASE_DE_DATOS.md
- @description Manifiesto Canónico y SSoT para el Protocolo de Nivelación y Sincronización de la Base de Datos.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Soberano: Protocolo de Nivelación de Base de Datos

## 1. Filosofía Raíz: "La Documentación es el Contrato, la Realidad Debe Cumplirlo."

Este documento es la Única Fuente de Verdad (SSoT) que define el flujo de trabajo inmutable para garantizar que la estructura real de nuestra base de datos de Supabase sea un reflejo perfecto de su diseño conceptual.

No auditamos la base de datos para ver "cómo está". Definimos "cómo debe estar" en nuestros manifiestos, y luego nivelamos la base de datos para que cumpla ese contrato.

## 2. El Ciclo de Nivelación de 5 Fases

Toda modificación o creación de una entidad de base de datos (tabla, función, política) **DEBE** seguir este ciclo:

### Fase 1: Definición Conceptual (El Plano Soberano)

- **Acción:** Crear o actualizar un Manifiesto `.md` en `_docs/supabase/` para la entidad en cuestión (ej. `00X_MANIFIESTO_TABLA_NUEVA.md`).
- **Contenido:** Este manifiesto **DEBE** incluir:
  1.  La visión y el propósito de la tabla.
  2.  El esquema `DDL` (SQL `CREATE TABLE`) completo y explícito.
  3.  La definición de todas las `RLS Policies` (políticas de seguridad).
  4.  La definición de cualquier `Trigger` o `Function` asociada.
- **Resultado:** Una SSoT conceptual, legible por humanos y por IA, que representa el estado ideal de la tabla.

### Fase 2: Diagnóstico de Esquema (La Radiografía)

- **Acción:** Ejecutar el script de diagnóstico de esquema relevante (ej. `pnpm diag:supabase:schema-all`).
- **Resultado:** Un informe `.json` que representa el estado real ("as-is") de la base de datos.

### Fase 3: Análisis de Desviación (El Veredicto)

- **Acción:** Comparar el Manifiesto Conceptual (Fase 1) con el Informe de Diagnóstico (Fase 2).
- **Responsable:** L.I.A. Legacy.
- **Resultado:** Un informe de auditoría que identifica claramente todas las desalineaciones (columnas faltantes, políticas incorrectas, etc.).

### Fase 4: Nivelación (La Cirugía)

- **Acción:** Generar las sentencias SQL de migración (`ALTER TABLE`, `CREATE POLICY`, `DROP POLICY`, etc.) necesarias para que el esquema real coincida con el esquema conceptual.
- **Responsable:** L.I.A. Legacy.
- **Ejecución:** El arquitecto (tú) ejecuta estas sentencias en el editor SQL de Supabase.

### Fase 5: Verificación Post-Nivelación (La Confirmación)

- **Acción:** Volver a ejecutar el script de diagnóstico de esquema de la Fase 2.
- **Resultado:** Un nuevo informe `.json` que **DEBE** coincidir perfectamente con el contrato definido en el Manifiesto de la Fase 1. El ciclo se completa solo cuando la verificación es exitosa.

---

actualizacaion
// \_docs/databases-schemas/000_PROTOCOLO_NIVELACION_BASE_DE_DATOS.md
/\*\*

- @file 000_PROTOCOLO_NIVELACION_BASE_DE_DATOS.md
- @description Manifiesto Canónico y SSoT para el Protocolo de Nivelación y Sincronización de la Base de Datos.
- @version 2.0.0 (Granular & Surgical)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Soberano: Protocolo de Nivelación de Base de Datos v2.0

## 1. Filosofía Raíz: "La Documentación es el Contrato, la Realidad Debe Cumplirlo."

Este documento es la Única Fuente de Verdad (SSoT) que define el flujo de trabajo inmutable para garantizar que la estructura real de nuestra base de datos de Supabase sea un reflejo perfecto de su diseño conceptual.

No auditamos la base de datos para ver "cómo está". Definimos "cómo debe estar" en nuestros manifiestos, y luego nivelamos la base de datos para que cumpla ese contrato.

## 2. El Ciclo de Nivelación de 5 Fases

Toda modificación o creación de una entidad de base de datos (tabla, función, política) **DEBE** seguir este ciclo:

### Fase 1: Definición Conceptual (El Plano Soberano)

- **Acción:** Crear o actualizar un Manifiesto `.md` en `_docs/supabase/` para la entidad en cuestión (ej. `00X_MANIFIESTO_TABLA_NUEVA.md`). Este es el **archivo maestro de configuración y contenido** para cada tabla.
- **Contenido Mandatorio:**
  1.  La visión y el propósito de la tabla en el ecosistema.
  2.  El esquema `DDL` (`CREATE TABLE`) completo y explícito.
  3.  La definición de todas las `RLS Policies` (políticas de seguridad a nivel de fila).
  4.  La definición de cualquier `Trigger` o `Function` asociada.
- **Resultado:** Una SSoT conceptual que representa el estado ideal de la tabla, legible por humanos y por IA.

### Fase 2: Diagnóstico de Esquema (La Radiografía)

- **Acción:** Ejecutar el script de diagnóstico de esquema relevante (ej. `pnpm diag:supabase:schema-all` o el script específico de la tabla como `pnpm diag:supabase:schema-profiles`).
- **Resultado:** Un informe `.json` en `reports/supabase/` que representa el estado real ("as-is") de la base de datos.

### Fase 3: Análisis de Desviación (El Veredicto)

- **Acción:** Comparar el Manifiesto Conceptual (Fase 1) con el Informe de Diagnóstico (Fase 2).
- **Responsable:** L.I.A. Legacy.
- **Resultado:** Un informe de auditoría que identifica claramente todas las desalineaciones (columnas faltantes, políticas incorrectas, etc.).

### Fase 4: Nivelación Quirúrgica (La Cirugía)

- **Acción:** Generar las sentencias SQL de migración (`ALTER TABLE`, `CREATE POLICY`, etc.) necesarias para que el esquema real coincida con el conceptual.
- **Organización:** Cada script de nivelación se almacenará en una nueva ruta soberana: `scripts/supabase/migrations/`.
- **Ejecución:** El arquitecto (tú) ejecuta estas sentencias en el editor SQL de Supabase.

### Fase 5: Verificación Post-Nivelación (La Confirmación)

- **Acción:** Volver a ejecutar el script de diagnóstico de la Fase 2.
- **Resultado:** Un nuevo informe `.json` que **DEBE** coincidir perfectamente con el contrato definido en el Manifiesto. El ciclo se completa solo cuando la verificación es exitosa.

## 3. Protocolo de Creación "Desde Cero"

Para la reconstrucción de una base de datos desde cero, se creará y perfeccionará un script maestro en `scripts/supabase/migrations/000_create_initial_schema.ts`. Este script consolidará todos los `CREATE TABLE`, `CREATE FUNCTION` y `CREATE POLICY` de los manifiestos individuales en un único archivo ejecutable, garantizando un despliegue rápido, consistente y determinista.

---
