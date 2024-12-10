import { Circle } from 'react-leaflet';
import { Notification } from '../../Notification/Notification';

interface LocationMarkerViewProps {
  position: [number, number] | null;
  isLoading: boolean;
  error: string | null;
}

export const LocationMarkerView = ({ position, isLoading, error }: LocationMarkerViewProps) => {
  return (
    <>
      {(isLoading || error) && (
        <Notification
          message={isLoading ? 'Searching for parcel...' : error || ''}
          type={error ? 'error' : 'info'}
          timeout={10000}
        />
      )}
      {position && !isLoading && !error && (
        <Circle
          center={position}
          radius={5}
          pathOptions={{ 
            color: '#2563eb',
            fillColor: '#3b82f6',
            fillOpacity: 1,
            weight: 2
          }}
        />
      )}
    </>
  );
};