// RUTA: src/components/features/auth/components/SignUpForm.tsx
/**
 * @file SignUpForm.tsx
 * @description Componente de presentación puro para el formulario de registro de élite,
 *              nivelado con observabilidad completa y cumplimiento de contratos.
 * @version 4.0.0 (Holistic Observability & Contract Integrity)
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import React, { useTransition, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { motion, type Variants } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  Button,
  DynamicIcon,
  Separator,
} from "@/components/ui";
import { logger } from "@/shared/lib/logging";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import {
  SignUpSchema,
  type SignUpFormData,
} from "@/shared/lib/schemas/auth/signup.schema";
import { signUpAction } from "@/shared/lib/actions/auth/auth.actions";
import { OAuthButtons } from "./OAuthButtons";
import { DeveloperErrorDisplay } from "@/components/features/dev-tools/DeveloperErrorDisplay";

type AuthFormContent = NonNullable<Dictionary["devLoginPage"]>;
type OAuthButtonsContent = NonNullable<Dictionary["oAuthButtons"]>;

interface SignUpFormProps {
  content: AuthFormContent;
  oAuthContent: OAuthButtonsContent;
  locale: Locale;
  onSwitchView: () => void;
}

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

export function SignUpForm({
  content,
  oAuthContent,
  onSwitchView,
}: SignUpFormProps) {
  const traceId = useMemo(
    () => logger.startTrace("SignUpForm_Lifecycle_v4.0"),
    []
  );
  useEffect(() => {
    logger.info("[SignUpForm] Componente montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isPending, startTransition] = useTransition();
  const form = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      fullName: process.env.NODE_ENV === "development" ? "Super User Dev" : "",
      email:
        process.env.NODE_ENV === "development" ? "superuser@webvork.dev" : "",
      password:
        process.env.NODE_ENV === "development" ? "superuserpassword123" : "",
      confirmPassword:
        process.env.NODE_ENV === "development" ? "superuserpassword123" : "",
    },
  });

  if (!content || !oAuthContent) {
    const errorMsg =
      "Contrato de UI violado: Faltan props de contenido requeridas.";
    logger.error(`[Guardián] ${errorMsg}`, { traceId });
    return (
      <DeveloperErrorDisplay context="SignUpForm" errorMessage={errorMsg} />
    );
  }

  const onSubmit = (data: SignUpFormData) => {
    const submitTraceId = logger.startTrace("SignUpForm.onSubmit");
    // --- [INICIO DE CORRECCIÓN DE CONTRATO v4.0.0] ---
    const groupId = logger.startGroup(
      "[SignUpForm] Procesando envío de formulario de registro...",
      submitTraceId
    );
    // --- [FIN DE CORRECCIÓN DE CONTRATO v4.0.0] ---

    startTransition(async () => {
      logger.traceEvent(submitTraceId, "Invocando 'signUpAction'...");
      const result = await signUpAction(data);
      if (result.success) {
        toast.success("¡Registro exitoso!", {
          description: "Revisa tu email para confirmar tu cuenta.",
        });
        logger.success("[SignUpForm] Registro exitoso.", {
          traceId: submitTraceId,
        });
        form.reset();
      } else {
        toast.error("Error de Registro", { description: result.error });
        logger.error("[SignUpForm] Fallo en el registro.", {
          error: result.error,
          traceId: submitTraceId,
        });
      }
      // --- [INICIO DE CORRECCIÓN DE CONTRATO v4.0.0] ---
      logger.endGroup(groupId);
      logger.endTrace(submitTraceId);
      // --- [FIN DE CORRECCIÓN DE CONTRATO v4.0.0] ---
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{content.signUpLink}</CardTitle>
        <CardDescription>
          Crea una nueva cuenta para acceder a la suite de desarrollo.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            variants={formVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fieldVariants}>
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre Completo</FormLabel>
                    <FormControl>
                      <Input placeholder="Tu nombre completo" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content.emailLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder={content.emailPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{content.passwordLabel}</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder={content.passwordPlaceholder}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={fieldVariants}>
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Contraseña</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Repite la contraseña"
                        {...field}
                        onPaste={(e) => {
                          e.preventDefault();
                          toast.info(
                            "Por seguridad, escribe la contraseña de nuevo."
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </motion.div>
            <motion.div variants={fieldVariants} className="!mt-6">
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && (
                  <DynamicIcon
                    name="LoaderCircle"
                    className="mr-2 h-4 w-4 animate-spin"
                  />
                )}
                {isPending ? "Registrando..." : content.signUpLink}
              </Button>
            </motion.div>
          </motion.form>
        </Form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              O regístrate con
            </span>
          </div>
        </div>

        <OAuthButtons content={oAuthContent} />

        <div className="mt-4 text-center text-sm">
          ¿Ya tienes una cuenta?{" "}
          <button
            onClick={onSwitchView}
            className="underline font-semibold text-primary"
          >
            Iniciar Sesión
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
