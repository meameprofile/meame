// RUTA: src/components/features/auth/components/LoginForm.tsx
/**
 * @file LoginForm.tsx
 * @description Componente de presentación puro para el formulario de login.
 *              v12.0.0 (Pure Presentation & State Decoupling): Desacoplado de la
 *              lógica de transición y enrutamiento, que ahora es gestionada por
 *              el orquestador padre.
 * @version 12.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, type Variants, AnimatePresence } from "framer-motion";
import React, { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";

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
  Dialog,
  DialogContent,
  Separator,
} from "@/components/ui";
import type { Locale } from "@/shared/lib/i18n/i18n.config";
import {
  LoginSchema,
  type LoginFormData,
} from "@/shared/lib/schemas/auth/login.schema";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";
import { logger } from "@/shared/lib/telemetry/heimdall.emitter";

import { DeveloperErrorDisplay } from "../../dev-tools";

import { ForgotPasswordForm } from "./ForgotPasswordForm";
import { OAuthButtons } from "./OAuthButtons";

type LoginFormContent = NonNullable<Dictionary["devLoginPage"]>;
type OAuthButtonsContent = NonNullable<Dictionary["oAuthButtons"]>;

interface LoginFormProps {
  content: LoginFormContent;
  oAuthContent: OAuthButtonsContent;
  locale: Locale;
  onSwitchView: () => void;
  onSubmit: (data: LoginFormData) => void;
  isPending: boolean;
}

const formVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 120 } },
};

export function LoginForm({
  content,
  oAuthContent,
  onSwitchView,
  onSubmit,
  isPending,
}: LoginFormProps) {
  const traceId = useMemo(
    () => logger.startTrace("LoginForm_Lifecycle_v12.0"),
    []
  );
  useEffect(() => {
    logger.info("[LoginForm] Componente de presentación montado.", { traceId });
    return () => logger.endTrace(traceId);
  }, [traceId]);

  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email:
        process.env.NODE_ENV === "development" ? "superuser@webvork.dev" : "",
      password:
        process.env.NODE_ENV === "development" ? "superuserpassword123" : "",
    },
  });

  if (!content || !oAuthContent) {
    return (
      <DeveloperErrorDisplay
        context="LoginForm"
        errorMessage="Contrato de UI violado: Contenido i18n incompleto."
      />
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{content.title}</CardTitle>
          <CardDescription>{content.subtitle}</CardDescription>
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
                      <div className="flex items-center">
                        <FormLabel>{content.passwordLabel}</FormLabel>
                        <button
                          type="button"
                          onClick={() => setIsForgotPasswordOpen(true)}
                          className="ml-auto inline-block text-sm underline"
                        >
                          {content.forgotPasswordLink}
                        </button>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder={content.passwordPlaceholder}
                            className="pr-10"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute inset-y-0 right-0 h-full px-3 text-muted-foreground"
                            onClick={() => setShowPassword((prev) => !prev)}
                            aria-label={
                              showPassword
                                ? content.hidePasswordAriaLabel
                                : content.showPasswordAriaLabel
                            }
                          >
                            <AnimatePresence mode="wait">
                              <motion.div
                                key={showPassword ? "eye-off" : "eye"}
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                transition={{ duration: 0.15 }}
                              >
                                <DynamicIcon
                                  name={showPassword ? "EyeOff" : "Eye"}
                                  className="h-4 w-4"
                                />
                              </motion.div>
                            </AnimatePresence>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
              {form.formState.errors.root && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.root.message}
                </p>
              )}
              <motion.div variants={fieldVariants} className="!mt-6">
                <Button type="submit" className="w-full" disabled={isPending}>
                  {isPending && (
                    <DynamicIcon
                      name="LoaderCircle"
                      className="mr-2 h-4 w-4 animate-spin"
                    />
                  )}
                  {isPending ? content.buttonLoadingText : content.buttonText}
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
                O continúa con
              </span>
            </div>
          </div>
          <OAuthButtons content={oAuthContent} />
          <div className="mt-4 text-center text-sm">
            {content.signUpPrompt}{" "}
            <button
              onClick={onSwitchView}
              className="underline font-semibold text-primary"
            >
              {content.signUpLink}
            </button>
          </div>
        </CardContent>
      </Card>
      <Dialog
        open={isForgotPasswordOpen}
        onOpenChange={setIsForgotPasswordOpen}
      >
        <DialogContent>
          <ForgotPasswordForm
            content={content.forgotPassword}
            onSuccess={() => setIsForgotPasswordOpen(false)}
            onCancel={() => setIsForgotPasswordOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
