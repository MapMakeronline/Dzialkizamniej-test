```typescript
import { Feature } from 'geojson';
import { parseWKB } from './wkbParser';
import { parseWKT } from './wktParser';

export function convertToGeometry(value: string, format: 'wkb' | 'wkt' = 'wkb'): Feature | null {
  try {
    if (!value?.trim()) return null;

    // Clean the input string
    const cleanValue = value.trim().toUpperCase();
    
    if (format === 'wkb') {
      if (/^[0-9A-F]+$/i.test(cleanValue)) {
        return parseWKB(cleanValue);
      }
    } else if (format === 'wkt') {
      if (cleanValue.startsWith('POLYGON') || cleanValue.startsWith('MULTIPOLYGON')) {
        const geometry = parseWKT(cleanValue);
        return {
          type: 'Feature',
          properties: {},
          geometry
        };
      }
    }

    return null;
  } catch (error) {
    console.error('Error converting to geometry:', error);
    return null;
  }
}
```