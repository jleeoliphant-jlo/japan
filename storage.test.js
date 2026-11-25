import test from 'node:test';
import assert from 'node:assert/strict';
import { categories, days, lists, seed } from './itinerary.js';
import { decode, encode, mapLink, original, pinned, safeUrl, validate } from './storage.js';

test('original itinerary covers every day and both bonus groups with uniquely identified stops', () => {
  const trip = validate(original());
  assert.equal(trip.stops.length, seed.length);
  assert.ok(trip.stops.filter(pinned).length > 100);
  assert.deepEqual(new Set(trip.stops.map((stop) => stop.day)), new Set(days.map((day) => day.id)));
  for (const stop of trip.stops) {
    assert.ok(Object.hasOwn(categories, stop.category));
    if (stop.category === 'note') assert.ok(stop.notes);
    if (pinned(stop)) {
      assert.ok(stop.lat >= 34 && stop.lat <= 36);
      assert.ok(stop.lng >= 135 && stop.lng <= 141);
    }
  }
  assert.deepEqual(lists.map((list) => list.items.length), [7, 19]);
});

test('share data round-trips added and edited stops, deletions, and checklist state', () => {
  const trip = original();
  const edited = { ...trip.stops[1], id: 'added', name: '京都 café 🌸', notes: 'Coffee & pastries' };
  trip.stops = [edited, ...trip.stops.slice(2)];
  trip.checked['food-0'] = true;
  assert.deepEqual(decode(encode(trip)), validate(trip));
  assert.throws(() => decode('not a snapshot'));
});

test('imports reject duplicate IDs and incomplete locations, and strip unsafe URLs', () => {
  const trip = original();
  trip.stops.push(trip.stops[0]);
  assert.throws(() => validate(trip), /invalid fields/);
  trip.stops.pop();
  trip.stops[0].lng = null;
  assert.throws(() => validate(trip), /invalid fields/);
  assert.equal(safeUrl('javascript:alert(1)'), '');
  trip.stops[0].lng = 140.3929;
  trip.stops[0].website = 'data:text/plain,ignored';
  assert.equal(validate(trip).stops[0].website, '');
});

test('directions use a pinned destination and unverified venues get a search link', () => {
  const trip = original();
  const airport = trip.stops[0];
  const recordRoom = trip.stops.find(({ name }) => name === 'Record Room');
  assert.match(mapLink(airport, true), /\/dir\/\?api=1&destination=35\.7732%2C140\.3929$/);
  assert.match(mapLink(recordRoom, true), /\/search\/\?api=1&query=Record%20Room%20Tokyo%20Japan$/);
});
