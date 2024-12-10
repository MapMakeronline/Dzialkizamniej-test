import { Feature } from 'geojson';
import { Buffer } from 'buffer';

export function parseWKB(wkbHex: string): Feature {
  // Remove any whitespace and ensure uppercase
  wkbHex = wkbHex.replace(/\s/g, '').toUpperCase();
  
  // Remove SRID prefix if present (e.g., 0103000020110F0000)
  const sridPattern = /^[0-9A-F]{16}/;
  if (sridPattern.test(wkbHex)) {
    wkbHex = wkbHex.substring(16);
  }
  
  // Parse number of rings (first 8 chars after SRID)
  const numRings = parseInt(wkbHex.substring(0, 8), 16);
  
  // Parse number of points in the ring (next 8 chars)
  const numPoints = parseInt(wkbHex.substring(8, 16), 16);
  
  // Parse coordinates
  const coordinates: number[][] = [];
  let offset = 16;
  
  for (let i = 0; i < numPoints; i++) {
    const x = Buffer.from(wkbHex.substring(offset, offset + 16), 'hex').readDoubleLE(0);
    const y = Buffer.from(wkbHex.substring(offset + 16, offset + 32), 'hex').readDoubleLE(0);
    coordinates.push([x, y]);
    offset += 32;
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [coordinates],
    },
  };
}