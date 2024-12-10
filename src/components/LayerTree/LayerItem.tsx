import { Map, Table, ChevronRight, Trash2, Shapes } from 'lucide-react';
import { LayerItem as LayerItemType } from '../../store/layerStore';
import { memo, useState } from 'react';
import { LayerStyleButton } from '../LayerStyling/LayerStyleButton';
import { useLayerStore } from '../../store/layerStore';
import { GeometryConverter } from '../GeometryConverter/GeometryConverter';

interface LayerItemProps {
  layer: LayerItemType;
  depth: number;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
}

export const LayerItem = memo(({ layer, depth, onToggle, onSelect }: LayerItemProps) => {
  const { removeLayer } = useLayerStore();
  const [showGeometryConverter, setShowGeometryConverter] = useState(false);
  
  const getIcon = () => {
    if (layer.type === 'table') return <Table className="h-4 w-4 text-purple-600" />;
    if (layer.type === 'group') return null;
    return <Map className="h-4 w-4 text-blue-600" />;
  };

  const handleSelect = () => {
    if (layer.attributes?.length) {
      onSelect(layer.id);
    }
  };

  const handleRemove = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await removeLayer(layer.id);
    } catch (error) {
      console.error('Error removing layer:', error);
    }
  };

  return (
    <div className="relative group hover:bg-gray-50 transition-colors">
      <div
        className="flex items-center gap-2 py-1.5 px-2 cursor-pointer"
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={handleSelect}
      >
        <span className="flex-1 text-sm flex items-center gap-2 min-w-0">
          {getIcon()}
          <span className="truncate">{layer.name}</span>
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-50 group-hover:bg-gray-100 rounded-lg px-1">
          <LayerStyleButton
            layerId={layer.id}
            isVisible={layer.visible}
            onToggleVisibility={(e) => {
              e.stopPropagation();
              onToggle(layer.id);
            }}
          />
          {layer.type === 'table' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowGeometryConverter(true);
              }}
              className="p-1 hover:bg-gray-200 rounded transition-colors"
              title="Convert to geometry"
            >
              <Shapes className="h-4 w-4 text-green-600" />
            </button>
          )}
          <button
            onClick={handleRemove}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
            title="Remove layer"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </button>
        </div>
      </div>

      {showGeometryConverter && (
        <GeometryConverter 
          layerId={layer.id}
          onClose={() => setShowGeometryConverter(false)}
        />
      )}
    </div>
  );
});

LayerItem.displayName = 'LayerItem';