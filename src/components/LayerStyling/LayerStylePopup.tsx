import { useState, useEffect, useRef } from 'react';
import { X, Palette, Download, Upload } from 'lucide-react';
import { useLayerStore, LayerStyle } from '../../store/layerStore';
import { ColorPicker } from './ColorPicker';
import { AttributeStylePopup } from './AttributeStylePopup';
import { generateSLD } from '../../utils/sld/sldGenerator';
import { parseSLD } from '../../utils/sld/sldParser';

interface LayerStylePopupProps {
  layerId: string;
  onClose: () => void;
}

export const LayerStylePopup = ({ layerId, onClose }: LayerStylePopupProps) => {
  const { findLayer, updateLayerStyle } = useLayerStore();
  const [showAttributeStyle, setShowAttributeStyle] = useState(false);
  const [style, setStyle] = useState<LayerStyle>({
    color: '#3b82f6',
    fillColor: '#93c5fd',
    weight: 2,
    opacity: 0.8,
    fillOpacity: 0.2
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const layer = findLayer(layerId);
    if (layer?.style && !('attribute' in layer.style)) {
      setStyle(layer.style);
    }
  }, [layerId, findLayer]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleApply = () => {
    updateLayerStyle(layerId, style);
    onClose();
  };

  const handleExportSLD = () => {
    const layer = findLayer(layerId);
    if (!layer) return;

    const sldContent = generateSLD(layer.name, style);
    const blob = new Blob([sldContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${layer.name.toLowerCase().replace(/\s+/g, '_')}_style.sld`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImportSLD = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedStyle = await parseSLD(text);
      setStyle(importedStyle);
    } catch (error) {
      console.error('Error importing SLD:', error);
      alert('Invalid SLD file format');
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (showAttributeStyle) {
    return <AttributeStylePopup layerId={layerId} onClose={() => setShowAttributeStyle(false)} />;
  }

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/20">
      <div 
        ref={popupRef}
        className="bg-white rounded-lg shadow-xl w-full max-w-sm overflow-hidden"
      >
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Layer Style</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6">
          <button
            onClick={() => setShowAttributeStyle(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            <Palette className="h-4 w-4" />
            Style by Attribute
          </button>

          <div className="space-y-4">
            <div className="space-y-2">
              <ColorPicker
                label="Border Color"
                value={style.color}
                onChange={(color) => setStyle(prev => ({ ...prev, color }))}
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
                  onChange={(e) => setStyle(prev => ({ ...prev, weight: parseFloat(e.target.value) }))}
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
                  onChange={(e) => setStyle(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600 w-8">{Math.round(style.opacity * 100)}%</span>
              </div>
            </div>

            <div className="space-y-2">
              <ColorPicker
                label="Fill Color"
                value={style.fillColor}
                onChange={(color) => setStyle(prev => ({ ...prev, fillColor: color }))}
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
                  onChange={(e) => setStyle(prev => ({ ...prev, fillOpacity: parseFloat(e.target.value) }))}
                  className="w-32"
                />
                <span className="text-sm text-gray-600 w-8">{Math.round(style.fillOpacity * 100)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-t flex justify-between items-center bg-gray-50">
          <div className="flex gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".sld,.xml"
              onChange={handleImportSLD}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button
              onClick={handleExportSLD}
              className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};