// .docs-espejo/components/layout/sections/sponsors.tsx.md
/\*\*

- @file sponsors.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Patrocinadores.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Sponsors Section

## 1. Rol Estratégico

La `SponsorsSection` es un componente de prueba social y credibilidad. Su propósito es mostrar los logotipos o nombres de empresas, socios o patrocinadores de confianza, asociando la marca del proyecto con otras entidades establecidas y reforzando la confianza del usuario.

## 2. Arquitectura y Flujo de Ejecución

El componente es una pieza de **presentación pura**, diseñada para ser eficiente y visualmente dinámica.

1.  **Entrada:** Recibe una única prop `content`, validada por `sponsors-section.schema.ts`, que contiene el título de la sección y un array de `sponsors`. Cada patrocinador es un objeto con un `name` y un `icon`.
2.  **Componente de Marquesina:** Utiliza el paquete `react-fast-marquee` (la dependencia estándar del proyecto para este efecto) para crear un bucle de desplazamiento infinito.
3.  **Renderizado Dinámico de Iconos:** Dentro de la marquesina, mapea el array `content.sponsors`. Para cada patrocinador, renderiza un `DynamicIcon` (la SSoT para iconos) y el nombre del patrocinador.
4.  **Estilo y Configuración:** Las propiedades de la marquesina (velocidad, gradiente, etc.) están configuradas directamente en el componente para un comportamiento visual consistente.
5.  **Salida:** Un bloque `<section>` con una banda de patrocinadores en continuo movimiento.

## 3. Contrato de API

- **Función:** `SponsorsSection({ content }: SponsorsSectionProps): React.ReactElement | null`
- **Props (`SponsorsSectionProps`):**
  - `content`: Objeto con los datos de la sección.

## 4. Zona de Melhorias Futuras

- **Logotipos en lugar de Iconos:** Evolucionar el schema para permitir una propiedad `logoUrl` opcional en cada `sponsor`. El componente podría renderizar condicionalmente un `<Image>` si `logoUrl` está presente, o el `DynamicIcon` como fallback.
- **Enlaces de Patrocinadores:** Añadir una propiedad `href` opcional a cada `sponsor` para que cada entrada en la marquesina sea un enlace clicable a la web del patrocinador.
- **Velocidad Configurable:** Exponer la prop `speed` de la marquesina a través del `content.config` para permitir un control más granular del efecto desde el archivo i18n.

// .docs-espejo/components/layout/sections/sponsors.tsx.md
