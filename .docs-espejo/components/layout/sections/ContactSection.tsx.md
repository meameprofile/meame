// .docs-espejo/components/layout/sections/ContactSection.tsx.md
/\*\*

- @file ContactSection.tsx.md
- @description Documento Espejo y SSoT conceptual para el orquestador ContactSection.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: ContactSection Orchestrator

## 1. Rol Estratégico

La `ContactSection` actúa como un **orquestador de layout**. Su única responsabilidad es estructurar la sección de contacto de la página, presentando la información de contacto de la empresa y proporcionando un espacio para el formulario de interacción.

Ha sido refactorizada para delegar toda la lógica y el estado del formulario al componente atómico `ContactForm`, adhiriéndose estrictamente al Principio de Responsabilidad Única y funcionando como un componente de presentación puro.

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada:** Recibe una única prop `content` que contiene todos los datos para la sección, incluyendo el contenido para la lista de información y el sub-objeto `form` para el componente hijo.
2.  **Renderizado de Layout:** Mapea los datos de `content.title`, `content.description`, y `content.contactInfo` para renderizar la parte informativa de la sección.
3.  **Composición de Componentes:** Renderiza el componente `ContactForm`, pasándole la parte del `content` que le corresponde (`content.form`). Esta composición es el núcleo de su función como orquestador.
4.  **Salida:** Un bloque `<section>` completo y funcional.

## 3. Contrato de API

- **Función:** `ContactSection({ content }: ContactSectionProps): React.ReactElement | null`
- **Props (`ContactSectionProps`):**
  - `content`: Un objeto que contiene todo el contenido textual y de datos, validado por `contact-section.schema.ts`.

## 4. Zona de Melhorias Futuras

- **Variantes de Layout:** Introducir una prop `layoutVariant` (ej. `'image-left' | 'form-left'`) para permitir diferentes disposiciones de la información de contacto y el formulario, aumentando su reutilización en diferentes páginas.
- **Mapa Interactivo (Integración):** Añadir una opción para mostrar un mapa interactivo (ej. Google Maps, OpenStreetMap) basado en la dirección proporcionada en `content.contactInfo`, como un componente hijo adicional.

// .docs-espejo/components/layout/sections/ContactSection.tsx.md
