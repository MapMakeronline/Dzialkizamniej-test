import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { getFavorites, addFavorite, removeFavorite, FavoriteData } from '../services/api/favoriteService';

interface FavoriteState {
  favorites: FavoriteData[];
  loading: boolean;
  error: string | null;
  fetchFavorites: () => Promise<void>;
  addToFavorites: (parcelId: string) => Promise<void>;
  removeFromFavorites: (id: string) => Promise<void>;
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set, get) => ({
      favorites: [],
      loading: false,
      error: null,

      fetchFavorites: async () => {
        try {
          set({ loading: true, error: null });
          const favorites = await getFavorites();
          set({ favorites, loading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error fetching favorites',
            loading: false 
          });
        }
      },

      addToFavorites: async (parcelId: string) => {
        try {
          set({ loading: true, error: null });
          const favorite = await addFavorite(parcelId);
          set(state => ({ 
            favorites: [...state.favorites, favorite],
            loading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error adding to favorites',
            loading: false 
          });
        }
      },

      removeFromFavorites: async (id: string) => {
        try {
          set({ loading: true, error: null });
          await removeFavorite(id);
          set(state => ({ 
            favorites: state.favorites.filter(f => f.id !== id),
            loading: false 
          }));
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Error removing from favorites',
            loading: false 
          });
        }
      }
    }),
    {
      name: 'favorite-store'
    }
  )
);