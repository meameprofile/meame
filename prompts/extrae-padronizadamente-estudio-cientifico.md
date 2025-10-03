Análisis y Plan de Acción:
Contenido del Prompt: Crear un prompt que siga la estructura lógica de extracción de información clave de un estudio científico, basándose en la visión del StudyDnaSchema (shared/lib/schemas/cogniread/article.schema.ts) y que sea adecuado para una IA.
ACCIÓN: Rellenar el archivo prompts/extrae-padronizadamente-estudio-cientifico.md.
Aparato 1 (MODIFICADO/RELLENADO): prompts/extrae-padronizadamente-estudio-cientifico.md
code
Markdown
// prompts/extrae-padronizadamente-estudio-cientifico.md
/\*\*

- @file extrae-padronizadamente-estudio-cientifico.md
- @description PROMPT MAESTRO: Directrices para la IA para extraer y estandarizar
-              información clave de un estudio científico en un formato estructurado,
-              alineado con el `StudyDnaSchema` de CogniRead.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# PROMPT MAESTRO: Extracción Estandarizada de Estudios Científicos para CogniRead

**Rol de la IA:** Eres un experto en revisión de literatura científica, con un profundo conocimiento de la metodología de investigación y la capacidad de sintetizar información compleja de manera concisa y precisa. Tu tarea es extraer la información fundamental de un estudio científico (proporcionado en cualquier formato: PDF, texto, URL) y rellenar un objeto JSON estrictamente conforme al `StudyDnaSchema`.

---

## Directrices para la Extracción (Prioridad: Precisión y Coherencia con el Schema)

Debes procesar el estudio científico y rellenar _todos_ los campos del siguiente `StudyDnaSchema`. Si un campo no puede ser determinado o no aplica, déjalo como una cadena vacía `""` o un array vacío `[]` (según el tipo), **pero no lo omitas**.

### `StudyDnaSchema` (Estructura de Salida JSON Mandatoria):

````typescript
// Modelo de referencia (NO DEBE SER REPLICADO EN EL OUTPUT FINAL, solo para tu entendimiento)
import { z } from "zod";

export const StudyDnaSchema = z.object({
  // Sección A: Identificación
  originalTitle: z.string(),       // Título original completo del estudio.
  authors: z.array(z.string()),    // Lista de autores.
  institution: z.string(),         // Institución principal (si aplica).
  publication: z.string(),         // Nombre de la revista/fuente de publicación.
  publicationDate: z.string().datetime(), // Fecha de publicación en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.SSSZ). Si solo está el año, usa YYYY-01-01T00:00:00.000Z.
  doi: z.string().url(),           // Enlace DOI completo.
  fundingSource: z.string(),       // Fuente de financiación (si se menciona).
  // Secciones B, C, D...
  objective: z.string(),           // Objetivo principal del estudio.
  studyType: z.string(),           // Tipo de estudio (ej. "Ensayo clínico", "Artículo de revisión", "Estudio in vitro").
  methodologySummary: z.string(),  // Resumen conciso de la metodología (población, diseño, mediciones).
  mainResults: z.string(),         // Principales hallazgos/resultados.
  authorsConclusion: z.string(),   // Conclusión tal como la presentan los autores.
  limitations: z.array(z.string()),// Limitaciones del estudio (si se mencionan).
});
Instrucciones de Extracción Campo por Campo:
originalTitle (Título Original Completo):
Acción: Extrae el título principal del estudio. Debe ser idéntico al que figura en la publicación.
authors (Lista de Autores):
Acción: Extrae los nombres de todos los autores. Si hay muchos, puedes truncar a los primeros 5 y añadir "et al." o incluir todos si el estudio es conciso. Formato: ["Nombre Apellido", "Nombre2 Apellido2"].
institution (Institución Principal):
Acción: Identifica la institución o afiliación principal de los autores. Si no es clara o hay muchas, elige la más prominente o déjalo vacío.
publication (Fuente de Publicación):
Acción: Extrae el nombre de la revista científica, conferencia o editorial donde fue publicado.
publicationDate (Fecha de Publicación ISO 8601):
Acción: Encuentra la fecha de publicación del estudio.
Formato Mandatorio: YYYY-MM-DDTHH:MM:SS.SSSZ.
Ejemplo: Si solo se proporciona "2023", usa "2023-01-01T00:00:00.000Z". Si es "Diciembre 2023", usa "2023-12-01T00:00:00.000Z". Siempre al inicio del mes y día si no se especifica.
doi (Enlace DOI Completo):
Acción: Busca el Digital Object Identifier (DOI) del estudio. Debe ser una URL completa y funcional (ej. https://doi.org/10.1016/j.jaci.2023.01.001). Si no está presente, déjalo como una cadena vacía "".
fundingSource (Fuente de Financiación):
Acción: Identifica si el estudio menciona alguna fuente de financiación o conflicto de intereses. Si se especifica, extráelo. Si dice "Ninguno" o no se menciona, usa "".
objective (Objetivo Principal):
Acción: Sintetiza el objetivo central del estudio en una o dos frases claras. ¿Qué se propuso investigar?
studyType (Tipo de Estudio):
Acción: Clasifica el estudio. Ejemplos: "Ensayo clínico aleatorizado", "Meta-análisis", "Artículo de revisión", "Estudio in vitro", "Estudio observacional". Sé lo más específico posible.
methodologySummary (Resumen de Metodología):
Acción: Describe brevemente cómo se realizó el estudio. Incluye: participantes (número, características), diseño del estudio (doble ciego, placebo-controlado), duración, intervenciones y mediciones principales.
Prioridad: Sé conciso, enfócate en los detalles clave.
mainResults (Principales Resultados/Hallazgos):
Acción: Extrae los hallazgos más significativos y estadísticamente relevantes del estudio. ¿Qué descubrieron los investigadores?
Prioridad: Números y porcentajes clave son importantes si están presentes.
authorsConclusion (Conclusión de los Autores):
Acción: Transcribe o parafrasea fielmente la conclusión principal que los propios autores presentan en su sección de "Conclusión". No añadas tu propia interpretación.
limitations (Limitaciones del Estudio):
Acción: Lista las limitaciones del estudio mencionadas por los autores. Si no se mencionan explícitamente, usa un array vacío []. Formato: ["Limitación 1", "Limitación 2"].
Formato de Salida Final (JSON Mandatorio):
Tu respuesta DEBE ser un objeto JSON que contenga únicamente la estructura del StudyDnaSchema, con todos los campos rellenos según las directrices.
Ejemplo de Salida Esperada:
code
JSON
{
  "originalTitle": "Exploring synergistic benefits and clinical efficacy of turmeric in management of inflammatory and chronic diseases: A traditional Chinese medicine based review",
  "authors": ["Divya Jain", "Kuldeep Singh"],
  "institution": "Uttaranchal University & GLA University, India",
  "publication": "Pharmacological Research - Modern Chinese Medicine",
  "publicationDate": "2025-01-03T00:00:00.000Z",
  "doi": "https://doi.org/10.1016/j.prmcm.2025.100572",
  "fundingSource": "No especificado en el artículo.",
  "objective": "Explorar los efectos terapéuticos de la cúrcuma y la Medicina Tradicional China (MTC) en el manejo de enfermedades inflamatorias y crónicas, destacando mecanismos de acción, eficacia clínica y posibles efectos sinérgicos.",
  "studyType": "Artículo de revisión (Review)",
  "methodologySummary": "Revisión de la literatura científica publicada entre 2000 y 2024, obtenida de las bases de datos Google Scholar, Scopus, PubMed y Web of Science. Se seleccionaron 85 de 150 artículos recuperados.",
  "mainResults": "La revisión encontró evidencia significativa que respalda los efectos antiinflamatorios de la cúrcuma, principalmente a través de la modulación de las vías moleculares NF-kB y Nrf2. El uso combinado con preparaciones de la MTC mostró resultados terapéuticos mejorados.",
  "authorsConclusion": "La cúrcuma y la MTC tienen un potencial significativo en el manejo de enfermedades inflamatorias y crónicas. Su integración en la medicina convencional podría ofrecer opciones de tratamiento más completas.",
  "limitations": [
    "Variabilidad en los diseños de los estudios analizados.",
    "Diferencias en las formulaciones y dosis utilizadas en los estudios.",
    "Necesidad de más ensayos clínicos a gran escala para estandarizar protocolos."
  ]
}
---
AJUSTE ANTERIOR Y ACTUALIZACION
// prompts/extrae-padronizadamente-estudio-cientifico.md
/**
 * @file extrae-padronizadamente-estudio-cientifico.md
 * @description PROMPT MAESTRO: Directrices para la IA para extraer y estandarizar
 *              información clave de un estudio científico en un formato estructurado,
 *              alineado con el `StudyDnaSchema` de CogniRead.
 * @version 1.0.0
 * @author RaZ Podestá - MetaShark Tech
 */

# PROMPT MAESTRO: Extracción Estandarizada de Estudios Científicos para CogniRead

**Rol de la IA:** Eres un experto en revisión de literatura científica, con un profundo conocimiento de la metodología de investigación y la capacidad de sintetizar información compleja de manera concisa y precisa. Tu tarea es extraer la información fundamental de un estudio científico (proporcionado en cualquier formato: PDF, texto, URL) y rellenar un objeto JSON estrictamente conforme al `StudyDnaSchema`.

---

## Directrices para la Extracción (Prioridad: Precisión y Coherencia con el Schema)

Debes procesar el estudio científico y rellenar *todos* los campos del siguiente `StudyDnaSchema`. Si un campo no puede ser determinado o no aplica, déjalo como una cadena vacía `""` o un array vacío `[]` (según el tipo), **pero no lo omitas**.

### `StudyDnaSchema` (Estructura de Salida JSON Mandatoria):

```typescript
// Modelo de referencia (NO DEBE SER REPLICADO EN EL OUTPUT FINAL, solo para tu entendimiento)
import { z } from "zod";

export const StudyDnaSchema = z.object({
  // Sección A: Identificación
  originalTitle: z.string(),       // Título original completo del estudio.
  authors: z.array(z.string()),    // Lista de autores.
  institution: z.string(),         // Institución principal (si aplica).
  publication: z.string(),         // Nombre de la revista/fuente de publicación.
  publicationDate: z.string().datetime(), // Fecha de publicación en formato ISO 8601 (YYYY-MM-DDTHH:MM:SS.SSSZ). Si solo está el año, usa YYYY-01-01T00:00:00.000Z.
  doi: z.string().url(),           // Enlace DOI completo.
  fundingSource: z.string(),       // Fuente de financiación (si se menciona).
  // Secciones B, C, D...
  objective: z.string(),           // Objetivo principal del estudio.
  studyType: z.string(),           // Tipo de estudio (ej. "Ensayo clínico", "Artículo de revisión", "Estudio in vitro").
  methodologySummary: z.string(),  // Resumen conciso de la metodología (población, diseño, mediciones).
  mainResults: z.string(),         // Principales hallazgos/resultados.
  authorsConclusion: z.string(),   // Conclusión tal como la presentan los autores.
  limitations: z.array(z.string()),// Limitaciones del estudio (si se mencionan).
});
Instrucciones de Extracción Campo por Campo:
originalTitle (Título Original Completo):
Acción: Extrae el título principal del estudio. Debe ser idéntico al que figura en la publicación.
authors (Lista de Autores):
Acción: Extrae los nombres de todos los autores. Si hay muchos, puedes truncar a los primeros 5 y añadir "et al." o incluir todos si el estudio es conciso. Formato: ["Nombre Apellido", "Nombre2 Apellido2"].
institution (Institución Principal):
Acción: Identifica la institución o afiliación principal de los autores. Si no es clara o hay muchas, elige la más prominente o déjalo vacío.
publication (Fuente de Publicación):
Acción: Extrae el nombre de la revista científica, conferencia o editorial donde fue publicado.
publicationDate (Fecha de Publicación ISO 8601):
Acción: Encuentra la fecha de publicación del estudio.
Formato Mandatorio: YYYY-MM-DDTHH:MM:SS.SSSZ.
Ejemplo: Si solo se proporciona "2023", usa "2023-01-01T00:00:00.000Z". Si es "Diciembre 2023", usa "2023-12-01T00:00:00.000Z". Siempre al inicio del mes y día si no se especifica.
doi (Enlace DOI Completo):
Acción: Busca el Digital Object Identifier (DOI) del estudio. Debe ser una URL completa y funcional (ej. https://doi.org/10.1016/j.jaci.2023.01.001). Si no está presente, déjalo como una cadena vacía "".
fundingSource (Fuente de Financiación):
Acción: Identifica si el estudio menciona alguna fuente de financiación o conflicto de intereses. Si se especifica, extráelo. Si dice "Ninguno" o no se menciona, usa "".
objective (Objetivo Principal):
Acción: Sintetiza el objetivo central del estudio en una o dos frases claras. ¿Qué se propuso investigar?
studyType (Tipo de Estudio):
Acción: Clasifica el estudio. Ejemplos: "Ensayo clínico aleatorizado", "Meta-análisis", "Artículo de revisión", "Estudio in vitro", "Estudio observacional". Sé lo más específico posible.
methodologySummary (Resumen de Metodología):
Acción: Describe brevemente cómo se realizó el estudio. Incluye: participantes (número, características), diseño del estudio (doble ciego, placebo-controlado), duración, intervenciones y mediciones principales.
Prioridad: Sé conciso, enfócate en los detalles clave.
mainResults (Principales Resultados/Hallazgos):
Acción: Extrae los hallazgos más significativos y estadísticamente relevantes del estudio. ¿Qué descubrieron los investigadores?
Prioridad: Números y porcentajes clave son importantes si están presentes.
authorsConclusion (Conclusión de los Autores):
Acción: Transcribe o parafrasea fielmente la conclusión principal que los propios autores presentan en su sección de "Conclusión". No añadas tu propia interpretación.
limitations (Limitaciones del Estudio):
Acción: Lista las limitaciones del estudio mencionadas por los autores. Si no se mencionan explícitamente, usa un array vacío []. Formato: ["Limitación 1", "Limitación 2"].
Formato de Salida Final (JSON Mandatorio):
Tu respuesta DEBE ser un objeto JSON que contenga únicamente la estructura del StudyDnaSchema, con todos los campos rellenos según las directrices.
Ejemplo de Salida Esperada:
code
JSON
{
  "originalTitle": "Exploring synergistic benefits and clinical efficacy of turmeric in management of inflammatory and chronic diseases: A traditional Chinese medicine based review",
  "authors": ["Divya Jain", "Kuldeep Singh"],
  "institution": "Uttaranchal University & GLA University, India",
  "publication": "Pharmacological Research - Modern Chinese Medicine",
  "publicationDate": "2025-01-03T00:00:00.000Z",
  "doi": "https://doi.org/10.1016/j.prmcm.2025.100572",
  "fundingSource": "No especificado en el artículo.",
  "objective": "Explorar los efectos terapéuticos de la cúrcuma y la Medicina Tradicional China (MTC) en el manejo de enfermedades inflamatorias y crónicas, destacando mecanismos de acción, eficacia clínica y posibles efectos sinérgicos.",
  "studyType": "Artículo de revisión (Review)",
  "methodologySummary": "Revisión de la literatura científica publicada entre 2000 y 2024, obtenida de las bases de datos Google Scholar, Scopus, PubMed y Web of Science. Se seleccionaron 85 de 150 artículos recuperados.",
  "mainResults": "La revisión encontró evidencia significativa que respalda los efectos antiinflamatorios de la cúrcuma, principalmente a través de la modulación de las vías moleculares NF-kB y Nrf2. El uso combinado con preparaciones de la MTC mostró resultados terapéuticos mejorados.",
  "authorsConclusion": "La cúrcuma y la MTC tienen un potencial significativo en el manejo de enfermedades inflamatorias y crónicas. Su integración en la medicina convencional podría ofrecer opciones de tratamiento más completas.",
  "limitations": [
    "Variabilidad en los diseños de los estudios analizados.",
    "Diferencias en las formulaciones y dosis utilizadas en los estudios.",
    "Necesidad de más ensayos clínicos a gran escala para estandarizar protocolos."
  ]
}
---

````
