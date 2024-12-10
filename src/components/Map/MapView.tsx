import { MapContainer, TileLayer, ZoomControl, GeoJSON } from 'react-leaflet';
import { useMapStore } from '../../store/mapStore';
import { useLayerStore } from '../../store/layerStore';
import { useLoadingStore } from '../../store/loadingStore';
import { useNotificationStore } from '../../store/notificationStore';
import { MapControls } from './MapControls';
import { LocationMarkerContainer } from './LocationMarker/LocationMarkerContainer';
import { AttributesTable } from '../AttributesTable/AttributesTable';
import { useMapFeatures } from '../../hooks/useMapFeatures';
import { NotificationContainer } from '../Notification/NotificationContainer';
import { NotificationSettings } from '../Notification/NotificationSettings';
import { searchParcelByCoordinates } from '../../services/uldk/uldkService';
import { CoordinateDisplay } from './CoordinateDisplay';
import { ParcelInfo } from './ParcelInfo';
import { ULDKIdentifier } from './ULDKIdentifier';
import { DatabaseSchemaButton } from '../DatabaseSchema/DatabaseSchemaButton';
import { DatabaseSchemaPopup } from '../DatabaseSchema/DatabaseSchemaPopup';
import { useState, useMemo } from 'react';
import { Feature } from 'geojson';
import 'leaflet/dist/leaflet.css';

import { setupLeafletIcons } from '../../utils/leaflet/setupIcons';
setupLeafletIcons();

export function MapView() {
  const { center, zoom } = useMapStore();
  const { layers, selectedLayer, setSelectedLayer } = useLayerStore();
  const { notifications, removeNotification } = useNotificationStore();
  const [showDatabaseSchema, setShowDatabaseSchema] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState<Feature | null>(null);
  const { onEachFeature } = useMapFeatures();

  const visibleLayers = useMemo(() => 
    layers.filter(layer => layer.visible && layer.data?.features?.length > 0),
    [layers]
  );

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    try {
      const { lat, lng } = e.latlng;
      const feature = await searchParcelByCoordinates(lat, lng);
      if (feature) {
        setSelectedParcel(feature);
      }
    } catch (error) {
      console.error('Error handling map click:', error);
    }
  };

  return (
    <div className="absolute inset-0 transition-all duration-300 ease-in-out" 
         style={{ top: '4rem', zIndex: 1000 }}>
      <MapContainer
        center={center}
        zoom={zoom}
        zoomControl={false}
        className="h-full w-full"
        minZoom={6}
        maxZoom={18}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LocationMarkerContainer />
        <CoordinateDisplay />
        <ULDKIdentifier />
        
        {selectedParcel && (
          <ParcelInfo 
            feature={selectedParcel} 
            onClose={() => setSelectedParcel(null)} 
          />
        )}
        
        {visibleLayers.map((layer) => (
          <GeoJSON
            key={layer.id}
            data={layer.data}
            style={layer.style}
            onEachFeature={onEachFeature}
          />
        ))}
        
        <ZoomControl position="bottomright" />
        <MapControls />
      </MapContainer>
      
      <AttributesTable />
      
      <DatabaseSchemaButton onClick={() => setShowDatabaseSchema(true)} />
      {showDatabaseSchema && (
        <DatabaseSchemaPopup onClose={() => setShowDatabaseSchema(false)} />
      )}
      
      <NotificationContainer 
        notifications={notifications}
        onDismiss={removeNotification}
      />
      
      <NotificationSettings />
    </div>
  );
}