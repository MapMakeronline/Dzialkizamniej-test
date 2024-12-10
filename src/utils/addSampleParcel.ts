import { parseWKB } from './wkbParser';
import { useLayerStore } from '../store/layerStore';

export function addSampleParcel() {
  const wkbHex = '0103000020110F00000100000007000000C1CAEFBBFABA3D411EE5D2ABF39459414FB039DDFBBA3D41C93C2FD0EF9459415B12A056FCBA3D4173B7C1DEEE945941728F0C9C19BB3D414E072E52EA9459410061315762BB3D41EFA1D403EB94594108EFFA675ABB3D412DFBC496F4945941C1CAEFBBFABA3D411EE5D2ABF3945941';
  
  try {
    const feature = parseWKB(wkbHex);
    const { addFeatureLayer } = useLayerStore.getState();
    addFeatureLayer(feature);
  } catch (error) {
    console.error('Error adding sample parcel:', error);
  }
}