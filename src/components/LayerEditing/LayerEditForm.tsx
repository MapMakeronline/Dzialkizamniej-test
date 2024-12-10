import { useState } from 'react';
import { X } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { LayerStyleEditor } from './LayerStyleEditor';
import { LayerPropertiesEditor } from './LayerPropertiesEditor';

interface LayerEditFormProps {
  layerId: string;
  onClose: () => void;
}

export const LayerEditForm = ({ layerId, onClose }: LayerEditFormProps) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'style'>('properties');
  const { findLayer } = useLayerStore();
  const layer = findLayer(layerId);

  if (!layer) return null;

  return (
    <div className="fixed inset-0 z-[1001] flex items-center justify-center p-4 bg-black/20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b flex items-center justify-between">
          <h3 className="text-lg font-medium">Edit Layer: {layer.name}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="flex border-b">
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'properties' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('properties')}
          >
            Properties
          </button>
          <button
            className={`flex-1 px-4 py-2 text-sm font-medium ${
              activeTab === 'style' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'
            }`}
            onClick={() => setActiveTab('style')}
          >
            Style
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {activeTab === 'properties' ? (
            <LayerPropertiesEditor layer={layer} />
          ) : (
            <LayerStyleEditor layerId={layerId} />
          )}
        </div>
      </div>
    </div>
  );
};