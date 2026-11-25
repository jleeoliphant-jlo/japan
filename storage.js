import LZString from 'lz-string';
import { categories, days, lists, seed } from './itinerary.js';

export const saveKey = 'japan-atlas-v1';
export const original = () => ({ version: 1, stops: structuredClone(seed), checked: {} });
export const pinned = (stop) => Number.isFinite(stop.lat) && Number.isFinite(stop.lng);

export function safeUrl(value) {
  try {
    const { href, protocol } = new URL(value);
    return ['http:', 'https:'].includes(protocol) ? href : '';
  } catch {
    return '';
  }
}

export function mapLink(stop, directions = false) {
  const day = days.find(({ id }) => id === stop.day);
  const query = encodeURIComponent(directions && pinned(stop)
    ? `${stop.lat},${stop.lng}`
    : `${stop.name} ${day?.area ?? ''} Japan`);
  return directions && pinned(stop)
    ? `https://www.google.com/maps/dir/?api=1&destination=${query}`
    : `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export function validate(data) {
  if (data?.version !== 1 || !Array.isArray(data.stops) || data.stops.length > 500) throw new Error('Invalid itinerary file.');
  const ids = new Set();
  const stops = data.stops.map((stop) => {
    if (!stop || typeof stop.id !== 'string' || !stop.id || stop.id.length > 100 || ids.has(stop.id)
      || !days.some(({ id }) => id === stop.day) || !Object.hasOwn(categories, stop.category)
      || typeof stop.name !== 'string' || !stop.name.trim() || stop.name.length > 120
      || !((stop.lat === null && stop.lng === null) || (pinned(stop) && Math.abs(stop.lat) <= 85 && Math.abs(stop.lng) <= 180))) {
      throw new Error('One or more stops have invalid fields.');
    }
    ids.add(stop.id);
    const str = (key, length) => typeof stop[key] === 'string' ? stop[key].slice(0, length) : '';
    return { id: stop.id, day: stop.day, category: stop.category, name: stop.name.trim(), lat: stop.lat, lng: stop.lng,
      time: str('time', 80), book: stop.book === true, website: safeUrl(str('website', 1000)), notes: str('notes', 1500) };
  });
  const checked = {};
  for (const list of lists) list.items.forEach((_, index) => {
    const key = `${list.id}-${index}`;
    if (data.checked?.[key] === true) checked[key] = true;
  });
  return { version: 1, stops, checked };
}

export function encode(data) {
  return LZString.compressToEncodedURIComponent(JSON.stringify(data));
}

export function decode(value) {
  return validate(JSON.parse(LZString.decompressFromEncodedURIComponent(value)));
}
