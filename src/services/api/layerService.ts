import { api } from './config';
import { LayerItem } from '../../store/layerStore';
import { useNotificationStore } from '../../store/notificationStore';

export interface LayerResponse {
  id: string;
  name: string;
  type: string;
  visible: boolean;
  data?: any;
  attributes?: Record<string, any>[];
  orderedColumns?: string[];
  style?: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function saveLayer(layer: LayerItem): Promise<LayerResponse> {
  const { addNotification } = useNotificationStore.getState();
  
  try {
    const response = await api.post<LayerResponse>('/api/layers', layer);
    
    addNotification({
      type: 'success',
      message: 'Layer saved successfully',
      timeout: 3000
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error saving layer';
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });
    throw error;
  }
}

export async function getUserLayers(): Promise<LayerResponse[]> {
  const { addNotification } = useNotificationStore.getState();
  
  try {
    const response = await api.get<LayerResponse[]>('/api/layers');
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error fetching layers';
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });
    throw error;
  }
}

export async function updateLayer(id: string, data: Partial<LayerItem>): Promise<LayerResponse> {
  const { addNotification } = useNotificationStore.getState();
  
  try {
    const response = await api.patch<LayerResponse>(`/api/layers/${id}`, data);
    
    addNotification({
      type: 'success',
      message: 'Layer updated successfully',
      timeout: 3000
    });
    
    return response.data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error updating layer';
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });
    throw error;
  }
}

export async function deleteLayer(id: string): Promise<void> {
  const { addNotification } = useNotificationStore.getState();
  
  try {
    await api.delete(`/api/layers/${id}`);
    
    addNotification({
      type: 'success',
      message: 'Layer deleted successfully',
      timeout: 3000
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Error deleting layer';
    addNotification({
      type: 'error',
      message: errorMessage,
      timeout: 5000
    });
    throw error;
  }
}