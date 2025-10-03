// .docs-espejo/components/sections/Hero.tsx.md
/\*\*

- @file Hero.tsx.md
- @description Documento Espejo para el componente de sección Hero.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Componente Hero

## 1. Rol Estratégico

El componente `Hero` es el **Aparato de Captura de Atención Primaria** de cualquier página. Su rol estratégico es comunicar la Propuesta Única de Valor (PUV) de la manera más impactante y concisa posible en los primeros segundos de la visita del usuario.

Es el componente más importante "above the fold" y su diseño y contenido deben generar una conexión emocional o intelectual inmediata que motive al usuario a seguir explorando.

## 2. Arquitectura y Flujo de Ejecución

`Hero` es un **componente de presentación puro**.

1.  **Entrada:** Recibe un único objeto `content` que contiene todo el texto necesario (título, subtítulo). Este objeto es validado por su schema (`hero.schema.ts`) antes de llegar al componente.
2.  **Proceso:** El componente desestructura el objeto `content` y renderiza el título y el subtítulo. Implementa una animación de cascada de palabras en el título para crear un efecto visual dinámico y atractivo.
3.  **Salida:** Una sección `<section>` semántica y estilizada, lista para ser insertada en el layout de la página.

## 3. Contrato de API

- **`content: Dictionary['hero']`**: Un objeto que contiene las cadenas de texto `title` y `subtitle`.

## 4. Zona de Melhorias Futuras

- **Fondo Dinámico:** La prop `content` podría extenderse para incluir una URL de imagen o video de fondo, permitiendo una personalización visual completa por campaña.
- **Animaciones Configurables:** Añadir propiedades al `content` para controlar el tipo de animación de entrada (ej. "cascade", "fade-in", "slide-up"), ofreciendo mayor flexibilidad creativa.
- **Inclusión de CTA:** El `content` podría incluir opcionalmente los datos para un Botón de Llamada a la Acción (CTA) principal, convirtiendo el Hero en un punto de conversión directo.
  // .docs-espejo/components/sections/Hero.tsx.md
