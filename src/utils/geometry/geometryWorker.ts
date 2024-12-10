import { Feature, Geometry } from 'geojson';
import { mercatorToWgs84 } from '../coordinates/coordinateTransform';

self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  switch (type) {
    case 'parseGMLGeometry':
      try {
        const geometry = parseGMLGeometry(data);
        self.postMessage({ type: 'geometryResult', data: geometry });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
      break;
      
    case 'transformCoordinates':
      try {
        const transformed = transformCoordinates(data);
        self.postMessage({ type: 'coordinatesResult', data: transformed });
      } catch (error) {
        self.postMessage({ type: 'error', error: error.message });
      }
      break;
  }
};

function parseGMLGeometry(gmlGeometry: any): Geometry | null {
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
          .filter(coord => coord.length === 2 && coord.every(n => isFinite(n)));
        
        if (coords.length >= 3) {
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
}

function transformCoordinates(coordinates: number[][]): number[][] {
  return coordinates.map(([x, y]) => {
    const { lat, lng } = mercatorToWgs84(x, y);
    return [lng, lat];
  });
}

export {};