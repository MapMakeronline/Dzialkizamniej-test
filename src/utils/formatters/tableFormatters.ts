import { Geometry } from 'geojson';

export const formatColumnValue = (value: any, columnName: string): string => {
  if (value === null || value === undefined) return '';

  // Handle geometry objects
  if (columnName.toLowerCase() === 'geometry' || columnName.toLowerCase() === 'geom') {
    if (typeof value === 'object' && value.type && value.coordinates) {
      switch (value.type) {
        case 'Point':
          return `Point(${value.coordinates.join(', ')})`;
        case 'Polygon':
          return `Polygon(${value.coordinates[0].length} points)`;
        case 'MultiPolygon':
          return `MultiPolygon(${value.coordinates.length} polygons)`;
        default:
          return value.type;
      }
    }
    return value.toString();
  }

  // Handle dates
  if (columnName.toLowerCase().includes('data') || 
      columnName.toLowerCase().includes('date')) {
    try {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('pl-PL');
      }
    } catch (e) {
      return value.toString();
    }
  }

  // Handle numeric values
  if (typeof value === 'number' || !isNaN(Number(value))) {
    const num = Number(value);
    return num.toLocaleString('pl-PL');
  }

  // Handle all other values
  return value.toString();
};

export const formatColumnHeader = (header: string): string => {
  // Remove common prefixes
  const withoutPrefix = header.replace(/^[A-Z]_/, '');
  
  // Split by underscores and capitalize
  return withoutPrefix
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

export const formatGeometry = (geometry: Geometry): string => {
  if (!geometry) return '';
  
  switch (geometry.type) {
    case 'Point':
      return `Point(${geometry.coordinates.join(', ')})`;
    case 'Polygon':
      return `Polygon(${geometry.coordinates[0]?.length || 0} points)`;
    case 'MultiPolygon':
      return `MultiPolygon(${geometry.coordinates.length} polygons)`;
    default:
      return geometry.type;
  }
};