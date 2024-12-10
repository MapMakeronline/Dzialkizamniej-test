import { useCallback } from 'react';
import { useLayerStore } from '../store/layerStore';
import { useNotificationStore } from '../store/notificationStore';
import { searchParcelByCoordinates } from '../services/uldk/uldkService';
import { Feature } from 'geojson';

export const useMapEvents = () => {
  const { addFeatureLayer } = useLayerStore();
  const { addNotification } = useNotificationStore();

  const handleMapClick = useCallback(async (lat: number, lng: number) => {
    try {
      const feature = await searchParcelByCoordinates(lat, lng);
      if (feature) {
        addFeatureLayer(feature);
        return feature;
      }
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error fetching parcel information';
      addNotification({
        type: 'error',
        message: errorMessage,
        timeout: 5000
      });
      return null;
    }
  }, [addFeatureLayer, addNotification]);

  const handleFeatureClick = useCallback((feature: Feature) => {
    if (!feature.properties?.id) return;
    
    const { id, layerId } = feature.properties;
    return { featureId: id, layerId };
  }, []);

  return {
    handleMapClick,
    handleFeatureClick
  };
};