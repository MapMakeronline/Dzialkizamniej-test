import { useMap } from 'react-leaflet';
import { AttributesTable } from './AttributesTable';
import { memo } from 'react';

export const AttributesTableContainer = memo(() => {
  const map = useMap();
  return <AttributesTable map={map} />;
});

AttributesTableContainer.displayName = 'AttributesTableContainer';