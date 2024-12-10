import { Feature, Geometry } from 'geojson';
import { Buffer } from 'buffer';
import { puwg1992ToWgs84 } from '../coordinates/coordinateTransform';

// WKB Geometry Types
const WKBGeometryType = {
  Point: 1,
  LineString: 2,
  Polygon: 3,
  MultiPoint: 4,
  MultiLineString: 5,
  MultiPolygon: 6,
  GeometryCollection: 7
} as const;

interface WKBHeader {
  byteOrder: number;
  type: number;
  srid?: number;
}

function parseWKBHeader(wkbHex: string): WKBHeader {
  try {
    // Remove any whitespace and ensure uppercase
    wkbHex = wkbHex.replace(/\s/g, '').toUpperCase();

    // Check for SRID prefix (0x01 + geometry type + SRID)
    const hasSRID = wkbHex.startsWith('01') && wkbHex.length >= 18;
    const headerStart = hasSRID ? 18 : 0;

    // Parse byte order and geometry type
    const byteOrder = parseInt(wkbHex.substring(headerStart, headerStart + 2), 16);
    const type = parseInt(wkbHex.substring(headerStart + 2, headerStart + 10), 16);
    const srid = hasSRID ? parseInt(wkbHex.substring(10, 18), 16) : undefined;

    return {
      byteOrder,
      type: type & 0x1FFFFFFF, // Remove SRID and dimension flags
      srid
    };
  } catch (error) {
    console.error('Error parsing WKB header:', error);
    throw new Error('Invalid WKB header format');
  }
}

function readDouble(hex: string, offset: number = 0): number {
  try {
    const buffer = Buffer.from(hex.substring(offset, offset + 16), 'hex');
    return buffer.readDoubleLE(0);
  } catch (error) {
    console.error('Error reading double:', error);
    throw new Error('Invalid double value in WKB');
  }
}

function parseCoordinates(wkbHex: string, offset: number, numPoints: number): [number[][], number] {
  const coordinates: number[][] = [];
  let currentOffset = offset;

  try {
    for (let i = 0; i < numPoints; i++) {
      const x = readDouble(wkbHex, currentOffset);
      currentOffset += 16;
      const y = readDouble(wkbHex, currentOffset);
      currentOffset += 16;

      // Transform from PUWG1992 to WGS84
      const { lat, lng } = puwg1992ToWgs84(x, y);
      coordinates.push([lng, lat]);
    }

    return [coordinates, currentOffset];
  } catch (error) {
    console.error('Error parsing coordinates:', error);
    throw new Error('Invalid coordinate data in WKB');
  }
}

function parsePolygon(wkbHex: string, offset: number): Geometry {
  try {
    // Read number of rings
    const numRings = parseInt(wkbHex.substring(offset, offset + 8), 16);
    offset += 8;

    const rings: number[][][] = [];
    
    // Parse each ring
    for (let i = 0; i < numRings; i++) {
      // Read number of points in this ring
      const numPoints = parseInt(wkbHex.substring(offset, offset + 8), 16);
      offset += 8;

      // Parse coordinates for this ring
      const [coordinates, newOffset] = parseCoordinates(wkbHex, offset, numPoints);
      offset = newOffset;

      // Ensure ring is closed
      if (coordinates.length >= 3) {
        const first = coordinates[0];
        const last = coordinates[coordinates.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          coordinates.push([...first]);
        }
      }

      rings.push(coordinates);
    }

    return {
      type: 'Polygon',
      coordinates: rings
    };
  } catch (error) {
    console.error('Error parsing polygon:', error);
    throw new Error('Invalid polygon data in WKB');
  }
}

export function parseWKB(wkbHex: string): Feature | null {
  try {
    if (!wkbHex?.trim()) return null;

    // Clean WKB string
    wkbHex = wkbHex.replace(/[^0-9A-Fa-f]/g, '').toUpperCase();
    
    // Parse header
    const header = parseWKBHeader(wkbHex);
    
    // Start parsing after header
    let offset = header.srid !== undefined ? 18 : 10;
    
    let geometry: Geometry;

    switch (header.type) {
      case WKBGeometryType.Polygon:
        geometry = parsePolygon(wkbHex, offset);
        break;
      default:
        console.warn(`Geometry type ${header.type} not yet implemented`);
        return null;
    }

    return {
      type: 'Feature',
      properties: {},
      geometry
    };
  } catch (error) {
    console.error('WKB parsing error:', error);
    return null;
  }
}