import { Feature, Point, Polygon, MultiPolygon } from 'geojson';
import { Buffer } from 'buffer';

interface GeometryParseResult {
  success: boolean;
  geometry?: Feature['geometry'];
  error?: string;
}

function mercatorToWgs84(x: number, y: number) {
  const earthRadius = 6378137.0;
  const lng = (x / earthRadius) * (180 / Math.PI);
  const lat = (Math.PI / 2 - 2 * Math.atan(Math.exp(-y / earthRadius))) * (180 / Math.PI);
  return { lat, lng };
}

function parseWKBHex(wkbHex: string) {
  const hasPrefix = wkbHex.slice(0, 8) === '01030000';
  const dataStart = hasPrefix ? 18 : 10;
  
  const coordinates = [];
  let pos = dataStart;

  // Skip ring count
  pos += 8;
  // Skip point count
  pos += 8;
  
  while (pos < wkbHex.length) {
    const x = Buffer.from(wkbHex.slice(pos, pos + 16), 'hex').readDoubleLE(0);
    pos += 16;
    const y = Buffer.from(wkbHex.slice(pos, pos + 16), 'hex').readDoubleLE(0);
    pos += 16;
    
    coordinates.push([x, y]);
  }
  
  return {
    type: 'Polygon',
    coordinates: [coordinates]
  };
}

function convertGeometryToLatLng(geom: any) {
  if (geom.type === 'MultiPolygon') {
    return geom.coordinates[0][0].map((point: number[]) => {
      const converted = mercatorToWgs84(point[0], point[1]);
      return [converted.lng, converted.lat];
    });
  } 
  else if (geom.type === 'Polygon') {
    return geom.coordinates[0].map((point: number[]) => {
      const converted = mercatorToWgs84(point[0], point[1]);
      return [converted.lng, converted.lat];
    });
  }
  
  throw new Error('Unsupported geometry type');
}

export function transformToGeometry(value: string): GeometryParseResult {
  try {
    if (!value?.trim()) {
      return {
        success: false,
        error: 'Empty geometry value'
      };
    }

    // Clean the input string
    const cleanValue = value.trim().toUpperCase();

    // Handle WKB format
    if (/^[0-9A-F]+$/i.test(cleanValue)) {
      const parsedGeometry = parseWKBHex(cleanValue);
      const convertedCoordinates = convertGeometryToLatLng(parsedGeometry);
      
      return {
        success: true,
        geometry: {
          type: 'Polygon',
          coordinates: [convertedCoordinates]
        }
      };
    }

    return {
      success: false,
      error: 'Unsupported geometry format'
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error parsing geometry'
    };
  }
}

export function createFeatureFromGeometry(
  geometry: Feature['geometry'],
  properties: Record<string, any> = {}
): Feature {
  return {
    type: 'Feature',
    properties: {
      id: properties.id || `feature-${Date.now()}`,
      ...properties
    },
    geometry
  };
}

export function validateGeometry(geometry: Feature['geometry']): boolean {
  if (!geometry || !geometry.type || !geometry.coordinates) {
    return false;
  }

  try {
    switch (geometry.type) {
      case 'Point':
        return Array.isArray(geometry.coordinates) &&
               geometry.coordinates.length === 2 &&
               geometry.coordinates.every(coord => typeof coord === 'number');

      case 'Polygon':
        return Array.isArray(geometry.coordinates) &&
               geometry.coordinates.length > 0 &&
               geometry.coordinates.every(ring =>
                 Array.isArray(ring) &&
                 ring.length >= 4 &&
                 ring.every(coord =>
                   Array.isArray(coord) &&
                   coord.length === 2 &&
                   coord.every(num => typeof num === 'number')
                 )
               );

      case 'MultiPolygon':
        return Array.isArray(geometry.coordinates) &&
               geometry.coordinates.every(polygon =>
                 Array.isArray(polygon) &&
                 polygon.every(ring =>
                   Array.isArray(ring) &&
                   ring.length >= 4 &&
                   ring.every(coord =>
                     Array.isArray(coord) &&
                     coord.length === 2 &&
                     coord.every(num => typeof num === 'number')
                   )
                 )
               );

      default:
        return false;
    }
  } catch {
    return false;
  }
}