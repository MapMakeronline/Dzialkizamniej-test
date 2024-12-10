import { ChevronDown, ChevronUp, Table as TableIcon, Upload, Save, X } from 'lucide-react';
import { memo } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { useAuthStore } from '../../store/authStore';

interface TableHeaderProps {
  isExpanded: boolean;
  title: string;
  layerId: string;
  onToggleExpand: () => void;
  onClose: () => void;
  onImport?: () => void;
  showImportButton?: boolean;
}

export const TableHeader = memo(({ 
  isExpanded, 
  title,
  layerId,
  onToggleExpand, 
  onClose, 
  onImport,
  showImportButton 
}: TableHeaderProps) => {
  const { saveLayerToDatabase } = useLayerStore();
  const { isAuthenticated } = useAuthStore();

  const handleSave = async () => {
    try {
      await saveLayerToDatabase(layerId);
    } catch (error) {
      console.error('Error saving layer:', error);
    }
  };

  return (
    <div className="flex items-center justify-between px-4 h-10 bg-gray-50/90 border-b">
      <div className="flex items-center gap-4">
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={onToggleExpand}
        >
          <TableIcon className="h-5 w-5 text-blue-600" />
          <h3 className="font-medium text-gray-700">{title}</h3>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronUp className="h-5 w-5 text-gray-500" />
          )}
        </div>
        {showImportButton && onImport && (
          <button
            onClick={onImport}
            className="flex items-center gap-2 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Upload className="h-4 w-4" />
            Import CSV
          </button>
        )}
        {isAuthenticated && (
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-3 py-1 text-sm text-green-600 hover:bg-green-50 rounded-md transition-colors"
            title="Save to database"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
        )}
      </div>
      <button
        onClick={onClose}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        title="Close"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
  );
});

TableHeader.displayName = 'TableHeader';