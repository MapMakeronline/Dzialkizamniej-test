import { useState } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { LayerItem } from '../../store/layerStore';

interface LayerPropertiesEditorProps {
  layer: LayerItem;
}

export const LayerPropertiesEditor = ({ layer }: LayerPropertiesEditorProps) => {
  const { updateLayer } = useLayerStore();
  const [name, setName] = useState(layer.name);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLayer(layer.id, { name });
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Layer Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Layer Type
        </label>
        <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
          {layer.type}
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};