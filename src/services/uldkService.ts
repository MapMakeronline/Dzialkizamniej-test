import { wgs84ToPUWG1992 } from '../utils/coordinates';
import { Feature } from 'geojson';
import { parseWKT } from '../utils/wktParser';

export interface ParcelInfo {
  id: string;
  voivodeship: string;
  county: string;
  commune: string;
  region: string;
  parcel: string;
  geom_wkt: string;
}

export async function searchParcelByCoordinates(lat: number, lng: number): Promise<Feature | null> {
  const converted = wgs84ToPUWG1992(lat, lng);
  
  // Log coordinates for debugging
  console.log('Original coordinates:', { lat, lng });
  console.log('Converted coordinates:', converted);
  
  // Try both coordinate orders to determine which one works
  const urls = [
    `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${converted.x},${converted.y}&result=id,voivodeship,county,commune,region,parcel,geom_wkt&srid=2180`,
    `https://uldk.gugik.gov.pl/?request=GetParcelByXY&xy=${converted.y},${converted.x}&result=id,voivodeship,county,commune,region,parcel,geom_wkt&srid=2180`
  ];

  for (const url of urls) {
    try {
      console.log('Trying URL:', url);
      const response = await fetch(url);
      const data = await response.text();
      
      console.log('ULDK Response:', data);

      if (data.includes("ERROR")) {
        console.log("No parcel found at location, trying next coordinate order");
        continue;
      }

      const parts = data.split('|');
      if (parts.length < 7) {
        console.log("Invalid data format, trying next coordinate order");
        continue;
      }

      const [id, voivodeship, county, commune, region, parcel, geom_wkt] = parts;
      console.log('Parsed parcel data:', { id, voivodeship, county, commune, region, parcel });
      
      const geometry = parseWKT(geom_wkt);

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
      console.error('Error with URL:', url, error);
    }
  }

  console.log('No valid response from either coordinate order');
  return null;
}