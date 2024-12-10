import { useState, useEffect, memo } from 'react';
import { useMapEvents } from 'react-leaflet';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { useLayerStore } from '../../store/layerStore';

export const ULDKIdentifier = memo(() => {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const { selectedLayer } = useLayerStore();

  useMapEvents({
    click(e) {
      if (selectedLayer) return; // Don't show identifier when table is open
      
      const x = e.originalEvent.clientX;
      const y = e.originalEvent.clientY;
      setPosition({ x, y });
    }
  });

  useEffect(() => {
    if (position) {
      const timer = setTimeout(() => setPosition(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [position]);

  if (!position || selectedLayer) return null;

  return (
    <div 
      className="fixed z-[1001] bg-white/95 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg pointer-events-none"
      style={{ 
        left: position.x + 10,
        top: position.y + 10
      }}
    >
      <div className="flex items-center gap-2 text-sm">
        <LoadingSpinner size="sm" />
        <span>Searching parcel...</span>
      </div>
    </div>
  );
});

ULDKIdentifier.displayName = 'ULDKIdentifier';