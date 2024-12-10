import { useState, memo } from 'react';
import { Edit2 } from 'lucide-react';

interface TableCellProps {
  value: any;
  column: string;
  onUpdate: (value: string) => void;
}

export const TableCell = memo(({ value, column, onUpdate }: TableCellProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value?.toString() || '');

  const handleUpdate = (newValue: string) => {
    onUpdate(newValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleUpdate(editValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditValue(value?.toString() || '');
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={() => handleUpdate(editValue)}
        onKeyDown={handleKeyDown}
        className="w-full px-2 py-1 text-sm border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        autoFocus
      />
    );
  }

  return (
    <div className="group flex items-center gap-2 min-w-0">
      <span className="truncate flex-1">{value?.toString() || ''}</span>
      <button
        onClick={() => setIsEditing(true)}
        className="invisible group-hover:visible p-1 hover:bg-gray-100 rounded-full"
        title="Edit cell"
      >
        <Edit2 className="h-3 w-3 text-gray-500" />
      </button>
    </div>
  );
});

TableCell.displayName = 'TableCell';