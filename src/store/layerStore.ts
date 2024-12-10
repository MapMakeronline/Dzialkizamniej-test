import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Layer } from '../services/firebase/layerService';
import { useNotificationStore } from './notificationStore';

interface LayerState {
  layers: Layer[];
  selectedLayer: string | null;
  selectedFeatureId: { layerId: string; featureId: string } | null;
  setSelectedLayer: (id: string | null) => void;
  setSelectedFeatureId: (selection: { layerId: string; featureId: string } | null) => void;
  addLayer: (layer: Omit<Layer, 'id'>) => Promise<void>;
  removeLayer: (id: string) => Promise<void>;
  toggleLayer: (id: string) => Promise<void>;
  updateLayer: (id: string, updates: Partial<Layer>) => Promise<void>;
  findLayer: (id: string) => Layer | undefined;
}

export const useLayerStore = create<LayerState>()(
  persist(
    (set, get) => ({
      layers: [],
      selectedLayer: null,
      selectedFeatureId: null,

      setSelectedLayer: (id) => set({ selectedLayer: id }),
      
      setSelectedFeatureId: (selection) => set({ selectedFeatureId: selection }),

      addLayer: async (layer) => {
        const { addNotification } = useNotificationStore.getState();

        try {
          const layerData: Layer = {
            ...layer,
            id: `layer-${Date.now()}`,
            userId: 'anonymous',
            visible: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          set(state => ({
            layers: [...state.layers, layerData]
          }));

          addNotification({
            type: 'success',
            message: 'Layer added successfully',
            timeout: 3000
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to add layer';
          addNotification({
            type: 'error',
            message,
            timeout: 5000
          });
          throw error;
        }
      },

      removeLayer: async (id) => {
        const { addNotification } = useNotificationStore.getState();
        
        try {
          set(state => ({
            layers: state.layers.filter(l => l.id !== id),
            selectedLayer: state.selectedLayer === id ? null : state.selectedLayer
          }));

          addNotification({
            type: 'success',
            message: 'Layer removed successfully',
            timeout: 3000
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Failed to remove layer';
          addNotification({
            type: 'error',
            message,
            timeout: 5000
          });
          throw error;
        }
      },

      toggleLayer: async (id) => {
        const layer = get().findLayer(id);
        if (!layer) return;

        set(state => ({
          layers: state.layers.map(l => 
            l.id === id ? { ...l, visible: !l.visible } : l
          )
        }));
      },

      updateLayer: async (id, updates) => {
        set(state => ({
          layers: state.layers.map(l =>
            l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l
          )
        }));
      },

      findLayer: (id) => {
        return get().layers.find(l => l.id === id);
      }
    }),
    {
      name: 'layer-store',
      version: 1
    }
  )
);