import { LayerStyle } from '../../store/layerStore';

interface SLDParseResult {
  color: string;
  fillColor: string;
  weight: number;
  opacity: number;
  fillOpacity: number;
}

export async function parseSLD(sldContent: string): Promise<LayerStyle> {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(sldContent, 'text/xml');

    // Handle parsing errors
    const parseError = xmlDoc.querySelector('parsererror');
    if (parseError) {
      throw new Error('Invalid XML format');
    }

    const style: SLDParseResult = {
      color: '#3b82f6',
      fillColor: '#93c5fd',
      weight: 2,
      opacity: 0.8,
      fillOpacity: 0.2
    };

    // Parse stroke (border) properties
    const strokeParams = xmlDoc.querySelectorAll('Stroke CssParameter');
    strokeParams.forEach(param => {
      const name = param.getAttribute('name');
      const value = param.textContent;
      if (!name || !value) return;

      switch (name) {
        case 'stroke':
          style.color = value;
          break;
        case 'stroke-width':
          style.weight = parseFloat(value);
          break;
        case 'stroke-opacity':
          style.opacity = parseFloat(value);
          break;
      }
    });

    // Parse fill properties
    const fillParams = xmlDoc.querySelectorAll('Fill CssParameter');
    fillParams.forEach(param => {
      const name = param.getAttribute('name');
      const value = param.textContent;
      if (!name || !value) return;

      switch (name) {
        case 'fill':
          style.fillColor = value;
          break;
        case 'fill-opacity':
          style.fillOpacity = parseFloat(value);
          break;
      }
    });

    return style;
  } catch (error) {
    console.error('Error parsing SLD:', error);
    throw new Error('Failed to parse SLD file');
  }
}