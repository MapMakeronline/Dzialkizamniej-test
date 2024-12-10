interface Geometry {
  type: string;
  coordinates: number[][] | number[][][] | number[][][][];
}

export function parseWKT(wkt: string): Geometry {
  // Remove any whitespace and convert to uppercase
  const cleanWkt = wkt.trim().toUpperCase();
  
  if (cleanWkt.startsWith('POLYGON')) {
    return parsePolygon(cleanWkt);
  } else if (cleanWkt.startsWith('MULTIPOLYGON')) {
    return parseMultiPolygon(cleanWkt);
  }
  
  throw new Error('Unsupported geometry type');
}

function parsePolygon(wkt: string): Geometry {
  try {
    // Extract coordinates between parentheses
    const coordsMatch = wkt.match(/\(\((.*)\)\)/);
    if (!coordsMatch) throw new Error('Invalid polygon format');
    
    const coords = coordsMatch[1]
      .split(',')
      .map(pair => pair.trim().split(' ')
        .map(coord => parseFloat(coord)));
    
    return {
      type: 'Polygon',
      coordinates: [coords]
    };
  } catch (error) {
    console.error('Error parsing polygon:', error);
    throw new Error('Failed to parse polygon WKT');
  }
}

function parseMultiPolygon(wkt: string): Geometry {
  try {
    // Extract all polygons
    const polygons = wkt
      .match(/\(\([^)]+\)\)/g)
      ?.map(polygon => 
        polygon
          .slice(2, -2)
          .split(',')
          .map(pair => pair.trim().split(' ')
            .map(coord => parseFloat(coord)))
      ) || [];
    
    return {
      type: 'MultiPolygon',
      coordinates: [polygons]
    };
  } catch (error) {
    console.error('Error parsing multipolygon:', error);
    throw new Error('Failed to parse multipolygon WKT');
  }
}