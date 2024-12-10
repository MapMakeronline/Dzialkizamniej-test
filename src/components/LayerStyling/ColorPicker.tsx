import { memo } from 'react';

interface ColorPickerProps {
  label?: string;
  value: string;
  onChange: (color: string) => void;
}

export const ColorPicker = memo(({ label, value, onChange }: ColorPickerProps) => {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <label className="text-sm font-medium text-gray-700 flex-1">{label}</label>
      )}
      <div className="relative w-8 h-8 overflow-hidden rounded-lg">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 w-full h-full cursor-pointer border-0"
          style={{ transform: 'scale(1.5)' }}
        />
      </div>
    </div>
  );
});

ColorPicker.displayName = 'ColorPicker';