// .docs-espejo/components/layout/sections/services.tsx.md
/\*\*

- @file services.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Servicios.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Services Section

## 1. Rol Estratégico

La `ServicesSection` tiene como objetivo presentar una lista de servicios o características de forma clara y segmentada. Su rol es educar al usuario sobre el valor ofrecido, destacando visualmente las ofertas "Pro" o "Premium" para guiar la decisión del usuario hacia planes de mayor valor.

## 2. Arquitectura y Flujo de Ejecución

El componente es un **componente de presentación puro**.

1.  **Entrada:** Recibe una única prop `content`, cuyo contrato está definido por `services-section.schema.ts`. Este objeto contiene los títulos de la sección y un array de objetos `services`, donde cada uno tiene un título, descripción y un booleano `isPro`.
2.  **Renderizado Dinámico:** El componente mapea el array `content.services` para renderizar una `Card` por cada servicio.
3.  **Lógica Condicional de UI:** Dentro del mapeo, se realiza una comprobación simple del booleano `service.isPro`. Si es `true`, el componente `Badge` (con la etiqueta "PRO") se renderiza; si es `false`, no se renderiza nada. Este enfoque es más simple y declarativo que usar `data-attributes` y CSS complejo.
4.  **Salida:** Un bloque `<section>` completo con una cuadrícula de tarjetas de servicios.

## 3. Contrato de API

- **Función:** `ServicesSection({ content }: ServicesSectionProps): React.ReactElement | null`
- **Props (`ServicesSectionProps`):**
  - `content`: Objeto con los datos de la sección, validado por Zod.

## 4. Zona de Melhorias Futuras

- **Enlaces Individuales:** Añadir una propiedad `href` opcional a cada `ServiceItem` en el schema para que cada tarjeta pueda enlazar a una página de detalle del servicio.
- **Iconografía:** Añadir una propiedad `iconName` a cada `ServiceItem` para mostrar un `DynamicIcon` relevante en la cabecera de la tarjeta, mejorando el impacto visual.
- **Filtrado de Servicios:** Para listas largas, añadir controles (ej. botones de filtro "Todos", "Gratis", "Pro") para que el usuario pueda filtrar dinámicamente los servicios mostrados.

// .docs-espejo/components/layout/sections/services.tsx.md
