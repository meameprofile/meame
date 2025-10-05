// RUTA: src/components/features/commerce/OrderForm.tsx
/**
 * @file OrderForm.tsx
 * @description Formulario de pedido de élite, "Guardián de la Conversión".
 *              v9.1.0 (Ghost Import Eradication): Se elimina la dependencia
 *              al hook obsoleto `useProducerLogic`, restaurando la integridad
 *              del build y el cumplimiento arquitectónico.
 * @version 9.1.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useRef, useMemo } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants } from "framer-motion";
import { getProducerConfig } from "@/shared/lib/config/producer.config";
import { logger } from "@/shared/lib/logging";
// --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
// Se elimina la importación del hook obsoleto que causaba el error de build.
// import { useProducerLogic } from "@/shared/hooks/use-producer-logic";
// --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
import { HiddenFormFields } from "@/components/features/commerce/HiddenFormFields";
import { FormInput } from "@/components/ui/FormInput";
import { Button, DynamicIcon } from "@/components/ui";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools";

// --- SSoT de Contratos y Animaciones ---

const OrderFormSchema = z.object({
  name: z.string().min(2, "Il nome è obbligatorio"),
  phone: z
    .string()
    .min(9, "Il numero de telefono non è valido")
    .regex(/^\+?[0-9\s-()]+$/, "Formato de telefone inválido"),
});

type OrderFormData = z.infer<typeof OrderFormSchema>;

interface OrderFormProps {
  content: {
    nameInputLabel: string;
    nameInputPlaceholder: string;
    phoneInputLabel: string;
    phoneInputPlaceholder: string;
    submitButtonText: string;
    submitButtonLoadingText: string;
  };
}

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

export function OrderForm({ content }: OrderFormProps): React.ReactElement {
  const traceId = useMemo(
    () => logger.startTrace("OrderForm_Lifecycle_v9.1"),
    []
  );
  logger.info("[OrderForm] Renderizando v9.1 (Ghost Import Eradicated).", {
    traceId,
  });

  const formRef = useRef<HTMLFormElement>(null);
  const producerConfig = getProducerConfig();

  // --- [INICIO DE REFACTORIZACIÓN ARQUITECTÓNICA] ---
  // Se elimina la llamada al hook obsoleto. La lógica de tracking ahora es
  // gestionada de forma centralizada y soberana por `ProducerLogicWrapper` en el layout raíz.
  // useProducerLogic();
  // --- [FIN DE REFACTORIZACIÓN ARQUITECTÓNICA] ---

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(OrderFormSchema),
  });

  const onSubmit: SubmitHandler<OrderFormData> = (data) => {
    logger.success(
      "[OrderForm] Validación de cliente exitosa. Enviando formulario nativo...",
      { action: producerConfig.ACTION_URL, data, traceId }
    );
    formRef.current?.submit();
  };

  if (!content) {
    const errorMsg = "Contrato de UI violado: La prop 'content' es requerida.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="OrderForm" errorMessage={errorMsg} />
    );
  }

  return (
    <motion.form
      ref={formRef}
      onSubmit={handleSubmit(onSubmit)}
      action={producerConfig.ACTION_URL}
      method="POST"
      className="space-y-4 wv_order-form"
      noValidate
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={fieldVariants}>
        <FormInput
          id="name"
          label={content.nameInputLabel}
          icon="User"
          placeholder={content.nameInputPlaceholder}
          {...register("name")}
          error={errors.name?.message}
          aria-invalid={!!errors.name}
          autoComplete="name"
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <FormInput
          id="phone"
          label={content.phoneInputLabel}
          icon="Phone"
          type="tel"
          placeholder={content.phoneInputPlaceholder}
          {...register("phone")}
          error={errors.phone?.message}
          aria-invalid={!!errors.phone}
          autoComplete="tel"
        />
      </motion.div>

      <HiddenFormFields />

      <motion.div variants={fieldVariants} className="!mt-6 pt-2">
        <Button
          type="submit"
          size="lg"
          variant="default"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting && (
            <DynamicIcon
              name="LoaderCircle"
              className="mr-2 h-4 w-4 animate-spin"
            />
          )}
          {isSubmitting
            ? content.submitButtonLoadingText
            : content.submitButtonText}
        </Button>
      </motion.div>
    </motion.form>
  );
}
