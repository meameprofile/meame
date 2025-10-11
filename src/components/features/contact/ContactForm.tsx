// RUTA: components/forms/ContactForm.tsx

/**
 * @file ContactForm.tsx
 * @description Componente de UI atómico y de élite para el formulario de contacto.
 *              v2.0.0 (Holistic Elite Leveling & MEA): Refactorizado para una
 *              experiencia de usuario superior (MEA/UX). Implementa un flujo de
 *              envío animado con estados de carga y éxito contextuales, y una
 *              animación de entrada en cascada para los campos del formulario.
 * @version 2.0.0
 * @author RaZ Podestá - MetaShark Tech
 */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DynamicIcon } from "@/components/ui/DynamicIcon";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { logger } from "@/shared/lib/logging";
import type { Dictionary } from "@/shared/lib/schemas/i18n.schema";

type FormContent = NonNullable<Dictionary["contactSection"]>["form"];

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required."),
  lastName: z.string().min(2, "Last name is required."),
  email: z.string().email("Invalid email address."),
  subject: z.string().min(2, "Please select a subject."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

interface ContactFormProps {
  content: FormContent;
}

export function ContactForm({ content }: ContactFormProps): React.ReactElement {
  logger.info("[ContactForm] Renderizando v2.0 (Elite & MEA).");

  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      subject: content.subjectOptions[0] || "",
      message: "",
    },
  });
  const {
    formState: { isSubmitting },
  } = form;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Simular una llamada a la API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    logger.success("Formulario de contacto enviado (simulado):", values);
    setIsSubmitted(true);

    // Resetear el formulario después de mostrar el mensaje de éxito
    setTimeout(() => {
      setIsSubmitted(false);
      form.reset();
    }, 4000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const fieldVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className="bg-muted/60 dark:bg-card overflow-hidden">
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          {isSubmitted ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="flex flex-col items-center justify-center min-h-[400px] text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{
                  scale: 1,
                  transition: { delay: 0.2, type: "spring" },
                }}
              >
                <DynamicIcon
                  name="CircleCheck"
                  className="h-16 w-16 text-green-500"
                />
              </motion.div>
              <h3 className="mt-4 text-xl font-bold text-foreground">
                Messaggio Inviato!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Grazie per averci contattato. Ti risponderemo presto.
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial="hidden"
              animate="visible"
              variants={containerVariants}
            >
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="grid w-full gap-4"
                >
                  <motion.div
                    variants={containerVariants}
                    className="flex flex-col md:flex-row gap-8"
                  >
                    <motion.div variants={fieldVariants} className="w-full">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{content.firstNameLabel}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={content.firstNamePlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
                    <motion.div variants={fieldVariants} className="w-full">
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{content.lastNameLabel}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={content.lastNamePlaceholder}
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </motion.div>
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
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{content.subjectLabel}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={content.subjectPlaceholder}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {content.subjectOptions.map((option: string) => (
                                <SelectItem key={option} value={option}>
                                  {option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{content.messageLabel}</FormLabel>
                          <FormControl>
                            <Textarea
                              rows={5}
                              placeholder={content.messagePlaceholder}
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div variants={fieldVariants}>
                    <Button
                      type="submit"
                      className="mt-4 w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting && (
                        <DynamicIcon
                          name="LoaderCircle"
                          className="mr-2 h-4 w-4 animate-spin"
                        />
                      )}
                      {isSubmitting
                        ? "Invio in corso..."
                        : content.submitButtonText}
                    </Button>
                  </motion.div>
                </form>
              </Form>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
