import { useEffect, useState } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';

export const CoordinateDisplay = () => {
  const [position, setPosition] = useState<LatLng | null>(null);
  const map = useMap();

  useMapEvents({
    mousemove(e) {
      setPosition(e.latlng);
    },
    mouseout() {
      setPosition(null);
    }
  });

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
      <div className="text-sm font-mono">
        {position ? (
          <>
            <span className="text-gray-600">Lat: </span>
            <span className="font-medium">{position.lat.toFixed(6)}°</span>
            <span className="mx-2 text-gray-400">|</span>
            <span className="text-gray-600">Lng: </span>
            <span className="font-medium">{position.lng.toFixed(6)}°</span>
          </>
        ) : (
          <span className="text-gray-500">Move mouse over map</span>
        )}
      </div>
    </div>
  );
};