// .docs-espejo/components/sections/CommunitySection.tsx.md
/\*\*

- @file .docs-espejo/components/sections/CommunitySection.tsx.md
- @description Manifiesto conceptual y SSoT para el aparato de sección de comunidad.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: CommunitySection

## 1. Rol Estratégico

El rol del aparato `CommunitySection` es actuar como un punto de conversión social. Su objetivo es dirigir el tráfico del sitio web hacia una plataforma de comunidad externa (como Discord, Telegram, etc.), fomentando un mayor compromiso y lealtad del usuario más allá de la simple visita a la página.

## 2. Arquitectura y Flujo de Ejecución

`CommunitySection` es un **Componente de Presentación Puro (Dumb Component)**.

- **Entrada:** Recibe un único objeto `content` a través de sus `props`, validado por `CommunitySectionLocaleSchema`. Este objeto contiene todos los textos, el nombre del icono (`LucideIconName`), y la URL de destino.
- **Lógica Interna:** No posee estado ni lógica de negocio. Utiliza el componente `DynamicIcon` para renderizar el icono solicitado y el componente `Button` para el enlace externo.
- **Salida:** Renderiza una sección (`<section>`) visualmente distintiva que invita a la acción de unirse a la comunidad.

## 3. Contrato de API (Props)

- **`content: Dictionary['communitySection']`**:
  - **Tipo:** Objeto, validado por `CommunitySectionLocaleSchema`.
  - **Descripción:** Contiene todo el contenido necesario: `iconName`, `titlePart1`, `titlePart2`, `description`, `buttonLabel`, `buttonHref`.
  - **Obligatorio:** Sí. Si es `undefined`, el componente renderiza `null`.

## 4. Zona de Melhorias Futuras

- **Métricas de Clic:** Integrar un evento de tracking (ej. Sentry, Google Analytics) en el `onClick` del botón para medir la tasa de conversión de esta sección.
- **Icono Personalizado:** Modificar el contrato para aceptar una `iconUrl` opcional, permitiendo usar un SVG personalizado (como el logo de Discord) en lugar de un icono de Lucide.
- **Fondo Dinámico:** Añadir una prop `backgroundImageUrl` al contrato para permitir un fondo de sección más inmersivo.
  // .docs-espejo/components/sections/CommunitySection.tsx.md
