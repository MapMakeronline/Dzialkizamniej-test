import { api } from './config';
import { ApiResponse } from './types';

export interface UserData {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  googleId?: string;
}

export async function getCurrentUser(): Promise<UserData> {
  try {
    const response = await api.get<ApiResponse<UserData>>('/users/me');
    return response.data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
}

export async function updateUser(data: Partial<UserData>): Promise<UserData> {
  try {
    const response = await api.patch<ApiResponse<UserData>>('/users/me', data);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
}