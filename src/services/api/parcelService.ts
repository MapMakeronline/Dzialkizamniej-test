import { api } from './config';
import { ApiResponse, ParcelData, ImportParcelData } from './types';
import { Feature } from 'geojson';

export async function saveParcel(feature: Feature, attributes: Record<string, any>): Promise<ParcelData> {
  try {
    const response = await api.post<ApiResponse<ParcelData>>('/parcels', {
      feature,
      attributes
    });
    return response.data.data;
  } catch (error) {
    console.error('Error saving parcel:', error);
    throw error;
  }
}

export async function getParcels(): Promise<ParcelData[]> {
  try {
    const response = await api.get<ApiResponse<ParcelData[]>>('/parcels');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching parcels:', error);
    throw error;
  }
}

export async function getParcelById(id: string): Promise<ParcelData> {
  try {
    const response = await api.get<ApiResponse<ParcelData>>(`/parcels/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Error fetching parcel:', error);
    throw error;
  }
}

export async function updateParcel(id: string, data: Partial<ParcelData>): Promise<ParcelData> {
  try {
    const response = await api.patch<ApiResponse<ParcelData>>(`/parcels/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating parcel:', error);
    throw error;
  }
}

export async function deleteParcel(id: string): Promise<void> {
  try {
    await api.delete(`/parcels/${id}`);
  } catch (error) {
    console.error('Error deleting parcel:', error);
    throw error;
  }
}

export async function importParcelFromCSV(data: ImportParcelData): Promise<ParcelData> {
  try {
    const response = await api.post<ApiResponse<ParcelData>>('/parcels/import', data);
    return response.data.data;
  } catch (error) {
    console.error('Error importing parcel from CSV:', error);
    throw error;
  }
}