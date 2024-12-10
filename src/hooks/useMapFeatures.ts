import { useCallback } from 'react';
import { Feature, Position } from 'geojson';
import { Layer, LatLng } from 'leaflet';
import { useLayerStore } from '../store/layerStore';

function getFeatureCenter(feature: Feature): LatLng | null {
  try {
    if (!feature.geometry) return null;

    switch (feature.geometry.type) {
      case 'Point':
        return new LatLng(feature.geometry.coordinates[1], feature.geometry.coordinates[0]);
      
      case 'Polygon':
        // Get center of first ring
        const coords = feature.geometry.coordinates[0];
        if (!coords?.length) return null;
        
        // Calculate centroid
        const center = coords.reduce(
          (acc: Position, curr: Position) => [acc[0] + curr[0], acc[1] + curr[1]],
          [0, 0]
        );
        return new LatLng(
          center[1] / coords.length,
          center[0] / coords.length
        );
      
      case 'MultiPolygon':
        // Get center of first polygon
        const firstPoly = feature.geometry.coordinates[0];
        if (!firstPoly?.[0]?.length) return null;
        
        const polyCenter = firstPoly[0].reduce(
          (acc: Position, curr: Position) => [acc[0] + curr[0], acc[1] + curr[1]],
          [0, 0]
        );
        return new LatLng(
          polyCenter[1] / firstPoly[0].length,
          polyCenter[0] / firstPoly[0].length
        );
      
      default:
        return null;
    }
  } catch (error) {
    console.warn('Error calculating feature center:', error);
    return null;
  }
}

export const useMapFeatures = () => {
  const { selectedFeatureId } = useLayerStore();

  const onEachFeature = useCallback((feature: Feature, layer: Layer) => {
    if (feature.properties) {
      const center = getFeatureCenter(feature);
      if (center) {
        layer.bindTooltip(feature.properties.name || feature.properties.id, {
          permanent: false,
          direction: 'top',
          offset: [0, -5]
        });
      }
    }
  }, []);

  const layerStyle = useCallback((feature: any, selected: { layerId: string; featureId: string } | null) => {
    const isSelected = selected && 
                      feature.properties?.layerId === selected.layerId && 
                      feature.properties?.id === selected.featureId;

    return {
      color: isSelected ? '#2563eb' : '#3b82f6',
      weight: isSelected ? 3 : 2,
      opacity: 0.8,
      fillOpacity: isSelected ? 0.4 : 0.2,
      fillColor: isSelected ? '#60a5fa' : '#93c5fd',
      cursor: 'pointer'
    };
  }, []);

  return {
    onEachFeature,
    layerStyle
  };
};