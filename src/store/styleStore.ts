import { create } from 'zustand';
import { LayerStyle, AttributeStyle } from '../types/layer';

interface StyleState {
  styles: Record<string, LayerStyle | AttributeStyle>;
  setStyle: (layerId: string, style: LayerStyle | AttributeStyle) => void;
  getStyle: (layerId: string, feature?: any) => LayerStyle;
  removeStyle: (layerId: string) => void;
}

const defaultStyle: LayerStyle = {
  color: '#3b82f6',
  fillColor: '#93c5fd',
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0.2
};

export const useStyleStore = create<StyleState>((set, get) => ({
  styles: {},

  setStyle: (layerId, style) => 
    set(state => ({
      styles: { ...state.styles, [layerId]: style }
    })),

  getStyle: (layerId, feature) => {
    const style = get().styles[layerId];
    if (!style) return defaultStyle;

    if ('attribute' in style) {
      const { attribute, rules } = style;
      const value = feature?.properties?.[attribute]?.toString();
      const rule = rules.find(r => r.value === value);
      return rule?.style || defaultStyle;
    }

    return style as LayerStyle;
  },

  removeStyle: (layerId) =>
    set(state => {
      const { [layerId]: _, ...rest } = state.styles;
      return { styles: rest };
    })
}));