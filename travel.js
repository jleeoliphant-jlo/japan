import { seed } from './itinerary.js';
import { pinned } from './storage.js';

const radians = (degrees) => degrees * Math.PI / 180;
export function distanceKm(from, to) {
  const a = Math.sin(radians(to.lat - from.lat) / 2) ** 2
    + Math.cos(radians(from.lat)) * Math.cos(radians(to.lat)) * Math.sin(radians(to.lng - from.lng) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(Math.min(1, a)));
}

const timetable = {
  '23-1/23-2': ['Narita Express (N’EX)', 60, 'Direct to Tokyo Station. Keisei Skyliner to Ueno plus JR is an alternative.', 'https://www.jreast.co.jp/multi/en/nex/'],
  '23-2/23-3': ['JR Yamanote Line', 27, 'Tokyo Station to Shibuya Station.'],
  '25-4/25-5': ['Tokyo Metro Ginza Line', 32, 'Walk to Tawaramachi, then ride toward Ginza.'],
  '25-7/25-8': ['Tokyo Metro Hibiya Line', 23, 'Ginza to Naka-meguro.'],
  '26-1/26-2': ['Tokaido Shinkansen', 135, 'Nozomi from Tokyo to Kyoto; reserve ahead for the holidays.', 'https://smart-ex.jp/en/'],
  '26-2/26-3': ['JR Nara Line + Keihan Main Line', 27, 'Transfer at Tofukuji for Gion-Shijo; Kyoto City Bus is another option.'],
  '26-5/26-6': ['Tozai Subway + Randen', 53, 'Sanjō Keihan → Uzumasa Tenjingawa. Walk to Randen-Tenjingawa and transfer at Katabiranotsuji for Arashiyama.'],
  '26-8/26-9': ['Hankyu Arashiyama & Kyoto lines', 48, 'Hankyu Arashiyama → Katsura → Kyoto-kawaramachi; walk across the Kamo River.'],
  '27-1/27-2': ['Keihan Main Line', 35, 'Fushimi-inari to Kiyomizu-gojo, then walk uphill to the temple.'],
  '28-1/28-2': ['JR Special Rapid + Osaka Loop Line', 56, 'Kyoto → Osaka on JR Kyoto Line, then Osaka Loop Line to Osakajokoen.', 'https://www.westjr.co.jp/global/en/'],
  '28-1/28-3': ['Kintetsu Kyoto + Nara lines', 60, 'Travel from Kyoto Station to Kintetsu-Nara, then walk to the park. Some trains require a transfer.'],
  '28-2/28-3': ['Osaka Loop Line + JR Yamatoji Line', 79, 'Optional detour, not the original plan: choose Nara instead of Osaka Castle if short on time.'],
  '28-2/28-4': ['Osaka Metro Chuo + Midosuji lines', 30, 'Walk to Morinomiya, then change at Hommachi for Namba.'],
  '28-3/28-4': ['Kintetsu Nara Line', 53, 'Kintetsu-Nara to Osaka-Namba.'],
  '28-14/28-15': ['JR Osaka Loop Line', 30, 'Tennoji to Osaka Station.'],
  '28-15/28-16': ['JR Kyoto Line Special Rapid', 30, 'Osaka to Kyoto. Hankyu or Keihan may suit hotels near their stations.', 'https://www.westjr.co.jp/global/en/'],
  '29-2/29-3': ['Tokaido Shinkansen + JR transfer', 160, 'Nozomi Kyoto → Tokyo, then local rail to the candidate hotel area. Reserve ahead.', 'https://smart-ex.jp/en/'],
  '29-8/29-9': ['Tokyo Metro Hibiya + Oedo lines', 29, 'Toranomon Hills → Roppongi, then Toei Oedo Line for Shinjuku.'],
  '30-2/30-3': ['Narita Express (N’EX)', 60, 'Direct from Tokyo Station. Check the terminal on your ticket.', 'https://www.jreast.co.jp/multi/en/nex/'],
};
const busJoins = new Set(['26-2/26-3', '26-5/26-6', '26-8/26-9', '27-1/27-2']);
const seedById = new Map(seed.map((stop) => [stop.id, stop]));
const closeToOriginal = (stop) => {
  const original = seedById.get(stop.id);
  return original && original.day === stop.day && pinned(original)
    && distanceKm(stop, original) < (original.category === 'transport' ? 0.55 : 0.35);
};

export function directionsUrl(from, to, travelmode) {
  const p = new URLSearchParams({
    api: '1', origin: `${from.lat},${from.lng}`, destination: `${to.lat},${to.lng}`, travelmode,
  });
  return `https://www.google.com/maps/dir/?${p}`;
}

export function uberUrl(from, to) {
  const p = new URLSearchParams({
    action: 'setPickup',
    'pickup[latitude]': from.lat, 'pickup[longitude]': from.lng,
    'dropoff[latitude]': to.lat, 'dropoff[longitude]': to.lng,
    'dropoff[nickname]': to.name,
  });
  return `https://m.uber.com/ul/?${p}`;
}

export const goUrl = 'https://go.goinc.jp/';
const option = (kind, name, minutes, mode, detail, extra = {}) => ({ kind, name, minutes, mode, detail, ...extra });

export function planLeg(from, to) {
  const key = `${from.id}/${to.id}`;
  if (!pinned(from) || !pinned(to)) return { from, to, key, km: null, options: [] };
  const km = distanceKm(from, to);
  const known = closeToOriginal(from) && closeToOriginal(to);
  const service = known && timetable[key];
  const roadKm = km * (km < 20 ? 1.32 : 1.22);
  const walk = option('walk', 'Walk', Math.max(1, Math.ceil(km * 1.24 / 4.5 * 60)), 'walking', 'Approximate on-foot time.');
  const train = service
    ? option('train', service[0], service[1], 'transit', service[2], { website: service[3] })
    : option('train', km >= 80 ? 'Train / intercity rail' : 'Train / subway', Math.round(12 + km * (km >= 80 ? 0.55 : 2.15)), 'transit', 'Check for nearby stations, service hours, and transfers.');
  const taxi = option('taxi', km >= 80 ? 'Car / private transfer' : 'Taxi / rideshare',
    Math.round(6 + roadKm * (km < 20 ? 2.45 : 0.95)), 'driving',
    km >= 80 ? 'Compare rental or private transfer rates; tolls may apply.' : 'Indicative daytime meter fare; traffic, region and surcharges can change it.',
    { fare: km >= 80 ? undefined : 100 * Math.ceil(500 / 100 + Math.max(0, roadKm - 1) / 0.23) });
  const options = !service && km < 1.2 ? [walk, taxi, ...(km >= 0.65 ? [train] : [])]
    : [train, taxi, ...(km <= 5 ? [walk] : [])];
  if (known && busJoins.has(key)) options.push(option('bus', 'Kyoto City Bus', Math.round(15 + roadKm * 4), 'transit', 'Check bus stops and departure times in Directions.'));
  return { from, to, key, km, options };
}

export function itineraryLegs(stops) {
  const legs = [];
  for (const day of new Set(stops.map(({ day }) => day))) {
    const daily = stops.filter((stop) => stop.day === day);
    let lastPin;
    daily.forEach((stop, i) => {
      const previous = daily[i - 1];
      if (previous) legs.push(planLeg(previous, stop));
      if (pinned(stop)) {
        if (lastPin && previous !== lastPin) legs.push({ ...planLeg(lastPin, stop), skipsUnpinned: true });
        lastPin = stop;
      }
    });
  }
  return legs;
}

export function reorderStop(stops, id, direction) {
  const index = stops.findIndex((stop) => stop.id === id);
  if (index < 0 || ![-1, 1].includes(direction)) return stops;
  for (let i = index + direction; i >= 0 && i < stops.length; i += direction) {
    if (stops[i].day !== stops[index].day) continue;
    const next = [...stops];
    [next[i], next[index]] = [next[index], next[i]];
    return next;
  }
  return stops;
}
