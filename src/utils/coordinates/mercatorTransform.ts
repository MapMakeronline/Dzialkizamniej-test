import { LatLng } from 'leaflet';

// Constants for Web Mercator projection
const EARTH_RADIUS = 6378137.0; // Earth's radius in meters
const PI_180 = Math.PI / 180;
const PI_4 = Math.PI / 4;

/**
 * Converts Web Mercator coordinates (EPSG:3857) to WGS84 (EPSG:4326)
 */
export function mercatorToWgs84(x: number, y: number): { lat: number; lng: number } {
  try {
    // Validate input coordinates
    if (!isFinite(x) || !isFinite(y)) {
      throw new Error('Invalid input coordinates');
    }

    // Convert to WGS84
    const lng = (x / EARTH_RADIUS) * (180 / Math.PI);
    const lat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-y / EARTH_RADIUS))) * (180 / Math.PI);
    
    // Validate output coordinates
    if (!isFinite(lng) || !isFinite(lat) || 
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid coordinates after conversion');
    }
    
    return { lat, lng };
  } catch (error) {
    console.error('Error converting Mercator to WGS84:', error);
    throw error;
  }
}

/**
 * Converts WGS84 coordinates (EPSG:4326) to Web Mercator (EPSG:3857)
 */
export function wgs84ToMercator(lat: number, lng: number): { x: number; y: number } {
  try {
    // Validate input coordinates
    if (!isFinite(lat) || !isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid input coordinates');
    }

    // Convert to Web Mercator
    const x = lng * EARTH_RADIUS * PI_180;
    const y = Math.log(Math.tan(PI_4 + lat * PI_180 / 2)) * EARTH_RADIUS;
    
    // Validate output coordinates
    if (!isFinite(x) || !isFinite(y)) {
      throw new Error('Invalid coordinates after conversion');
    }
    
    return { x, y };
  } catch (error) {
    console.error('Error converting WGS84 to Mercator:', error);
    throw error;
  }
}

/**
 * Converts Leaflet LatLng to Web Mercator coordinates
 */
export function latLngToMercator(latLng: LatLng): { x: number; y: number } {
  return wgs84ToMercator(latLng.lat, latLng.lng);
}

/**
 * Converts Web Mercator coordinates to Leaflet LatLng
 */
export function mercatorToLatLng(x: number, y: number): LatLng {
  const { lat, lng } = mercatorToWgs84(x, y);
  return new LatLng(lat, lng);
}

/**
 * Validates if coordinates are within valid Web Mercator bounds
 */
export function isValidMercatorCoordinate(x: number, y: number): boolean {
  const MAX_MERCATOR_BOUND = Math.PI * EARTH_RADIUS;
  return isFinite(x) && isFinite(y) &&
         Math.abs(x) <= MAX_MERCATOR_BOUND &&
         Math.abs(y) <= MAX_MERCATOR_BOUND;
}