export interface LayerStyle {
  color: string;
  fillColor: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
}

export interface StyleRule {
  value: string;
  style: LayerStyle;
}

export interface AttributeStyle {
  attribute: string;
  rules: StyleRule[];
}

export const defaultStyle: LayerStyle = {
  color: '#3b82f6',
  fillColor: '#93c5fd',
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0.2
};