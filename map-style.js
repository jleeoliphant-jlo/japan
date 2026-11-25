export const styleUrl = 'https://tiles.openfreemap.org/styles/liberty';

const imagery = {
  type: 'raster',
  tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
  tileSize: 256,
  maxzoom: 19,
  attribution: 'Imagery © <a href="https://www.esri.com/en-us/arcgis/products/arcgis-living-atlas" target="_blank" rel="noopener">Esri</a>, Maxar, Earthstar Geographics, and GIS contributors',
};
const terrain = {
  type: 'raster-dem',
  tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
  tileSize: 256,
  maxzoom: 13,
  encoding: 'terrarium',
  attribution: 'Elevation: <a href="https://registry.opendata.aws/terrain-tiles/" target="_blank" rel="noopener">AWS Open Data</a> / Mapzen',
};

const buildingHeight = ['coalesce', ['get', 'render_height'], 4];
const buildingColor = ['interpolate', ['linear'], buildingHeight, 4, '#bdb9ab', 20, '#b9c0bf', 70, '#c4d1d9', 160, '#d6e0e5', 300, '#edf1f4'];

export function transformBasemap(satellite) {
  return (_prior, raw) => {
    raw.projection = { type: 'globe' };
    raw.sky = {
      'sky-color': satellite ? '#74a9d8' : '#dce7ef',
      'horizon-color': '#dcecf5',
      'fog-color': '#d6e5ed',
      'fog-ground-blend': 0.73,
      'horizon-fog-blend': 0.17,
      'sky-horizon-blend': 0.55,
      'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 3, 0.64, 13, 0.24, 17, 0.04],
    };
    for (const layer of raw.layers) {
      const paint = layer.paint ??= {};
      if (layer.id.includes('shield') || /^poi_r/.test(layer.id)) layer.layout = { ...layer.layout, visibility: 'none' };
      if (layer.type !== 'symbol') continue;
      if (layer.layout?.['text-field'] && !layer.id.includes('shield')) {
        layer.layout['text-field'] = ['coalesce', ['get', 'name:en'], ['get', 'name'], ''];
      }
      if (satellite && paint['text-color']) {
        paint['text-color'] = layer.id.startsWith('water') ? '#d4edfc' : '#fffdf0';
        paint['text-halo-color'] = '#101e29';
        paint['text-halo-width'] = 1.7;
        paint['text-halo-blur'] = 0.4;
      }
    }
    if (!satellite) {
      raw.layers = raw.layers.filter((layer) => layer.type !== 'fill-extrusion');
      return raw;
    }
    Object.assign(raw.sources, { imagery, elevation: terrain, relief: terrain });
    raw.terrain = { source: 'elevation', exaggeration: 1.35 };
    raw.light = { anchor: 'map', position: [1.4, 315, 40], intensity: 0.62, color: '#fff3dd' };
    const overlays = raw.layers.filter((layer) => layer.type === 'symbol' && (
      /^(label_|water_name|airport|poi_transit)/.test(layer.id) || layer.id === 'highway-name-major'
    ));
    const buildings = raw.layers.find((layer) => layer.id === 'building-3d');
    if (buildings) buildings.paint = {
      ...buildings.paint,
      'fill-extrusion-height': buildingHeight,
      'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
      'fill-extrusion-color': buildingColor,
      'fill-extrusion-opacity': ['interpolate', ['linear'], ['zoom'], 14, 0.22, 15.7, 0.9, 17, 0.98],
      'fill-extrusion-vertical-gradient': true,
    };
    raw.layers = [
      { id: 'satellite-background', type: 'background', paint: { 'background-color': '#1b3d4e' } },
      { id: 'world-imagery', type: 'raster', source: 'imagery', paint: { 'raster-saturation': -0.12, 'raster-contrast': 0.09, 'raster-fade-duration': 140 } },
      { id: 'terrain-relief', type: 'hillshade', source: 'relief', maxzoom: 14, paint: {
        'hillshade-exaggeration': 0.24, 'hillshade-shadow-color': '#283b43', 'hillshade-highlight-color': '#ffedca', 'hillshade-accent-color': '#637668',
      } },
      ...(buildings ? [buildings] : []),
      ...overlays,
    ];
    return raw;
  };
}
