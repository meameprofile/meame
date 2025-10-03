// .docs-espejo/components/ui/ContactForm.tsx.md
/\*\*

- @file ContactForm.tsx.md
- @description Documento Espejo y SSoT conceptual para el componente atómico ContactForm.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: ContactForm

## 1. Rol Estratégico

El `ContactForm` es un componente de UI atómico y "smart" cuya única responsabilidad es la captura de datos de contacto del usuario. Ha sido atomizado desde la `ContactSection` para encapsular toda la complejidad de la gestión de estado del formulario, la validación y la lógica de envío, siguiendo el Principio de Responsabilidad Única (PRU).

Su propósito es ser un componente reutilizable, seguro y que proporciona una experiencia de usuario fluida en la entrada de datos.

## 2. Arquitectura y Flujo de Ejecución

1.  **Entrada:** Recibe una única prop `content` con todos los textos necesarios (labels, placeholders, etc.), haciéndolo completamente data-driven e internacionalizable.
2.  **Gestión de Estado:** Utiliza la librería `react-hook-form` para gestionar el estado de los campos, la validación y el estado de envío (`isSubmitting`).
3.  **Validación por Contrato:** Emplea `zod` y `@hookform/resolvers` para validar los datos del formulario en el lado del cliente, proporcionando feedback instantáneo al usuario. El schema de validación está definido dentro del propio componente.
4.  **Lógica de Envío:** La función `onSubmit` se encarga de la lógica a ejecutar cuando el formulario es válido. Actualmente, simula un envío y loguea los datos. En una implementación futura, invocaría una Server Action.
5.  **Renderizado:** Utiliza los componentes de UI atómicos del proyecto (`Input`, `Button`, `Select`, `Textarea`, etc.) para construir la interfaz del formulario.

## 3. Contrato de API

- **Función:** `ContactForm({ content }: ContactFormProps): React.ReactElement`
- **Props (`ContactFormProps`):**
  - `content`: Un objeto que contiene todos los textos para los labels, placeholders y el botón de envío.

## 4. Zona de Melhorias Futuras

- **Integración con Server Actions:** Reemplazar la simulación de `onSubmit` con una llamada a una Server Action real que maneje el envío de correos o la inserción en una base de datos.
- **Manejo de Estado de Envío Mejorado:** Mostrar mensajes de éxito o error al usuario después del envío del formulario utilizando `react-hot-toast` o un sistema similar.
- **Protección Anti-Spam:** Integrar un sistema de protección como Google reCAPTCHA v3.
- **Componente Genérico:** Evolucionar el `ContactForm` hacia un componente `FormBuilder` más genérico que pueda construir diferentes formularios a partir de una configuración JSON.

// .docs-espejo/components/ui/ContactForm.tsx.md
