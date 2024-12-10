import { Layer } from '../firebase/layerService';
import { parseTableFile } from '../../utils/parsers/tableParser';
import { useNotificationStore } from '../../store/notificationStore';
import { useLoadingStore } from '../../store/loadingStore';
import { useAuthStore } from '../../store/authStore';

export interface TableImportResult {
  layer: Omit<Layer, 'id'>;
}

export async function importTableFile(file: File): Promise<TableImportResult> {
  const { addNotification } = useNotificationStore.getState();
  const { setLoading } = useLoadingStore.getState();
  const { user } = useAuthStore.getState();
  
  try {
    setLoading(true, 'Processing table file...');

    if (!file) {
      throw new Error('No file provided');
    }

    const maxSize = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxSize) {
      throw new Error('File size exceeds 10MB limit');
    }

    const { headers, data, orderedColumns } = await parseTableFile(file);

    const layerName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9-_\s]/g, '');

    const result: TableImportResult = {
      layer: {
        name: layerName || 'Imported Table',
        type: 'table',
        visible: true,
        attributes: data,
        orderedColumns,
        userId: user?.uid || 'anonymous'
      }
    };

    addNotification({
      type: 'success',
      message: `Successfully imported ${data.length} rows`,
      timeout: 3000
    });

    return result;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error importing table';
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