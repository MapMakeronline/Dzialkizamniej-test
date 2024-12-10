import { memo } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { VirtualTable } from './VirtualTable';

interface TableContentProps {
  columns: string[];
  data: Record<string, any>[];
  layerId: string;
  orderedColumns?: string[];
  onRowClick: (row: any) => void;
}

export const TableContent = memo(({ 
  columns, 
  data, 
  layerId,
  orderedColumns,
  onRowClick
}: TableContentProps) => {
  const { selectedFeatureId, setSelectedFeatureId } = useLayerStore();
  
  const handleRowClick = (row: any) => {
    const featureId = row.id || row.identyfikator;
    setSelectedFeatureId({
      layerId,
      featureId
    });
    onRowClick(row);
  };

  return (
    <div className="h-full">
      <VirtualTable
        data={data}
        columns={orderedColumns || columns}
        onRowClick={handleRowClick}
        selectedId={selectedFeatureId?.featureId}
      />
    </div>
  );
});

TableContent.displayName = 'TableContent';