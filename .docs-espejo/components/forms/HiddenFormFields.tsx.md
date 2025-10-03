// .docs-espejo/components/forms/HiddenFormFields.tsx.md
/\*\*

- @file .docs-espejo/components/forms/HiddenFormFields.tsx.md
- @description Documento Espejo para el aparato HiddenFormFields.tsx. Define su
-              rol estratégico, arquitectura y contrato de API.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Aparato `HiddenFormFields`

## 1. Rol Estratégico

El rol estratégico de `HiddenFormFields` es servir como un **contenedor atómico y soberano para el payload de datos de tracking del productor**. Su propósito es desacoplar completamente el componente `OrderForm` de los detalles de implementación específicos del sistema de afiliados.

Al aislar estos campos, se adhiere rigurosamente al **Principio de Responsabilidad Única (PRU)**, mejorando la mantenibilidad y la claridad del código. `OrderForm` se preocupa de la interacción del usuario; `HiddenFormFields` se preocupa de la carga de tracking.

## 2. Arquitectura y Flujo de Ejecución

- **Tipo de Componente**: Componente de Presentación Puro (Dumb Component).
- **Lógica Interna**: El componente no contiene lógica. Su única función es renderizar un conjunto estático de elementos `<input type="hidden">`.
- **Flujo de Datos**:
  1. Es renderizado dentro del `<form>` del componente `OrderForm`.
  2. Los scripts de tracking del productor (ej. `webvork.js`), que se ejecutan en el cliente, localizan estos campos por su atributo `name` y los pueblan con los valores de tracking correspondientes (UTMs, GUID, etc.).
  3. Cuando el formulario se envía, los valores de estos campos se incluyen en la petición POST hacia el endpoint del productor.

## 3. Contrato de API (Props)

Actualmente, el componente no requiere props, ya que los campos son estáticos. Se define una interfaz vacía para mantener la consistencia y permitir futuras extensiones.

```typescript
interface HiddenFormFieldsProps {
  // No se requieren props en la v1.0.0.
}
```
