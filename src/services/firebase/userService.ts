import { db } from '../../config/firebase';
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { ADMIN_EMAIL } from '../../config/firebase';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isAdmin?: boolean;
}

export interface Plot {
  id: string;
  location: {
    lat: number;
    lng: number;
  };
  size: number;
  metadata: Record<string, any>;
}

export interface Map {
  id: string;
  generatedMapUrl: string;
  createdAt: string;
}

export async function createUser(userData: Omit<User, 'id' | 'isAdmin'>): Promise<string> {
  const userRef = doc(collection(db, 'users'));
  const isAdmin = userData.email === ADMIN_EMAIL;

  await setDoc(userRef, {
    ...userData,
    isAdmin,
    createdAt: new Date().toISOString()
  });

  return userRef.id;
}

export async function getUser(userId: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...userDoc.data() } as User;
}

export async function isUserAdmin(userId: string): Promise<boolean> {
  const user = await getUser(userId);
  return user?.isAdmin || false;
}

export async function createPlot(userId: string, plotData: Omit<Plot, 'id'>): Promise<string> {
  const plotRef = doc(collection(db, `users/${userId}/plots`));
  await setDoc(plotRef, {
    ...plotData,
    createdAt: new Date().toISOString()
  });
  return plotRef.id;
}

export async function createMap(userId: string, plotId: string, mapData: Omit<Map, 'id'>): Promise<string> {
  const mapRef = doc(collection(db, `users/${userId}/plots/${plotId}/maps`));
  await setDoc(mapRef, {
    ...mapData,
    createdAt: new Date().toISOString()
  });
  return mapRef.id;
}

export async function getUserPlots(userId: string): Promise<Plot[]> {
  const plotsSnapshot = await getDocs(collection(db, `users/${userId}/plots`));
  return plotsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Plot));
}

export async function getPlotMaps(userId: string, plotId: string): Promise<Map[]> {
  const mapsSnapshot = await getDocs(collection(db, `users/${userId}/plots/${plotId}/maps`));
  return mapsSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Map));
}

export async function getAllPlotsForAdmin(): Promise<Record<string, Plot[]>> {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const allPlots: Record<string, Plot[]> = {};

  for (const userDoc of usersSnapshot.docs) {
    const plots = await getUserPlots(userDoc.id);
    allPlots[userDoc.id] = plots;
  }

  return allPlots;
}