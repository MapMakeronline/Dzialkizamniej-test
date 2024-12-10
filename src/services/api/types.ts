import { Feature, FeatureCollection } from 'geojson';

export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

export interface LayerData {
  id: string;
  name: string;
  type: 'layer' | 'table' | 'group';
  visible: boolean;
  data?: FeatureCollection;
  attributes?: Record<string, any>[];
  orderedColumns?: string[];
  style?: Record<string, any>;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ParcelData {
  id: string;
  identifier: string;
  voivodeship?: string;
  county?: string;
  commune?: string;
  region?: string;
  parcelNumber?: string;
  area?: number;
  purpose?: string;
  price?: number;
  description?: string;
  photoUrl?: string;
  offerUrl?: string;
  geometry: string;
  properties?: Record<string, any>;
}

export interface ImportParcelData {
  feature: Feature;
  attributes: Record<string, any>;
}