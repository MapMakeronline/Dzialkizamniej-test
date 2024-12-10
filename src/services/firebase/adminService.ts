import { db } from '../../config/firebase';
import { collection, query, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Plot, Map, User } from './userService';

export async function getAllUsers(): Promise<User[]> {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  return usersSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as User));
}

export async function updateUserPlot(
  userId: string,
  plotId: string,
  updates: Partial<Plot>
): Promise<void> {
  const plotRef = doc(db, `users/${userId}/plots/${plotId}`);
  await updateDoc(plotRef, {
    ...updates,
    updatedAt: new Date().toISOString()
  });
}

export async function deleteUserPlot(userId: string, plotId: string): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/plots/${plotId}`));
}

export async function deleteUserMap(
  userId: string,
  plotId: string,
  mapId: string
): Promise<void> {
  await deleteDoc(doc(db, `users/${userId}/plots/${plotId}/maps/${mapId}`));
}

export async function getAdminDashboardData(): Promise<{
  users: User[];
  totalPlots: number;
  totalMaps: number;
}> {
  const users = await getAllUsers();
  let totalPlots = 0;
  let totalMaps = 0;

  for (const user of users) {
    const plots = await getDocs(collection(db, `users/${user.id}/plots`));
    totalPlots += plots.size;

    for (const plot of plots.docs) {
      const maps = await getDocs(collection(db, `users/${user.id}/plots/${plot.id}/maps`));
      totalMaps += maps.size;
    }
  }

  return {
    users,
    totalPlots,
    totalMaps
  };
}