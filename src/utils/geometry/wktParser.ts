import { Geometry } from 'geojson';

const GEOMETRY_TYPES = {
  POINT: 'Point',
  LINESTRING: 'LineString',
  POLYGON: 'Polygon',
  MULTIPOINT: 'MultiPoint',
  MULTILINESTRING: 'MultiLineString',
  MULTIPOLYGON: 'MultiPolygon'
} as const;

function parseCoordinatePair(pair: string): number[] {
  try {
    const [x, y] = pair.trim().split(/\s+/).map(Number);
    if (isNaN(x) || isNaN(y)) {
      throw new Error(`Invalid coordinate pair: ${pair}`);
    }
    return [x, y];
  } catch (error) {
    throw new Error(`Error parsing coordinate pair: ${error.message}`);
  }
}

function parsePolygon(coordinates: string): number[][][] {
  try {
    // Remove outer parentheses and split into rings
    const rings = coordinates.slice(1, -1).split('),(');
    
    return rings.map(ring => {
      // Remove remaining parentheses and split into coordinate pairs
      const coords = ring.replace(/^\(|\)$/g, '').split(',');
      
      // Parse each coordinate pair
      const parsedCoords = coords.map(parseCoordinatePair);
      
      // Ensure the ring is closed
      if (parsedCoords.length < 4 || 
          parsedCoords[0][0] !== parsedCoords[parsedCoords.length - 1][0] ||
          parsedCoords[0][1] !== parsedCoords[parsedCoords.length - 1][1]) {
        parsedCoords.push([...parsedCoords[0]]);
      }
      
      return parsedCoords;
    });
  } catch (error) {
    throw new Error(`Error parsing polygon: ${error.message}`);
  }
}

function parseMultiPolygon(coordinates: string): number[][][][] {
  try {
    // Split into individual polygons
    const polygons = coordinates.match(/\(\([^)]+\)\)/g);
    if (!polygons) {
      throw new Error('No valid polygons found');
    }

    return polygons.map(polygon => {
      // Remove outer parentheses and parse as regular polygon
      return parsePolygon(polygon.slice(1, -1));
    });
  } catch (error) {
    throw new Error(`Error parsing multipolygon: ${error.message}`);
  }
}

export function parseWKT(wkt: string): Geometry {
  try {
    // Clean and validate input
    const cleanWkt = wkt.trim().toUpperCase();
    if (!cleanWkt) {
      throw new Error('Empty WKT string');
    }

    // Extract geometry type and coordinates
    const matches = cleanWkt.match(/^([A-Z]+)\s*\((.*)\)$/);
    if (!matches) {
      throw new Error('Invalid WKT format');
    }

    const [, geometryType, coordinatesString] = matches;

    switch (geometryType) {
      case 'POLYGON':
        return {
          type: GEOMETRY_TYPES.POLYGON,
          coordinates: parsePolygon(coordinatesString)
        };
      
      case 'MULTIPOLYGON':
        return {
          type: GEOMETRY_TYPES.MULTIPOLYGON,
          coordinates: parseMultiPolygon(coordinatesString)
        };
      
      default:
        throw new Error(`Unsupported geometry type: ${geometryType}`);
    }
  } catch (error) {
    console.error('WKT parsing error:', error);
    throw new Error(`Failed to parse WKT: ${error.message}`);
  }
}