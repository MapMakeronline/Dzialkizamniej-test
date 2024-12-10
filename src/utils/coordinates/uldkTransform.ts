// Constants for PUWG1992 (EPSG:2180) transformation
const LAT_ORIGIN = 52.0;
const LON_ORIGIN = 19.0;
const FALSE_EASTING = 500000.0;
const FALSE_NORTHING = -5300000.0;
const SCALE = 0.9993;
const RADIUS = 6378137.0;
const E2 = 0.00669438002290;

/**
 * Converts WGS84 coordinates to PUWG1992 (EPSG:2180)
 */
export function wgs84ToPUWG1992(lat: number, lng: number): { x: number; y: number } {
  try {
    // Validate input coordinates
    if (!isFinite(lat) || !isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid input coordinates');
    }

    // Convert degrees to radians
    const latRad = lat * Math.PI / 180.0;
    const lonRad = lng * Math.PI / 180.0;
    const latOriginRad = LAT_ORIGIN * Math.PI / 180.0;
    const lonOriginRad = LON_ORIGIN * Math.PI / 180.0;

    // Calculate projection parameters
    const t = Math.tan(latRad);
    const t2 = t * t;
    const n2 = E2 * Math.pow(Math.cos(latRad), 2);
    const N = RADIUS / Math.sqrt(1 - E2 * Math.pow(Math.sin(latRad), 2));
    const l = lonRad - lonOriginRad;
    const l2 = l * l;
    const l4 = l2 * l2;

    // Calculate coordinates
    const x = SCALE * N * (
      l + 
      (l * l2 / 6.0) * Math.pow(Math.cos(latRad), 2) * (1 - t2 + n2) +
      (l * l4 / 120.0) * Math.pow(Math.cos(latRad), 4) * (5 - 18 * t2 + t2 * t2 + 14 * n2 - 58 * n2 * t2)
    ) + FALSE_EASTING;

    const y = SCALE * (
      meridianArc(latRad) +
      N * t * l2 * Math.cos(latRad) / 2.0 +
      N * t * l4 * Math.pow(Math.cos(latRad), 3) / 24.0 * (5 - t2 + 9 * n2 + 4 * n2 * n2)
    ) + FALSE_NORTHING;

    return { 
      x: Math.round(x * 100) / 100,
      y: Math.round(y * 100) / 100
    };
  } catch (error) {
    console.error('Error converting WGS84 to PUWG1992:', error);
    throw error;
  }
}

/**
 * Calculates meridian arc length
 */
function meridianArc(lat: number): number {
  const e2 = E2;
  const e4 = e2 * e2;
  const e6 = e4 * e2;
  const e8 = e6 * e2;

  return RADIUS * (
    (1 - e2/4 - 3*e4/64 - 5*e6/256 - 175*e8/16384) * lat -
    (3*e2/8 + 3*e4/32 + 45*e6/1024 + 175*e8/8192) * Math.sin(2*lat) +
    (15*e4/256 + 45*e6/1024 + 525*e8/16384) * Math.sin(4*lat) -
    (35*e6/3072 + 175*e8/12288) * Math.sin(6*lat) +
    (315*e8/131072) * Math.sin(8*lat)
  );
}

/**
 * Validates if coordinates are within Poland's bounds
 */
export function isWithinPolandBounds(lat: number, lng: number): boolean {
  return lat >= 49.0 && lat <= 54.9 && 
         lng >= 14.1 && lng <= 24.2;
}

/**
 * Converts coordinates from PUWG1992 to WGS84
 */
export function puwg1992ToWGS84(x: number, y: number): { lat: number; lng: number } {
  // This is an approximate conversion
  const xNorm = (x - FALSE_EASTING) / SCALE;
  const yNorm = (y - FALSE_NORTHING) / SCALE;

  const lat = (yNorm / RADIUS) * (180.0 / Math.PI) + LAT_ORIGIN;
  const lng = (xNorm / (RADIUS * Math.cos(lat * Math.PI / 180.0))) * (180.0 / Math.PI) + LON_ORIGIN;

  return { lat, lng };
}