// .docs-espejo/components/layout/sections/footer.tsx.md
/\*\*

- @file footer.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Footer.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Footer Section

## 1. Rol Estratégico

La `FooterSection` es el componente de cierre de la página, proporcionando navegación secundaria, enlaces legales y de contacto, e información de copyright. Su rol estratégico es ofrecer una red de seguridad de navegación para el usuario, reforzar la identidad de la marca y presentar información de atribución y legal de forma clara y accesible.

## 2. Arquitectura y Flujo de Ejecución

El componente es un **componente de presentación puro**, diseñado para ser completamente data-driven.

1.  **Entrada:** Recibe una única prop `content`, cuyo contrato está estrictamente definido por `footer.schema.ts`. Este objeto contiene toda la información necesaria: el nombre del logo, un array de columnas de enlaces (cada una con un título y sus enlaces), el texto de copyright y los datos para el enlace del desarrollador.
2.  **Renderizado Dinámico:** El componente mapea el array `linkColumns` para generar dinámicamente cada columna y sus respectivos enlaces. Esto lo hace flexible a cualquier número de columnas o enlaces definidos en el archivo de contenido.
3.  **Composición:** Utiliza componentes de UI atómicos como `Separator` y `Link` de Next.js para construir su estructura.
4.  **Salida:** Un elemento semántico `<footer>` completo, estilizado y totalmente internacionalizado.

## 3. Contrato de API

- **Función:** `FooterSection({ content }: FooterSectionProps): React.ReactElement | null`
- **Props (`FooterSectionProps`):**
  - `content`: Un objeto que contiene todo el contenido textual y de datos, validado por Zod.

## 4. Zona de Melhorias Futuras

- **Suscripción a Newsletter:** Integrar un campo de entrada de email simple y un botón de suscripción como un componente opcional dentro del footer, controlado por una propiedad en el `content`.
- **Iconos Sociales:** En lugar de solo enlaces de texto en las columnas, añadir una sección dedicada a iconos de redes sociales, controlada por un array `socialLinks` en el `content` que incluya el nombre del icono de Lucide.
- **Contenido Dinámico de Copyright:** Hacer que el año en el texto de copyright se genere dinámicamente (`new Date().getFullYear()`) en lugar de estar hardcodeado en el archivo i18n, para que se actualice automáticamente cada año.

// .docs-espejo/components/layout/sections/footer.tsx.md
