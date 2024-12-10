import { useState } from 'react';
import { LatLngTuple } from 'leaflet';

export interface Layer {
  id: string;
  name: string;
  type: 'feature' | 'group';
  visible: boolean;
  expanded?: boolean;
  children?: Layer[];
  data?: {
    coordinates: LatLngTuple;
    attributes: Record<string, any>[];
  };
}

export const useLayerData = () => {
  const [layers, setLayers] = useState<Layer[]>([
    {
      id: 'cities',
      name: 'Cities',
      type: 'group',
      visible: true,
      expanded: true,
      children: [
        {
          id: 'warsaw',
          name: 'Warsaw',
          type: 'feature',
          visible: true,
          data: {
            coordinates: [52.237049, 21.017532],
            attributes: [
              { id: 1, name: 'Warsaw City Center', population: '1.7M', area: '517 km²' }
            ]
          }
        }
      ]
    },
    {
      id: 'landmarks',
      name: 'Landmarks',
      type: 'group',
      visible: true,
      expanded: true,
      children: [
        {
          id: 'palace',
          name: 'Palaces',
          type: 'feature',
          visible: true,
          data: {
            coordinates: [52.229676, 21.012229],
            attributes: [
              { id: 1, name: 'Palace of Culture', height: '237m', built: '1955' }
            ]
          }
        },
        {
          id: 'parks',
          name: 'Parks',
          type: 'feature',
          visible: true,
          data: {
            coordinates: [52.215117, 21.035725],
            attributes: [
              { id: 1, name: 'Łazienki Park', area: '76 ha', established: '1764' }
            ]
          }
        }
      ]
    }
  ]);

  const toggleLayerVisibility = (layerId: string) => {
    setLayers(prevLayers => {
      const updateLayer = (layer: Layer): Layer => {
        if (layer.id === layerId) {
          return { ...layer, visible: !layer.visible };
        }
        if (layer.children) {
          return {
            ...layer,
            children: layer.children.map(updateLayer)
          };
        }
        return layer;
      };
      return prevLayers.map(updateLayer);
    });
  };

  const toggleLayerExpanded = (layerId: string) => {
    setLayers(prevLayers => {
      const updateLayer = (layer: Layer): Layer => {
        if (layer.id === layerId) {
          return { ...layer, expanded: !layer.expanded };
        }
        if (layer.children) {
          return {
            ...layer,
            children: layer.children.map(updateLayer)
          };
        }
        return layer;
      };
      return prevLayers.map(updateLayer);
    });
  };

  return {
    layers,
    toggleLayerVisibility,
    toggleLayerExpanded
  };
};