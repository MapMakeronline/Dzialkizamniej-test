import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { isUserAdmin } from '../services/firebase/userService';

interface AuthState {
  user: FirebaseUser | null;
  isAdmin: boolean;
  loading: boolean;
  displayName: string;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAdmin: false,
    loading: true,
    displayName: 'Anonim'
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const admin = await isUserAdmin(user.uid);
        setAuthState({
          user,
          isAdmin: admin,
          loading: false,
          displayName: user.displayName || user.email || 'Anonim'
        });
      } else {
        setAuthState({
          user: null,
          isAdmin: false,
          loading: false,
          displayName: 'Anonim'
        });
      }
    });

    return () => unsubscribe();
  }, []);

  return authState;
}