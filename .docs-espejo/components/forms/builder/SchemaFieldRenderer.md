// .docs-espejo/components/forms/builder/SchemaFieldRenderer.md
/\*\*

- @file SchemaFieldRenderer.md
- @description Documento Espejo y SSoT conceptual para el módulo SchemaFieldRenderer.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Módulo `SchemaFieldRenderer`

## 1. Rol Estratégico

El `SchemaFieldRenderer` es un **Motor de Renderizado de Formularios Declarativo**. Su propósito estratégico es desacoplar por completo la lógica de los formularios de su presentación, permitiendo a la aplicación generar interfaces de edición complejas y seguras a nivel de tipos directamente a partir de un schema de Zod.

Es un componente de propósito general, fundamental para la Suite de Diseño de Campañas, y diseñado para ser reutilizado en cualquier parte del sistema que requiera la edición de datos estructurados.

## 2. Arquitectura y Flujo de Ejecución

El módulo opera como un sistema de muñecas rusas, donde cada capa delega una responsabilidad más específica a la capa inferior:

1.  **Entrada:** `ContentEditorBody` invoca a `<SchemaFieldRenderer />`, pasándole el `control` de `react-hook-form`, el `fieldName` y el `fieldSchema` de Zod.
2.  **Orquestación (`SchemaFieldRenderer`):** Este aparato envuelve el campo en la lógica de `react-hook-form` (`<FormField>`), gestionando la etiqueta (`<FormLabel>`) y los mensajes de error. Extrae el `fieldType` del schema.
3.  **Despacho (`FieldControl`):** Delega el renderizado del control de UI al `FieldControl`, pasándole el `fieldType`.
4.  **Renderizado Atómico (`...Field.tsx`):** El `FieldControl` actúa como un `switch`, seleccionando y renderizando el micro-componente apropiado (`BooleanField`, `NumberField`, etc.), que es el único que contiene JSX de UI.

## 3. Contrato de API

```typescript
interface SchemaFieldRendererProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  fieldName: Path<TFieldValues>;
  fieldSchema: z.ZodTypeAny;
  onValueChange: (field: Path<TFieldValues>, value: unknown) => void;
}
4. Zona de Mejoras Futuras (Aparato Individual)
Soporte para z.enum: Añadir un micro-componente EnumField.tsx que renderice un <Select> con las opciones del enum.
Soporte para Imágenes: Añadir un ImageField.tsx que renderice el ImageUploader para campos z.string().describe("image").
Soporte para Colores: Añadir un ColorPickerField.tsx para campos z.string().describe("color").
Metadata de Schema: Utilizar el useFieldMetadata.ts para extraer label, placeholder y description directamente del fieldSchema de Zod (ej. z.string().describe("Este es el placeholder")), reduciendo la necesidad de props adicionales.
Renderizado Condicional: Soportar lógica para mostrar/ocultar un campo basado en el valor de otro (ej. z.object({ a: z.boolean(), b: z.string().optional().refine(...) })).
Soporte para Arrays: Implementar un ArrayField.tsx que permita añadir/eliminar dinámicamente un conjunto de campos para z.array(z.object(...)).
5. Zona de Mejoras Futuras (Sistema de forms/builder)
Registro de Controles Personalizados: Crear un FieldControlRegistry que permita registrar nuevos tipos de campo personalizados sin modificar el switch del FieldControl, siguiendo el Patrón de Inversión de Dependencias.
Generador de Formularios Completos: Crear un SchemaFormBuilder.tsx que tome un schema de Zod completo y un onSubmit, y renderice todo el formulario, incluyendo el botón de submit y el manejo del estado de carga.
Integración con Tooltips: Integrar el sistema con un componente <Tooltip> de shadcn/ui para que, si un schema tiene una .description(), se muestre un icono de información junto a la etiqueta del campo con la descripción.
Layouts de Grid: Añadir metadatos al schema para controlar el layout (ej. z.string().describe("col-span-2")) y que el SchemaFieldRenderer pueda colocar los campos en una cuadrícula.
Validación Asíncrona: Integrar soporte para validaciones de Zod asíncronas (.refine(async ...)), mostrando un estado de carga/validación a nivel de campo.
```
