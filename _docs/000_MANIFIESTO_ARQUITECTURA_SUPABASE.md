# APARATO 1: NUEVO MANIFIESTO SOBERANO

# RUTA: \_docs/000_MANIFIESTO_ARQUITECTURA_SUPABASE.md

/\*\*

- @file 000_MANIFIESTO_ARQUITECTURA_SUPABASE.md
- @description Manifiesto Soberano y SSoT para la arquitectura de integración con Supabase.
-              Define la separación de intereses inmutable entre la infraestructura de la
-              base de datos y la capa de acceso a datos de la aplicación.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Soberano: Arquitectura de Integración con Supabase

## 1. Filosofía Raíz: "Infraestructura como Código, Aplicación como Consumidor"

Este documento establece la separación arquitectónica inmutable entre el código que define nuestra infraestructura de Supabase y el código de nuestra aplicación Next.js que la consume. La claridad de estas fronteras es fundamental para la mantenibilidad, escalabilidad y seguridad del ecosistema `meame`.

## 2. Anatomía de la Integración Soberana

Nuestra integración con Supabase se divide en tres dominios distintos y soberanos, cada uno con una ubicación y propósito específicos:

### 2.1. Dominio de Infraestructura (`/supabase`)

- **Ubicación:** Raíz del proyecto.
- **Propósito Soberano:** Contener todo el código que es **desplegado o ejecutado por la plataforma Supabase**. Esto es "Infraestructura como Código".
- **Justificación Arquitectónica:** Esta estructura es un estándar de la CLI de Supabase. Mantenerla garantiza la compatibilidad total con el ecosistema de Supabase para migraciones, despliegue de Edge Functions y desarrollo local.
- **Contenido:**
  - `supabase/migrations/`: Almacena los archivos `.sql` de migración de esquema.
  - `supabase/functions/`: Almacena el código de las Edge Functions (Deno).

### 2.2. Dominio de Acceso a Datos (`/src/shared/lib/supabase`)

- **Ubicación:** Dentro de la librería compartida de la aplicación.
- **Propósito Soberano:** Actuar como la **única interfaz (fachada)** a través de la cual la aplicación Next.js se comunica con la API de Supabase.
- **Justificación Arquitectónica:** Centralizar la creación de clientes de Supabase (`client.ts`, `server.ts`) en un solo lugar nos permite gestionar la autenticación y el acceso a datos de forma consistente y segura. Es la capa de abstracción entre nuestra aplicación y el servicio externo.
- **Contenido:**
  - `client.ts`: Cliente para el navegador.
  - `server.ts`: Cliente para Componentes de Servidor y Server Actions.
  - `middleware.ts`: Lógica de Supabase para el middleware de Next.js.
  - `database.types.ts`: La SSoT de los tipos de la base de datos, generada por la CLI de Supabase.

### 2.3. Dominio de Operaciones (`/scripts/supabase`)

- **Ubicación:** Directorio de scripts en la raíz del proyecto.
- **Propósito Soberano:** Contener herramientas de desarrollo y mantenimiento que interactúan con la base de datos pero **no son parte del código de la aplicación en tiempo de ejecución**.
- **Justificación Arquitectónica:** Separa las herramientas de desarrollo del código de producción, manteniendo el `bundle` de la aplicación limpio y optimizado.
- **Contenido:**
  - `seeding/`: Scripts para poblar la base de datos con datos de prueba.
  - `schema-*.ts`: Scripts de diagnóstico para auditar la estructura de la base de datos.

---

ACTUALICAION

### 2.4. Dominio de Sincronización Local (Comandos)

- **Propósito Soberano:** Garantizar que el entorno de desarrollo local esté inequívocamente enlazado con la SSoT de la base de datos remota.
- **Protocolo Mandatorio:**
  1.  **Enlace (`pnpm supabase:link`):** Este es el **primer comando** que se debe ejecutar después de clonar el proyecto o si el proyecto de Supabase remoto cambia. Establece la conexión entre la CLI local y el `project-ref` correcto en Supabase.
  2.  **Sincronización de Tipos (`pnpm supabase:gen-types`):** Después de cualquier migración de esquema en la base de datos, este comando **DEBE** ejecutarse para regenerar `database.types.ts`, manteniendo el "mapa" de TypeScript alineado con la "realidad" de la base de datos.
- **Justificación Arquitectónica:** Este protocolo desacopla la configuración del proyecto de los comandos de operación, eliminando los "números mágicos" y haciendo que las migraciones de ecosistema sean un proceso explícito y controlado.

---
