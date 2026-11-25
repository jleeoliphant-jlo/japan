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

Deploy the contents of `dist/` to any static HTTPS host (for example, GitHub Pages or Netlify). Vite builds with a relative base, so the site can be served at a subpath. There is no backend or API key. The basemap uses OpenFreeMap/OpenStreetMap and WebGL; address search uses OpenStreetMap Nominatim. These services need an internet connection.

## Use the atlas

- Choose a date or bonus group, then search or filter the list. Tap a pin or a list entry to see its notes, booking flag, website (or a Maps search), and directions when pinned.
- Use **Add stop** to place a pin on the map, search an address, type coordinates, or save a plan without a pin. Open a stop and choose **Edit** to change, delete, or drag its pin.
- **Manage trip** exports and imports JSON or restores the original itinerary. Edits and checklist progress are saved in the current browser. **Share** copies a portable snapshot link, not a live collaborative session. Recipients can open a copy on the same hosted site.
- **Connect stops** draws straight segments in itinerary order; it is not navigation. Hotel pins represent candidate neighborhoods, and stops without a chosen venue are labeled as areas or plans. The Tokyo venue named “Record Room” is unconfirmed and is included without a pin. Double-check holiday hours, lighting dates, and reservations.
