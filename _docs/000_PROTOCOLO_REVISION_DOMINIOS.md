// \_docs/000_PROTOCOLO_REVISION_DOMINIOS.md
/\*\*

- @file 015_PROTOCOLO_REVISION_DOMINIOS.md
- @description Manifiesto Canónico y SSoT para la Revisión Holística de Dominios.
-              Define el checklist mandatorio para auditar la salud, integración
-              y resiliencia de cualquier dominio dentro del ecosistema.
- @version 1.0.0
- @author RaZ Podestá
  \*/

# Manifiesto Canónico: Protocolo de Revisión de Dominios

## 1. Filosofía Raíz: "Un Dominio Saludable es Predecible, Observable y Resiliente."

Este documento establece el checklist de auditoría que se debe seguir para validar la integridad de cualquier dominio funcional dentro del ecosistema. Un dominio no es solo un conjunto de componentes; es un órgano vital que debe funcionar en perfecta simbiosis con el resto del sistema.

## 2. Checklist de Auditoría de Dominio (Mandatorio)

### ✅ **Paso 1: Navegabilidad y Acceso**

- [ ] **Rutas Definidas:** Todas las rutas de la UI del dominio están correctamente definidas en la SSoT `src/shared/lib/navigation.ts`.
- [ ] **Generación de Rutas:** El script `scripts/generation/generate-navigation-manifest.ts` descubre y genera correctamente todas las rutas del dominio.
- [ ] **Acceso Directo:** Se puede navegar directamente a cada ruta del dominio a través de la URL sin encontrar errores 404 (asumiendo la autenticación correcta).
- [ ] **Enlaces del Ecosistema:** Todos los puntos de entrada al dominio desde otras partes de la aplicación (ej. links en el DCC) son correctos y funcionales.

### ✅ **Paso 2: Observabilidad (Logging)**

- [ ] **Trazabilidad de Renderizado:** Cada componente de página (Server Component) del dominio anuncia su renderizado con `logger.info`.
- [ ] **Trazabilidad de Componentes Clave:** Los componentes de cliente "inteligentes" o "contenedores" anuncian su renderizado con `logger.trace`.
- [ ] **Trazabilidad de Lógica Crítica:** Los hooks de lógica de negocio y las Server Actions anuncian el inicio, los pasos clave y el resultado (éxito/fallo) de sus operaciones.
- [ ] **Cero `console.log`:** No existen llamadas a `console.log` en el dominio; todo el logging se canaliza a través del `logger` soberano.

### ✅ **Paso 3: Resiliencia y Manejo de Errores**

- [ ] **Guardianes de Contenido:** Los componentes que dependen de contenido i18n o datos de API tienen guardias que previenen el renderizado si los datos son nulos o inválidos.
- [ ] **Componente `DeveloperErrorDisplay`:** En modo de desarrollo, los errores de obtención de datos o validación son capturados y mostrados claramente usando el componente `DeveloperErrorDisplay`.
- [ ] **Manejo de Fallos en Acciones:** Todas las Server Actions y funciones de acceso a datos tienen bloques `try/catch` robustos que reportan errores a través del `logger` y devuelven un `ActionResult` consistente.
- [ ] **Estados de Carga y Vacío:** Los componentes de UI manejan y muestran visualmente los estados de carga (ej. `<Skeleton />`) y los estados vacíos (ej. "No se encontraron resultados").

### ✅ **Paso 4: Integración y Contratos de Datos**

- [ ] **Consumo de SSoT:** El dominio consume datos de otros dominios (ej. BAVI, RaZPrompts) a través de sus Server Actions o hooks designados, no mediante acceso directo a sus implementaciones internas.
- [ ] **Cumplimiento de Schemas:** Todos los datos que entran o salen del dominio (props, respuestas de API, contenido i18n) son validados con sus schemas de Zod correspondientes.
- [ ] **Alineamiento Arquitectónico:** La estructura de archivos y la nomenclatura dentro del dominio cumplen con el `000_MANIFIESTO_CONVENCIONES_DE_CODIGO.md`.
