// \_docs/000_MANIFIESTO_THEMING_SOBERANO.md
/\*\*

- @file 000_MANIFIESTO_THEMING_SOBERANO.md
- @description Manifiesto Canónico y SSoT para la Arquitectura de Theming.
-              Define la filosofía, los pilares, el flujo de datos y los contratos
-              del sistema de temas visuales del ecosistema.
- @version 1.0.0
  _@author RaZ Podestá - MetaShark Tech (Inteligencia Artificial - Asistente Personalizado)
  _/

# Manifiesto Canónico: La Arquitectura de Theming Soberana

## 1. Filosofía Raíz: "Composición Atómica, Ensamblaje Dinámico, Estilo Soberano."

Este documento es la Única Fuente de Verdad (SSoT) que rige la arquitectura del sistema visual de todo el ecosistema. Nuestra filosofía rechaza los temas monolíticos y frágiles. En su lugar, tratamos el estilo como un conjunto de "átomos" intercambiables —fragmentos de color, tipografía y geometría— que se ensamblan dinámicamente para forjar una identidad visual única para cada campaña.

La soberanía del estilo reside en su composición declarativa, no en hojas de estilo estáticas.

## 2. Pilares Arquitectónicos

La arquitectura de theming se erige sobre cinco pilares inquebrantables:

### 2.1. SSoT de Tokens Globales (`globals.css`)

El archivo `src/app/globals.css` es la constitución del sistema de diseño. Utilizando la directiva `@theme` de Tailwind CSS v4, define el conjunto completo de **tokens de diseño semánticos** como variables CSS. Este es el fallback y la base sobre la cual se aplican todas las personalizaciones.

### 2.2. Fragmentos Atómicos (`content/theme-fragments/`)

La innovación central es la deconstrucción de los temas en sus "átomos" puros, almacenados como archivos JSON:

- **Paletas de Colores:** `.../colors/*.colors.json`
- **Conjuntos de Tipografía:** `.../fonts/*.fonts.json`
- **Estilos de Geometría (Radios):** `.../radii/*.radii.json`
  Esta granularidad permite una reutilización y combinación casi infinita, formando la base de la personalización.

### 2.3. NET (Nomenclatura Estructurada de Trazos)

Es el "lenguaje de ensamblaje" del sistema visual. Una simple cadena de texto en `campaign.map.json` actúa como un plano para construir un tema completo.
**Ejemplo:** `"theme": "cp-vitality.ft-poppins-inter.rd-soft"`

- `cp-vitality`: Usa la **P**aleta de **C**olor (`colors`) `vitality`.
- `ft-poppins-inter`: Usa el conjunto de **F**uen**t**es (`fonts`) `poppins-inter`.
- `rd-soft`: Usa el estilo de **R**a**d**ios (`radii`) `soft`.
  El manifiesto `src/shared/lib/config/theming.config.ts` es la SSoT que mapea estos prefijos a sus directorios correspondientes.

### 2.4. Ensamblaje en Servidor (`getCampaignData`)

La Server Action `getCampaignData` es el motor de ensamblaje. Orquesta la carga en paralelo del fragmento base, los tres fragmentos definidos en la NET y cualquier `themeOverrides` específico. Luego, fusiona estos objetos en un único `AssembledTheme` y lo valida rigurosamente contra su schema (`AssembledThemeSchema`).

### 2.5. Inyección Anti-FOUC (`CampaignThemeProvider`)

El `AssembledTheme` validado se pasa al Server Component `CampaignThemeProvider`. Este genera una cadena de variables CSS y la inyecta directamente en un tag `<style>` en el `<head>` del HTML. Esta técnica de élite previene el "Flash of Unstyled Content" (FOUC), garantizando un renderizado visualmente perfecto desde el primer byte.

## 3. Flujo de Datos: Del Plano a la Píxel

El viaje de un tema desde la declaración hasta la renderización sigue un flujo inmutable y observable:

1.  **Declaración (El Plano):** Un estratega define la traza NET en el `campaign.map.json` de una campaña.
2.  **Orquestación (El Motor):** Al solicitar una página, `getCampaignData` lee el mapa, parsea la NET y dispara la carga de todos los fragmentos JSON necesarios.
3.  **Ensamblaje (La Forja):** Los objetos JSON de los fragmentos se fusionan (`deepMerge`) en un único objeto `AssembledTheme`.
4.  **Validación (El Guardián):** El objeto ensamblado se valida contra `AssembledThemeSchema`. Si falla, la operación se detiene para prevenir la inyección de un tema corrupto.
5.  **Inyección (El Renderizado):** El `CampaignThemeProvider` recibe el tema válido, genera las variables CSS y las inyecta en el servidor, entregando al cliente un HTML ya estilizado.

## 4. La Experiencia de Desarrollador (DX) de Élite: El `SuiteStyleComposer`

Esta arquitectura habilita una de las herramientas más potentes del DCC: el `SuiteStyleComposer`. Este aparato permite a los desarrolladores:

- **Previsualizar** temas completos en tiempo real.
- **Crear y modificar** los fragmentos atómicos de forma granular.
- **Guardar** nuevas combinaciones como "presets" en la base de datos, abriendo la puerta a una gestión de temas por usuario y por workspace.

## 5. Contratos de Datos Soberanos

La integridad de todo el sistema se basa en los siguientes schemas de Zod:

- `AssembledThemeSchema`: El contrato para un tema final y completo.
- `ColorsFragmentSchema`, `FontsFragmentSchema`, `GeometryFragmentSchema`: Los contratos para cada tipo de fragmento atómico.
- `CampaignMapSchema`: El contrato que valida la traza NET dentro de los manifiestos de campaña.
