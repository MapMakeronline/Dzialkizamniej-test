import { Feature } from 'geojson';
import { parseWKT } from '../../utils/geometry/wktParser';

export type ULDKResponse = [
  string, // id
  string, // voivodeship
  string, // county
  string, // commune
  string, // region
  string, // parcel
  string  // geom_wkt
];

interface ParcelProperties {
  id: string;
  name: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
}

export function transformULDKResponse(response: ULDKResponse): Feature {
  const [id, voivodeship, county, commune, region, parcel, geom_wkt] = response;
  
  try {
    const geometry = parseWKT(geom_wkt);

    const properties: ParcelProperties = {
      id,
      name: `Działka ${parcel}`,
      voivodeship,
      county,
      commune,
      region,
      parcel
    };

    return {
      type: 'Feature',
      properties,
      geometry
    };
  } catch (error) {
    console.error('Error transforming ULDK response:', error);
    throw new Error('Failed to transform ULDK response');
  }
}