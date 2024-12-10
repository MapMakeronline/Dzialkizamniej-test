import { Upload } from 'lucide-react';
import { useCallback } from 'react';
import { parseGML } from '../../utils/parsers/gmlParser';
import { useLayerStore } from '../../store/layerStore';
import { useLoadingStore } from '../../store/loadingStore';
import { useNotificationStore } from '../../store/notificationStore';

export const FileUpload = () => {
  const { addLayer } = useLayerStore();
  const { setLoading } = useLoadingStore();
  const { addNotification } = useNotificationStore();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const layerId = `layer-${Date.now()}`;
    setLoading(true);

    try {
      if (file.name.toLowerCase().endsWith('.gml') || file.name.toLowerCase().endsWith('.xml')) {
        const result = await parseGML(file);
        
        if (!result.features.length) {
          throw new Error('No valid features found in the file');
        }

        addLayer({
          id: layerId,
          name: file.name.replace(/\.[^/.]+$/, ''),
          type: 'layer',
          visible: true,
          data: {
            type: 'FeatureCollection',
            features: result.features
          },
          attributes: result.metadata.attributes,
          orderedColumns: result.metadata.orderedColumns
        });

        addNotification({
          type: 'success',
          message: `Successfully imported ${result.features.length} features`,
          timeout: 3000
        });
      } else {
        throw new Error('Unsupported file format. Please use GML or XML files.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error importing file';
      addNotification({
        type: 'error',
        message: errorMessage,
        timeout: 5000
      });
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  }, [addLayer, setLoading, addNotification]);

  return (
    <div className="p-2">
      <label className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg cursor-pointer hover:bg-blue-100">
        <Upload className="h-4 w-4" />
        <span className="text-sm">Import GML</span>
        <input
          type="file"
          accept=".gml,.xml"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>
    </div>
  );
};