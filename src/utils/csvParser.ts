import { Feature, FeatureCollection } from 'geojson';
import { parseWKB } from './wkbParser';
import { useLayerStore } from '../store/layerStore';

export const parseCSV = (content: string): FeatureCollection => {
  const lines = content.trim().split('\n');
  if (lines.length < 2) throw new Error('CSV file must have header and data rows');

  // Parse header (skip first column as it's WKB)
  const headers = lines[0].split('\t').map(h => h.trim());
  const geometryColumnIndex = headers.findIndex(h => h.toLowerCase() === 'geom');
  
  if (geometryColumnIndex === -1) {
    throw new Error('No geometry column (geom) found in CSV');
  }

  const features: Feature[] = [];

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split('\t').map(v => v.trim());
    const wkb = values[geometryColumnIndex];
    
    // Create properties object from all columns except geometry
    const properties: { [key: string]: string } = {};
    headers.forEach((header, index) => {
      if (index !== geometryColumnIndex) {
        properties[header] = values[index] || '';
      }
    });

    try {
      const feature = parseWKB(wkb);
      feature.properties = {
        ...feature.properties,
        ...properties,
        id: properties.identyfikator || `${i}`,
      };
      features.push(feature);
    } catch (error) {
      console.error(`Error parsing WKB at row ${i + 1}:`, error);
    }
  }

  return {
    type: 'FeatureCollection',
    features
  };
};