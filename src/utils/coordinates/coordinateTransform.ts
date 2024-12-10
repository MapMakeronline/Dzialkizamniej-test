import proj4 from 'proj4';

// Define coordinate systems
proj4.defs('EPSG:4326', '+proj=longlat +datum=WGS84 +no_defs');
proj4.defs('EPSG:2180', '+proj=tmerc +lat_0=0 +lon_0=19 +k=0.9993 +x_0=500000 +y_0=-5300000 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');

/**
 * Converts WGS84 coordinates to PUWG1992
 */
export function wgs84ToPUWG1992(lat: number, lng: number): { x: number; y: number } {
  try {
    if (!isFinite(lat) || !isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid coordinates');
    }

    const [x, y] = proj4('EPSG:4326', 'EPSG:2180', [lng, lat]);
    return { x, y };
  } catch (error) {
    console.error('Error converting WGS84 to PUWG1992:', error);
    throw error;
  }
}

/**
 * Converts PUWG1992 coordinates to WGS84
 */
export function puwg1992ToWgs84(x: number, y: number): { lat: number; lng: number } {
  try {
    if (!isFinite(x) || !isFinite(y)) {
      throw new Error('Invalid coordinates');
    }

    const [lng, lat] = proj4('EPSG:2180', 'EPSG:4326', [x, y]);
    
    if (!isFinite(lat) || !isFinite(lng) ||
        Math.abs(lat) > 90 || Math.abs(lng) > 180) {
      throw new Error('Invalid coordinates after conversion');
    }
    
    return { lat, lng };
  } catch (error) {
    console.error('Error converting PUWG1992 to WGS84:', error);
    throw error;
  }
}

/**
 * Checks if coordinates are within Poland's bounds
 */
export function isWithinPolandBounds(lat: number, lng: number): boolean {
  return lat >= 49.0 && lat <= 54.9 && 
         lng >= 14.1 && lng <= 24.2;
}