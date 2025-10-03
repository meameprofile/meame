// .docs-espejo/components/ui/Accordion.tsx.md
/\*\*

- @file Accordion.tsx.md
- @description Documento Espejo para el componente de Acordeón nivelado.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Componente `AccordionItem`

## 1. Rol Estratégico

El `AccordionItem` es un aparato de UI atómico y de presentación pura, diseñado para mostrar y ocultar secciones de contenido de manera interactiva. Su principal aplicación es en las secciones de **Preguntas Frecuentes (FAQ)**, donde la claridad y la capacidad de escaneo son cruciales para resolver las objeciones del usuario.

## 2. Arquitectura y Patrones

- **Composición:** Este componente no es un sistema de acordeón completo, sino un **único item**. La lógica para agrupar múltiples `AccordionItem` y controlar su comportamiento (ej. permitir solo uno abierto a la vez) reside en el componente padre que lo consume, como `FaqAccordion.tsx`. Esto maximiza su reutilización.
- **Estado Aislado:** Cada `AccordionItem` gestiona su propio estado de "abierto/cerrado" a través del hook `useState`. Es un componente autocontenido.
- **Animación Declarativa:** Utiliza `framer-motion` (`AnimatePresence` y `motion.div`) para manejar las animaciones de despliegue, asegurando una experiencia de usuario fluida y físicamente plausible.

## 3. Contrato de API (`props`)

- **`content: { question: string, answer: string }`**: El componente se adhiere a la **Internacionalización por Contrato (i18n-B)**. No acepta strings primitivas, sino un objeto `content` cuya estructura está garantizada por un schema de Zod. Esto lo desacopla completamente del contenido.

## 4. Zona de Mejoras Futuras

1.  **Icono Personalizable:** La prop `content` podría extenderse para incluir un campo opcional `icon` que permita cambiar el `ChevronDown` por defecto.
2.  **Estado Controlado:** Podríamos añadir props opcionales (`isOpen`, `onToggle`) para permitir que un componente padre controle el estado del `AccordionItem`, transformándolo de un componente no controlado a uno controlado.
    // .docs-espejo/components/ui/Accordion.tsx.md
