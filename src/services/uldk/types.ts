export type ULDKRequestType = 
  | 'GetParcelByXY'
  | 'GetBuildingByXY'
  | 'GetRegionByXY'
  | 'GetCommuneByXY'
  | 'GetCountyByXY'
  | 'GetVoivodeshipByXY';

export type ULDKResponse = [
  string, // id
  string, // voivodeship
  string, // county
  string, // commune
  string, // region
  string, // parcel
  string  // geom_wkt
];

export interface ULDKError extends Error {
  code: 'INVALID_RESPONSE' | 'API_ERROR' | 'PARSE_ERROR';
  details?: unknown;
}

export interface ULDKRequestParams {
  request: ULDKRequestType;
  xy: string;
  result?: string;
  srid?: string;
}

export interface ULDKSearchOptions {
  requestType?: ULDKRequestType;
  srid?: string;
  result?: string;
}