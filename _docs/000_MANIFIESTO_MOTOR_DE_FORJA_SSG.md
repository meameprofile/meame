// \_docs/000_MANIFIESTO_MOTOR_DE_FORJA_SSG.md
/\*\*

- @file 000_MANIFIESTO_MOTOR_DE_FORJA_SSG.md
- @description Manifiesto Canónico y SSoT para el Motor de Forja (SSG).
-              Define la filosofía, arquitectura, componentes y flujo de ejecución
-              del sistema de build programático y estático de campañas.
- @version 1.0.0
  _@author RaZ Podestá - MetaShark Tech
  _/

# Manifiesto Canónico: El Motor de Forja (SSG)

## 1. Filosofía Raíz: "Automatización Soberana, Build Transaccional, Artefactos Inmutables."

Este documento es la Única Fuente de Verdad (SSoT) que rige la arquitectura del **Motor de Forja**, nuestro sistema de Generación de Sitios Estáticos (SSG). Su misión es transformar un "plano" de campaña (`CampaignDraft`) en un producto de software final: un sitio web Next.js estático, optimizado, auto-contenido y listo para ser desplegado en cualquier entorno de hosting.

La filosofía del motor es la **transacción inmutable**: o un build se completa con éxito al 100%, o falla limpiamente sin dejar artefactos corruptos. Cada build es un proceso atómico, observable y predecible.

## 2. Pilares Arquitectónicos

El Motor de Forja se construye sobre un conjunto de aparatos de ingeniería de software de élite, cada uno con una responsabilidad única y soberana.

### 2.1. El Pipeline de Build (`BuildPipeline`)

Es el orquestador central. Esta clase (`ssg/engine/build-pipeline.ts`) implementa un patrón de "cadena de responsabilidad" transaccional. Las tareas se ejecutan en secuencia estricta, y cualquier fallo en una de ellas detiene inmediatamente todo el proceso, garantizando que no se produzcan builds parciales.

### 2.2. La Receta de Build (`campaign.build-pipeline.ts`)

Es el "plano de ensamblaje" de una campaña. Esta función pura define la secuencia exacta de tareas que deben ejecutarse para forjar un sitio de campaña. Desacopla la _definición_ del proceso de su _ejecución_.

### 2.3. Los Generadores Atómicos (`ssg/generators/`)

Son los "brazos robóticos" del motor. Cada generador es una función pura `server-only` con una única misión: crear un archivo específico (`package.json`, `next.config.mjs`, `globals.css`, etc.) a partir del estado del `CampaignDraft`.

### 2.4. El Copiador de Dependencias por AST (`componentCopier.ts`)

Es el cerebro analítico del motor. En lugar de copiar ciegamente todos los componentes de la UI, este aparato:

1.  **Analiza el `draft`** para identificar las secciones requeridas.
2.  **Parsea el código** de esos componentes usando un Árbol de Sintaxis Abstracto (AST).
3.  **Detecta recursivamente** todas las dependencias (`import` con alias `@/`).
4.  **Copia selectivamente** solo los archivos necesarios al directorio de build.
    Esto garantiza que el artefacto final sea mínimo, optimizado y libre de código muerto.

### 2.5. El Builder Programático (`programmatic-builder.ts`)

Esta utilidad invoca el comando `next build` en un subproceso aislado. Es agnóstico al gestor de paquetes (detecta `pnpm`, `yarn`, `npm`) y captura toda la salida (stdout/stderr) para una observabilidad completa, asegurando que el build de Next.js se ejecute en un entorno limpio.

### 2.6. El Empaquetador (`packager.ts`)

Es la etapa final de la línea de ensamblaje. Una vez que Next.js genera el directorio estático `/out`, esta utilidad lo comprime en un archivo `.zip` inmutable, listo para su almacenamiento y distribución.

## 3. Flujo de Ejecución: La Línea de Ensamblaje

Cuando un usuario activa la acción "Exportar", se inicia un flujo de ejecución inmutable y observable:

1.  **Invocación:** Se llama a `packageCampaignAction` con el `CampaignDraft` actual.
2.  **Contextualización:** Se crea un `BuildContext`, definiendo un directorio temporal único para el build.
3.  **Planificación:** Se instancia un `BuildPipeline` y se le aplica la "receta" de `defineCampaignBuildPipeline`.
4.  **Ejecución Transaccional:** El `pipeline.run()` comienza, ejecutando cada tarea en orden:
    a. Creación de directorios y archivos de configuración (`package.json`, `next.config.mjs`, etc.).
    b. Generación de la estructura base de la aplicación Next.js (`layout.tsx`, `page.tsx`).
    c. Ensamblaje y escritura de los datos de la campaña (`content.json`) y el tema (`globals.css`, `theme.json`).
    d. **Análisis y Copia Inteligente:** `componentCopier` analiza el `draft` y copia solo los componentes de UI, hooks y utilidades necesarios.
    e. **Compilación Aislada:** `programmatic-builder` ejecuta `pnpm next build` dentro del directorio temporal.
    f. **Empaquetado Final:** `packager` comprime el directorio `/out` resultante en un archivo `.zip`.
5.  **Persistencia del Artefacto:** La `packageCampaignAction` sube el `.zip` a un almacenamiento persistente (Vercel Blob) y genera una URL de descarga segura.
6.  **Limpieza:** Se eliminan todos los archivos y directorios temporales, sin dejar rastro en el sistema de archivos del servidor.

Este proceso de extremo a extremo garantiza la creación de artefactos de campaña consistentes, optimizados y reproducibles con una fiabilidad de nivel de producción.
