// .docs/000_MANIFIESTO_CONSOL_COGNIREAD.md
/\*\*

- @file 000_MANIFIESTO_CONSOL_COGNIREAD.md
- @description Manifiesto Consolidado y SSoT para el Dominio CogniRead.
-              Define su visión, arquitectura, funcionalidades, integración con el ecosistema
-              y proyecciones futuras como proyecto independiente, ahora en Supabase.
- @version 1.2.0 (Formato de Artículo Estándar para Publicaciones)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Consolidado: CogniRead - El Cerebro Analítico

## 1. Visión y Filosofía Raíz: "La Evidencia como Activo Atómico, el Conocimiento como Servicio"

**CogniRead** es el **Sistema de Gestión de Inteligencia Científica (SKMS)** de nuestro ecosistema. Su misión fundamental es transformar la vasta y a menudo inaccesible literatura científica en **activos de conocimiento estructurados, multilingües y verificables**. Cada entrada no es un simple artículo, sino un **genoma del estudio**: la esencia de la evidencia, destilada, organizada y lista para ser consumida.

Nuestra filosofía se basa en que el conocimiento es un servicio. CogniRead está naciendo como un módulo integrado, pero con la clara proyección de evolucionar hacia un **proyecto totalmente independiente y soberano**, ofrecido como un microservicio (SaaS), capaz de ser llamado a través de su propia API.

## 2. Arquitectura y Modelo de Datos (SSoT en Supabase)

CogniRead reside como un dominio soberano dentro de la base de datos central de Supabase (PostgreSQL).

### 2.1. El `CogniReadArticle` (La SSoT del Dato)

La estructura canónica de cada artículo se almacena en la tabla `public.cogniread_articles`.

- **`articleId`**: Identificador único (UUID en Supabase).
- **`status`**: (`draft`, `published`, `archived`).
- **`studyDna` (JSONB)**: El "ADN" del estudio científico. Incluye `originalTitle`, `authors`, `institution`, `doi`, `objective`, `methodologySummary`, `mainResults`, `authorsConclusion`, `limitations`.
- **`content` (JSONB)**: Contenido divulgativo traducido a múltiples locales. Cada idioma (`it-IT`, `es-ES`, etc.) tiene su propio `title`, `slug`, `summary` y `body` (en Markdown).
- **`baviHeroImageId`**: Vínculo con la BAVI para la imagen destacada.
- **`relatedPromptIds` (TEXT[])**: Vínculos a los genomas creativos en RaZPrompts.
- **`createdAt`, `updatedAt`**: Timestamps de gestión.

### 2.2. Capa de Lógica (`Server Actions`)

Toda interacción con la base de datos se realiza a través de `Server Actions`, garantizando seguridad y tipado.

- **Mutaciones:** `createOrUpdateArticleAction`, `publishArticleAction`, `archiveArticleAction`.
- **Consultas:** `getPublishedArticlesAction`, `getArticleBySlugAction`, `getArticlesIndexAction`, `getArticlesByIdsAction`.

## 3. Formato de Datos, Tablas y Migración (Actualización)

### 3.1. Migración Histórica: De MongoDB a Supabase

Inicialmente, el almacenamiento de los artículos de CogniRead fue diseñado para MongoDB. Sin embargo, para consolidar la infraestructura de datos y aprovechar la robustez de PostgreSQL, **todo el dominio CogniRead fue migrado a Supabase**. Esta decisión simplificó la arquitectura, centralizó la persistencia de datos y permitió el uso de características avanzadas como Row Level Security (RLS) de forma nativa.

### 3.2. La Tabla Principal: `public.cogniread_articles`

Esta tabla es la **Única Fuente de Verdad** para todos los artículos de CogniRead. Su estructura se define en el esquema SQL de Supabase y se refleja programáticamente en `src/shared/lib/schemas/cogniread/article.schema.ts`.

- **Columnas Clave:**
  - `id` (`UUID`): Identificador único del artículo. Corresponde al `articleId` en el `CogniReadArticleSchema`.
  - `status` (`TEXT`): Enum con valores `'draft'`, `'published'`, `'archived'`.
  - `study_dna` (`JSONB`): Almacena la estructura detallada del análisis científico del estudio.
  - `content` (`JSONB`): Almacena las traducciones del contenido divulgativo del artículo para cada idioma soportado.
  - `bavi_hero_image_id` (`TEXT`): ID del activo visual de la BAVI utilizado como imagen principal. Puede ser `NULL`.
  - `related_prompt_ids` (`TEXT[]`): Array de IDs de RaZPrompts relacionados con el artículo. Puede ser `NULL`.
  - `created_at` (`TIMESTAMPTZ`): Timestamp de creación.
  - `updated_at` (`TIMESTAMPTZ`): Timestamp de la última actualización.

- **Uso de `JSONB` para `study_dna` y `content`:**
  - El tipo `JSONB` en PostgreSQL es crucial para la flexibilidad de CogniRead. Permite almacenar objetos JSON semi-estructurados con esquemas internos variables sin requerir una modificación de la tabla principal. Esto es ideal para el `studyDna` (que puede evolucionar) y para el `content` multilingüe (que tiene una estructura anidada por idioma). Además, `JSONB` permite indexación y consultas eficientes sobre sus datos internos.
- **Uso de `TEXT[]` para `related_prompt_ids`:**
  - El tipo `TEXT[]` es eficiente para almacenar arrays simples de cadenas de texto (UUIDs en este caso) sin la sobrecarga de un objeto JSON completo.

### 3.3. Estructura Estándar de un Artículo Publicado

El siguiente ejemplo muestra el formato que tendrán todos los artículos de CogniRead una vez validados por `CogniReadArticleSchema` y almacenados en Supabase. Este es el contrato de datos que la IA debe mantener para todas las publicaciones.

```json
{
  "articleId": "clwz1a2b30000cde45f6g7h8j",
  "status": "published",
  "createdAt": "2025-09-15T10:00:00.000Z",
  "updatedAt": "2025-09-15T10:00:00.000Z",
  "studyDna": {
    "originalTitle": "Benefits of Superfoods for General Well-being: A Narrative Review",
    "authors": ["Dr. Sophia Rossi"],
    "institution": "Global Nutrition Institute",
    "publication": "Journal of Holistic Health",
    "publicationDate": "2024-03-01T00:00:00.000Z",
    "doi": "https://doi.org/10.1234/jhh.2024.123",
    "fundingSource": "Self-funded",
    "objective": "To review the current scientific literature on common superfoods and their general health benefits.",
    "studyType": "Narrative Review",
    "methodologySummary": "Review of peer-reviewed articles from PubMed and Scopus databases published between 2010-2023. Key themes were extracted and synthesized.",
    "mainResults": "Superfoods such as berries, nuts, and leafy greens consistently show high antioxidant and anti-inflammatory properties, contributing to improved cardiovascular health and cognitive function.",
    "authorsConclusion": "Integrating a variety of superfoods into a balanced diet can significantly enhance overall health and prevent chronic diseases.",
    "limitations": [
      "Reliance on observational studies.",
      "Variability in nutrient content due to sourcing.",
      "Lack of long-term interventional studies."
    ]
  },
  "content": {
    "es-ES": {
      "title": "5 Superalimentos Esenciales para Añadir a Tu Dieta Diaria",
      "slug": "5-superalimentos-esenciales-dieta",
      "summary": "Potencia tu salud con estos concentrados de nutrientes que la naturaleza nos ofrece.",
      "body": "En un mundo lleno de dietas complejas y suplementos, a veces la solución más potente se encuentra en los alimentos simples y naturales. Los superalimentos son alimentos densos en nutrientes considerados especialmente beneficiosos para la salud y el bienestar. Aquí tienes cinco de nuestros favoritos que puedes integrar fácilmente en tu rutina.\\n\\n## 1. Bayas de Goji: El Antioxidante Poderoso\\n\\nEstas pequeñas bayas rojas son una potencia de antioxidantes, vitaminas y minerales. Ayudan a combatir los radicales libres, apoyan la visión y pueden mejorar el sistema inmunológico. Añádelas a tu yogur o batido matutino.\\n\\n## 2. Espinacas: El Héroe Verde\\n\\nLas espinacas son ricas en hierro, vitaminas K y A, y antioxidantes. Son excelentes para la salud ósea, la visión y la energía. Un puñado en tu batido o ensalada hace maravillas.\\n\\n## 3. Nueces: Cerebro y Corazón\\n\\nRicas en ácidos grasos Omega-3, antioxidantes y fibra, las nueces son beneficiosas para la salud cerebral y cardiovascular. Un puñado al día puede hacer una gran diferencia.\\n\\n## 4. Aguacate: La Grasa Buena\\n\\nFuente de grasas monoinsaturadas saludables, fibra, potasio y vitaminas K, C, B6, y E. Ideal para la saciedad y la salud del corazón. Añádelo a tus ensaladas o tostadas.\\n\\n## 5. Brócoli: El Desintoxicante Natural\\n\\nConocido por sus propiedades desintoxicantes y su alto contenido de vitaminas C y K, y fibra. Es un aliado poderoso contra la inflamación y para la salud digestiva. "
    },
    "en-US": {
      "title": "5 Essential Superfoods to Add to Your Daily Diet",
      "slug": "5-essential-superfoods-diet",
      "summary": "Boost your health with these nutrient powerhouses that nature offers.",
      "body": "In a world full of complex diets and supplements, sometimes the most powerful solution lies in simple, natural foods. Superfoods are nutrient-dense foods considered to be particularly beneficial for health and well-being. Here are five of our favorites that you can easily integrate into your routine.\\n\\n## 1. Goji Berries: The Antioxidant Powerhouse\\n\\nThese small red berries are a powerhouse of antioxidants, vitamins, and minerals. They help fight free radicals, support vision, and can boost the immune system. Add them to your morning yogurt or smoothie.\\n\\n## 2. Spinach: The Green Hero\\n\\nSpinach is rich in iron, vitamins K and A, and antioxidants. It's excellent for bone health, vision, and energy. A handful in your smoothie or salad works wonders.\\n\\n## 3. Walnuts: Brain and Heart\\n\\nRich in Omega-3 fatty acids, antioxidants, and fiber, walnuts are beneficial for brain and cardiovascular health. A handful a day can make a big difference.\\n\\n## 4. Avocado: The Good Fat\\n\\nA source of healthy monounsaturated fats, fiber, potassium, and vitamins K, C, B6, and E. Ideal for satiety and heart health. Add it to your salads or toasts.\\n\\n## 5. Broccoli: The Natural Detoxifier\\n\\nKnown for its detoxifying properties and high content of vitamins C and K, and fiber. It is a powerful ally against inflammation and for digestive health."
    },
    "it-IT": {
      "title": "5 Superfood Essenziali da Aggiungere alla Tua Dieta Quotidiana",
      "slug": "5-superfood-essenziali-dieta",
      "summary": "Potenzia la tua salute con questi concentrati di nutrienti che la natura ci offre.",
      "body": "In un mondo pieno di diete complesse e integratori, a volte la soluzione più potente si trova negli alimenti semplici e naturali. I superfood sono alimenti ricchi di nutrienti considerati particolarmente benefici per la salute e il benessere. Ecco cinque dei nostri preferiti che puoi facilmente integrare nella tua routine.\\n\\n## 1. Bacche di Goji: L'Antiossidante Potente\\n\\nQueste piccole bacche rosse sono un concentrato di antiossidanti, vitamine e minerali. Aiutano a combattere i radicali liberi, supportano la vista e possono migliorare il sistema immunitario. Aggiungile al tuo yogurt o frullato mattutino.\\n\\n## 2. Spinaci: L'Eroe Verde\\n\\nGli spinaci sono ricchi di ferro, vitamine K e A, e antiossidanti. Sono eccellenti per la salute delle ossa, la vista e l'energia. Una manciata nel tuo frullato o nella tua insalata fa miracoli.\\n\\n## 3. Noci: Cervello e Cuore\\n\\nRicche di acidi grassi Omega-3, antiossidanti e fibre, le noci sono benefiche per la salute cerebrale e cardiovascolare. Una manciata al giorno può fare una grande differenza.\\n\\n## 4. Avocado: Il Grasso Buono\\n\\nFonte di grassi monoinsaturi sani, fibre, potassio e vitamine K, C, B6 ed E. Ideale per la sazietà e la salute del cuore. Aggiungilo alle tue insalate o ai tuoi toast.\\n\\n## 5. Broccoli: Il Disintossicante Naturale\\n\\nConosciuto per le sue proprietà disintossicanti e il suo alto contenuto di vitamine C e K, e fibre. È un potente alleato contra l'infiammazione e per la salute digestiva."
    },
    "pt-BR": {
      "title": "5 Superalimentos Essenciais para Adicionar à Sua Dieta Diária",
      "slug": "5-superalimentos-essenciais-dieta",
      "summary": "Potencialize sua saúde com estes concentrados de nutrientes que a natureza nos oferece.",
      "body": "Em um mundo cheio de dietas complexas e suplementos, às vezes a solução mais potente está nos alimentos simples e naturais. Superalimentos são alimentos densos em nutrientes considerados particularmente benéficos para a saúde e o bem-estar. Aqui estão cinco dos nossos favoritos que você pode integrar facilmente à sua rotina.\\n\\n## 1. Bagas de Goji: O Poderoso Antioxidante\\n\\nEstas pequenas bagas vermelhas são uma potência de antioxidantes, vitaminas e minerais. Elas ajudam a combater os radicais livres, apoiam a visão e podem fortalecer o sistema imunológico. Adicione-as ao seu iogurte ou smoothie matinal.\\n\\n## 2. Espinafre: O Herói Verde\\n\\nO espinafre é rico em ferro, vitaminas K e A, e antioxidantes. É excelente para a saúde óssea, visão e energia. Um punhado no seu smoothie ou salada faz maravilhas.\\n\\n## 3. Nozes: Cérebro e Coração\\n\\nRicas em ácidos graxos Ômega-3, antioxidantes e fibras, as nozes são benéficas para a saúde cerebral e cardiovascular. Um punhado por dia pode fazer uma grande diferença.\\n\\n## 4. Abacate: A Gordura Boa\\n\\nFonte de gorduras monoinsaturadas saudáveis, fibras, potássio e vitaminas K, C, B6 e E. Ideal para saciedade e saúde do coração. Adicione-o às suas saladas ou torradas.\\n\\n## 5. Brócolis: O Desintoxicante Natural\\n\\nConhecido por suas propriedades desintoxicantes e alto teor de vitaminas C e K, e fibras. É um poderoso aliado contra a inflamação e para a saúde digestiva."
    }
  },
  "baviHeroImageId": "webvork/assets/i-ing-superfoods-bowl-01/v1-original.jpg",
  "relatedPromptIds": []
}
3.4. Schema de Validación para Artículos (src/shared/lib/schemas/cogniread/article.schema.ts)
Este es el contrato de datos inmutable que garantiza la integridad de todos los artículos de CogniRead. Cada artículo, antes de ser persistido o leído, debe conformarse a esta estructura.
code
TypeScript
// shared/lib/schemas/cogniread/article.schema.ts
/**
 * @file article.schema.ts
 * @description SSoT para el contrato de datos de la entidad Artículo de CogniRead.
 *              Define la estructura para un documento en la colección 'cogniread_articles' de Supabase.
 * @version 2.0.0 (Migración a Supabase)
 * @author RaZ Podestá - MetaShark Tech
 */
import { z } from "zod";
import { supportedLocales } from "@/shared/lib/i18n/i18n.config";

/**
 * @const ArticleTranslationSchema
 * @description Valida el contenido de un artículo de blog en un idioma específico.
 */
export const ArticleTranslationSchema = z.object({
  title: z.string().min(1, "El título no puede estar vacío."),
  slug: z
    .string()
    .min(1, "El slug es requerido.")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones."
    ),
  summary: z.string().min(1, "El resumen no puede estar vacío."),
  body: z.string().min(1, "El cuerpo del artículo no puede estar vacío."),
});

/**
 * @const StudyDnaSchema
 * @description Valida la estructura de los datos extraídos del estudio científico.
 *              Esta es la materialización de nuestro "Prompt Maestro".
 */
export const StudyDnaSchema = z.object({
  originalTitle: z.string().min(1, "El título original del estudio no puede estar vacío."),
  authors: z.array(z.string().min(1, "El nombre del autor no puede estar vacío.")).min(1, "Debe haber al menos un autor."),
  institution: z.string().min(1, "La institución no puede estar vacía."),
  publication: z.string().min(1, "La publicación no puede estar vacía."),
  publicationDate: z.string().datetime("La fecha de publicación debe ser un formato de fecha y hora ISO válido."),
  doi: z.string().url("El DOI debe ser una URL válida."),
  fundingSource: z.string().min(1, "La fuente de financiación no puede estar vacía."),
  objective: z.string().min(1, "El objetivo del estudio no puede estar vacío."),
  studyType: z.string().min(1, "El tipo de estudio no puede estar vacío."),
  methodologySummary: z.string().min(1, "El resumen de la metodología no puede estar vacío."),
  mainResults: z.string().min(1, "Los resultados principales no pueden estar vacíos."),
  authorsConclusion: z.string().min(1, "La conclusión de los autores no puede estar vacía."),
  limitations: z.array(z.string().min(1, "La limitación no puede estar vacía.")).min(1, "Debe haber al menos una limitación."),
});

/**
 * @const CogniReadArticleSchema
 * @description El schema principal y soberano para un artículo en CogniRead.
 */
export const CogniReadArticleSchema = z.object({
  // --- Metadatos de CogniRead ---
  articleId: z.string().cuid2("El ID del artículo debe ser un CUID2 válido."),
  status: z.enum(["draft", "published", "archived"], "El estado del artículo es inválido."),
  createdAt: z.string().datetime("La fecha de creación debe ser un formato de fecha y hora ISO válido."),
  updatedAt: z.string().datetime("La fecha de actualización debe ser un formato de fecha y hora ISO válido."),

  // --- El ADN del Estudio (SSoT de Evidencia) ---
  studyDna: StudyDnaSchema,

  // --- Contenido Multilingüe (SSoT de Divulgación) ---
  content: z.record(z.enum(supportedLocales), ArticleTranslationSchema),

  // --- Vínculos del Ecosistema ---
  baviHeroImageId: z.string().optional().describe("ID del activo visual de BAVI para la imagen destacada."),
  relatedPromptIds: z.array(z.string().cuid2("Los IDs de prompt relacionados deben ser CUID2 válidos.")).optional().describe("IDs de prompts relacionados con este artículo."),
});

/**
 * @type CogniReadArticle
 * @description Infiere el tipo TypeScript para un artículo completo de CogniRead.
 */
export type CogniReadArticle = z.infer<typeof CogniReadArticleSchema>;

/**
 * @type ArticleTranslation
 * @description Infiere el tipo TypeScript para el contenido de una traducción.
 */
export type ArticleTranslation = z.infer<typeof ArticleTranslationSchema>;

/**
 * @type StudyDna
 * @description Infiere el tipo TypeScript para el ADN del estudio.
 */
export type StudyDna = z.infer<typeof StudyDnaSchema>;
4. Integración con el Ecosistema Webvork (Simbiosis Total)
CogniRead no es una isla; es un órgano vital del ecosistema.
Con BAVI (Biblioteca de Activos Visuales Integrada):
Flujo: Al crear o editar un artículo, el usuario puede seleccionar imágenes de la BAVI para usar como baviHeroImageId.
Valor: Asegura que los artículos usen activos visuales optimizados y alineados con la marca, gestionados de forma centralizada.
Con RaZPrompts (Bóveda de Conocimiento Generativo):
Flujo: Los relatedPromptIds permiten vincular artículos con los prompts de IA que podrían haber inspirado sus imágenes o elementos visuales.
Valor: Cierra el bucle creativo entre la investigación, la generación de ideas y la manifestación visual.
Con el Portal Público (/news):
Flujo: Las páginas de noticias (/news y /news/[slug]) consumen directamente los artículos published de CogniRead.
Valor: Posiciona a Global Fitwell como una fuente de autoridad científica, impulsando el SEO orgánico.
Con la Comunidad (/community y comentarios):
Flujo: Los artículos de CogniRead pueden tener secciones de comentarios, fomentando la discusión basada en evidencia.
Valor: Fomenta la interacción en torno a contenido de valor, construyendo una comunidad informada.
Con Aura/Nos3 (Inteligencia de Visitantes):
Flujo: Se registra el comportamiento del usuario en las páginas de artículos (tiempos de lectura, scrolls, clics en referencias).
Valor: Proporciona datos empíricos para optimizar la legibilidad, el engagement y la conversión de los artículos.
5. Funcionalidades Clave y Experiencia de Usuario
Dashboard de Gestión: Una UI dedicada en el DCC (/dev/cogniread) para la creación, edición, publicación y archivo de artículos.
Editor de Artículos: Formularios generados por schema (con Zod) para una entrada de datos estructurada y validada.
Soporte Multilingüe: Edición de contenido para todos los supportedLocales en un solo lugar.
Caché Persistente del Cliente: Estrategia de caché híbrida (localStorage + validación por versión en el servidor) para una carga ultrarrápida de artículos y una experiencia PWA de facto.
6. Proyecciones Futuras (Independencia y SaaS)
La arquitectura actual está sentando las bases para la evolución de CogniRead hacia un proyecto independiente.
Microservicio Independiente: En el futuro, CogniRead podría ser extraído como un microservicio autónomo, accesible a través de su propia API RESTful/GraphQL.
SaaS "Evidence-as-a-Service": Podría ofrecerse como un servicio a otras empresas que necesiten generar contenido de autoridad basado en evidencia científica.
Integración con Generación de Texto por IA: Implementar un botón "Sugerir Resumen" en el editor de artículos que envíe el studyDna a una API de IA para generar propuestas de summary o title.
7. Uso Canónico (IA Arquitecta)
Como IA, al interactuar con CogniRead, seguiré estas directivas:
Prioridad a la SSoT: Siempre me referiré al article.schema.ts como la fuente inmutable de la estructura de datos.
Integración Holística: Al proponer nuevas funcionalidades o refactorizaciones, consideraré proactivamente la integración de CogniRead con todos los dominios relevantes (BAVI, RaZPrompts, Portal, Analíticas).
Calidad Innegociable: Todo código que cree o modifique dentro de este dominio cumplirá con los 8 Pilares de Calidad de nuestro manifiesto.
Enfoque en la Escalabilidad: Mis propuestas considerarán la futura independencia de CogniRead y su potencial como servicio externo.
---

```
