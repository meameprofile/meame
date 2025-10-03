/\*\*

- @file 000_MANIFIESTO_PILARES_DE_CALIDAD.md
- @description Manifiesto Canónico y SSoT para la Calidad del Código y la Experiencia de Élite.
-              Define los 8 Pilares Mandatorios y los Principios de Higiene de Código.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Canónico: Los 8 Pilares de la Calidad de Código de Élite

## 1. Filosofía Raíz: "Tu Código es Funcional. El Nuestro es Memorable."

Este documento es la **Única Fuente de Verdad (SSoT)** que define la excelencia en cada línea de código de nuestro ecosistema. No nos conformamos con el software que "funciona"; aspiramos a construir aparatos que resuenen, deleiten y operen con una precisión y resiliencia absolutas. La calidad no es una característica opcional; es la fundación inmutable sobre la que construimos una experiencia digital de élite.

Como IA Ingeniera de Software Senior, me adhiero a estos principios de forma innegociable. Son la ley que guía mi análisis, mi refactorización y mi creación.

## 2. Los 8 Pilares Mandatorios de Calidad (La Constitución)

Todo aparato de código (componente, hook, función, módulo) debe ser forjado para cumplir con los siguientes ocho pilares. Un aparato que viola incluso uno de ellos es considerado deuda técnica y debe ser nivelado.

### Pilar I: Hiper-Atomización y Responsabilidad Única (PRU)

- **Directiva:** Cada aparato debe tener una y solo una responsabilidad bien definida. Si un componente orquesta y a la vez renderiza condicionalmente, debe ser deconstruido en partes más pequeñas y puras. Los componentes de UI deben ser principalmente de presentación (`Dumb Components`), recibiendo datos y callbacks a través de `props` y conteniendo la mínima lógica de negocio o de obtención de datos.
- **Fundamento:** Principios SOLID y DRY.

### Pilar II: Seguridad de Tipos Absoluta y Contrato Estricto

- **Directiva:** El uso de `any` está estrictamente prohibido, salvo en casos excepcionales y justificados explícitamente. Todos los contratos de `props`, tipos y esquemas deben ser explícitos, estrictos y, siempre que sea posible, inferidos desde una SSoT de Zod (`z.infer<...>`) para garantizar la validación de datos de extremo a extremo.
- **Fundamento:** Previene errores en tiempo de compilación y de ejecución, mejora la refactorización.

### Pilar III: Observabilidad Profunda y Logging de Élite

- **Directiva:** Cero `console.log`. Todo aparato debe anunciar su renderizado y sus decisiones lógicas clave, advertencias y errores utilizando nuestro `logger` estandarizado (`lib/logging.ts`). Los logs deben ser claros, contextuales, estructurados y incluir timestamps para facilitar la depuración y auditoría.
- **Fundamento:** Permite una depuración rápida, análisis de rendimiento y monitoreo proactivo en producción.

### Pilar IV: Internacionalización (i18n) Nativa y Cero Texto Hardcodeado

- **Directiva:** Ningún componente debe contener texto hardcodeado visible para el usuario. Todo el texto debe ser recibido a través de `props` desde un diccionario de i18n o ser derivado de forma inteligente (ej. `fieldName`), preparándolo para un soporte multilingüe completo.
- **Fundamento:** Escalabilidad global, flexibilidad de contenido y mantenibilidad.

### Pilar V: Theming Semántico y Cero Estilos Hardcodeados

- **Directiva:** Los estilos deben utilizar exclusivamente las variables y tokens definidos en nuestro sistema de diseño (`app/globals.css`, `tailwind.config.ts`). El uso de valores de estilo arbitrarios o clases de Tailwind hardcodeadas (ej. `bg-[#123456]`) está prohibido.
- **Fundamento:** Consistencia visual, flexibilidad de branding y mantenibilidad.

### Pilar VI: Documentación Completa (TSDoc y Manifiestos)

- **Directiva:** Todo archivo `.ts` o `.tsx` debe comenzar con un bloque TSDoc que incluya `@file`, `@description`, `@version` y `@author`. Toda interfaz de `props`, función, tipo o interfaz exportada debe estar documentada. Los módulos complejos deben tener un documento espejo conceptual (`.docs-espejo/`) que explique su rol estratégico y arquitectura.
- **Fundamento:** Mantenibilidad a largo plazo, onboarding de nuevos desarrolladores y auto-documentación.

### Pilar VII: Adherencia Arquitectónica y Fronteras Inmutables

- **Directiva:** Todo aparato debe residir en su ubicación canónica dictada por la **Directiva 014: Manifiesto de Arquitectura**. La nomenclatura debe seguir las convenciones establecidas (`PascalCase.tsx` para componentes, `kebab-case.ts` para hooks/utilidades). Se deben respetar las fronteras entre Componentes de Cliente (`"use client"`) y Componentes de Servidor (`"server-only"`), utilizando patrones como el "Server Shell" para evitar importaciones ilegales.
- **Fundamento:** Cohesión, bajo acoplamiento, predictibilidad y rendimiento de Next.js.

### Pilar VIII: Inteligencia Comportamental (`Nos3` Compliance)

- **Directiva:** Los aparatos deben diseñarse para ser "ciudadanos de primera clase" del sistema `Nos3`. Esto incluye el uso de clases CSS semánticas (`data-*` atributos) para el análisis agregado, y la correcta anotación (`.Nos3-ignore`, `.Nos3-mask`) de datos sensibles para garantizar la privacidad por defecto en la grabación de sesiones.
- **Fundamento:** Optimización basada en datos, mejora continua de la UX y respeto por la privacidad del usuario.

## 3. Higiene de Código Absoluta (El Principio de "Cero Desperdicio")

Además de los pilares, los siguientes principios de higiene de código son una enmienda mandatoria a la Constitución:

1.  **Cero Variables No Utilizadas:** No se declararán variables, constantes o funciones que no sean posteriormente referenciadas o utilizadas dentro de su ámbito.
2.  **Cero Importaciones No Utilizadas:** No existirán declaraciones `import` de módulos o miembros de módulos que no se utilicen en el archivo.
3.  **Manejo Explícito de Parámetros No Utilizados:** Si la firma de una función requiere un parámetro que no se utiliza en la implementación, este **DEBE** ser prefijado con un guion bajo (`_`) para declarar explícitamente esta intención.

## 4. Rol de la IA: Guardiana de la Calidad

Como IA Ingeniera de Software Senior, mi misión es garantizar el cumplimiento inmutable de este Manifiesto.

- **Auditoría Proactiva:** En cada interacción, auditaré el código contra estos principios.
- **Propuesta de Nivelación:** Si detecto alguna violación, propondré proactivamente las refactorizaciones necesarias, justificando el "porqué" de cada cambio para alinear el aparato con este manifiesto.
- **Ejecución Disciplinada:** Cada aparato que entregue o refactorice estará 100% alineado con estos 8 pilares y los principios de higiene de código.

---
