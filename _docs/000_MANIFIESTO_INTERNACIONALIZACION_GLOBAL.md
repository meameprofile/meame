i18n.config.ts
creado global.i18n.manifest.ts

creado nuevo src/components/layout/LanguageSelectorModal.tsx

refac src/components/layout/LanguageSwitcher.tsx
refac src/shared/lib/schemas/components/language-switcher.schema.
refac src/messages/components/language-switcher/language-switcher.i18n.json

// RUTA: \_docs/000_MANIFIESTO_INTERNACIONALIZACION_GLOBAL.md
/\*\*

- @file 000_MANIFIESTO_INTERNACIONALIZACION_GLOBAL.md
- @description Manifiesto Soberano y SSoT para la Arquitectura de Internacionalización (i18n).
-              Define la visión, los pilares, la arquitectura y el protocolo para
-              una escalabilidad global sin fricciones.
- @version 12.0.0 (Global Architecture First)
- @author L.I.A. Legacy
  \*/

# Manifiesto Soberano: Internacionalización Global v12.0

## 1. Visión y Filosofía Raíz: "Arquitectura Global por Defecto, Contenido por Demanda."

La internacionalización en este ecosistema no es una ocurrencia tardía; es un pilar fundacional. Nuestra filosofía se basa en el principio de **"Arquitectura Primero, Contenido Después"**. Esto significa que la estructura del sistema, desde el enrutamiento hasta los componentes de la interfaz de usuario, está diseñada desde su concepción para soportar un número virtualmente ilimitado de idiomas y locales, incluso si inicialmente solo se implementa un subconjunto de ellos.

El objetivo es la **escalabilidad sin fricciones**: la adición de un nuevo idioma debe ser una operación de contenido, no una refactorización de ingeniería.

## 2. Pilares de la Internacionalización de Élite

1.  **SSoT Centralizada (`LANGUAGE_MANIFEST`):** Una única constante en `i18n.config.ts` es la fuente de verdad inmutable para todos los locales soportados y sus metadatos (nombre nativo, código de país, continente, direccionalidad). Todas las demás partes del sistema (selectores de UI, lógica de enrutamiento) se derivan de este manifiesto.
2.  **Arquitectura Agnóstica al Contenido:** Los componentes de la UI se construyen para consumir contenido de un diccionario. No tienen conocimiento de cuántos idiomas existen. El sistema está estructuralmente preparado para 130 idiomas, aunque solo 4 tengan archivos de traducción completos.
3.  **UX Inclusiva y de Élite:** Las banderas representan países, no idiomas. La SSoT para la selección de un idioma es su **nombre nativo (endónimo)**. Las banderas sirven como un apoyo visual contextual para el _locale_, no como el identificador principal. La interfaz de selección debe ser buscable para manejar la escala.
4.  **Enrutamiento Resiliente y Predecible:** El sistema de enrutamiento manejará cualquier código de locale válido presente en la URL. Para los locales que aún no tienen contenido implementado, el sistema recurrirá de manera elegante al `defaultLocale`, garantizando que el usuario nunca se enfrente a un error fatal.

## 3. Arquitectura y Aparatos Soberanos

- **`src/shared/lib/i18n/i18n.config.ts`**: Es el motor y la base de datos en memoria del sistema. Contiene el `LANGUAGE_MANIFEST` completo con los 128 locales.
- **`src/components/layout/LanguageSwitcher.tsx`**: Es el **activador** de la UI. Muestra la bandera del locale actual y abre el modal de selección.
- **`src/components/layout/LanguageSelectorModal.tsx`**: Es el **selector** de UI de élite. Proporciona una interfaz de búsqueda para que los usuarios encuentren y seleccionen su idioma preferido de la lista completa.
- **`src/components/ui/FlagIcon.tsx`**: Es el **despachador visual**. Renderiza dinámicamente el componente SVG de la bandera correcta basándose en el `countryCode` del manifiesto.
- **`/src/messages/`**: Es el **repositorio de contenido**. La adición de un nuevo idioma se reduce a añadir los archivos `.i18n.json` correspondientes dentro de esta estructura.

## 4. El Manifiesto de 128 Idiomas

El siguiente `LANGUAGE_MANIFEST` es la implementación completa de nuestra SSoT geo-lingüística. Es la base de datos que permite que nuestra arquitectura soporte todos estos locales desde el primer día.

```typescript
// Fragmento de: src/shared/lib/i18n/i18n.config.ts

export const LANGUAGE_MANIFEST: readonly LanguageManifestItem[] = [
  (ver listado i18n) ];
5. Flujo de Trabajo y Protocolo de Implementación
Fase 1: Implementación del Núcleo (Status: COMPLETO)
La arquitectura está forjada para soportar los 128 locales.
El contenido de la interfaz (UI) será implementado y mantenido inicialmente para los 4 locales del núcleo:
es-ES (Español)
it-IT (Italiano)
en-US (Inglés)
pt-BR (Portugués)
Fase 2: Expansión de Contenido (Protocolo para Añadir un Nuevo Idioma)
La adición de soporte de contenido para un nuevo idioma (ej. fr-FR) es una operación de bajo riesgo y no requiere cambios de ingeniería:
Validar: Asegurarse de que el locale (fr-FR) ya existe en el LANGUAGE_MANIFEST.
Crear Contenido: Replicar la estructura de archivos en /src/messages/, añadiendo la clave "fr-FR" a cada archivo .i18n.json con el contenido traducido.
Verificar: El script pnpm build:i18n validará automáticamente los nuevos archivos de contenido contra los schemas existentes. El sistema de enrutamiento y los componentes de UI lo soportarán de forma nativa.
Fase 3: Enrutamiento para Idiomas Sin Contenido Implementado
Comportamiento Soberano: Si un usuario accede a una URL con un locale que existe en nuestro LANGUAGE_MANIFEST pero para el cual aún no hemos creado los archivos .i18n.json (ej. /de-DE/store), el sistema NO fallará.
Mecanismo de Fallback: El motor de i18n (getDictionary) detectará la ausencia de un diccionario para de-DE y cargará automáticamente el diccionario del defaultLocale (es-ES).
Resultado para el Usuario: El usuario verá la página en el idioma por defecto (español), pero la URL (/de-DE/store) se conservará. Esto garantiza una experiencia funcional y predecible, evitando errores 404 y sentando las bases para la futura adición del contenido en alemán.
6. Conclusión
Este manifiesto establece una arquitectura de internacionalización que es a la vez ambiciosa en su alcance global y pragmática en su implementación. Al separar la capacidad estructural del contenido, garantizamos que el ecosistema esté preparado para un crecimiento sin fricciones, cumpliendo nuestra visión de una plataforma verdaderamente de élite y de alcance mundial.

---


```
