import { useCallback } from 'react';
import { Upload } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { importTableFile } from '../../services/import/tableImportService';

interface TableImportProps {
  onClose: () => void;
}

export function TableImport({ onClose }: TableImportProps) {
  const { addLayer } = useLayerStore();

  const handleFileInput = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const { layer } = await importTableFile(file);
      await addLayer(layer);
      onClose();
    } catch (error) {
      console.error('Error importing table:', error);
    }
  }, [addLayer, onClose]);

  return (
    <div className="p-4">
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="table-upload"
        />
        <label
          htmlFor="table-upload"
          className="flex flex-col items-center gap-4 cursor-pointer"
        >
          <Upload className="h-12 w-12 text-blue-500" />
          <div className="text-gray-600">
            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
            <div className="text-sm text-gray-500 mt-1">CSV or TXT files (max 10MB)</div>
          </div>
        </label>
      </div>
    </div>
  );
}