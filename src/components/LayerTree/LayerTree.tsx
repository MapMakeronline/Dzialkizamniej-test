import { Menu } from 'lucide-react';
import { useLayerStore } from '../../store/layerStore';
import { LayerItem } from './LayerItem';
import { memo, useState, useEffect } from 'react';
import { Logo } from '../Logo/Logo';
import { LayerTreeHeader } from './LayerTreeHeader';

export const LayerTree = memo(() => {
  const { layers, toggleLayer, setSelectedLayer, fetchLayers } = useLayerStore();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 768);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLayers = async () => {
      try {
        setIsLoading(true);
        await fetchLayers();
      } catch (error) {
        console.error('Error loading layers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLayers();
  }, [fetchLayers]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLayerSelect = (id: string) => {
    setSelectedLayer(id);
    setIsOpen(false);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-200 flex items-center px-4 z-[1004]">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
          <Logo />
        </div>
      </header>

      <aside
        className={`fixed top-16 left-0 w-72 bg-white border-r border-gray-200 h-[calc(100vh-4rem)] z-[1003] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <LayerTreeHeader />
          <div className="flex-1 overflow-y-auto py-2">
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading layers...
              </div>
            ) : layers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 text-gray-500 px-4 text-center">
                <p>No layers available</p>
                <p className="text-sm mt-2">Click the + button above to import a layer</p>
              </div>
            ) : (
              layers.map((layer) => (
                <LayerItem
                  key={layer.id}
                  layer={layer}
                  depth={0}
                  onToggle={toggleLayer}
                  onSelect={handleLayerSelect}
                />
              ))
            )}
          </div>
        </div>
      </aside>

      {isOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[1002]"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
});

LayerTree.displayName = 'LayerTree';