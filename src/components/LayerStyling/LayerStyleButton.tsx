import { useState } from 'react';
import { Eye, EyeOff, Palette } from 'lucide-react';
import { LayerStylePopup } from './LayerStylePopup';

interface LayerStyleButtonProps {
  layerId: string;
  isVisible: boolean;
  onToggleVisibility: (e: React.MouseEvent) => void;
}

export const LayerStyleButton = ({ layerId, isVisible, onToggleVisibility }: LayerStyleButtonProps) => {
  const [showStylePopup, setShowStylePopup] = useState(false);

  return (
    <>
      <button
        onClick={onToggleVisibility}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title={isVisible ? 'Hide layer' : 'Show layer'}
      >
        {isVisible ? (
          <Eye className="h-4 w-4 text-blue-600" />
        ) : (
          <EyeOff className="h-4 w-4 text-gray-400" />
        )}
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          setShowStylePopup(true);
        }}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
        title="Layer style"
      >
        <Palette className="h-4 w-4 text-gray-500" />
      </button>

      {showStylePopup && (
        <LayerStylePopup 
          layerId={layerId} 
          onClose={() => setShowStylePopup(false)} 
        />
      )}
    </>
  );
};