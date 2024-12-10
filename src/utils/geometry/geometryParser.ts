import { Feature, Geometry } from 'geojson';
import { mercatorToWgs84 } from '../coordinates/mercatorTransform';

function parseGMLGeometry(gmlGeometry: any): Geometry | null {
  try {
    if (gmlGeometry['gml:MultiPolygon']) {
      const polygonMembers = gmlGeometry['gml:MultiPolygon']['gml:polygonMember'];
      const polygons = Array.isArray(polygonMembers) ? polygonMembers : [polygonMembers];
      
      const coordinates = polygons
        .map(polygon => {
          const coordsText = polygon?.['gml:Polygon']?.['gml:outerBoundaryIs']?.['gml:LinearRing']?.['gml:coordinates']?._text;
          if (!coordsText) return null;
          
          const coords = coordsText.split(' ')
            .filter(Boolean)
            .map(pair => pair.split(',').map(Number))
            .filter(coord => coord.length === 2 && coord.every(n => isFinite(n)))
            .map(([x, y]) => {
              const { lat, lng } = mercatorToWgs84(x, y);
              return [lng, lat];
            });
          
          if (coords.length >= 3) {
            // Ensure the polygon is closed
            if (coords[0][0] !== coords[coords.length - 1][0] || 
                coords[0][1] !== coords[coords.length - 1][1]) {
              coords.push([...coords[0]]);
            }
            return coords;
          }
          return null;
        })
        .filter(Boolean);
      
      if (coordinates.length > 0) {
        return {
          type: 'MultiPolygon',
          coordinates: [coordinates]
        };
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error parsing GML geometry:', error);
    return null;
  }
}

export function parseGeometry(value: string): Geometry | null {
  try {
    if (!value?.trim()) {
      console.warn('Empty geometry value provided');
      return null;
    }

    const geometry = parseGMLGeometry(value);
    if (geometry) {
      return geometry;
    }

    console.warn('Unsupported geometry format:', value.substring(0, 50) + '...');
    return null;
  } catch (error) {
    console.error('Error parsing geometry:', error);
    return null;
  }
}

export function createFeatureFromGeometry(
  geometry: Geometry, 
  properties: Record<string, any> = {}
): Feature {
  if (!geometry) {
    throw new Error('Invalid geometry provided to createFeatureFromGeometry');
  }

  return {
    type: 'Feature',
    properties: {
      id: properties.id || `feature-${Date.now()}`,
      ...properties
    },
    geometry
  };
}