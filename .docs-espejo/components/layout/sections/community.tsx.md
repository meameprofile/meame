// .docs-espejo/components/layout/sections/community.tsx.md
/\*\*

- @file community.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Comunidad.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Community Section

## 1. Rol Estratégico

La `CommunitySection` es un componente de "Llamada a la Acción" (Call to Action) de alta visibilidad. Su propósito estratégico es canalizar el interés del usuario hacia las plataformas de la comunidad (ej. Discord, Telegram) para fomentar el engagement y construir una base de usuarios leales más allá del sitio web.

Actúa como un puente entre el consumo pasivo de contenido y la participación activa, siendo un elemento clave en el embudo de marketing relacional.

## 2. Arquitectura y Flujo de Ejecución

El componente está diseñado bajo el **Principio de Responsabilidad Única** como un **componente de presentación puro**.

1.  **Entrada:** Recibe una única prop `content` que se ajusta al contrato definido en `community-section.schema.ts`. Este objeto contiene todos los textos, el nombre del icono y la URL del enlace.
2.  **Lógica Interna:** No contiene lógica de negocio. Su única función es desestructurar el objeto `content` y mapear sus valores a los elementos JSX correspondientes.
3.  **Renderizado:** Utiliza componentes atómicos del directorio `ui` como `Card`, `Button`, y `DynamicIcon` para construir la interfaz visual.
4.  **Guarda de Resiliencia:** Incluye una guarda de seguridad que retorna `null` si la prop `content` no se proporciona, evitando errores de renderizado si los datos no están disponibles en el diccionario i18n para una página específica.

## 3. Contrato de API

- **Función:** `CommunitySection({ content }: CommunitySectionProps): React.ReactElement | null`
- **Props (`CommunitySectionProps`):**
  - `content: Dictionary["communitySection"]`: Un objeto que contiene todo el contenido textual y de datos, validado por Zod.

## 4. Zona de Melhorias Futuras

- **Tracking de Eventos:** Integrar un sistema de tracking de eventos (ej. Google Analytics, Sentry) en el `onClick` del botón para medir la tasa de clics (CTR) y la efectividad de la sección como herramienta de conversión a la comunidad.
- **Contenido Dinámico de Comunidad:** En lugar de un enlace estático, el componente podría hacer una llamada a la API de Discord/Telegram para mostrar el número actual de miembros en línea, añadiendo un elemento de prueba social dinámica ("Únete a 1,234 miembros activos").
- **Variantes Visuales:** Extender el componente para aceptar una prop `variant` (ej. `'default' | 'compact'`) que modifique su apariencia (tamaño, colores) para adaptarse a diferentes contextos de la página (ej. un CTA más sutil en el pie de página).

// .docs-espejo/components/layout/sections/community.tsx.md
