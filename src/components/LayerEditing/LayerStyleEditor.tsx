import { useState } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { ColorPicker } from '../LayerStyling/ColorPicker';
import { LayerStyle } from '../../types/layer';

interface LayerStyleEditorProps {
  layerId: string;
}

export const LayerStyleEditor = ({ layerId }: LayerStyleEditorProps) => {
  const { findLayer, updateLayerStyle } = useLayerStore();
  const layer = findLayer(layerId);
  
  const [style, setStyle] = useState<LayerStyle>(layer?.style || {
    color: '#3b82f6',
    fillColor: '#93c5fd',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2
  });

  const handleStyleChange = (updates: Partial<LayerStyle>) => {
    setStyle(prev => ({ ...prev, ...updates }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLayerStyle(layerId, style);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <ColorPicker
            label="Border Color"
            value={style.color}
            onChange={(color) => handleStyleChange({ color })}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 flex-1">
              Border Width
            </label>
            <input
              type="range"
              min="1"
              max="5"
              step="0.5"
              value={style.weight}
              onChange={(e) => handleStyleChange({ weight: parseFloat(e.target.value) })}
              className="w-32"
            />
            <span className="text-sm text-gray-600 w-8">{style.weight}px</span>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 flex-1">
              Border Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={style.opacity}
              onChange={(e) => handleStyleChange({ opacity: parseFloat(e.target.value) })}
              className="w-32"
            />
            <span className="text-sm text-gray-600 w-8">{Math.round(style.opacity * 100)}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <ColorPicker
            label="Fill Color"
            value={style.fillColor}
            onChange={(color) => handleStyleChange({ fillColor: color })}
          />
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 flex-1">
              Fill Opacity
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={style.fillOpacity}
              onChange={(e) => handleStyleChange({ fillOpacity: parseFloat(e.target.value) })}
              className="w-32"
            />
            <span className="text-sm text-gray-600 w-8">{Math.round(style.fillOpacity * 100)}%</span>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Apply Style
        </button>
      </div>
    </form>
  );
};