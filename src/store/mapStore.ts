import { create } from 'zustand';
import { LatLngTuple } from 'leaflet';

interface MapState {
  center: LatLngTuple;
  zoom: number;
  setView: (center: LatLngTuple, zoom: number) => void;
}

export const useMapStore = create<MapState>((set) => ({
  center: [52.237049, 21.017532],
  zoom: 13,
  setView: (center, zoom) => set({ center, zoom }),
}));