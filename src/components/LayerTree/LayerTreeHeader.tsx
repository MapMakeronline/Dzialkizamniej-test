import { Layers, Plus } from 'lucide-react';
import { useState } from 'react';
import { ImportPopup } from '../ImportPopup/ImportPopup';

export const LayerTreeHeader = () => {
  const [showImport, setShowImport] = useState(false);

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-blue-600" />
          <h2 className="text-base font-medium">Layers</h2>
        </div>
        <button
          onClick={() => setShowImport(true)}
          className="p-1.5 bg-black hover:bg-gray-800 rounded-lg transition-colors"
          title="Import Layer"
        >
          <Plus className="h-4 w-4 text-white" />
        </button>
      </div>
      {showImport && <ImportPopup onClose={() => setShowImport(false)} />}
    </div>
  );
};