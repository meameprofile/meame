<div align="center">
  <img src="https://raw.githubusercontent.com/user-attachments/assets/91c78479-5091-4963-83bd-d75d506d860d" alt="Meame Project Banner" width="800"/>
  <h1>Meame: La Suite de Orquestación Creativa de Élite</h1>
  <p>
    <strong>Una arquitectura soberana para forjar, gestionar y optimizar ecosistemas digitales de alta conversión, impulsada por IA y principios de ingeniería de software de élite.</strong>
  </p>
  <p>
    <a href="https://github.com"><img src="https://img.shields.io/badge/build-passing-brightgreen.svg" alt="Estado del Build"/></a>
    <a href="_docs/000_MANIFIESTO_PILARES_DE_CALIDAD.md"><img src="https://img.shields.io/badge/quality-elite-blueviolet.svg" alt="Calidad del Código"/></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="Licencia: MIT"/></a>
    <a href="https://conventionalcommits.org"><img src="https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg" alt="Conventional Commits"/></a>
  </p>
</div>

---

`meame` no es solo una aplicación web. Es una plataforma holística diseñada para orquestar el ciclo de vida completo de campañas de marketing digital, desde la concepción creativa hasta el análisis de conversión post-lanzamiento. Su núcleo es un **Centro de Comando de Desarrollador (DCC)** que integra una suite de herramientas soberanas, cada una con una misión específica, para crear, gestionar y optimizar activos y experiencias a una escala sin precedentes.

## 📜 Filosofía Raíz: "Arquitectura por Manifiesto"

Este proyecto se rige por un principio fundamental: la claridad conceptual precede a la implementación. Cada dominio y cada decisión arquitectónica están documentados en **Manifiestos Soberanos** (`/_docs`), que actúan como la Única Fuente de Verdad (SSoT) conceptual.

> **El código no solo debe funcionar; debe ser memorable, predecible y resiliente por diseño.**

Nuestra calidad se cimienta sobre **Los 8 Pilares de la Calidad de Código de Élite**, un contrato inmutable que cada "aparato" de código debe cumplir:

1.  **Hiper-Atomización y Responsabilidad Única**
2.  **Seguridad de Tipos Absoluta y Contrato Estricto (Zod)**
3.  **Observabilidad Profunda y Logging de Élite**
4.  **Internacionalización (i18n) Nativa**
5.  **Theming Semántico y Soberano**
6.  **Documentación Completa (TSDoc y Manifiestos)**
7.  **Adherencia Arquitectónica y Fronteras Inmutables**
8.  **Inteligencia Comportamental (Nos3 Compliance)**

---

## 🏛️ Arquitectura Holística del Ecosistema

`meame` está diseñado como un sistema distribuido de dominios especializados que colaboran para ofrecer una plataforma unificada. El DCC actúa como el cerebro central, orquestando los servicios de datos, contenido y IA.

```mermaid
graph TD
    subgraph Usuario
        A[Stratega / Desarrollador]
    end

    subgraph "Plataforma Meame (Next.js)"
        B(Centro de Comando de Desarrollador - DCC)
        C(Portal Público / Landing Pages)
    end

    subgraph "Backend & Servicios Soberanos"
        D[Supabase: Auth, DB, Edge Functions]
        E[Cloudinary: Almacenamiento de Activos]
        F[Vercel Blob: Grabaciones de Sesión]
        G[TEMEO (Motor IA): Google Gemini]
        H[Shopify/Stripe: E-commerce]
    end

    A -- Accede y Gestiona --> B
    B -- Despliega y Sirve --> C
    B -- Utiliza --> D
    B -- Utiliza --> E
    B -- Utiliza --> F
    B -- Utiliza --> G
    C -- Orquestado por --> H

    style A fill:#8b5cf6,stroke:#fff,stroke-width:2px,color:#fff
    style B fill:#3b82f6,stroke:#fff,stroke-width:2px,color:#fff
    style C fill:#10b981,stroke:#fff,stroke-width:2px,color:#fff
🛠️ La Suite Meame: Un Desglose Granular
meame está compuesto por una suite de dominios interconectados, cada uno con un propósito y un potencial únicos.
🎨 La Forja Creativa (SDC) - Suite de Diseño de Campañas
Es el epicentro del ecosistema. Un asistente visual de 6 pasos que transforma la estrategia en bruto en campañas de alta conversión.
Potencialidades:
Creación Guiada: Un wizard que estandariza y acelera la creación de variantes de campaña.
Previsualización en Tiempo Real (EDVI): Un lienzo que renderiza instantáneamente los cambios de layout, tema y contenido.
Theming Soberano Atómico: Un sistema revolucionario que ensambla temas visuales a partir de "fragmentos" atómicos.
Motor de Forja (SSG bajo demanda): Capacidad de "empaquetar" una campaña, generando un sitio Next.js estático, completo y optimizado.
code
Mermaid
graph LR
    subgraph SDC - Flujo de Creación
        S0[Paso 0: Identidad] --> S1[Paso 1: Estructura]
        S1 --> S2[Paso 2: Layout]
        S2 --> S3[Paso 3: Tema Visual]
        S3 --> S4[Paso 4: Contenido]
        S4 --> S5[Paso 5: Gestión y Publicación]
    end

    S5 -- Acción de Publicar --> P1[Genera Activos .json]
    S5 -- Acción de Empaquetar --> P2(Motor de Forja SSG)
    P2 -- Genera --> P3{Sitio Estático .zip}

    style S0 fill:#a78bfa
    style S1 fill:#93c5fd
    style S2 fill:#6ee7b7
    style S3 fill:#fde047
    style S4 fill:#fda4af
    style S5 fill:#e879f9
    style P3 fill:#22c55e,color:#fff
🖼️ BAVI - Biblioteca de Activos Visuales Integrada
El sistema nervioso visual del ecosistema. Trata los activos no como archivos, sino como datos ricos y estructurados.
Potencialidades:
SSoT Híbrida: Centraliza metadatos en Supabase, mientras delega el almacenamiento a Cloudinary.
Descubrimiento Inteligente: Implementa un Protocolo de Etiquetado Semántico Atómico (SESA) para filtrado de alto rendimiento.
Trazabilidad Creativa: Se integra con RaZPrompts para vincular cada activo generado por IA a su "genoma" creativo.
AssetExplorer: Una interfaz de búsqueda y selección de activos reutilizable en todo el DCC.
code
Mermaid
graph TD
    subgraph BAVI - Arquitectura de Datos
        A(Supabase DB) -- Metadatos, Taxonomía, Propiedad --> B{Manifiestos BAVI}
        C(Cloudinary) -- Almacenamiento Binario, Optimización --> B
        B -- SSoT de Activos --> D(Ecosistema Meame)
    end
    D -- Consume vía --> E[AssetExplorer UI]
    style A fill:#3ecf8e,color:#fff
    style C fill:#3b82f6,color:#fff
🧠 CogniRead - El Motor de Credibilidad
Transforma la literatura científica en activos de conocimiento estructurados y multilingües para potenciar el marketing de contenidos.
Potencialidades:
"ADN del Estudio": Cada artículo almacena la esencia de un estudio científico en un campo JSONB estructurado.
Extracción Asistida por IA: Utiliza TEMEO para analizar texto científico y rellenar automáticamente los campos del "ADN del Estudio".
Contenido Multilingüe Nativo: Diseñado para gestionar y servir contenido en múltiples idiomas.
Proyección a Microservicio: Su arquitectura está diseñada para evolucionar hacia un SaaS independiente ("Evidence-as-a-Service").
code
Mermaid
graph TD
    A[Estudio Científico<br>(PDF, Texto, URL)] --> B{Extractor IA (TEMEO)};
    B -- Analiza y Estructura --> C[ADN del Estudio (JSONB)];
    C -- SSoT de Evidencia --> D[Artículo CogniRead];
    E[Contenido Divulgativo<br>(Markdown Multilingüe)] --> D;
    D -- Se publica en --> F(Portal Público /news);
🧬 RaZPrompts - La Bóveda Genómica Creativa
La memoria inmutable de la creatividad generativa del ecosistema.
Potencialidades:
Reproducibilidad Absoluta: Almacena el prompt, parámetros y modelo de IA de cada activo generado.
Gestión del Ciclo de Vida Creativo: Permite buscar, filtrar, versionar y mejorar "genomas creativos".
Refinamiento Conversacional: Se integra con ai_conversations para permitir a los usuarios "chatear" con una IA para refinar un prompt.
code
Mermaid
sequenceDiagram
    participant C as Creativo
    participant R as RaZPrompts
    participant T as TEMEO (IA)
    participant B as BAVI

    C->>R: Crea nuevo "Genoma de Prompt"
    R-->>C: Devuelve Prompt ID
    C->>T: Genera imagen usando el Genoma
    T-->>B: Sube el activo visual generado
    B-->>R: Vincula el nuevo Asset ID al Prompt ID
📈 Aura & Nos3 - La Suite de Inteligencia de Doble Embudo
El sistema nervioso y cerebro analítico de la plataforma, optimizando la experiencia del creador (CXO) y del comprador (CRO).
Potencialidades:
Tracking Cualitativo (Nos3): Graba las sesiones de usuario de forma anónima y segura usando rrweb.
Tracking Cuantitativo (Aura): Registra eventos de negocio para análisis agregado y KPIs.
Perfilado Holístico: Un pipeline de middleware perfila a cada visitante y enriquece las peticiones con un "pasaporte digital".
Insights Asistidos por IA: Un Cron Job invoca una Edge Function que utiliza TEMEO para analizar patrones y generar recomendaciones estratégicas.
code
Mermaid
graph TD
    subgraph "Capa 1: Perfilador (Middleware Edge)"
        A[Request Entrante] --> A1{Identifica/Crea Fingerprint} --> A2[Captura GeoIP/UA] --> A3[Persiste en visitor_sessions] --> A4[Enriquece Headers]
    end

    subgraph "Capa 2: Colectores (Cliente)"
        B[Interacción del Usuario] --> B1{useNos3Tracker (rrweb)} --> B2["/api/nos3/ingest (Vercel Blob)"]
        B --> B3{useAuraTracker} --> B4["/api/aura/ingest (Supabase)"]
    end

    subgraph "Capa 3: Motor Analítico (DB)"
        C[Supabase DB] --> C1{get_campaign_analytics()} --> C2[Dashboard KPIs]
    end

    subgraph "Capa 4: Motor de Inferencia (IA)"
        D[Supabase Cron Job] --> D1{analyze_behavior_patterns()} --> D2{Edge Function: generate-aura-insight} --> D3[Motor TEMEO (Gemini)] --> D4[Persiste en aura_insights]
    end

    A4 --> B
🚀 Pila Tecnológica
Dominio	Tecnologías Clave
Framework	Next.js 14+ (App Router), React 18
Lenguaje	TypeScript (Strict Mode)
Backend & DB	Supabase (PostgreSQL, Auth, Edge Functions), Vercel Blob
Estilos	Tailwind CSS v4, shadcn/ui, Radix UI, Framer Motion
Gestión de Estado	Zustand (Client-side)
Validación	Zod
Inteligencia Artificial	Google Gemini (vía la capa de abstracción TEMEO)
Servicios Externos	Cloudinary, Resend, Stripe, Shopify
Observabilidad	Logger Soberano (isomórfico), rrweb (Nos3)
🏁 Primeros Pasos (Getting Started)
Prerrequisitos: Asegúrate de tener Node.js (v20+) y pnpm (v10+) instalados.
Clonar: git clone https://URL_DEL_REPOSITORIO.git
Instalar Dependencias: pnpm install
Configurar Entorno:
Copia el manifiesto de entorno: cp .env.local.md .env.local
Abre .env.local y rellena todas las variables de entorno, especialmente las de Supabase, Cloudinary y otras APIs.
Enlazar con Supabase: pnpm supabase:link
Generar Tipos de la Base de Datos: pnpm supabase:gen-types
Ejecutar el Servidor de Desarrollo: pnpm dev
Tu instancia de desarrollo estará disponible en http://localhost:3000.
📂 Arquitectura del Proyecto
El proyecto sigue una arquitectura híbrida inspirada en Feature-Sliced Design (FSD) y Domain-Driven Design (DDD), con una separación estricta de responsabilidades:
code
Code
/
├── _docs/                # La SSoT Conceptual: Manifiestos y Protocolos
├── content/              # Contenido estático: manifiestos de datos, prompts, temas
├── public/               # Activos estáticos públicos
├── scripts/              # El Arsenal: Diagnósticos, generación, seeding
├── src/
│   ├── app/              # Capa de Presentación (App Router de Next.js)
│   ├── components/       # Capa de UI Reutilizable
│   │   ├── features/     # Módulos de UI complejos (AuthForm, CampaignSuiteWizard)
│   │   ├── layout/       # Componentes estructurales (Header, Footer)
│   │   ├── sections/     # Bloques de contenido de página (Hero, FaqAccordion)
│   │   └── ui/           # Átomos de UI puros (Button, Card)
│   └── shared/
│       └── lib/          # El Cerebro: Lógica agnóstica a la UI
│           ├── actions/  # Todas las Server Actions (organizadas por dominio)
│           ├── hooks/    # Hooks de React reutilizables
│           ├── schemas/  # Todos los schemas de Zod (contratos de datos)
│           ├── services/ # Clientes para APIs de terceros (Stripe, Resend)
│           └── stores/   # Stores globales de Zustand
└── supabase/             # Infraestructura como Código de Supabase (migraciones, funciones)
⚡ Comandos Soberanos
Este proyecto está equipado con un arsenal de scripts para mantener la calidad y la eficiencia.
Comando	Descripción
pnpm validate	Ejecuta un pipeline completo de validación: tipos, formato, linting y consistencia de esquemas.
pnpm generate	Genera artefactos de código como el manifiesto de iconos (lucide-icon-names.ts).
pnpm db:seed:all	Ejecuta todos los scripts de seeding para poblar la base de datos con datos iniciales.
pnpm audit:holistic	Guardián de Integridad Total. Ejecuta todos los scripts de diagnóstico para verificar la salud del ecosistema.

Leer los Manifiestos: Familiarízate con la filosofía y los patrones arquitectónicos en /_docs.

Cumplir los 8 Pilares: Cada línea de código debe aspirar a cumplir los 8 Pilares de Calidad.
Conventional Commits: Todos los commits deben seguir la especificación de Conventional Commits.

📄 Licencia
Este proyecto está bajo la licencia "UNLICENSED"
```
