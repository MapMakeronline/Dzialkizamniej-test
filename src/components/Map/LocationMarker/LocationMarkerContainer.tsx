import { useState, useEffect } from 'react';
import { useMap, useMapEvents } from 'react-leaflet';
import { searchParcelByCoordinates } from '../../../services/uldk/uldkService';
import { useLayerStore } from '../../../store/layerStore';
import { LocationMarkerView } from './LocationMarkerView';
import { useNotificationStore } from '../../../store/notificationStore';

export const LocationMarkerContainer = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const map = useMap();
  const { addFeatureLayer } = useLayerStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
  }, [map]);

  const handleParcelSearch = async (lat: number, lng: number) => {
    if (!map.getBounds().contains([lat, lng])) return;
    
    setPosition([lat, lng]);
    setIsLoading(true);

    try {
      const feature = await searchParcelByCoordinates(lat, lng);
      if (feature) {
        addFeatureLayer(feature);
        const bounds = feature.geometry.coordinates[0].map(([lng, lat]) => [lat, lng]);
        map.fitBounds(bounds);
      }
    } catch (error) {
      console.error('Error fetching parcel info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useMapEvents({
    locationfound: (e) => {
      const { lat, lng } = e.latlng;
      map.flyTo(e.latlng, map.getZoom());
      handleParcelSearch(lat, lng);
    },
    locationerror() {
      addNotification({
        type: 'error',
        message: 'Location access denied. You can click on the map to search for parcels.',
        timeout: 5000
      });
    },
    click(e) {
      const { lat, lng } = e.latlng;
      handleParcelSearch(lat, lng);
    }
  });

  return (
    <LocationMarkerView 
      position={position} 
      isLoading={isLoading}
    />
  );
};