import { ULDKResponse, ULDKError, ULDKRequestType } from './types';
import { Feature, Geometry } from 'geojson';
import { parseWKB } from '../../utils/geometry/wkbParser';

export function parseULDKResponse(data: string): ULDKResponse {
  try {
    if (!data || data === '0') {
      throw new Error('No parcel found at this location');
    }

    const parts = data.split('|');
    if (parts.length < 3) {
      throw new Error('Invalid ULDK response format');
    }

    return parts as ULDKResponse;
  } catch (error) {
    console.error('Error parsing ULDK response:', error);
    const parseError = new Error(error instanceof Error ? error.message : 'Parse error') as ULDKError;
    parseError.code = 'PARSE_ERROR';
    parseError.details = { data };
    throw parseError;
  }
}

export function transformToFeature(response: ULDKResponse, requestType: ULDKRequestType): Feature {
  try {
    const [id, voivodeship, county, commune, region, parcel, geom_wkt] = response;

    // Parse WKB geometry
    let geometry: Geometry;
    try {
      geometry = parseWKB(geom_wkt).geometry;
    } catch (error) {
      console.error('Error parsing WKB geometry:', error);
      throw new Error('Invalid geometry data');
    }

    return {
      type: 'Feature',
      properties: {
        id,
        name: `Działka ${parcel}`,
        voivodeship,
        county,
        commune,
        region,
        parcel
      },
      geometry
    };
  } catch (error) {
    console.error('Error transforming ULDK response:', error);
    const transformError = new Error('Failed to transform ULDK response') as ULDKError;
    transformError.code = 'PARSE_ERROR';
    transformError.details = error;
    throw transformError;
  }
}