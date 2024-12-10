import { useState, useCallback, useEffect, memo, useRef } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { VirtualTable } from './VirtualTable';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

export const AttributesTable = memo(() => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [height, setHeight] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const tableRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  
  const { layers, selectedLayer, setSelectedLayer, updateLayer } = useLayerStore();
  const selectedLayerData = selectedLayer ? layers.find(l => l.id === selectedLayer) : null;

  const handleMouseDown = useCallback((e: React.MouseEvent | TouchEvent) => {
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setIsDragging(true);
    setStartY(clientY);
    setStartHeight(height);
    e.preventDefault();
  }, [height]);

  const handleMouseMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging) return;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const delta = startY - clientY;
    const newHeight = Math.min(
      Math.max(startHeight + delta, 200),
      window.innerHeight * 0.8
    );
    setHeight(newHeight);
  }, [isDragging, startY, startHeight]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        window.removeEventListener('touchmove', handleMouseMove);
        window.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleCellUpdate = useCallback((rowIndex: number, column: string, value: string) => {
    if (!selectedLayerData?.attributes) return;

    const updatedAttributes = [...selectedLayerData.attributes];
    updatedAttributes[rowIndex] = {
      ...updatedAttributes[rowIndex],
      [column]: value
    };

    updateLayer(selectedLayer!, { attributes: updatedAttributes });
  }, [selectedLayer, selectedLayerData, updateLayer]);

  const handleHeaderDoubleClick = useCallback((e: React.MouseEvent) => {
    if (headerRef.current?.contains(e.target as Node)) {
      setIsExpanded(prev => !prev);
    }
  }, []);

  if (!selectedLayerData?.attributes?.length) return null;

  return (
    <div 
      ref={tableRef}
      className="fixed bottom-0 left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out"
      style={{ 
        height: `${height}px`,
        transform: isExpanded ? 'translateY(0)' : 'translateY(calc(100% - 40px))',
        zIndex: 2000
      }}
    >
      <div
        className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 flex items-center justify-center bg-white rounded-t-lg shadow-md cursor-row-resize z-10"
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
      >
        <div className="w-8 h-1 bg-gray-300 rounded-full" />
      </div>

      <div className="h-full flex flex-col">
        <div 
          ref={headerRef}
          className="sticky top-0 z-20 flex items-center justify-between px-4 h-10 bg-gray-50 border-b cursor-pointer"
          onDoubleClick={handleHeaderDoubleClick}
        >
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronUp className="h-5 w-5 text-gray-500" />
              )}
            </button>
            <h3 className="font-medium text-gray-700">{selectedLayerData.name} - Attributes</h3>
          </div>
          <button
            onClick={() => setSelectedLayer(null)}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {isExpanded && (
          <div className="flex-1 overflow-hidden">
            <VirtualTable
              data={selectedLayerData.attributes}
              columns={selectedLayerData.orderedColumns || Object.keys(selectedLayerData.attributes[0])}
              onRowClick={() => {}}
              onCellUpdate={handleCellUpdate}
            />
          </div>
        )}
      </div>
    </div>
  );
});

AttributesTable.displayName = 'AttributesTable';