import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { TableCell } from './TableCell';

interface VirtualTableProps {
  data: Record<string, any>[];
  columns: string[];
  onRowClick: (row: any) => void;
  onCellUpdate: (rowIndex: number, column: string, value: string) => void;
}

export const VirtualTable = ({ data, columns, onRowClick, onCellUpdate }: VirtualTableProps) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);

  const parentRef = useRef<HTMLDivElement>(null);

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    const aString = String(aValue || '').toLowerCase();
    const bString = String(bValue || '').toLowerCase();
    
    return sortConfig.direction === 'asc' 
      ? aString.localeCompare(bString)
      : bString.localeCompare(aString);
  });

  const rowVirtualizer = useVirtualizer({
    count: sortedData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 10,
  });

  const handleSort = useCallback((column: string) => {
    setSortConfig(current => {
      if (current?.key === column) {
        return current.direction === 'asc'
          ? { key: column, direction: 'desc' }
          : null;
      }
      return { key: column, direction: 'asc' };
    });
  }, []);

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div className="relative min-w-full">
        {/* Fixed Header */}
        <div className="sticky top-0 z-20 bg-white shadow-sm">
          <div className="flex border-b border-gray-200">
            {columns.map((column, columnIndex) => (
              <div
                key={`header-${columnIndex}-${column}`}
                className="flex-1 px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleSort(column)}
                style={{ minWidth: '150px' }}
              >
                <div className="flex items-center gap-2">
                  {column}
                  {sortConfig?.key === column && (
                    sortConfig.direction === 'asc' 
                      ? <ChevronUp className="h-4 w-4" />
                      : <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Virtualized Rows */}
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative'
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const row = sortedData[virtualRow.index];
            const rowId = row.id || row.identyfikator || `row-${virtualRow.index}`;
            
            return (
              <div
                key={`row-${rowId}-${virtualRow.index}`}
                className={`absolute top-0 left-0 flex w-full hover:bg-blue-50 cursor-pointer transition-colors ${
                  virtualRow.index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
                onClick={() => onRowClick(row)}
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`
                }}
              >
                {columns.map((column, columnIndex) => (
                  <div
                    key={`cell-${rowId}-${columnIndex}-${column}`}
                    className="flex-1 px-4 py-2 text-sm text-gray-700 border-b border-gray-200"
                    style={{ minWidth: '150px' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <TableCell
                      value={row[column]}
                      column={column}
                      onUpdate={(value) => onCellUpdate(virtualRow.index, column, value)}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};