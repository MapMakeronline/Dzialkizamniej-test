import { Feature } from 'geojson';

export const samplePolygon: Feature = {
  type: 'Feature',
  properties: {
    id: 'sample-1',
    identyfikator: '123456_1.0001.123/4',
    województwo: 'mazowieckie',
    powiat: 'warszawski',
    gmina: 'Warszawa',
    obręb: 'Mokotów',
    numer: '123/4',
    powierzchnia: '1250',
    przeznaczenie: 'budowlana',
    cena: '350000',
    data_dodania: '2024-03-15'
  },
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [21.015, 52.235],
      [21.017, 52.235],
      [21.017, 52.236],
      [21.015, 52.236],
      [21.015, 52.235]
    ]]
  }
};