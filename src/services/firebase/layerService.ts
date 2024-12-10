import { db } from '../../config/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs, query, where, updateDoc } from 'firebase/firestore';

export interface Layer {
  id?: string;
  name: string;
  type: 'layer' | 'table' | 'group';
  visible: boolean;
  data?: any;
  attributes?: Record<string, any>[];
  orderedColumns?: string[];
  style?: Record<string, any>;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export async function createLayer(layer: Omit<Layer, 'id'>): Promise<string> {
  try {
    if (!layer.userId) {
      throw new Error('User ID is required');
    }

    const layerRef = doc(collection(db, 'layers'));
    
    const layerData = {
      ...layer,
      id: layerRef.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      visible: layer.visible ?? true,
      type: layer.type || 'layer'
    };

    await setDoc(layerRef, layerData);
    return layerRef.id;
  } catch (error) {
    console.error('Error creating layer:', error);
    throw error;
  }
}

export async function deleteLayer(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'layers', id));
  } catch (error) {
    console.error('Error deleting layer:', error);
    throw error;
  }
}

export async function updateLayer(id: string, updates: Partial<Layer>): Promise<void> {
  try {
    const layerRef = doc(db, 'layers', id);
    await updateDoc(layerRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating layer:', error);
    throw error;
  }
}

export async function updateLayerStyle(id: string, style: Record<string, any>): Promise<void> {
  try {
    const layerRef = doc(db, 'layers', id);
    await updateDoc(layerRef, {
      style,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating layer style:', error);
    throw error;
  }
}

export async function updateLayerAttributes(id: string, attributes: Record<string, any>[]): Promise<void> {
  try {
    const layerRef = doc(db, 'layers', id);
    await updateDoc(layerRef, {
      attributes,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating layer attributes:', error);
    throw error;
  }
}

export async function getLayers(userId?: string): Promise<Layer[]> {
  try {
    let layersQuery = collection(db, 'layers');
    
    if (userId) {
      layersQuery = query(layersQuery, where('userId', '==', userId));
    }
    
    const snapshot = await getDocs(layersQuery);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Layer));
  } catch (error) {
    console.error('Error fetching layers:', error);
    throw error;
  }
}