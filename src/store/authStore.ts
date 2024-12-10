import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User as FirebaseUser } from 'firebase/auth';
import { auth } from '../config/firebase';
import { isUserAdmin } from '../services/firebase/userService';

interface AuthState {
  user: FirebaseUser | null;
  isAdmin: boolean;
  displayName: string;
  setUser: (user: FirebaseUser | null) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAdmin: false,
      displayName: 'Anonim',

      setUser: async (user) => {
        if (user) {
          const admin = await isUserAdmin(user.uid);
          set({ 
            user, 
            isAdmin: admin,
            displayName: user.displayName || user.email || 'Anonim'
          });
        } else {
          set({ 
            user: null, 
            isAdmin: false,
            displayName: 'Anonim'
          });
        }
      },

      logout: async () => {
        await auth.signOut();
        set({ 
          user: null, 
          isAdmin: false,
          displayName: 'Anonim'
        });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);