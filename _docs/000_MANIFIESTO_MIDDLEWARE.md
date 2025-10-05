// APARATO REVISADO Y NIVELADO POR L.I.A. LEGACY - VERSIÓN 3.0.0
// ADVERTENCIA: No modificar sin consultar para evaluar el impacto holístico.

// \_docs/000_MANIFIESTO_MIDDLEWARE.md
/\*\*

- @file 000_MANIFIESTO_MIDDLEWARE.md
- @description Manifiesto Canónico y SSoT para el Pipeline del Middleware v3.0.
-              Define la arquitectura del "Guardián Inteligente" que perfila,
-              personaliza y protege cada petición entrante.
- @version 3.0.0 (Holistic Visitor Profiling & Preference-First i18n)
- @author RaZ Podestá - MetaShark Tech
  \*/

# Manifiesto Canónico: El Pipeline del Middleware v3.0 (El Guardián Inteligente)

## 1. Filosofía Raíz: "Inteligencia Proactiva, Personalización Persistente, Seguridad Inquebrantable."

Este documento es la **Única Fuente de Verdad (SSoT)** para la arquitectura y el flujo lógico del middleware. Su misión es actuar como un **motor de inteligencia proactivo** que perfila, personaliza y protege cada petición entrante antes de que llegue a la aplicación.

El pipeline es **atómico, secuencial y cortocircuitable**, y su lógica prioriza la elección explícita del usuario y la recopilación de inteligencia de negocio.

## 2. Diagrama de Flujo de Solicitud v3.0 (El "Grapho" de Élite)

```mermaid
graph TD
    A[Request Entrante] --> B{Middleware Invoked};
    B --> C[Visitor Intelligence Handler];
    C -- Petición Enriquecida --> D[i18n Handler];

    subgraph "1. Inteligencia del Visitante (Perfilador Holístico)"
        C --> C1{¿Cookie de Sesión Supabase?};
        C1 -- Sí --> C2[ID: 'Identificado'];
        C1 -- No --> C3{¿Cookie de Fingerprint?};
        C3 -- Sí --> C4[ID: 'Anónimo Recurrente'];
        C3 -- No --> C5[Generar Fingerprint & Set Cookie];
        C5 --> C6[ID: 'Anónimo Nuevo'];
        C2 & C4 & C6 --> C7[Obtener GeoIP Granular, User-Agent & Referer];
        C7 --> C8[Inyectar Headers x-visitor-*];
    end

    D -- Procesa Headers --> E{¿Ruta Exenta?};
    E -- Sí (API, Archivos) --> F[Continuar sin cambios];
    E -- No --> G{¿Cookie 'NEXT_LOCALE' presente?};

    subgraph "2. Internacionalización (Personalizador Persistente)"
        G -- Sí --> H[Redirigir a /<locale-cookie>/ruta];
        G -- No --> I{¿GeoIP Válido?};
        I -- Sí --> J[Redirigir a /<locale-país>/ruta];
        I -- No --> K{¿Header de Navegador Válido?};
        K -- Sí --> L[Redirigir a /<locale-navegador>/ruta];
        K -- No --> M[Redirigir a /select-language?returnUrl=...];
    end

    F & H & J & L --> N[Auth Handler];

    subgraph "3. Autenticación (Guardián Contextual)"
        N --> O{¿Ruta Protegida?};
        O -- No --> P[Response Final a Next.js];
        O -- Sí --> Q{¿Sesión de Usuario Válida?};
        Q -- Sí --> P;
        Q -- No --> R[Redirigir a /login?redirectedFrom=...&reason=...];
    end
3. Orden y Responsabilidad de los Manejadores
Manejador 1: visitorIntelligenceHandler (El Perfilador Holístico)
Visión y Propósito: Su única responsabilidad es construir un "pasaporte digital" exhaustivo para cada visitante y enriquecer la petición con esta información. Nunca redirige.
Orden de Ejecución: Primero.
Flujo de Lógica Detallado:
Identificación de Identidad: Determina si el visitante es 'identified' (sesión de Supabase) o 'anonymous'. Para los anónimos, busca o crea una cookie de fingerprint con una duración de 2 años.
Recopilación de Inteligencia Holística: Obtiene y procesa:
Red y GeoIP: IP, País, Ciudad, Región/Provincia, Latitud, Longitud y si es un Proxy.
Dispositivo y Navegador: User-Agent completo, tipo de dispositivo, navegador, OS y motor de renderizado.
Contexto de Navegación: URL de Referencia (Referer) y la URL completa solicitada.
Preferencia de Idioma: La cabecera Accept-Language del navegador.
Infraestructura: El ID de la petición de Vercel (x-vercel-id).
Enriquecimiento de Cabeceras: Inyecta todas las cabeceras x-visitor-* en la respuesta para su uso en manejadores posteriores y en la aplicación.
Manejador 2: i18nHandler (El Personalizador de Idioma)
Visión y Propósito: Garantizar que el usuario vea el contenido en su idioma preferido, priorizando la elección explícita sobre la detección implícita.
Orden de Ejecución: Segundo.
Flujo de Lógica Jerárquico:
Guardianes de Exclusión: Ignora rutas ya localizadas, archivos públicos y rutas exentas (/api, /select-language) para prevenir bucles de redirección.
(Prioridad 1) Cookie de Preferencia (NEXT_LOCALE): Si la cookie existe, su valor se utiliza para la redirección. Esta es la SSoT de la preferencia del usuario.
(Prioridad 2) Detección por GeoIP: Utiliza la cabecera x-visitor-country para determinar el locale.
(Prioridad 3) Detección por Navegador: Como último recurso, utiliza las cabeceras Accept-Language.
(Fallback Final) Selector de Idioma: Si todo lo anterior falla, redirige a /select-language, preservando la URL original a la que se intentaba acceder.
Manejador 3: authHandler (El Guardián de Acceso Contextual)
Visión y Propósito: Proteger rutas sensibles y guiar a los usuarios no autenticados al flujo de login de manera contextual, informándoles por qué fueron redirigidos.
Orden de Ejecución: Tercero.
Flujo de Lógica Detallado:
Identificación de Ruta Protegida: Utiliza el manifiesto navigation.ts como SSoT para determinar si la ruta es de tipo DevOnly.
Verificación de Sesión: Valida la sesión del usuario a través de las cookies de Supabase.
Redirección Contextual: Si no hay sesión, redirige a /login con dos parámetros:
redirectedFrom: La ruta original a la que el usuario intentaba acceder.
reason: Un código (ej. protected_route_access) que la UI de login utilizará para mostrar un mensaje contextual y no hardcodeado.
4. Ecosistema de Soporte y Flujos Relacionados
Cookie NEXT_LOCALE: Es la SSoT de la preferencia de idioma del usuario, con una duración de 1 año. Es establecida por los componentes de cliente LanguageSwitcher y LanguageSelectorClient.
Persistencia de Inteligencia de Visitantes:
Almacenamiento: Los datos del pasaporte digital de cada petición se persistirán en la tabla visitor_sessions de Supabase. Los datos sensibles serán encriptados.
Retención: Los registros se conservarán por 2 años para análisis de seguridad y de negocio.
Migración de Identidad: Se implementará un mecanismo de backend (Supabase Trigger) para asociar el historial de un visitante anónimo con su user_id en el momento del registro, unificando su viaje.

---

```
