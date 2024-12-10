import { useState } from 'react';
import { X } from 'lucide-react';

interface GeometryColumnSelectorProps {
  headers: string[];
  onSelect: (column: string | null) => void;
  onClose: () => void;
}

export function GeometryColumnSelector({ headers, onSelect, onClose }: GeometryColumnSelectorProps) {
  const [selectedColumn, setSelectedColumn] = useState<string>('');

  return (
    <div className="fixed inset-0 z-[1005] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">Select Geometry Column</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4">
          <p className="text-sm text-gray-600 mb-4">
            Select a column that contains geometry data (WKB format), or skip if this is a regular table.
          </p>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {headers.map((header) => (
              <label 
                key={header}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="radio"
                  name="geometry-column"
                  value={header}
                  checked={selectedColumn === header}
                  onChange={(e) => setSelectedColumn(e.target.value)}
                  className="text-blue-600"
                />
                <span className="text-sm text-gray-700">{header}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 p-4 bg-gray-50 rounded-b-lg">
          <button
            onClick={() => onSelect(null)}
            className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Import as Table
          </button>
          <button
            onClick={() => onSelect(selectedColumn)}
            disabled={!selectedColumn}
            className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
          >
            Import with Geometry
          </button>
        </div>
      </div>
    </div>
  );
}