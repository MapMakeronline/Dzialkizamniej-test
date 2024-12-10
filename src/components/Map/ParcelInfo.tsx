import { Feature } from 'geojson';
import { X } from 'lucide-react';

interface ParcelInfoProps {
  feature: Feature;
  onClose: () => void;
}

export const ParcelInfo = ({ feature, onClose }: ParcelInfoProps) => {
  const properties = feature.properties;
  if (!properties) return null;

  return (
    <div className="absolute top-20 right-4 z-[1000] bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg w-80">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Parcel Information</h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5 text-gray-500" />
        </button>
      </div>
      
      <div className="space-y-2 text-sm">
        <div>
          <span className="font-medium">Identifier: </span>
          <span>{properties.id}</span>
        </div>
        <div>
          <span className="font-medium">Voivodeship: </span>
          <span>{properties.voivodeship}</span>
        </div>
        <div>
          <span className="font-medium">County: </span>
          <span>{properties.county}</span>
        </div>
        <div>
          <span className="font-medium">Commune: </span>
          <span>{properties.commune}</span>
        </div>
        <div>
          <span className="font-medium">Region: </span>
          <span>{properties.region}</span>
        </div>
        <div>
          <span className="font-medium">Parcel number: </span>
          <span>{properties.parcel}</span>
        </div>
        {properties.coordinates && (
          <div>
            <span className="font-medium">Coordinates: </span>
            <span>{properties.coordinates}</span>
          </div>
        )}
      </div>
    </div>
  );
};