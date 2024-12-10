import { useState } from 'react';
import { X } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { processGeometryColumn } from '../../utils/parsers/csvParser';
import { useNotificationStore } from '../../store/notificationStore';

interface GeometryConverterProps {
  layerId: string;
  onClose: () => void;
}

export function GeometryConverter({ layerId, onClose }: GeometryConverterProps) {
  const { findLayer, updateLayer } = useLayerStore();
  const { addNotification } = useNotificationStore();
  const [selectedColumn, setSelectedColumn] = useState('');
  
  const layer = findLayer(layerId);
  if (!layer?.attributes?.length) return null;

  const columns = layer.orderedColumns || Object.keys(layer.attributes[0]);

  const handleConvert = async () => {
    if (!selectedColumn) return;

    try {
      // First, add the GEOMETRIA column to prepare for conversion
      const preparedAttributes = layer.attributes.map(attr => ({
        ...attr,
        GEOMETRIA: null
      }));

      // Update layer with prepared column first
      await updateLayer(layerId, {
        attributes: preparedAttributes,
        orderedColumns: [...(layer.orderedColumns || []), 'GEOMETRIA']
      });

      // Then process the geometry data
      const features = await processGeometryColumn(layer.attributes, selectedColumn);
      
      if (!features.length) {
        throw new Error('No valid geometries found in selected column');
      }

      // Update attributes with converted geometries
      const updatedAttributes = preparedAttributes.map((attr, index) => ({
        ...attr,
        GEOMETRIA: features[index]?.geometry || null
      }));

      // Convert layer to geometric type
      await updateLayer(layerId, {
        type: 'layer',
        data: {
          type: 'FeatureCollection',
          features
        },
        attributes: updatedAttributes,
        style: {
          color: '#3b82f6',
          fillColor: '#93c5fd',
          weight: 2,
          opacity: 0.8,
          fillOpacity: 0.2
        }
      });

      addNotification({
        type: 'success',
        message: `Successfully converted ${features.length} features`,
        timeout: 3000
      });

      onClose();
    } catch (error) {
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error converting geometry',
        timeout: 5000
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Convert to Geometry Layer</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a column that contains geometry data (WKB format) to convert this table into a geometry layer.
            A new "GEOMETRIA" column will be added with the converted geometry data.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {columns.map((column) => (
              <label 
                key={column}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="geometry-column"
                  value={column}
                  checked={selectedColumn === column}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{column}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConvert}
            disabled={!selectedColumn}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Convert
          </button>
        </div>
      </div>
    </div>
  );
}