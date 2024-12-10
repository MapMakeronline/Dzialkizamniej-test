import { useState } from 'react';
import { LatLngTuple } from 'leaflet';

interface AttributeItem {
  id: number;
  name: string;
  type: string;
  coordinates: LatLngTuple;
  description: string;
}

export const useAttributesData = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [tableHeight, setTableHeight] = useState(250); // Default height in pixels
  const [attributes] = useState<AttributeItem[]>([
    {
      id: 1,
      name: 'Warsaw City Center',
      type: 'City',
      coordinates: [52.237049, 21.017532],
      description: 'Capital city of Poland'
    },
    {
      id: 2,
      name: 'Palace of Culture and Science',
      type: 'Landmark',
      coordinates: [52.229676, 21.012229],
      description: 'Iconic building in Warsaw\'s center'
    },
    {
      id: 3,
      name: 'Old Town Market Place',
      type: 'Historical',
      coordinates: [52.249279, 21.012228],
      description: 'Historic center of Warsaw'
    },
    {
      id: 4,
      name: 'Łazienki Park',
      type: 'Park',
      coordinates: [52.215117, 21.035725],
      description: 'Largest park in Warsaw'
    }
  ]);

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return {
    isExpanded,
    toggleExpanded,
    attributes,
    tableHeight,
    setTableHeight
  };
};