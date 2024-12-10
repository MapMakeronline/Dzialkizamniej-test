import { xml2js } from 'xml-js';
import { Feature, FeatureCollection } from 'geojson';

export const parseGML = async (file: File): Promise<FeatureCollection> => {
  const text = await file.text();
  const result = xml2js(text, { compact: true });
  
  const features: Feature[] = [];
  const featureMembers = result?.['wfs:FeatureCollection']?.['gml:featureMember'] || [];
  
  (Array.isArray(featureMembers) ? featureMembers : [featureMembers]).forEach((member: any) => {
    const properties: { [key: string]: any } = {};
    let geometry: any = null;
    
    // Extract properties and geometry from GML
    Object.entries(member).forEach(([key, value]: [string, any]) => {
      if (key === '_attributes') return;
      
      // Handle geometry
      if (value?.['gml:Point']) {
        const coords = value['gml:Point']['gml:coordinates']?._text?.split(',');
        if (coords) {
          geometry = {
            type: 'Point',
            coordinates: [parseFloat(coords[0]), parseFloat(coords[1])]
          };
        }
      } else if (value?.['gml:Polygon']) {
        const coords = value['gml:Polygon']['gml:outerBoundaryIs']?.['gml:LinearRing']?.['gml:coordinates']?._text;
        if (coords) {
          geometry = {
            type: 'Polygon',
            coordinates: [coords.split(' ').map((pair: string) => 
              pair.split(',').map((num: string) => parseFloat(num))
            )]
          };
        }
      }
      
      // Handle properties
      if (!geometry) {
        const propValue = value?._text || value;
        if (propValue !== undefined) {
          properties[key] = propValue;
        }
      }
    });
    
    if (!geometry) {
      geometry = { type: 'Point', coordinates: [0, 0] };
    }
    
    features.push({
      type: 'Feature',
      properties,
      geometry
    });
  });
  
  return {
    type: 'FeatureCollection',
    features
  };
};