import { useState } from 'react';
import { useLayerStore } from '../../store/layerStore';
import { Upload } from 'lucide-react';

interface CSVImportProps {
  onClose: () => void;
}

export const CSVImport = ({ onClose }: CSVImportProps) => {
  const [dragActive, setDragActive] = useState(false);
  const { addTableLayer } = useLayerStore();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer?.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFile(file);
    }
  };

  const handleFile = async (file: File) => {
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      const headers = lines[0].split('\t');
      
      const attributes = lines.slice(1).map((line, index) => {
        const values = line.split('\t');
        const row: Record<string, string> = {};
        headers.forEach((header, i) => {
          row[header.trim()] = values[i]?.trim() || '';
        });
        row.id = `row-${index + 1}`;
        return row;
      });

      addTableLayer({
        id: `table-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        visible: true,
        attributes
      });

      onClose();
    } catch (error) {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please ensure it\'s a valid tab-separated file.');
    }
  };

  return (
    <div className="p-8">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 text-center ${
          dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={handleFileInput}
          className="hidden"
          id="csv-upload"
        />
        <label
          htmlFor="csv-upload"
          className="flex flex-col items-center gap-4 cursor-pointer"
        >
          <Upload className="h-12 w-12 text-purple-500" />
          <div className="text-gray-600">
            <span className="font-medium text-purple-600">Click to upload</span> or drag and drop
            <div className="text-sm text-gray-500 mt-1">CSV or TXT files (tab-separated)</div>
          </div>
        </label>
      </div>
    </div>
  );
};