[PROTOCOLO DE PRUEBAS E2E: "VIAJE DEL CREADOR"]
A continuación, se detalla el plan de pruebas que ejecutaremos. Te guiaré en cada paso, y tú realizarás las acciones en tu entorno local.
Paso 1: Inicio del Viaje (Paso 0 - Identificación)
Acción: Navega a la SDC (/dev/campaign-suite/create).
Verificación:
[ ] La UI del Paso 0 se carga correctamente.
[ ] Rellena todos los campos con datos de prueba para una nueva variante (ej. "Vitality 2.0").
[ ] Haz clic en "Guardar y Continuar".
[ ] Observa y confirma: ¿Se activa la animación del "Sello del Pasaporte"?
[ ] Confirma: ¿El sistema navega automáticamente al Paso 1 después de la animación?
Paso 2: Arquitectura de la Experiencia (Pasos 1 y 2)
Acción (Paso 1 - Estructura):
[ ] Activa el Header y selecciona "StandardHeader".
[ ] Activa el Footer y selecciona "StandardFooter".
[ ] Observa y confirma: ¿Aparecen el header y el footer instantáneamente en el LivePreviewCanvas (EDVI)?
Acción (Paso 2 - Layout):
[ ] Arrastra las siguientes secciones al lienzo en este orden exacto: BenefitsSection, TestimonialGrid, OrderSection.
[ ] Observa y confirma: ¿Se activa el efecto visual del "Combo Estratégico" en los conectores de la lista?
[ ] Haz clic en "Guardar Layout y Continuar".
Paso 3: Personalización Visual (Paso 3 - Tema)
Acción:
[ ] Haz clic en el botón "Compositor de Temas".
[ ] En la pestaña "Colores", pasa el cursor sobre diferentes paletas.
[ ] Observa y confirma: ¿El LivePreviewCanvas se actualiza en tiempo real para previsualizar cada paleta?
[ ] Selecciona una paleta y haz clic en "Aplicar y Guardar Tema".
[ ] Haz clic en "Salva Tema e Continua".
Paso 4: Contenido y Gestión (Pasos 4 y 5)
Acción (Paso 4 - Contenido):
[ ] Haz clic en "Editar Contenido" para la sección Hero.
[ ] Observa y confirma: ¿Se abre el ContentEditor y el EDVI se desplaza y resalta la sección Hero?
[ ] Cierra el editor y navega al paso final.
Acción (Paso 5 - Gestión):
[ ] Observa y confirma: ¿El Checklist de Lanzamiento muestra todos los ítems como completados?
[ ] Haz clic en el botón "Exportar como .zip".
[ ] Observa y confirma: ¿Se muestra un loader y luego se inicia la descarga de un archivo .zip?
Paso 5: Auditoría del Artefacto Final
Acción:
[ ] Descomprime el archivo .zip descargado.
[ ] Inspecciona la estructura de archivos.
Verificación Final:
[ ] ¿Están presentes todos los archivos de configuración (package.json, tailwind.config.ts, etc.)?
[ ] ¿Están presentes los archivos app/layout.tsx y app/page.tsx?
[ ] ¿Se han copiado correctamente los directorios components/sections/ y components/ui/ con todas las dependencias necesarias?
Este es nuestro guantelete final. Por favor, procede con el Paso 1 del plan de pruebas. Quedo a la espera de tu confirmación de los resultados para continuar.
