import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import mapWorker from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import sprite from 'lucide/sprite.svg?url';
import './style.css';
import { categories, days, lists } from './itinerary.js';
import { decode, encode, mapLink, original, pinned, safeUrl, saveKey, validate } from './storage.js';

const $ = (id) => document.getElementById(id);
const icon = (name) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><use href="${sprite}#${name}"></use></svg>`;
const element = (tag, className, text) => {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
};
const button = (text, glyph, className = 'button') => {
  const node = element('button', className, text);
  node.type = 'button';
  if (glyph) node.insertAdjacentHTML('afterbegin', icon(glyph));
  return node;
};
const getDay = (id) => days.find((day) => day.id === id);
const all = { id: 'all', name: 'The whole trip', area: 'Japan', caption: 'Explore every stop from Tokyo to Kyoto and Osaka.', color: '#ffa4b9' };
const mobile = matchMedia('(max-width: 760px)');
const motion = matchMedia('(prefers-reduced-motion: reduce)');
const dialog = $('dialog');
const styleUrl = 'https://tiles.openfreemap.org/styles/liberty';
let trip = original();
let activeDay = '24';
let activeCategory = 'all';
let query = '';
let showRoute = false;
let is3D = true;
let globeView = false;
let toastTimer;
let map;
let markers = [];
let selected;
let popup;
let mapReady = false;
let initialZoomAdjusted = false;
let pickDraft;
let dragId;

function toast(message, persistent = false) {
  clearTimeout(toastTimer);
  (dialog.open ? dialog : document.body).append($('toast'));
  $('toast').textContent = message;
  $('toast').hidden = false;
  if (!persistent) toastTimer = setTimeout(() => { $('toast').hidden = true; }, 4200);
}

function persist() {
  try {
    localStorage.setItem(saveKey, JSON.stringify(trip));
    return true;
  } catch {
    toast('This browser could not save changes. Export a copy before closing.', true);
    return false;
  }
}

try {
  const saved = localStorage.getItem(saveKey);
  if (saved) trip = validate(JSON.parse(saved));
} catch {
  toast('Could not read your saved trip. Showing the original itinerary.');
}

const fragment = location.hash.startsWith('#trip=') ? location.hash.slice(6) : '';

function filtered() {
  return trip.stops.filter((stop) =>
    (activeDay === 'all' || stop.day === activeDay)
    && (activeCategory === 'all' || stop.category === activeCategory)
    && (!query || `${stop.name} ${stop.notes} ${stop.time} ${categories[stop.category][0]}`.toLocaleLowerCase().includes(query)));
}

function paintTabs() {
  $('days').replaceChildren(...[all, ...days].map((day) => {
    const tab = button('', '', `day-tab ${day.dow ? '' : 'wide-tab'}`);
    tab.dataset.day = day.id;
    tab.style.setProperty('--accent', day.color);
    tab.setAttribute('aria-pressed', String(activeDay === day.id));
    const label = day.dow ? day.dow.toUpperCase() : day.id === 'all' ? 'OVERVIEW' : 'BONUS';
    const title = day.dow ? `Dec ${day.id}` : ({ all: 'All stops', ideas: 'Ideas', akane: 'Akane’s picks' })[day.id];
    tab.append(element('small', '', label), element('strong', '', title));
    tab.addEventListener('click', () => {
      if (activeDay === day.id) return;
      setDay(day.id);
      $('days').querySelector(`[data-day="${day.id}"]`).focus({ preventScroll: true });
    });
    return tab;
  }));
}

function setDay(day) {
  activeDay = day;
  activeCategory = $('category').value = 'all';
  query = $('search').value = '';
  $('stops').scrollTop = 0;
  paintTabs();
  render();
  fitVisible();
}

function syncSelection() {
  document.querySelectorAll('[data-stop-id]').forEach((node) => {
    node.classList.toggle('selected', node.dataset.stopId === selected);
  });
}

function render() {
  const day = getDay(activeDay) ?? all;
  const stops = filtered();
  document.documentElement.style.setProperty('--active-color', day.color);
  $('planner-kicker').textContent = day.dow ? `DAY ${Number(day.id) - 22}  /  ${day.area.toUpperCase()}` : day.id === 'all' ? 'DEC 23–30  /  JAPAN' : `EXTRAS  /  ${day.area.toUpperCase()}`;
  $('planner-title').textContent = day.name;
  $('planner-caption').textContent = day.caption;
  $('stops-count').textContent = `${stops.length} ${stops.length === 1 ? 'STOP' : 'STOPS'}`;
  $('map-context').textContent = `${day.area.toUpperCase()}  /  ${stops.filter(pinned).length} PINS`;
  $('stops').replaceChildren(...stops.map((stop) => {
    const item = button('', '', 'stop');
    item.dataset.stopId = stop.id;
    item.style.setProperty('--stop-color', getDay(stop.day).color);
    const mark = element('span', 'stop-icon');
    mark.innerHTML = icon(categories[stop.category][1]);
    const copy = element('span', 'stop-copy');
    const title = element('strong', '', stop.name);
    if (stop.book) {
      const star = element('span', 'star', '★');
      star.title = 'Book in advance';
      star.setAttribute('aria-label', 'Book in advance');
      title.append(star);
    }
    copy.append(title, element('small', '', [stop.time, categories[stop.category][0], activeDay === 'all' && getDay(stop.day).dow && `Dec ${stop.day}`].filter(Boolean).join(' · ')));
    const next = element('span', 'stop-next');
    next.innerHTML = icon('chevron-right');
    item.append(mark, copy, next);
    item.addEventListener('click', () => selectStop(stop));
    return item;
  }));
  if (!stops.length) $('stops').append(element('p', 'empty', 'No matching stops. Try another filter or add a stop.'));
  drawMarkers(stops);
}

function travelCamera(options) {
  if (!map) return;
  if (motion.matches) map.jumpTo(options);
  else map.flyTo({ ...options, duration: 1250, curve: 1.35 });
}

function fitVisible(instant = false) {
  const locations = filtered().filter(pinned);
  if (!map || !locations.length) return;
  globeView = false;
  $('globe').setAttribute('aria-pressed', 'false');
  const bounds = new maplibregl.LngLatBounds();
  locations.forEach(({ lng, lat }) => bounds.extend([lng, lat]));
  const camera = map.cameraForBounds(bounds, { padding: mobile.matches ? 48 : 105, maxZoom: 14.4 });
  if (!camera) return;
  const view = { ...camera, pitch: is3D ? 47 : 0, bearing: is3D ? -19 : 0 };
  if (instant) map.jumpTo(view);
  else travelCamera(view);
}

function colorStyle(_prior, raw) {
  raw.projection = { type: 'globe' };
  raw.sky = { 'sky-color': '#211729', 'horizon-color': '#493448', 'fog-color': '#302537',
    'fog-ground-blend': 0.6, 'horizon-fog-blend': 0.25, 'sky-horizon-blend': 0.65 };
  const fills = { park: '#283b36', landcover_wood: '#2d443e', landcover_grass: '#334740',
    landuse_residential: '#332c39', water: '#1b3745', building: '#473c4a' };
  for (const layer of raw.layers) {
    const paint = layer.paint ??= {};
    if (layer.id.includes('shield')) layer.layout = { ...layer.layout, visibility: 'none' };
    if (layer.type === 'background') paint['background-color'] = '#302a36';
    if (layer.type === 'raster') Object.assign(paint, { 'raster-saturation': -0.8, 'raster-brightness-min': 0.05, 'raster-brightness-max': 0.32 });
    if (layer.type === 'fill') {
      if (layer.id === 'road_area_pattern') layer.layout = { ...layer.layout, visibility: 'none' };
      else paint['fill-color'] = fills[layer.id] ?? '#3a3440';
      if (paint['fill-outline-color']) paint['fill-outline-color'] = '#372e3d';
    }
    if (layer.type === 'line' && paint['line-color']) {
      const major = /primary|trunk|motorway/.test(layer.id);
      paint['line-color'] = layer.id.startsWith('waterway') ? '#284958'
        : /casing/.test(layer.id) ? '#332936' : major ? '#786371' : '#554954';
    }
    if (layer.type === 'fill-extrusion') {
      Object.assign(paint, { 'fill-extrusion-color': '#886878', 'fill-extrusion-opacity': 0.9 });
    }
    if (layer.type === 'symbol' && paint['text-color']) {
      paint['text-color'] = /water/.test(layer.id) ? '#8caabf' : /label_(city|country|town)/.test(layer.id) ? '#e8d5df' : '#b9aab9';
      if (paint['text-halo-color']) paint['text-halo-color'] = '#302736';
      if (/^poi_r/.test(layer.id)) layer.layout = { ...layer.layout, visibility: 'none' };
      if (layer.layout?.['text-field'] && !layer.id.includes('shield')) layer.layout['text-field'] = ['coalesce', ['get', 'name:en'], ['get', 'name'], ''];
    }
  }
  return raw;
}

function drawRoute(stops = filtered()) {
  const source = map?.getSource('itinerary-route');
  if (!source) return;
  const coordinates = stops.filter(pinned).map(({ lng, lat }) => [lng, lat]);
  source.setData({
    type: 'FeatureCollection',
    features: showRoute && activeDay !== 'all' && coordinates.length > 1
      ? [{ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates } }] : [],
  });
  map.setPaintProperty('itinerary-route-line', 'line-color', (getDay(activeDay) ?? all).color);
}

function drawMarkers(stops) {
  if (!map) return;
  popup?.remove();
  selected = null;
  markers.forEach((marker) => marker.remove());
  markers = [];
  for (const stop of stops.filter(pinned)) {
    const pin = button('', categories[stop.category][1], 'pin');
    pin.dataset.stopId = stop.id;
    pin.title = stop.name;
    pin.setAttribute('aria-label', stop.name);
    pin.style.setProperty('--pin-color', getDay(stop.day).color);
    const moving = dragId === stop.id;
    pin.classList.toggle('moving', moving);
    const marker = new maplibregl.Marker({ element: pin, draggable: moving }).setLngLat([stop.lng, stop.lat]).addTo(map);
    pin.addEventListener('click', (event) => {
      event.stopPropagation();
      if (!dragId && !pickDraft) selectStop(stop);
    });
    marker.on('dragend', () => {
      if (dragId !== stop.id) return;
      const { lng, lat } = marker.getLngLat().wrap();
      trip.stops = trip.stops.map((item) => item.id === stop.id ? { ...item, lat: +lat.toFixed(6), lng: +lng.toFixed(6) } : item);
      dragId = null;
      stopPicking();
      if (persist()) toast('Pin moved and saved.');
      render();
    });
    markers.push(marker);
  }
  drawRoute(stops);
}

function detailContent(stop) {
  const content = element('div', 'detail');
  content.style.setProperty('--detail-color', getDay(stop.day).color);
  const kicker = [categories[stop.category][0], stop.time, stop.book && '★ Book in advance'].filter(Boolean).join(' · ');
  content.append(element('p', 'detail-kicker', kicker), element('h3', '', stop.name));
  if (stop.notes) content.append(element('p', 'detail-notes', stop.notes));
  const links = element('div', 'detail-links');
  const makeLink = (title, href, glyph, className) => {
    const link = element('a', className, title);
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.insertAdjacentHTML('afterbegin', icon(glyph));
    return link;
  };
  const website = safeUrl(stop.website);
  if (website) links.append(makeLink('Website', website, 'external-link', 'button primary'));
  else if (stop.category !== 'note') links.append(makeLink('Find on Maps', mapLink(stop), 'map-pin', 'button primary'));
  if (pinned(stop)) links.append(makeLink('Directions', mapLink(stop, true), 'navigation', 'button'));
  const edit = button('Edit', 'pencil', 'text-button');
  edit.addEventListener('click', () => { popup?.remove(); openEditor(stop); });
  links.append(edit);
  content.append(links);
  return content;
}

function selectStop(stop) {
  if (dragId || pickDraft) return;
  popup?.remove();
  if (!map || !mapReady || !pinned(stop)) {
    const panel = openDialog('Stop details');
    panel.append(detailContent(stop));
    return;
  }
  if (mobile.matches) document.querySelector('.map-frame').scrollIntoView({ block: 'start', behavior: motion.matches ? 'instant' : 'smooth' });
  selected = stop.id;
  syncSelection();
  globeView = false;
  $('globe').setAttribute('aria-pressed', 'false');
  travelCamera({ center: [stop.lng, stop.lat], zoom: Math.max(16, Math.min(map.getZoom(), 17.1)), pitch: is3D ? 51 : 0, offset: [0, mobile.matches ? 52 : 70] });
  popup = new maplibregl.Popup({ offset: 16, maxWidth: '300px', anchor: 'bottom', focusAfterOpen: false })
    .setLngLat([stop.lng, stop.lat]).setDOMContent(detailContent(stop)).addTo(map);
  popup.on('close', () => { selected = null; syncSelection(); });
}

function initMap() {
  const status = $('map-status');
  try {
    maplibregl.setWorkerUrl(mapWorker);
    map = new maplibregl.Map({ container: 'map', style: styleUrl, transformStyle: colorStyle,
      center: [139.7018, 35.6659], zoom: 13.5, pitch: 48, bearing: -19, maxPitch: 72,
      attributionControl: { compact: true }, canvasContextAttributes: { antialias: true } });
  } catch {
    status.textContent = '3D is unavailable on this device. The itinerary and directions still work.';
    document.querySelector('.map-tools').hidden = true;
    return;
  }
  map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
  map.on('style.load', () => {
    if (!map.getSource('itinerary-route')) {
      map.addSource('itinerary-route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'itinerary-route-line', type: 'line', source: 'itinerary-route', paint: {
        'line-color': '#ffa4b9', 'line-width': 2.5, 'line-opacity': 0.7, 'line-dasharray': [1, 2],
      } });
    }
    drawRoute();
  });
  map.once('load', () => {
    mapReady = true;
    status.hidden = true;
    if (!initialZoomAdjusted) fitVisible(true);
  });
  map.on('error', () => {
    if (!mapReady) status.textContent = 'The basemap could not load. Check your connection or use the itinerary list.';
  });
  map.on('click', ({ lngLat }) => {
    if (!pickDraft) return;
    const { lat, lng } = lngLat.wrap();
    const draft = { ...pickDraft, lat: +lat.toFixed(6), lng: +lng.toFixed(6) };
    stopPicking();
    openEditor(draft);
  });
  drawMarkers(filtered());
}

function openDialog(title) {
  if (dialog.contains($('toast'))) document.body.append($('toast'));
  const header = element('header', 'dialog-header');
  const heading = element('h2', '', title);
  heading.id = 'dialog-title';
  const close = button('', 'x', 'tool');
  close.setAttribute('aria-label', 'Close dialog');
  close.addEventListener('click', () => dialog.close());
  header.append(heading, close);
  const body = element('div', 'dialog-body');
  dialog.replaceChildren(header, body);
  if (!dialog.open) dialog.showModal();
  return body;
}

function optionList(items) {
  return items.map(([value, label]) => new Option(label, value));
}

function stopPicking() {
  pickDraft = null;
  if (map) map.getCanvas().style.cursor = '';
  $('cancel-pick').hidden = true;
  $('toast').hidden = true;
}

function startPicking(draft) {
  pickDraft = draft;
  dialog.close();
  popup?.remove();
  map.getCanvas().style.cursor = 'crosshair';
  $('cancel-pick').hidden = false;
  $('cancel-pick').textContent = 'Cancel pin placement';
  toast('Tap or click the map to place the pin.', true);
  document.querySelector('.map-frame').scrollIntoView({ block: 'start' });
}

function startDragging(stop) {
  dialog.close();
  if (activeDay !== stop.day) setDay(stop.day);
  query = $('search').value = '';
  activeCategory = $('category').value = 'all';
  dragId = stop.id;
  render();
  $('cancel-pick').hidden = false;
  $('cancel-pick').textContent = 'Cancel pin move';
  toast('Drag the highlighted pin to move it.', true);
  document.querySelector('.map-frame').scrollIntoView({ block: 'start' });
  travelCamera({ center: [stop.lng, stop.lat], zoom: Math.max(14, map.getZoom()) });
}

let lastGeocodeAt = 0;

function openEditor(draft) {
  const isEdit = draft && trip.stops.some(({ id }) => id === draft.id);
  const body = openDialog(isEdit ? 'Edit stop' : 'Add a stop');
  const form = element('form', 'editor');
  form.innerHTML = `
    <label class="full">Stop name<input name="name" maxlength="120" required placeholder="e.g. A coffee shop in Kyoto"></label>
    <label>Day<select name="day"></select></label>
    <label>Category<select name="category"></select></label>
    <label>Time<input name="time" maxlength="80" placeholder="e.g. 9:30 AM"></label>
    <label class="inline-check"><input type="checkbox" name="book"> Book in advance</label>
    <label class="full">Website<input name="website" type="url" maxlength="1000" placeholder="https://…"></label>
    <label class="full">Notes<textarea name="notes" maxlength="1500" rows="2" placeholder="What makes this stop special?"></textarea></label>
    <fieldset class="full location"><legend>Map pin <small>Optional</small></legend>
      <div class="address"><input aria-label="Search for a place in Japan" placeholder="Search a place or address in Japan"><button type="button" class="button">Search</button></div>
      <div id="geocode-results" aria-live="polite"></div>
      <div class="coords"><label>Latitude<input name="lat" type="number" min="-85" max="85" step="any"></label>
      <label>Longitude<input name="lng" type="number" min="-180" max="180" step="any"></label>
      <button class="button" type="button" id="pick-map" data-icon="map-pin">Use map</button></div>
    </fieldset>
    <div class="editor-actions full"><div id="edit-tools"></div><button type="submit" class="button primary">${icon('check')} Save stop</button></div>`;
  body.append(form);
  const fields = form.elements;
  fields.day.replaceChildren(...optionList(days.map((day) => [day.id, day.dow ? `Dec ${day.id} · ${day.name}` : day.name])));
  fields.category.replaceChildren(...optionList(Object.entries(categories).map(([key, [name]]) => [key, name])));
  for (const name of ['name', 'time', 'notes', 'website', 'lat', 'lng']) fields.namedItem(name).value = draft?.[name] ?? '';
  fields.day.value = draft?.day ?? (activeDay === 'all' ? '24' : activeDay);
  fields.category.value = draft?.category ?? 'sight';
  fields.book.checked = draft?.book ?? false;
  const id = draft?.id ?? (crypto.randomUUID?.() ?? `stop-${Date.now()}-${Math.random().toString(36).slice(2)}`);
  function readForm() {
    return { id, name: fields.namedItem('name').value.trim(), time: fields.time.value.trim(), day: fields.day.value,
      category: fields.category.value, notes: fields.notes.value.trim(), website: fields.website.value.trim(),
      lat: Number.isFinite(fields.lat.valueAsNumber) ? fields.lat.valueAsNumber : null,
      lng: Number.isFinite(fields.lng.valueAsNumber) ? fields.lng.valueAsNumber : null, book: fields.book.checked };
  }
  const pick = $('pick-map');
  pick.insertAdjacentHTML('afterbegin', icon('map-pin'));
  pick.disabled = !mapReady;
  pick.addEventListener('click', () => startPicking(readForm()));
  const [address, lookup] = form.querySelector('.address').children;
  async function geocode() {
    const results = $('geocode-results');
    const term = address.value.trim();
    if (term.length < 3) { results.textContent = 'Enter at least three characters.'; return; }
    if (Date.now() - lastGeocodeAt < 1100) return;
    lastGeocodeAt = Date.now();
    lookup.disabled = true;
    results.textContent = 'Searching OpenStreetMap…';
    try {
      const params = new URLSearchParams({ q: term, format: 'jsonv2', limit: 4, countrycodes: 'jp', 'accept-language': 'en,ja' });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, { signal: AbortSignal.timeout(10000) });
      if (!response.ok) throw new Error('Search unavailable.');
      const matches = await response.json();
      results.replaceChildren(...matches.map((match) => {
        const action = button(match.display_name, 'map-pin', 'result');
        action.addEventListener('click', () => {
          fields.lat.value = Number(match.lat).toFixed(6);
          fields.lng.value = Number(match.lon).toFixed(6);
          if (!fields.namedItem('name').value.trim()) fields.namedItem('name').value = (match.name || term).slice(0, 120);
          results.textContent = 'Pin selected · © OpenStreetMap contributors';
        });
        return action;
      }));
      if (matches.length) results.append(element('small', '', '© OpenStreetMap contributors'));
      else results.textContent = 'No results. Try another spelling or place the pin on the map.';
    } catch {
      results.textContent = 'Address search is unavailable. Use the map or enter coordinates instead.';
    } finally {
      lookup.disabled = false;
    }
  }
  lookup.addEventListener('click', geocode);
  address.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') { event.preventDefault(); geocode(); }
  });
  if (isEdit) {
    const remove = button('Delete', 'trash-2', 'text-button danger');
    remove.addEventListener('click', () => confirmAction('Delete this stop?', draft.name, 'Delete stop', () => {
      trip.stops = trip.stops.filter((item) => item.id !== draft.id);
      dialog.close();
      if (persist()) toast('Stop deleted.');
      render();
    }));
    $('edit-tools').append(remove);
    if (pinned(draft) && mapReady) {
      const drag = button('Drag pin', 'move', 'text-button');
      drag.addEventListener('click', () => startDragging(trip.stops.find((stop) => stop.id === draft.id)));
      $('edit-tools').append(drag);
    }
  }
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const stop = readForm();
    if (!stop.name) { toast('Enter a stop name.'); return; }
    if (stop.website && !safeUrl(stop.website)) { toast('Use a website beginning with https:// or http://.'); return; }
    if ((stop.lat === null) !== (stop.lng === null)) { toast('Enter both coordinates, or leave both blank.'); return; }
    try {
      trip = validate({ ...trip, stops: isEdit ? trip.stops.map((item) => item.id === id ? stop : item) : [...trip.stops, stop] });
    } catch (error) { toast(error.message); return; }
    dialog.close();
    if (persist()) toast(isEdit ? 'Stop updated.' : 'Stop added.');
    setDay(stop.day);
    if (pinned(stop)) selectStop(stop);
  });
}

function confirmAction(title, description, label, action) {
  const body = openDialog(title);
  const controls = element('div', 'dialog-actions');
  const cancel = button('Cancel');
  cancel.addEventListener('click', () => dialog.close());
  const confirm = button(label, '', 'button primary');
  confirm.addEventListener('click', action);
  controls.append(cancel, confirm);
  body.append(element('p', 'dialog-copy', description), controls);
}

function loadTrip(replacement, message) {
  trip = replacement;
  dialog.close();
  if (persist()) toast(message);
  setDay('24');
}

function offerSharedTrip() {
  if (!fragment) return;
  history.replaceState(null, '', location.pathname + location.search);
  try {
    const shared = decode(fragment);
    confirmAction('Open a shared itinerary?', 'This snapshot will replace the itinerary and checklists saved on this device. Cancel to keep your current trip.', 'Open snapshot', () => loadTrip(shared, 'Shared itinerary opened.'));
  } catch {
    toast('This share link is invalid. Your trip was not changed.');
  }
}

function openShare() {
  const url = new URL(location.href);
  url.hash = `trip=${encode(trip)}`;
  const body = openDialog('Share this trip');
  const link = element('input', 'share-input');
  link.setAttribute('aria-label', 'Share link');
  link.readOnly = true;
  link.value = url.href;
  const copy = button('Copy link', 'copy', 'button primary');
  copy.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(url.href);
      toast('Share link copied.');
    } catch {
      link.focus();
      link.select();
      toast('Select and copy the link.');
    }
  });
  body.append(element('p', 'dialog-copy', 'Anyone with this link can open a copy of your current itinerary, notes, and checklists. Edits do not sync between devices.'), link, copy);
}

function openChecklists() {
  const body = openDialog('Trip checklists');
  for (const list of lists) {
    const section = element('section', 'checklist');
    const header = element('h3', '', list.title);
    header.insertAdjacentHTML('afterbegin', icon(list.icon));
    const count = element('span', 'check-count');
    const updateCount = () => { count.textContent = `${list.items.filter((_, i) => trip.checked[`${list.id}-${i}`]).length} / ${list.items.length}`; };
    header.append(count);
    section.append(header);
    list.items.forEach((item, index) => {
      const key = `${list.id}-${index}`;
      const label = element('label', 'check-item');
      const box = element('input');
      box.type = 'checkbox';
      box.checked = trip.checked[key] === true;
      box.addEventListener('change', () => {
        if (box.checked) trip.checked[key] = true;
        else delete trip.checked[key];
        persist();
        updateCount();
      });
      label.append(box, element('span', '', item));
      section.append(label);
    });
    updateCount();
    body.append(section);
  }
}

function openManage() {
  const body = openDialog('Manage your trip');
  const exportTrip = button('Export JSON', 'download');
  exportTrip.addEventListener('click', () => {
    const href = URL.createObjectURL(new Blob([JSON.stringify(trip, null, 2)], { type: 'application/json' }));
    const link = element('a');
    link.href = href;
    link.download = 'japan-atlas-itinerary.json';
    link.click();
    setTimeout(() => URL.revokeObjectURL(href), 1000);
  });
  const load = button('Import JSON', 'upload');
  load.addEventListener('click', () => $('import-file').click());
  const reset = button('Reset to original itinerary', 'rotate-ccw', 'button danger');
  reset.addEventListener('click', () => confirmAction('Reset to the original?', 'This will replace all stops and clear checklist progress on this device. Export first if you want to keep a copy.', 'Reset itinerary', () => loadTrip(original(), 'Original itinerary restored.')));
  const actions = element('div', 'manage-actions');
  actions.append(exportTrip, load, reset);
  body.append(element('p', 'dialog-copy', 'Your changes are saved in this browser. Export a backup or import a saved copy.'), actions);
}

document.querySelectorAll('[data-icon]').forEach((node) => node.insertAdjacentHTML('afterbegin', icon(node.dataset.icon)));
$('category').replaceChildren(...optionList([['all', 'All categories'], ...Object.entries(categories).map(([key, [name]]) => [key, name])]));
$('category').addEventListener('change', (event) => { activeCategory = event.target.value; render(); });
$('search').addEventListener('input', (event) => { query = event.target.value.trim().toLocaleLowerCase(); render(); });
$('add').addEventListener('click', () => openEditor());
$('checklists').addEventListener('click', openChecklists);
$('share').addEventListener('click', openShare);
$('manage').addEventListener('click', openManage);
$('fit').addEventListener('click', () => { initialZoomAdjusted = true; fitVisible(); });
$('dimension').addEventListener('click', (event) => {
  if (!map) return;
  is3D = !is3D;
  event.currentTarget.textContent = is3D ? '3D' : '2D';
  event.currentTarget.setAttribute('aria-pressed', String(is3D));
  travelCamera({ pitch: is3D && !globeView ? 48 : 0, bearing: is3D ? -19 : 0 });
});
$('globe').addEventListener('click', () => {
  if (!map) return;
  initialZoomAdjusted = true;
  if (globeView) { fitVisible(); return; }
  globeView = true;
  $('globe').setAttribute('aria-pressed', 'true');
  popup?.remove();
  travelCamera({ center: [138, 34], zoom: 2.1, pitch: 0, bearing: 0 });
});
$('route').addEventListener('click', (event) => {
  if (activeDay === 'all') { toast('Choose a day to connect its stops.'); return; }
  showRoute = !showRoute;
  event.currentTarget.setAttribute('aria-pressed', String(showRoute));
  drawRoute();
  if (showRoute) toast('Pins connected in itinerary order, not by roads.');
});
$('cancel-pick').addEventListener('click', () => {
  if (pickDraft) { const draft = pickDraft; stopPicking(); openEditor(draft); }
  if (dragId) { dragId = null; stopPicking(); render(); }
});
$('import-file').addEventListener('change', async (event) => {
  const file = event.target.files[0];
  event.target.value = '';
  if (!file) return;
  try {
    if (file.size > 2_000_000) throw new Error('The file is too large.');
    const next = validate(JSON.parse(await file.text()));
    confirmAction('Replace this itinerary?', 'The imported file will replace the stops and checklists on this device.', 'Import itinerary', () => loadTrip(next, 'Itinerary imported.'));
  } catch {
    toast('Could not import that file. Use a valid Japan Atlas JSON export.');
  }
});

paintTabs();
render();
initMap();
offerSharedTrip();
