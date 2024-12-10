import { useState, useCallback } from 'react';
import { X, Upload } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { useLoadingStore } from '../../store/loadingStore';
import { useNotificationStore } from '../../store/notificationStore';
import { parseCSV } from '../../utils/parsers/csvParser';
import { parseGML } from '../../utils/parsers/gmlParser';

interface ImportPopupProps {
  onClose: () => void;
}

export function ImportPopup({ onClose }: ImportPopupProps) {
  const { addLayer } = useLayerStore();
  const { setLoading } = useLoadingStore();
  const { addNotification } = useNotificationStore();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setLoading(true);

      if (file.name.toLowerCase().endsWith('.csv') || file.name.toLowerCase().endsWith('.txt')) {
        const text = await file.text();
        const { headers, data } = await parseCSV(text);
        
        await addLayer({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'table',
          visible: true,
          attributes: data,
          orderedColumns: ['id', ...headers]
        });

        onClose();
        return;
      }

      if (file.name.toLowerCase().endsWith('.gml') || file.name.toLowerCase().endsWith('.xml')) {
        const { features, metadata } = await parseGML(file);
        
        await addLayer({
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'layer',
          visible: true,
          data: {
            type: 'FeatureCollection',
            features
          },
          attributes: metadata.attributes,
          orderedColumns: metadata.orderedColumns,
          style: {
            color: '#3b82f6',
            fillColor: '#93c5fd',
            weight: 2,
            opacity: 0.8,
            fillOpacity: 0.2
          }
        });

        onClose();
      }
    } catch (error) {
      console.error('Error importing file:', error);
      addNotification({
        type: 'error',
        message: error instanceof Error ? error.message : 'Error importing file',
        timeout: 5000
      });
    } finally {
      setLoading(false);
    }
  }, [addLayer, setLoading, addNotification, onClose]);

  return (
    <div className="fixed inset-0 z-[1004] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold">Import Layer</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".gml,.xml,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center gap-4 cursor-pointer"
            >
              <Upload className="h-12 w-12 text-blue-500" />
              <div className="text-gray-600">
                <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                <div className="text-sm text-gray-500 mt-1">GML, XML, CSV or TXT files (max 10MB)</div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}