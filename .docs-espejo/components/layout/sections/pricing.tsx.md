// .docs-espejo/components/layout/sections/pricing.tsx.md
/\*\*

- @file pricing.tsx.md
- @description Documento Espejo y SSoT conceptual para la sección de Precios.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Pricing Section

## 1. Rol Estratégico

La `PricingSection` es un componente de conversión clave. Su propósito es presentar las opciones de precios de un producto o servicio de manera clara, concisa y persuasiva. Debe facilitar la comparación entre planes, destacar la opción recomendada (`isPopular`) y guiar al usuario hacia la toma de una decisión de compra.

## 2. Arquitectura y Flujo de Ejecución

El componente es un **componente de presentación puro y localizado**.

1.  **Entrada:** Recibe dos props:
    - `content`: Un objeto que contiene todos los datos de la sección (títulos, moneda y un array de `plans`), validado por `pricing-section.schema.ts`.
    - `locale`: Un string que representa el locale actual del usuario (ej. "it-IT").
2.  **Lógica de Formato:** Utiliza una función interna `formatCurrency` que instancia `Intl.NumberFormat` con el `locale` y la `currency` recibidos en las props. Esto asegura que los valores numéricos de los precios se rendericen en el formato correcto para el mercado objetivo.
3.  **Renderizado Dinámico:** Mapea el array `content.plans` para renderizar dinámicamente cada `Card` de precios.
4.  **Lógica Condicional de UI:** Aplica estilos condicionales (ej. un borde destacado, un escalado) a la tarjeta cuyo `plan.isPopular` sea `true`, atrayendo visualmente la atención del usuario a la oferta recomendada.
5.  **Composición:** Construye la UI utilizando componentes atómicos como `Card` y `Button`.

## 3. Contrato de API

- **Función:** `PricingSection({ content, locale }: PricingSectionProps): React.ReactElement | null`
- **Props (`PricingSectionProps`):**
  - `content`: Objeto con los datos de la sección.
  - `locale`: String del locale actual.

## 4. Zona de Melhorias Futuras

- **Interruptor de Facturación (Billing Toggle):** Añadir un interruptor (ej. "Mensual / Anual") que, al ser activado, cambie los precios mostrados. Esto requeriría añadir precios anuales al schema y al `content`, y gestionar el estado del interruptor.
- **Tooltips de Características:** Para las características (`benefitList`) que puedan ser complejas, añadir un icono de información junto a cada una que muestre un `Tooltip` con una descripción más detallada al pasar el ratón por encima.
- **Integración con Stripe/Paddle:** Hacer que el `buttonText` y el `href` del botón de cada plan sean dinámicos y puedan apuntar a URLs de checkout de una pasarela de pago, convirtiendo la sección en un componente de ventas funcional.

// .docs-espejo/components/layout/sections/pricing.tsx.md
