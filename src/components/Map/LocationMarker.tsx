import { useState, useEffect } from 'react';
import { useMap, useMapEvents, Circle } from 'react-leaflet';
import { searchParcelByCoordinates } from '../../services/uldkService';
import { useLayerStore } from '../../store/layerStore';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';

export const LocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const map = useMap();
  const { updateFirstLayer } = useLayerStore();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  useMapEvents({
    locationfound: async (e) => {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      setError(null);
      map.flyTo(e.latlng, 16);

      setIsLoading(true);
      try {
        const feature = await searchParcelByCoordinates(lat, lng);
        if (feature) {
          updateFirstLayer(feature);
          map.flyToBounds([
            [feature.geometry.coordinates[0][0][1], feature.geometry.coordinates[0][0][0]],
            [feature.geometry.coordinates[0][2][1], feature.geometry.coordinates[0][2][0]]
          ]);
        } else {
          setError('No parcel found at this location');
        }
      } catch (error) {
        console.error('Error fetching parcel info:', error);
        setError('Error fetching parcel information');
      } finally {
        setIsLoading(false);
      }
    },
    locationerror() {
      setError('Location access denied');
      console.log('Location access denied');
    },
  });

  return (
    <>
      {(isLoading || error) && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] bg-white p-3 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            {isLoading && <LoadingSpinner size="sm" />}
            <span className="text-sm text-gray-600">
              {isLoading ? 'Searching for parcel...' : error}
            </span>
          </div>
        </div>
      )}
      {position && !isLoading && !error && (
        <Circle
          center={position}
          radius={5}
          pathOptions={{ 
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 1,
            weight: 2
          }}
        />
      )}
    </>
  );
};