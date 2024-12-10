import { useMap } from 'react-leaflet';
import { Navigation, Home, Database } from 'lucide-react';

export const MapControls = () => {
  const map = useMap();

  const handleRecenter = () => {
    map.setView([52.237049, 21.017532], 13);
  };

  const openDatabaseStudio = () => {
    window.open('http://localhost:4983', '_blank');
  };

  return (
    <div className="absolute right-4 top-20 z-[1003] flex flex-col gap-2">
      <button
        onClick={handleRecenter}
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-gray-100"
        title="Reset view"
      >
        <Home className="h-5 w-5" />
      </button>
      <button
        onClick={() => map.locate()}
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-gray-100"
        title="Find my location"
      >
        <Navigation className="h-5 w-5" />
      </button>
      <button
        onClick={openDatabaseStudio}
        className="rounded-lg bg-white p-2 shadow-lg hover:bg-gray-100"
        title="Open Database Studio"
      >
        <Database className="h-5 w-5" />
      </button>
    </div>
  );
};