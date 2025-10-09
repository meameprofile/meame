http://169.254.0.21:5173/

https://manus.im/app/PEognowrMB9clnl92meGOV

manus https://vida-private.s3.us-east-1.amazonaws.com/sessionFile/PEognowrMB9clnl92meGOV/sandbox/qukaHAhIoFUKaXwrIPHHsY_1759868074099_na1fn_L2hvbWUvdWJ1bnR1L3Jhendpa2k.zip?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAZV3A2ECZOFHVT4UV%2F20251007%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20251007T202017Z&X-Amz-Expires=603800&X-Amz-Signature=c95afa669258a7155abf84231afb9dcb2ef084f12c06e23f5857ecbda7c44a5c&X-Amz-SignedHeaders=host&response-content-disposition=attachment%3B%20filename%2A%3DUTF-8%27%27razwiki.zip&response-content-type=binary%2Foctet-stream&x-amz-checksum-mode=ENABLED&x-id=GetObject

Estructura Conceptual de la RaZWiki para RaZSuite

Este documento describe la estructura conceptual y el diseño arquitectónico de la RaZWiki, un proyecto React independiente concebido como un sistema de información profesional, similar a Wikipedia, para el ecosistema RaZSuite. La RaZWiki integrará la información del preproyecto MVP de RaZSuite y el snapshot de código, con un enfoque en la navegabilidad, un banco de imágenes robusto y un alto rendimiento, preparando el terreno para una futura integración total entre ambos ecosistemas.

1. Visión y Propósito

La RaZWiki servirá como la fuente de verdad centralizada y accesible para todos los componentes y funcionalidades de RaZSuite. Su objetivo principal es:

•
Educar: Proporcionar documentación clara y detallada sobre cada dominio de RaZSuite (DCC, RaZPrompts, BAVI, SDC, SSG, Aether Engine, Heimdall, Nos3, Aura, Temeo AI).

•
Facilitar el Uso: Ofrecer guías, tutoriales y ejemplos prácticos para maximizar la eficiencia de los usuarios (estrategas de marketing, desarrolladores, diseñadores).

•
Promover la Adopción: Presentar el valor y las sinergias del ecosistema RaZSuite de manera comprensible y atractiva.

•
Escalabilidad: Diseñar una arquitectura que permita un crecimiento continuo del contenido y una fácil integración con futuras expansiones de RaZSuite.

2. Homepage Principal: "El Uso Profesional de la RaZWiki"

La página de inicio de la RaZWiki será el punto de entrada principal y estará diseñada para ofrecer una visión general del ecosistema RaZSuite y guiar al usuario hacia la información relevante. Deberá incluir:

•
Título Principal: "RaZWiki: Su Guía Definitiva para el Ecosistema RaZSuite"

•
Subtítulo: "Dominando la Creación y Optimización de Campañas de Ventas con Inteligencia Artificial Soberana."

•
Sección Introductoria: Un resumen conciso de qué es RaZSuite, su propuesta de valor (volante de crecimiento auto-reforzado) y cómo la RaZWiki ayuda a los usuarios a aprovecharlo al máximo. Se destacará la filosofía de "soberanía coesa" y la IA como "tejido conectivo" [1].

•
Navegación Destacada: Enlaces directos a las secciones principales (Dominios, Casos de Uso, Guías Rápidas, Preguntas Frecuentes).

•
Buscador Central: Una barra de búsqueda prominente para facilitar la localización de contenido específico.

•
Sección "Empezar Aquí": Guías para nuevos usuarios, como "Primeros Pasos con RaZSuite" o "Explorando los Dominios Clave".

•
Noticias y Actualizaciones: Un feed con las últimas novedades y mejoras del ecosistema RaZSuite, vinculando a artículos relevantes dentro de la wiki.

•
Call to Action: Invitación a explorar dominios específicos o a registrarse en RaZSuite.

3. Estructura de Contenido y Navegabilidad

La RaZWiki se organizará de forma jerárquica y modular, facilitando tanto la exploración como la búsqueda específica. La estructura propuesta es la siguiente:

3.1. Jerarquía de Contenido

1.  Homepage: Punto de entrada principal.

2.  Dominios de RaZSuite: Páginas dedicadas a cada uno de los 10 dominios principales (DCC, RaZPrompts, BAVI, SDC, SSG, Aether Engine, Heimdall, Nos3, Aura, Temeo AI). Cada página de dominio incluirá:

•
Visión y Propósito (Lenguaje Comprensible).

•
Arquitectura Técnica (Lenguaje Técnico).

•
Ejemplos Prácticos de Uso.

•
Lógica y Flujo de Inteligencia.

•
Potencialidad en MVP (Estado Actual y Funcional).

•
Potencialidad Global (Visión Futura como SaaS).

•
Aporte y Sinergia con el Ecosistema.

3.  Guías y Tutoriales: Artículos paso a paso sobre cómo realizar tareas específicas o utilizar funcionalidades avanzadas (ej., "Crear una Campaña con SDC", "Gestionar Activos en BAVI").

4.  Casos de Uso: Ejemplos reales o hipotéticos de cómo RaZSuite resuelve problemas específicos de marketing y ventas.

5.  Conceptos Fundamentales: Explicaciones de términos clave, metodologías (ej., Growth Flywheel, SSoT, RLS) y principios de diseño (ej., Soberanía Coesa, IA como Tejido Conectivo).

6.  Preguntas Frecuentes (FAQ): Respuestas a consultas comunes, organizadas por dominio o tema.

7.  Glosario: Definiciones de la terminología específica de RaZSuite.

8.  Historial de Versiones y Actualizaciones: Un registro de los cambios y mejoras en RaZSuite y la propia RaZWiki.

    3.2. Navegación

•
Barra de Navegación Principal (Header): Enlaces a Homepage, Dominios, Guías, Casos de Uso, Búsqueda.

•
Barra Lateral (Sidebar): Un menú expandible/colapsable que liste todos los dominios y subsecciones principales, permitiendo una exploración rápida y contextual. Deberá reflejar la estructura jerárquica del contenido.

•
Migas de Pan (Breadcrumbs): Indicadores de la ubicación actual del usuario dentro de la jerarquía de la wiki para mejorar la orientación.

•
Enlaces Internos Contextuales: Dentro de cada artículo, enlaces a otros artículos relacionados, dominios o conceptos para fomentar la exploración y la comprensión profunda.

•
Buscador Avanzado: Con capacidades de filtrado por dominio, tipo de contenido (guía, concepto, FAQ) y etiquetas.

4. Banco de Imágenes y Gestión de Activos Visuales

La RaZWiki hará un uso extensivo de la BAVI (Biblioteca de Activos Visuales Integrada) de RaZSuite para gestionar y servir todas sus imágenes y elementos multimedia. Esto asegura consistencia, optimización y escalabilidad.

•
Integración Directa con BAVI: Todas las imágenes, diagramas y videos utilizados en la RaZWiki serán servidos directamente desde la BAVI. Esto implica que la RaZWiki consumirá la API de BAVI para obtener los URLs de los activos.

•
Optimización Automática: Al utilizar BAVI, las imágenes se optimizarán automáticamente para diferentes dispositivos y anchos de banda, garantizando un alto rendimiento.

•
Metadatos y Búsqueda: Los metadatos de BAVI (SNIA, SESA) permitirán una fácil categorización y búsqueda de imágenes dentro de la wiki, y potencialmente, la inclusión de un "Asset Explorer" simplificado para los editores de la wiki.

•
Diagramas: Los gráficos Mermaid y otros diagramas (D2, PlantUML) se renderizarán a PNG y se gestionarán como activos en BAVI, asegurando su calidad y accesibilidad.

5. Rendimiento y Escalabilidad

Para asegurar una "wiki de gran performance", se adoptarán las siguientes estrategias:

•
React y Next.js: El proyecto se construirá como una aplicación React utilizando Next.js para aprovechar sus capacidades de Server-Side Rendering (SSR) o Static Site Generation (SSG), lo que mejora el tiempo de carga inicial y el SEO.

•
Optimización de Imágenes: Como se mencionó, la integración con BAVI garantizará que todas las imágenes se sirvan en formatos y tamaños óptimos.

•
Carga Diferida (Lazy Loading): Implementación de carga diferida para imágenes, componentes y secciones de contenido no críticas, mejorando la percepción de velocidad.

•
Caché: Utilización de estrategias de caché a nivel de CDN y navegador para contenido estático y activos multimedia.

•
Búsqueda Indexada: Implementación de un motor de búsqueda interno que utilice índices pregenerados para resultados rápidos y relevantes.

•
Modularidad: La arquitectura de componentes de React y la organización del contenido en módulos facilitarán el mantenimiento y la escalabilidad del proyecto.

6. Integración Futura con RaZSuite

La RaZWiki se diseñará desde el principio con la visión de una integración profunda y bidireccional con RaZSuite:

•
Autenticación Unificada: Posibilidad de integrar el sistema de autenticación de RaZSuite (Supabase Auth) para ofrecer una experiencia de usuario fluida y personalizada (ej., contenido basado en roles o historial de uso).

•
Contexto de Usuario: Si un usuario autenticado en RaZSuite accede a la RaZWiki, esta podría mostrar contenido personalizado o resaltar secciones relevantes basadas en su actividad o rol dentro de RaZSuite.

•
Enlaces Cruzados: Enlaces directos desde la RaZWiki a funcionalidades específicas dentro del DCC o SDC de RaZSuite, y viceversa.

•
Edición Colaborativa (Futuro): Potencial para que los usuarios de RaZSuite contribuyan o sugieran ediciones al contenido de la wiki, utilizando un flujo de trabajo similar al de las wikis tradicionales.

•
Uso de Componentes Compartidos: Explorar la posibilidad de compartir componentes de UI entre RaZSuite y RaZWiki para mantener una coherencia visual y de experiencia de usuario.

7. Estructura de Directorios (Ejemplo para Proyecto React/Next.js)

Plain Text

razwiki/
├── public/
│ ├── images/ (para iconos, logos, etc. no gestionados por BAVI)
│ └── favicon.ico
├── src/
│ ├── app/
│ │ ├── (main)/
│ │ │ ├── page.tsx (Homepage)
│ │ │ ├── layout.tsx
│ │ │ └── error.tsx
│ │ ├── [domainSlug]/
│ │ │ ├── page.tsx (Página de dominio específico)
│ │ │ └── [articleSlug]/
│ │ │ └── page.tsx (Artículos dentro de un dominio)
│ │ ├── guides/
│ │ │ └── [guideSlug]/
│ │ │ └── page.tsx
│ │ ├── concepts/
│ │ │ └── [conceptSlug]/
│ │ │ └── page.tsx
│ │ ├── faq/
│ │ │ └── page.tsx
│ │ ├── search/
│ │ │ └── page.tsx
│ │ ├── api/
│ │ │ └── bavi-proxy/ (Endpoint para interactuar con BAVI API)
│ │ │ └── route.ts
│ │ ├── globals.css
│ │ └── layout.tsx (Layout global con Header, Sidebar, Footer)
│ ├── components/
│ │ ├── layout/
│ │ │ ├── Header.tsx
│ │ │ ├── Sidebar.tsx
│ │ │ ├── Footer.tsx
│ │ │ └── Breadcrumbs.tsx
│ │ ├── ui/ (Componentes reutilizables: Button, Card, Input, etc.)
│ │ ├── domain-card/ (Componente para mostrar un dominio en la homepage)
│ │ ├── search-bar/ (Componente de la barra de búsqueda)
│ │ └── ...otros componentes específicos de la wiki
│ ├── lib/
│ │ ├── bavi/ (Funciones para interactuar con BAVI API)
│ │ ├── content/ (Funciones para cargar y parsear contenido Markdown)
│ │ ├── utils/ (Utilidades varias)
│ │ └── auth/ (Lógica de autenticación, si se integra con Supabase)
│ ├── styles/
│ │ └── tailwind.config.ts
│ └── types/
│ └── ...definiciones de tipos
├── content/
│ ├── domains/
│ │ ├── dcc.mdx
│ │ ├── razprompts.mdx
│ │ ├── bavi.mdx
│ │ └── ...otros dominios
│ ├── guides/
│ │ ├── getting-started.mdx
│ │ └── ...otras guías
│ ├── concepts/
│ │ ├── growth-flywheel.mdx
│ │ └── ...otros conceptos
│ └── faq.mdx
├── package.json
├── tsconfig.json
└── next.config.js
