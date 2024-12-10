import { useState, useMemo, useCallback } from 'react';
import { X } from 'lucide-react';
import { useLayerStore, LayerStyle } from '../../store/layerStore';
import { ColorPicker } from './ColorPicker';
import { generateDistinctColors } from '../../utils/colors/colorGenerator';

interface AttributeStylePopupProps {
  layerId: string;
  onClose: () => void;
}

export const AttributeStylePopup = ({ layerId, onClose }: AttributeStylePopupProps) => {
  const { findLayer, updateLayerStyle } = useLayerStore();
  const [selectedAttribute, setSelectedAttribute] = useState('');
  const [styleRules, setStyleRules] = useState<{ value: string; style: LayerStyle }[]>([]);

  const layer = useMemo(() => findLayer(layerId), [layerId, findLayer]);

  const attributes = useMemo(() => {
    if (!layer?.attributes?.length) return [];
    
    const firstRow = layer.attributes[0];
    return Object.keys(firstRow).filter(key => 
      !['id', 'geometry'].includes(key) && 
      layer.attributes?.some(row => row[key])
    );
  }, [layer]);

  const uniqueValues = useMemo(() => {
    if (!selectedAttribute || !layer?.attributes) return [];
    return [...new Set(layer.attributes
      .map(row => row[selectedAttribute])
      .filter(value => value !== null && value !== undefined && value !== '')
      .map(value => value.toString())
    )].sort();
  }, [selectedAttribute, layer]);

  const handleAttributeChange = useCallback((attribute: string) => {
    setSelectedAttribute(attribute);
    if (!attribute) {
      setStyleRules([]);
      return;
    }

    const values = [...new Set(layer?.attributes?.map(row => row[attribute])
      .filter(value => value !== null && value !== undefined && value !== '')
      .map(value => value.toString()) || [])].sort();

    const colors = generateDistinctColors(values.length);
    
    setStyleRules(values.map((value, index) => ({
      value,
      style: {
        color: colors[index],
        fillColor: colors[index],
        weight: 2,
        opacity: 0.8,
        fillOpacity: 0.3
      }
    })));
  }, [layer]);

  const handleApply = useCallback(() => {
    if (!selectedAttribute || !styleRules.length) return;

    updateLayerStyle(layerId, {
      attribute: selectedAttribute,
      rules: styleRules
    });
    
    onClose();
  }, [layerId, selectedAttribute, styleRules, updateLayerStyle, onClose]);

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Style by Attribute</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="p-4 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Select Attribute
            </label>
            <select
              value={selectedAttribute}
              onChange={(e) => handleAttributeChange(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Choose an attribute...</option>
              {attributes.map(attr => (
                <option key={attr} value={attr}>{attr}</option>
              ))}
            </select>
          </div>

          {selectedAttribute && styleRules.length > 0 && (
            <div className="space-y-3">
              {styleRules.map((rule, index) => (
                <div 
                  key={`${rule.value}-${index}`}
                  className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-sm font-medium flex-1 truncate">
                    {rule.value}
                  </span>
                  <ColorPicker
                    value={rule.style.color}
                    onChange={(color) => {
                      setStyleRules(prev => prev.map((r, i) => 
                        i === index ? { 
                          ...r, 
                          style: { ...r.style, color, fillColor: color } 
                        } : r
                      ));
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-3 border-t flex justify-end gap-2 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={!selectedAttribute || styleRules.length === 0}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};