// .docs-espejo/components/layout/sections/testimonial.tsx.md
/\*\*

- @file testimonial.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección TestimonialCarouselSection.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Testimonial Carousel Section

## 1. Rol Estratégico

La `TestimonialCarouselSection` es un componente de prueba social de alto impacto. Su propósito es mostrar testimonios de clientes de manera dinámica y visualmente atractiva utilizando un carrusel. Esto permite presentar múltiples pruebas de satisfacción en un espacio compacto, reforzando la confianza del usuario sin abrumarlo con texto.

## 2. Arquitectura y Flujo de Ejecución

El componente es una pieza de **presentación pura (`use client`)**.

1.  **Entrada:** Recibe una única prop `content`, validada por `testimonial-carousel-section.schema.ts`, que contiene los títulos de la sección y un array de `reviews`.
2.  **Renderizado Dinámico:** Mapea el array `content.reviews` para generar un `CarouselItem` por cada testimonio. Cada item se compone de subcomponentes atómicos como `Card`, `Avatar` y un renderizador de estrellas.
3.  **Lógica Condicional de UI (Estrellas):** Renderiza dinámicamente el número de estrellas de la calificación (`rating`) aplicando estilos diferentes para las estrellas activas y las inactivas.
4.  **Componente Carousel:** Utiliza el componente `Carousel` de `shadcn/ui` (basado en Embla Carousel) para gestionar toda la lógica de la interacción del carrusel (navegación, slides, etc.).
5.  **Salida:** Un bloque `<section>` interactivo y completamente funcional.

## 3. Contrato de API

- **Función:** `TestimonialCarouselSection({ content }: TestimonialCarouselSectionProps): React.ReactElement | null`
- **Props (`TestimonialCarouselSectionProps`):**
  - `content`: Objeto con los datos de la sección.

## 4. Zona de Melhorias Futuras

- **Autoplay:** Añadir una opción de `autoplay` al carrusel, controlada por una propiedad en el `content.config`, para que los testimonios roten automáticamente.
- **Video Testimonials:** Evolucionar el schema para que cada `review` pueda contener opcionalmente una `videoUrl`. Si está presente, la tarjeta podría mostrar un thumbnail con un botón de play para abrir el video en un modal.
- **Integración con APIs de Reseñas:** Conectar el componente a una API de reseñas (ej. Trustpilot, Google Reviews) para obtener y mostrar testimonios reales y actualizados dinámicamente.

// .docs-espejo/components/layout/sections/testimonial.tsx.md
