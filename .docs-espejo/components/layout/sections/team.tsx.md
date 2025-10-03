// .docs-espejo/components/layout/sections/team.tsx.md
/\*\*

- @file team.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Equipo.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Team Section

## 1. Rol Estratégico

La `TeamSection` es un componente de "humanización" y prueba social. Su propósito es presentar a los miembros clave del equipo, poniendo una cara humana a la marca. Esto genera confianza, muestra la experiencia detrás del producto/servicio y crea una conexión más personal con la audiencia.

## 2. Arquitectura y Flujo de Ejecución

El componente es un **componente de presentación puro**.

1.  **Entrada:** Recibe una única prop `content`, validada por `team-section.schema.ts`. Este objeto contiene los títulos de la sección y un array de `members`.
2.  **Renderizado Dinámico (Miembros):** El componente mapea el array `content.members` para renderizar una `Card` por cada miembro del equipo.
3.  **Renderizado Dinámico (Redes Sociales):** Dentro de cada tarjeta de miembro, se mapea el sub-array `socialNetworks`. Para cada red social, renderiza un `Link` que envuelve un `DynamicIcon`, asegurando un renderizado de iconos eficiente y consistente.
4.  **Estilo y Composición:** Utiliza componentes atómicos como `Card`, `Image` de Next.js, `Link` y `DynamicIcon` para construir la UI. Incluye micro-interacciones sutiles (ej. `group-hover` en la imagen) para mejorar la experiencia del usuario.
5.  **Salida:** Un bloque `<section>` con una cuadrícula de perfiles de miembros del equipo.

## 3. Contrato de API

- **Función:** `TeamSection({ content }: TeamSectionProps): React.ReactElement | null`
- **Props (`TeamSectionProps`):**
  - `content`: Objeto con los datos de la sección.

## 4. Zona de Melhorias Futuras

- **Modal de Biografía:** Al hacer clic en una tarjeta de miembro, se podría abrir un modal (`Dialog`) que muestre una biografía más extensa y detallada, obtenida de una propiedad `bio` adicional en el schema.
- **Filtro por Departamento:** Para equipos grandes, añadir botones de filtro ("Todos", "Desarrollo", "Marketing") que permitan al usuario filtrar los miembros mostrados.
- **Efecto Hover Avanzado:** Implementar un efecto hover más avanzado en las tarjetas, como un "tilt" 3D o una superposición de color con los iconos sociales, para aumentar el impacto visual.

// .docs-espejo/components/layout/sections/team.tsx.md
