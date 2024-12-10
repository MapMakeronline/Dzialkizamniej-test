// Constants for PUWG1992 transformation
const LAT_ORIGIN = 52.0;
const LON_ORIGIN = 19.0;
const FALSE_EASTING = 500000.0;
const FALSE_NORTHING = -5300000.0;
const SCALE = 0.9993;
const RADIUS = 6378137.0;

export function wgs84ToPUWG1992(lat: number, lng: number): { x: number; y: number } {
  // Convert degrees to radians
  const latRad = (lat * Math.PI) / 180.0;
  const lonRad = (lng * Math.PI) / 180.0;
  const latOriginRad = (LAT_ORIGIN * Math.PI) / 180.0;
  const lonOriginRad = (LON_ORIGIN * Math.PI) / 180.0;

  // Calculate projection parameters
  const N = RADIUS / Math.sqrt(1 - 0.00669438 * Math.sin(latRad) * Math.sin(latRad));
  const t = Math.tan(latRad);
  const n = Math.sqrt(0.00669438) * Math.cos(latRad);
  const l = lonRad - lonOriginRad;

  // Calculate coordinates
  const x = SCALE * N * (l + (l * l * l / 6.0) * (Math.cos(latRad) * Math.cos(latRad)) * 
          (1 - t * t + n * n)) + FALSE_EASTING;
          
  const y = SCALE * (N * Math.tan(latRad) + N * t * l * l * Math.cos(latRad) / 2.0) + 
          FALSE_NORTHING;

  console.log('Coordinate transformation:', {
    input: { lat, lng },
    output: { x, y },
    intermediate: {
      latRad,
      lonRad,
      N,
      t,
      n,
      l
    }
  });

  return { x, y };
}

export function puwg1992ToWGS84(x: number, y: number): { lat: number; lng: number } {
  // Reverse transformation (approximate)
  const xNorm = (x - FALSE_EASTING) / SCALE;
  const yNorm = (y - FALSE_NORTHING) / SCALE;

  const lat = (yNorm / RADIUS) * (180.0 / Math.PI) + LAT_ORIGIN;
  const lng = (xNorm / (RADIUS * Math.cos(lat * Math.PI / 180.0))) * (180.0 / Math.PI) + LON_ORIGIN;

  return { lat, lng };
}