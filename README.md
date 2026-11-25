# Japan Atlas

A mobile-friendly, interactive itinerary for Tokyo, Kyoto, and Osaka, December 23–30, 2026. It runs in a browser without an account or installation.

## Run locally

With Node 22.12+ or Node 24:

```sh
npm ci
npm test
npm run build
npm run preview
```

Deploy the contents of `dist/` to any static HTTPS host (for example, GitHub Pages or Netlify). Vite builds with a relative base, so the site can be served at a subpath. There is no backend or API key. Satellite 3D uses Esri World Imagery, AWS Open Data/Mapzen elevation, and OpenFreeMap/OpenStreetMap buildings and labels. Street Map uses OpenFreeMap, and addresses are searched with OpenStreetMap Nominatim. These services need an internet connection.

## Use the atlas

- Choose a date or bonus group, then search or filter the list. Use **Previous** and **Next** to step through the stops. Tap a numbered pin or a list entry to see its notes, booking flag, website (or a Maps search), and directions when pinned.
- Use **Add stop** to place a pin on the map, search an address, type coordinates, or save a plan without a pin. Open a stop and choose **Edit** to change, reorder, delete, or drag its pin. Connections recalculate when stops change.
- **Manage trip** exports and imports JSON or restores the original itinerary. Edits and checklist progress are saved in the current browser. **Share** copies a portable snapshot link, not a live collaborative session. Recipients can open a copy on the same hosted site.
- Open **Getting there** in the itinerary or tap a dashed line for travel options. Estimates are not live; follow Directions for actual routes and schedules. Nearby alternatives may include walking, bus, and taxi; GO opens its website and Uber opens a handoff with pickup and destination. Hotel pins represent candidate neighborhoods, and the Tokyo venue named “Record Room” remains unpinned. Double-check holiday hours, lighting dates, and reservations.
