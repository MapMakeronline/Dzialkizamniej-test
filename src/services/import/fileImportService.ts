import { Feature } from 'geojson';
import { parseGML } from '../../utils/parsers/gmlParser';
import { parseCSV, processGeometryColumn } from '../../utils/parsers/csvParser';
import { Layer } from '../firebase/layerService';
import { useNotificationStore } from '../../store/notificationStore';
import { useLoadingStore } from '../../store/loadingStore';

export interface ImportResult {
  layer: Omit<Layer, 'id'>;
  features?: Feature[];
}

const DEFAULT_STYLE = {
  color: '#3b82f6',
  fillColor: '#93c5fd',
  weight: 2,
  opacity: 0.8,
  fillOpacity: 0.2
};

export async function importFile(file: File, geometryColumn?: string): Promise<ImportResult> {
  const { addNotification } = useNotificationStore.getState();
  const { setLoading } = useLoadingStore.getState();
  
  try {
    setLoading(true, 'Processing file...');
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const maxSize = 10 * 1024 * 1024; // 10MB limit

    if (!file || file.size > maxSize) {
      throw new Error(file ? 'File size exceeds 10MB limit' : 'No file provided');
    }

    const layerName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_\s]/g, '');

    switch (fileExtension) {
      case 'csv':
      case 'txt': {
        const text = await file.text();
        const { headers, data } = await parseCSV(text);

        // If geometry column is specified, try to process as geometric layer
        if (geometryColumn && headers.includes(geometryColumn)) {
          const features = await processGeometryColumn(data, geometryColumn);
          
          if (features.length > 0) {
            return {
              layer: {
                name: layerName || 'Imported Layer',
                type: 'layer',
                visible: true,
                data: {
                  type: 'FeatureCollection',
                  features
                },
                attributes: data,
                orderedColumns: ['id', ...headers],
                style: DEFAULT_STYLE,
                userId: 'anonymous',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              },
              features
            };
          }
        }

        // Import as regular table if no geometry or processing failed
        return {
          layer: {
            name: layerName || 'Imported Table',
            type: 'table',
            visible: true,
            attributes: data,
            orderedColumns: ['id', ...headers],
            userId: 'anonymous',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        };
      }

      case 'gml':
      case 'xml': {
        const { features, metadata } = await parseGML(file);
        return {
          layer: {
            name: layerName || 'Imported Layer',
            type: 'layer',
            visible: true,
            data: {
              type: 'FeatureCollection',
              features
            },
            attributes: metadata.attributes,
            orderedColumns: metadata.orderedColumns,
            style: DEFAULT_STYLE,
            userId: 'anonymous',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          features
        };
      }

      default:
        throw new Error('Unsupported file format. Please use GML, XML, CSV, or TXT files.');
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error importing file';
    addNotification({
      type: 'error',
      message,
      timeout: 5000
    });
    throw error;
  } finally {
    setLoading(false);
  }
}