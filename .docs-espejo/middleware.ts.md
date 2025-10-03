// .docs-espejo/middleware.ts.md
/\*\*

- @file middleware.ts.md
- @description Documento Espejo y SSoT conceptual para el Middleware de la aplicación.
- @version 1.0.0
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Conceptual: Middleware Guardián

## 1. Rol Estratégico

El `middleware.ts` es el **guardián de la puerta de entrada** de la aplicación. Se ejecuta en el Edge (cerca del usuario) para cada petición que coincida con su `config.matcher`. Su responsabilidad principal y estratégica es la **normalización y localización de rutas**.

Su propósito es interceptar todas las peticiones de página entrantes, garantizar que tengan un prefijo de `locale` válido y redirigir al usuario a la URL canónica y localizada si es necesario. Esto es fundamental para el SEO y para el correcto funcionamiento del sistema de internacionalización (i18n) del App Router de Next.js.

## 2. Arquitectura y Flujo de Ejecución

El middleware es una función única y optimizada para un rendimiento máximo en el entorno Edge.

1.  **Configuración de `matcher`:** El objeto `config` define un patrón de expresión regular exhaustivo para que el middleware solo se ejecute en las rutas de página reales, excluyendo explícitamente `_next`, APIs, assets de `public/` y archivos de metadatos comunes (`robots.txt`, `sitemap.xml`, etc.). Esto es una optimización crítica de rendimiento.
2.  **Entrada:** Recibe el objeto `NextRequest`.
3.  **Paso 1: Extracción y Logging Inicial:** Extrae la `pathname` de la URL. Loguea el inicio del procesamiento para la trazabilidad.
4.  **Paso 2: Verificación de Locale:**
    - Utiliza una expresión regular pre-compilada y altamente eficiente para verificar si la `pathname` ya comienza con un `locale` soportado (ej. `/es-ES/...`).
    - Si el locale ya está presente, la función termina inmediatamente (`early return`), evitando cualquier procesamiento adicional.
5.  **Paso 3: Detección y Redirección (si es necesario):**
    - Si no se encontró un locale, invoca a la lógica de `getLocale` (que utiliza `Negotiator` y `@formatjs/intl-localematcher`) para determinar el mejor `locale` para el usuario basándose en sus cabeceras `Accept-Language`.
    - Construye la nueva URL de redirección.
    - Crea una `NextResponse` de tipo redirección (código 308 - permanente, para SEO).
    - **Mejora de Observabilidad:** Añade una cabecera `x-middleware-reason` a la respuesta para indicar explícitamente por qué se realizó la redirección.
6.  **Salida:** Devuelve una `NextResponse` (ya sea la original si no hay cambios o la de redirección).

## 3. Contrato de API

- **Función Principal:** `middleware(request: NextRequest): NextResponse | void`
- **Exportación de Configuración:** `config: { matcher: string[] }`

## 4. Zona de Melhorias Futuras

- **Integración de Pipeline de Handlers:** Evolucionar el middleware para que sea un orquestador que ejecute una cadena de manejadores (handlers) atómicos (ej. `i18nHandler`, `authHandler`, `abTestingHandler`). Esto mejoraría la separación de intereses y la escalabilidad a medida que se añadan más lógicas de Edge.
- **Gestión de A/B Testing:** Añadir un `abTestingHandler` que lea una cookie o un parámetro de URL y reescriba la ruta a una variante de página diferente, permitiendo realizar tests A/B en el Edge.
- **Geolocalización y Bloqueo:** Implementar un `geoHandler` que determine el país del usuario a partir de la IP (proporcionada por Vercel) y pueda bloquear o redirigir el tráfico de ciertas regiones.
- **Gestión de Autenticación:** Implementar un `authHandler` que verifique un token de sesión (en una cookie) y proteja rutas, redirigiendo a los usuarios no autenticados a la página de login.

// .docs-espejo/middleware.ts.md
