import { api } from './config';
import { ApiResponse } from './types';

export interface FavoriteData {
  id: string;
  userId: string;
  parcelId: string;
  createdAt: string;
}

export async function getFavorites(): Promise<FavoriteData[]> {
  try {
    const response = await api.get<ApiResponse<FavoriteData[]>>('/favorites');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }
}

export async function addFavorite(parcelId: string): Promise<FavoriteData> {
  try {
    const response = await api.post<ApiResponse<FavoriteData>>('/favorites', { parcelId });
    return response.data.data;
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
}

export async function removeFavorite(id: string): Promise<void> {
  try {
    await api.delete(`/favorites/${id}`);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
}