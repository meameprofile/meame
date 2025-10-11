// RUTA: src/shared/emails/OrderConfirmationEmail.tsx
/**
 * @file OrderConfirmationEmail.tsx
 * @description Plantilla de correo de élite para confirmación de pedidos.
 *              v3.0.0 (Decoupled Styling): Refactorizado a un componente de
 *              presentación puro que recibe sus estilos a través de props,
 *              cumpliendo con la arquitectura de theming soberana.
 * @version 3.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import React from "react";

import { logger } from "@/shared/lib/logging";
import type { EmailTheme } from "@/shared/lib/schemas/emails/email-theme.schema";
import type { OrderConfirmationEmailContent } from "@/shared/lib/schemas/emails/order-confirmation-email.schema";
import type { OrderItem } from "@/shared/lib/schemas/entities/order.schema";

interface OrderConfirmationEmailProps {
  content: OrderConfirmationEmailContent;
  orderId: string;
  totalAmount: string;
  items: OrderItem[];
  styles: EmailTheme;
}

export function OrderConfirmationEmail({
  content,
  orderId,
  totalAmount,
  items,
  styles,
}: OrderConfirmationEmailProps): React.ReactElement {
  logger.info(
    `[ReactEmail] Renderizando plantilla OrderConfirmationEmail v3.0 para pedido: ${orderId}`
  );

  return (
    <Html>
      <Head />
      <Preview>{content.previewText.replace("{{orderId}}", orderId)}</Preview>
      <Body style={styles.main}>
        <Container style={styles.container}>
          <Img
            src="https://res.cloudinary.com/dzjg5wr4q/image/upload/v1727038933/webvork/assets/i-sybl-global-fitwell-logo-01/v1-original.png"
            width="150"
            height="28"
            alt="Global Fitwell Logo"
            style={styles.logo}
          />
          <Heading style={styles.heading}>{content.title}</Heading>
          <Text style={styles.paragraph}>
            {content.greeting.replace("{{orderId}}", orderId)}
          </Text>
          <Hr style={styles.hr} />
          <Section>
            {items.map((item) => (
              <Text key={item.variantId} style={styles.itemText}>
                {item.quantity} x {item.name}
              </Text>
            ))}
          </Section>
          <Hr style={styles.hr} />
          <Text style={styles.totalText}>
            <strong>{content.totalLabel}:</strong> {totalAmount}
          </Text>
          <Text style={styles.paragraph}>{content.footerText}</Text>
        </Container>
      </Body>
    </Html>
  );
}
