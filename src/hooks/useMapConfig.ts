import { useState } from 'react';
import { LatLngTuple } from 'leaflet';

interface Marker {
  position: LatLngTuple;
  title: string;
  description: string;
}

export const useMapConfig = () => {
  const [center] = useState<LatLngTuple>([52.237049, 21.017532]); // Warsaw coordinates
  const [zoom] = useState(13);
  const [markers] = useState<Marker[]>([
    {
      position: [52.237049, 21.017532],
      title: "Warsaw",
      description: "Capital city of Poland"
    },
    {
      position: [52.229676, 21.012229],
      title: "Palace of Culture and Science",
      description: "Iconic building in Warsaw's center"
    }
  ]);

  return {
    center,
    zoom,
    markers
  };
};