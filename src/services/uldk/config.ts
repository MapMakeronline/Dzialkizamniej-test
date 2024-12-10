export const ULDK_CONFIG = {
  API_URL: 'https://uldk.gugik.gov.pl',
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  DEFAULT_SRID: '2180',
  RESULT_FIELDS: {
    GetParcelByXY: 'id,voivodeship,county,commune,region,parcel,geom_wkt',
    GetBuildingByXY: 'id,function,status,geom_wkt',
    GetRegionByXY: 'id,name,county,commune,geom_wkt',
    GetCommuneByXY: 'id,name,county,voivodeship,geom_wkt',
    GetCountyByXY: 'id,name,voivodeship,geom_wkt',
    GetVoivodeshipByXY: 'id,name,geom_wkt'
  },
  POLAND_BOUNDS: {
    minLat: 49.0,
    maxLat: 54.9,
    minLng: 14.1,
    maxLng: 24.2
  }
} as const;