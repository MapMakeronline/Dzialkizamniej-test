import { useEffect, useState } from 'react';
import { useLayerStore } from '../../store/layerStore';

export const FirebaseTest = () => {
  const { layers, fetchLayers, addLayer } = useLayerStore();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        setIsLoading(true);
        setError(null);
        await fetchLayers();
        console.log('Layers loaded:', layers);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        console.error('Firebase test error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    testFirebase();
  }, [fetchLayers]);

  const handleTestAdd = async () => {
    try {
      setIsLoading(true);
      await addLayer({
        name: 'Test Layer',
        type: 'layer',
        visible: true,
        attributes: [{ id: '1', name: 'Test' }],
        orderedColumns: ['id', 'name']
      });
      await fetchLayers();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="font-medium mb-2">Firebase Connection Test</h3>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Status: </span>
          <span className={isLoading ? 'text-blue-600' : error ? 'text-red-600' : 'text-green-600'}>
            {isLoading ? 'Loading...' : error ? 'Error' : 'Connected'}
          </span>
        </div>
        
        {error && (
          <div className="text-red-600">
            Error: {error}
          </div>
        )}
        
        <div>
          <span className="font-medium">Layers loaded: </span>
          <span>{layers.length}</span>
        </div>

        <button
          onClick={handleTestAdd}
          disabled={isLoading}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Test Add Layer
        </button>
      </div>
    </div>
  );
};