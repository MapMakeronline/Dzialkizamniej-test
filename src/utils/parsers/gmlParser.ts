import { xml2js } from 'xml-js';
import { Feature } from 'geojson';
import { mercatorToWgs84 } from '../coordinates/coordinateTransform';
import { useNotificationStore } from '../../store/notificationStore';

interface GMLParseResult {
  features: Feature[];
  metadata: {
    attributes: Record<string, any>[];
    orderedColumns: string[];
  };
}

function parseGMLGeometry(gmlGeometry: any): Feature['geometry'] | null {
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
            // Ensure polygon is closed
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

function extractProperties(member: any): Record<string, any> {
  const properties: Record<string, any> = {};
  
  Object.entries(member).forEach(([key, value]: [string, any]) => {
    if (key === '_attributes' || key === 'geometryProperty' || key === 'ogr:geometryProperty') return;
    
    if (typeof value === 'object' && value._text !== undefined) {
      properties[key.replace('ogr:', '')] = value._text;
    }
    else if (typeof value !== 'object') {
      properties[key.replace('ogr:', '')] = value;
    }
  });
  
  return properties;
}

export async function parseGML(file: File): Promise<GMLParseResult> {
  const { addNotification } = useNotificationStore.getState();

  try {
    const text = await file.text();
    const result = xml2js(text, { compact: true });
    
    const features: Feature[] = [];
    const attributes: Record<string, any>[] = [];
    const propertyKeys = new Set<string>();
    
    // Handle both WFS and OGR GML formats
    const featureMembers = result?.['wfs:FeatureCollection']?.['gml:featureMember'] || 
                          result?.['ogr:FeatureCollection']?.['gml:featureMember'] || [];
                          
    if (!featureMembers || (Array.isArray(featureMembers) && featureMembers.length === 0)) {
      throw new Error('No features found in GML file');
    }
    
    const members = Array.isArray(featureMembers) ? featureMembers : [featureMembers];
    
    members.forEach((member: any, index) => {
      const featureTypeKey = Object.keys(member).find(key => key !== '_attributes');
      if (!featureTypeKey) return;
      
      const featureData = member[featureTypeKey];
      const properties = extractProperties(featureData);
      
      Object.keys(properties).forEach(key => propertyKeys.add(key));
      
      const geometry = parseGMLGeometry(featureData['ogr:geometryProperty'] || featureData.geometryProperty);
      if (!geometry) {
        console.warn(`Could not parse geometry for feature ${index + 1}`);
        return;
      }
      
      const id = properties.id || properties.fid || `feature-${index + 1}`;
      
      const feature: Feature = {
        type: 'Feature',
        properties: { id, ...properties },
        geometry
      };
      
      features.push(feature);
      attributes.push({
        id,
        geometry,
        ...properties
      });
    });
    
    if (features.length === 0) {
      throw new Error('No valid features found in the GML file');
    }

    // Create ordered columns
    const orderedColumns = ['id', 'geometry', ...Array.from(propertyKeys)];

    return {
      features,
      metadata: {
        attributes,
        orderedColumns
      }
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to parse GML file';
    addNotification({
      type: 'error',
      message,
      timeout: 5000
    });
    throw error;
  }
}