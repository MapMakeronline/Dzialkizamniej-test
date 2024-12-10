export interface FirebaseUser {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface FirebasePlot {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  size: number;
  metadata: Record<string, any>;
  createdAt: string;
  updatedAt?: string;
}

export interface FirebaseMap {
  id: string;
  generatedMapUrl: string;
  createdAt: string;
  updatedAt?: string;
}

export interface FirebaseCollection<T> {
  [id: string]: T;
}