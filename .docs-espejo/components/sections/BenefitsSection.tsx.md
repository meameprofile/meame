// .docs-espejo/components/sections/BenefitsSection.tsx.md
/\*\*

- @file .docs-espejo/components/sections/BenefitsSection.tsx.md
- @description Manifiesto conceptual y SSoT para el aparato de sección de beneficios.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: BenefitsSection

## 1. Rol Estratégico

El rol del aparato `BenefitsSection` es comunicar de forma rápida, clara y visualmente atractiva los beneficios clave del producto o servicio. Actúa como un pilar de persuasión, traduciendo características en valor tangible para el usuario, respondiendo a la pregunta fundamental: "¿Qué gano yo con esto?".

## 2. Arquitectura y Flujo de Ejecución

`BenefitsSection` es un **Componente de Presentación Puro (Dumb Component)**. Su arquitectura se adhiere estrictamente al Principio de Responsabilidad Única (PRU).

- **Entrada:** Recibe un único objeto `content` a través de sus `props`. Este objeto contiene todo el texto y los datos necesarios (títulos, subtítulos, y un array de beneficios con sus propios iconos, títulos y descripciones).
- **Lógica Interna:** No contiene lógica de negocio, estado, o fetching de datos. Su única función es mapear el array de beneficios a componentes `Card` y renderizar la estructura de la sección.
- **Salida:** Renderiza una sección (`<section>`) de la página completamente estilizada y poblada con el contenido recibido.

## 3. Contrato de API (Props)

- **`content: Dictionary['benefitsSection']`**:
  - **Tipo:** Objeto, validado por `BenefitsSectionLocaleSchema`.
  - **Descripción:** Es el contrato de datos inmutable que contiene todo el contenido necesario. Su estructura está definida en `lib/schemas/components/benefits-section.schema.ts`.
  - **Obligatorio:** Sí. Si es `undefined`, el componente renderiza `null`.

## 4. Zona de Melhorias Futuras

- **Animaciones de Entrada:** Implementar animaciones escalonadas (`stagger`) con `framer-motion` para que cada tarjeta de beneficio aparezca de forma secuencial al entrar en el viewport.
- **Configuración de Layout:** Añadir una prop opcional `layout: 'grid' | 'list'` al contrato de datos para permitir al equipo de marketing cambiar la visualización sin tocar el código.
- **Tooltips para Iconos:** Añadir un `tooltip` en el `hover` de cada icono para proporcionar contexto adicional, si fuera necesario.
- **Soporte para Imágenes:** Modificar el contrato para permitir una `imageUrl` opcional en cada `BenefitItem`, permitiendo mostrar una imagen en lugar de un icono para mayor impacto visual.
  // .docs-espejo/components/sections/BenefitsSection.tsx.md
