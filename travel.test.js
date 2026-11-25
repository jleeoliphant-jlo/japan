import test from 'node:test';
import assert from 'node:assert/strict';
import { original, pinned } from './storage.js';
import { directionsUrl, distanceKm, itineraryLegs, planLeg, reorderStop, uberUrl } from './travel.js';

const { stops } = original();
const get = (id) => stops.find((stop) => stop.id === id);
const leg = (from, to) => planLeg(get(from), get(to));

test('curated Japanese rail connections include both airport directions, Shinkansen and Osaka', () => {
  for (const [from, to, service] of [
    ['23-1', '23-2', /Narita Express/],
    ['26-1', '26-2', /Tokaido Shinkansen/],
    ['28-1', '28-2', /JR Special Rapid/],
    ['28-15', '28-16', /JR Kyoto Line Special Rapid/],
    ['29-2', '29-3', /Tokaido Shinkansen/],
    ['30-2', '30-3', /Narita Express/],
  ]) {
    const { options } = leg(from, to);
    assert.match(options[0].name, service);
    assert.equal(options[0].mode, 'transit');
  }
  assert.ok(leg('26-2', '26-3').options.some(({ kind }) => kind === 'bus'));
  assert.equal(planLeg(get('23-1'), { ...get('23-2'), lat: 35 }).options[0].name, 'Train / intercity rail');
});

test('distance and transport estimates distinguish a walk, city taxi, and intercity transfer', () => {
  assert.ok(Math.abs(distanceKm(get('23-1'), get('23-2')) - 57) < 2);
  const short = leg('24-1', '24-2');
  assert.equal(short.options[0].mode, 'walking');
  assert.equal(short.options.find(({ kind }) => kind === 'taxi').fare, 500);
  const intercity = leg('26-1', '26-2');
  assert.equal(intercity.options.find(({ kind }) => kind === 'taxi').fare, undefined);
});

test('creates legs for each day in order, with no invented directions for notes', () => {
  const legs = itineraryLegs(stops);
  assert.ok(legs.every(({ from, to }) => from.day === to.day));
  for (const day of new Set(stops.map(({ day }) => day))) {
    const points = stops.filter((stop) => stop.day === day && pinned(stop));
    for (let i = 1; i < points.length; i++) {
      assert.ok(legs.some(({ from, to, options }) => from.id === points[i - 1].id && to.id === points[i].id && options.length));
    }
  }
  assert.ok(legs.some(({ from, options }) => from.category === 'note' && !options.length));
});

test('reordering stays within a day and add/delete/reorder rebuild adjacent legs', () => {
  const day = stops.filter(({ day }) => day === '24').slice(0, 3);
  const other = get('25-1');
  assert.equal(reorderStop(day, day[0].id, -1), day);
  const updated = reorderStop([day[0], other, day[1], day[2]], day[1].id, -1);
  assert.deepEqual(updated, [day[1], other, day[0], day[2]]);
  const added = { ...day[0], id: 'new', lat: day[0].lat - 0.006 };
  assert.deepEqual(itineraryLegs([...updated.filter(({ id }) => id !== day[0].id), added]).map(({ key }) => key),
    [`${day[1].id}/${day[2].id}`, `${day[2].id}/new`]);
});

test('provider links contain both endpoints and the requested mode', () => {
  const [from, to] = [get('23-1'), get('23-2')];
  const transit = new URL(directionsUrl(from, to, 'transit')).searchParams;
  assert.equal(transit.get('origin'), `${from.lat},${from.lng}`);
  assert.equal(transit.get('destination'), `${to.lat},${to.lng}`);
  assert.equal(transit.get('travelmode'), 'transit');
  const uber = new URL(uberUrl(from, to)).searchParams;
  assert.equal(uber.get('pickup[latitude]'), String(from.lat));
  assert.equal(uber.get('dropoff[longitude]'), String(to.lng));
});
