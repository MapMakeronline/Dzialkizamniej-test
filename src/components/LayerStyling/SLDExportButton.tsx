import { Download } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { generateSLD } from '../../utils/sld/sldGenerator';

interface SLDExportButtonProps {
  layerId: string;
}

export const SLDExportButton = ({ layerId }: SLDExportButtonProps) => {
  const { findLayer } = useLayerStore();

  const handleExport = () => {
    const layer = findLayer(layerId);
    if (!layer?.style) return;

    const sldContent = generateSLD(layer.name, layer.style);
    const blob = new Blob([sldContent], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${layer.name.toLowerCase().replace(/\s+/g, '_')}_style.sld`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      title="Export SLD style"
    >
      <Download className="h-4 w-4" />
      Export Style (SLD)
    </button>
  );
};