// RUTA: src/shared/lib/services/ip-intelligence.service.ts
/**
 * @file ip-intelligence.service.ts
 * @description SSoT para la obtención de datos de inteligencia de IP. Esta versión
 *              holística v4.1 captura geolocalización granular (incluyendo coordenadas),
 *              estado de proxy y es consciente del entorno de desarrollo.
 * @version 4.1.0 (Granular Geolocation & Proxy Detection)
 * @author L.I.A. Legacy
 */
import "server-only";
import { logger } from "../logging";

/**
 * @interface IpIntelligence
 * @description Contrato de datos soberano para la información de geolocalización
 *              y perfilado de una dirección IP.
 * @property {string} ip - La dirección IP consultada.
 * @property {string | null} countryCode - El código de país ISO 3166-1 alpha-2.
 * @property {string | null} region - El código de la región/estado/provincia.
 * @property {string | null} city - El nombre de la ciudad.
 * @property {number | null} latitude - La latitud geográfica.
 * @property {number | null} longitude - La longitud geográfica.
 * @property {boolean} isProxy - Verdadero si la IP es detectada como un proxy, VPN o Tor.
 */
export interface IpIntelligence {
  ip: string;
  countryCode: string | null;
  city: string | null;
  region: string | null;
  latitude: number | null;
  longitude: number | null;
  isProxy: boolean;
}

const LOCALHOST_IPS = new Set(["127.0.0.1", "::1", "::ffff:127.0.0.1"]);
const API_FIELDS = "status,message,countryCode,region,city,lat,lon,proxy,query";

/**
 * @function getIpIntelligence
 * @description Obtiene datos de geolocalización para una IP pública. Si se detecta
 *              una IP de localhost, omite la llamada a la API y devuelve null.
 * @param {string} ip - La dirección IP a consultar.
 * @returns {Promise<IpIntelligence | null>} Los datos de inteligencia o null si falla o es localhost.
 */
export async function getIpIntelligence(
  ip: string
): Promise<IpIntelligence | null> {
  const traceId = logger.startTrace("getIpIntelligence_v4.1");
  logger.trace(`[IpIntelligenceService] Iniciando consulta para IP: ${ip}`, {
    traceId,
  });

  if (LOCALHOST_IPS.has(ip)) {
    logger.trace(
      "[IpIntelligenceService] IP de localhost detectada. Omitiendo llamada a API.",
      { ip, traceId }
    );
    logger.endTrace(traceId);
    return null;
  }

  try {
    const response = await fetch(
      `http://ip-api.com/json/${ip}?fields=${API_FIELDS}`
    );

    if (!response.ok) {
      throw new Error(`La API de IP devolvió el estado: ${response.status}`);
    }
    const data = await response.json();

    if (data.status !== "success") {
      throw new Error(
        `La API de IP devolvió un error: ${data.message || "Respuesta sin mensaje."}`
      );
    }

    const result: IpIntelligence = {
      ip: data.query,
      countryCode: data.countryCode || null,
      region: data.region || null,
      city: data.city || null,
      latitude: data.lat || null,
      longitude: data.lon || null,
      isProxy: data.proxy || false,
    };

    logger.success(
      `[IpIntelligenceService] Inteligencia obtenida con éxito para IP: ${ip}`,
      { result, traceId }
    );
    return result;
  } catch (error) {
    logger.error(
      "[IpIntelligenceService] Fallo al consultar la API de GeoIP.",
      { error, ip, traceId }
    );
    return null;
  } finally {
    logger.endTrace(traceId);
  }
}
