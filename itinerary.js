export const days = [
  { id: '23', dow: 'Wed', name: 'Touchdown Tokyo', area: 'Tokyo', caption: 'Arrivals, the Narita Express, and a quiet first night.', color: '#e7b454' },
  { id: '24', dow: 'Thu', name: 'Harajuku to Shibuya', area: 'Tokyo', caption: 'Coffee, quiet shrine paths, vintage finds, and Christmas lights.', color: '#66d3d0' },
  { id: '25', dow: 'Fri', name: 'Christmas in Tokyo', area: 'Tokyo', caption: 'Asakusa markets, Ginza flagships, and cocktails after dark.', color: '#efd17e' },
  { id: '26', dow: 'Sat', name: 'On to Kyoto', area: 'Kyoto', caption: 'Ride the Shinkansen, then explore Arashiyama and Gion.', color: '#a6ce83' },
  { id: '27', dow: 'Sun', name: 'Old Japan', area: 'Kyoto', caption: 'Red gates, historic lanes, market bites, and a tea ceremony.', color: '#8cc3ef' },
  { id: '28', dow: 'Mon', name: 'Osaka food tour', area: 'Osaka', caption: 'Castle grounds, street food, neon, and an optional Nara detour.', color: '#f2ad71' },
  { id: '29', dow: 'Tue', name: 'Back to Tokyo', area: 'Tokyo', caption: 'Immersive art, tower views, and a Shinjuku night out.', color: '#d5ce86' },
  { id: '30', dow: 'Wed', name: 'Bye, Japan', area: 'Tokyo', caption: 'One last breakfast and snack haul before flying home.', color: '#8fd4af' },
  { id: 'ideas', name: 'Extra Tokyo ideas', area: 'Tokyo', caption: 'A few more stops if there’s time to spare.', color: '#b1d5a4' },
  { id: 'akane', name: 'Akane’s picks', area: 'Tokyo', caption: 'Favorite restaurants, cafés, and nights out.', color: '#b0c2e6' },
];

export const categories = {
  sight: ['Sights', 'landmark'],
  food: ['Food', 'utensils'],
  cafe: ['Cafés', 'coffee'],
  shopping: ['Shopping', 'shopping-bag'],
  nightlife: ['Nightlife', 'martini'],
  transport: ['Transit', 'train-front'],
  hotel: ['Hotels', 'bed-double'],
  note: ['Plans', 'list'],
};

const entries = {
  '23': `
Narita International Airport|transport|35.7732,140.3929|3:15 PM|https://www.narita-airport.jp/en/|Land from Newark. Outbound flight leaves EWR Dec 22 at 10:55 AM.
Narita Express → Tokyo Station|transport|35.68124,139.76713||https://www.jreast.co.jp/multi/en/nex/|Take the Narita Express into Tokyo.
Shibuya hotel area|hotel|35.65803,139.70164|~6:30 PM||Possible Tokyo base for Dec 23–26; no hotel chosen.
Ebisu hotel area|hotel|35.64669,139.71011|~6:30 PM||Alternate Tokyo base for Dec 23–26.
Ginza hotel area|hotel|35.67198,139.76408|~6:30 PM||Alternate Tokyo base for Dec 23–26.
First evening in Tokyo|note||||Stop at 7-Eleven for yen and Japanese snacks. Find ramen or an izakaya near the hotel; take a neighborhood walk if there’s energy, then get an early night.`,
  '24': `
Fuglen Tokyo|cafe|35.666618,139.692400|8:30 AM|https://fuglencoffee.jp/|Start in Tomigaya with Norwegian-roasted coffee.
Camelback Sandwich|cafe|35.665578,139.692228|9:00 AM|https://www.instagram.com/camelback_tokyo/|Try the famous Japanese egg sandos.
Yoyogi Park|sight|35.67163,139.69498|9:30 AM|https://www.tokyo-park.or.jp/park/yoyogi/|Walk through the neighborhood and along the park toward Meiji Jingu.
Meiji Jingu|sight|35.67484,139.69963|Morning|https://www.meijijingu.or.jp/en/|Visit one of Tokyo’s most important Shinto shrines and write a wish.
Harajuku|shopping|35.67167,139.70381|Late morning||Explore the neighborhood’s fashion and vintage shops.
Laforet Harajuku|shopping|35.66906,139.70516||https://www.laforet.ne.jp/en/|Multi-floor Japanese fashion, alternative styles, and emerging designers.
RAGTAG Harajuku|shopping|35.66693,139.70587||https://www.ragtag.jp/english/|Curated secondhand Japanese and international designers. Cat Street.
KICKS LAB. Harajuku|shopping|35.67036,139.70576||https://www.kickslab.com/|Limited-edition sneakers and streetwear.
Cat Street|shopping|35.66874,139.70673|Afternoon||Independent boutiques and vintage finds along the pedestrian street.
QOO Vintage|shopping|35.66589,139.70952||https://www.qoo-online.com/|Designer vintage in Jingumae.
Omotesando|shopping|35.66668,139.70898|Afternoon||Browse fashion stores along the avenue.
BEAMS Harajuku|shopping|35.67077,139.70563||https://www.beams.co.jp/shop/harajuku/|Japanese fashion flagship.
STUDIOUS WOMENS Omotesando|shopping|35.66991,139.70695||https://tokyobase.co.jp/shoplist/|Japanese designer select shop. The branch moved to 4-27-2 Jingumae in 2026.
Hysteric Glamour Shibuya|shopping|35.66442,139.70412||https://www.hystericglamour.jp/store/?country=JAPAN|Japanese streetwear at 6-23-2 Jingumae.
Omotesando Christmas illuminations|sight|35.66754,139.70838|After dark|https://omotesando.or.jp/|Christmas lights along the avenue. Check the 2026 dates before going.
CRAFTALE|food|35.647421,139.696507|Dinner*|https://www.craftale-tokyo.com/|Japanese–French tasting menu in Nakameguro; one of three dinner options.
Kaikaya by the Sea|food|35.65749,139.69503|Dinner*|https://www.kaikaya.com/|Lively Japanese seafood tasting menu; dinner option.
Ahiru Store|food|35.665805,139.692026|Dinner*||Casual neighborhood wine bar; dinner option. Check seating and reservation policy.`,
  '25': `
Breakfast|note||Morning||Grab breakfast before heading to Asakusa.
Nakamise Shopping Street|shopping|35.71285,139.79651|Morning|https://www.japan.travel/en/spot/1696/|Traditional shopping street leading to Sensō-ji.
Suzukien Asakusa|cafe|35.71680,139.79667||https://www.tocha.co.jp/|Choose your matcha gelato intensity.
Kappabashi Kitchen Town|shopping|35.71401,139.78821||https://www.kappabashi.or.jp/en/|Look for Japanese knives, ceramics, and sake cups.
Ginza|shopping|35.67198,139.76408|Afternoon|https://www.ginza.jp/en/|Designer and vintage stores, plus department-store food halls.
Onitsuka Tiger Ginza|shopping|35.67093,139.76189||https://www.onitsukatiger.com/jp/magazine/ginza-newstore_open/|Browse the flagship.
UNIQLO Ginza flagship|shopping|35.66984,139.76374||https://www.ginza.jp/en/landmark/9743|Flagship shopping.
Nakameguro|sight|35.64429,139.69907||https://www.gotokyo.org/en/destinations/southern-tokyo/nakameguro/index.html|Head toward Nakameguro and Daikanyama.
Massif|cafe|35.649701,139.687596||https://www.massif.tokyo/|Coffee and baked goods in Higashiyama, near Ikejiri-Ōhashi.
Meguro River|sight|35.64680,139.69830||https://www.gotokyo.org/en/spot/103/index.html|Walk along the river in Nakameguro.
Daikanyama T-Site|shopping|35.64926,139.69980||https://store.tsite.jp/daikanyama/|Bookstore, plus neighborhood sneaker stores, boutiques, and cafés.
Sushi Panchi|food|35.653655,139.735753|Dinner*|https://tabelog.com/en/tokyo/A1307/A130702/13260762/|Reservation-only omakase at 3-3-9 Azabu-Juban, 7F. Business-managed booking page.
Ginza / Azabu omakase|food|35.67166,139.76488|Dinner*||Choose an omakase in Ginza or Azabu. This pin marks Ginza, not a booked venue.
CRAFTALE|food|35.647421,139.696507|Dinner*|https://www.craftale-tokyo.com/|Christmas dinner alternative if not visited on Christmas Eve.
The SG Club|nightlife|35.66425,139.69924|Evening|https://sg-management.jp/en/establishments/sgclub/|Cocktail option after dinner.
A10|nightlife|35.647332,139.707351|Evening|https://a10club.jp/|Speakeasy behind coin lockers.
The Bellwood|nightlife|35.66310,139.69500|Evening|https://www.tablecheck.com/en/shops/thebellwood/reserve|Intimate cocktail bar.`,
  '26': `
Tokyo Station → Kyoto|transport|35.68124,139.76713|~9:00 AM*|https://smart-ex.jp/en/|Book the Tokaido Shinkansen.
Kyoto Station|transport|34.98585,135.75877|~11:30 AM|https://www.westjr.co.jp/global/en/|Arrive from Tokyo and drop off luggage at the hotel.
Gion hotel area|hotel|35.00288,135.77673|||Possible Kyoto base Dec 26–29; no hotel chosen.
Shijō hotel area|hotel|35.00367,135.75965|||Alternate Kyoto base Dec 26–29.
Sanjō hotel area|hotel|35.00906,135.77264|||Alternate Kyoto base Dec 26–29.
Tenryū-ji Temple|sight|35.01592,135.67378||https://www.tenryuji.com/en/|Explore the temple and gardens in Arashiyama.
Arashiyama Bamboo Grove|sight|35.01719,135.67133||https://www.japan.travel/en/destinations/kansai/kyoto/sagano-and-arashi-yama-area/|Walk through the bamboo grove; stop for matcha and mochi.
Togetsukyō Bridge & Katsura River|sight|35.01276,135.67767||https://www.japan.travel/en/destinations/kansai/kyoto/sagano-and-arashi-yama-area/|Walk along the river and across the bridge.
Gion|sight|35.00312,135.77573|Evening|https://www.japan.travel/en/destinations/kansai/kyoto/gion-and-higashiyama/|Explore Gion and the surrounding streets.
Kaiseki dinner in Gion|food|35.00238,135.77577|6:30 PM*||Choose a traditional Japanese kaiseki restaurant in Gion.
Kamo River|sight|35.00577,135.77146|Evening||Take an after-dinner riverside walk.
Pontochō Alley|nightlife|35.00606,135.77054|Evening||Drinks in the lantern-lit alley.`,
  '27': `
Fushimi Inari Taisha|sight|34.96714,135.77267|~8:00 AM|https://inari.jp/en/|Start early for the red torii gates and an optional mountain hike.
Kiyomizu-dera|sight|34.99486,135.78468|Morning|https://www.kiyomizudera.or.jp/en/|Hillside temple overlooking Kyoto.
Sannenzaka|sight|34.99631,135.78035|Morning||Historic lanes and Japanese sweets.
Ninenzaka|sight|34.99774,135.78025|Morning||Walk the traditional stone street; stop for matcha and mochi.
Nishiki Market|food|35.00502,135.76497|Afternoon|https://www.kyoto-nishiki.or.jp/en/|Lunch and snacks; shop for ceramics, chopsticks, and souvenirs nearby.
Traditional tea ceremony|sight|34.997663,135.774008|Afternoon*|https://mai-ko.com/tour/kimono-tea-ceremony-gion-kiyomizu-at-the-registered-cultural-property/|Try a tea ceremony in a traditional townhouse. Pin is a suggested venue: MAIKOYA Gion Kiyomizu.
Yasaka Shrine|sight|35.00366,135.77854|Afternoon|https://www.yasaka-jinja.or.jp/en/|Shrine at the eastern end of Shijō Street.
Gion & Shirakawa|sight|35.00584,135.77391|Afternoon / evening||Canal-side historic lanes, Japanese cold brew, and an evening stroll.
Tofu, soba or udon in Kyoto|note||Dinner||Choose a traditional Kyoto tofu meal or soba/udon.
Katsukura Sanjō|food|35.00876,135.76823|Dinner|https://www.katsukura.jp/en/|Tonkatsu dinner option at the Sanjō main shop.
Gion cocktail or whiskey bar|nightlife|35.00415,135.77419|Evening||Find a cozy place for a nightcap; no venue selected.`,
  '28': `
Kyoto Station → Osaka|transport|34.98585,135.75877|Morning|https://www.westjr.co.jp/global/en/|About 30 minutes station to station; train back to Kyoto in the evening.
Osaka Castle & Park|sight|34.68731,135.52620|Morning|https://www.osakacastle.net/|Explore the keep and surrounding park. Skip if choosing Nara.
Nara Park|sight|34.68505,135.84301|Optional AM|https://www.visitnara.jp/venues/A00505/|Alternative morning with the deer, then continue to Osaka for the afternoon food tour.
Namba|sight|34.66410,135.50134||https://osaka-info.jp/en/|Head toward Namba for the food tour.
Kuromon Market|food|34.66542,135.50624|Afternoon|https://kuromon.com/en/|Market snacking and a jumping-off point for takoyaki, kushikatsu, and fluffy pancakes.
Ajinoya Honten|food|34.66764,135.50062|Afternoon|https://ajinoya-okonomiyaki.com/|Osaka-style okonomiyaki.
Rikuro’s Namba|food|34.66637,135.50142|Afternoon|https://www.rikuro.co.jp/|Pick up fluffy Japanese cheesecake.
Shinsaibashi-suji|shopping|34.67361,135.50147|Afternoon|https://www.shinsaibashi.or.jp/|Covered shopping arcade.
Amerikamura|shopping|34.67223,135.49853|Afternoon|https://osaka-info.jp/en/|Neighborhood vintage stores and streetwear.
Hōzenji Yokochō|sight|34.66831,135.50218|Afternoon||Take a detour down the old stone alley.
Dōtonbori|sight|34.66874,135.50131|After dark|https://www.dotonbori.or.jp/en/|Neon canal-side stroll, izakaya, and drinks.
Glico Running Man|sight|34.66900,135.50108|Evening||Photo from the Ebisu Bridge.
Don Quijote Dōtonbori|shopping|34.66906,135.50338|Evening|https://www.donki.com/en/|The giant store with the Ferris wheel.
Harukas 300|sight|34.64618,135.51394|Optional PM|https://www.abenoharukas-300.jp/en/|Optional observation deck in Abeno.
Osaka Station → Kyoto|transport|34.70248,135.49595|Evening|https://www.westjr.co.jp/global/en/|Board the JR Kyoto Line Special Rapid for Kyoto.
Kyoto Station (return)|transport|34.98585,135.75877|Evening|https://www.westjr.co.jp/global/en/|Arrive back in Kyoto after the Osaka food tour.`,
  '29': `
Breakfast in Kyoto|note||Morning||Get breakfast and coffee before the train.
Kyoto Station → Tokyo|transport|34.98585,135.75877|~9:30 AM*|https://smart-ex.jp/en/|Book the return Shinkansen.
Tokyo hotel area|hotel|35.65803,139.70164|||Dec 29–30; drop off luggage. Shibuya pin is a placeholder, not a chosen hotel.
Azabudai Hills|food|35.66042,139.74211|Lunch|https://www.azabudai-hills.com/en/|Lunch and exploring around Azabudai Hills.
teamLab Borderless|sight|35.66042,139.74153|~3:00 PM*|https://www.teamlab.art/e/tokyo/|Immersive digital art at Azabudai Hills; not teamLab Planets.
Tokyo Tower|sight|35.65858,139.74543|Afternoon|https://www.tokyotower.co.jp/en/|City views from the iconic tower.
Roppongi|sight|35.66280,139.73155|Afternoon|https://www.gotokyo.org/en/destinations/southern-tokyo/roppongi/index.html|Explore between Azabudai and Roppongi.
The Tokyo EDITION Lobby Bar|nightlife|35.66610,139.74375|Evening|https://www.marriott.com/en-us/hotels/tyoet-the-tokyo-edition-toranomon/dining/|Cocktails and Tokyo Tower views at the Toranomon hotel.
Shinjuku|sight|35.69092,139.70017|Evening||Head to Shinjuku for the rest of the night.
Omoide Yokochō|food|35.69305,139.69996|Evening|https://en.shinjuku-omoide.com/|Yakitori in Memory Lane.
Shinjuku 3D Cat Billboard|sight|35.69213,139.70078|Evening|https://g3dc.xspace.tokyo/|Look up at Cross Shinjuku Vision outside the station’s east exit.
Bar Benfiddich|nightlife|35.689482,139.696612|Evening*|https://benfiddich.tokyo/|Bespoke cocktails. Book ahead.
Late-night ramen|note||Late evening||Find a bowl of ramen near the hotel or in Shinjuku.`,
  '30': `
Last morning in Tokyo|note||Morning||Sleep in, have a traditional Japanese breakfast, shop near the hotel, and pick up flight snacks.
Narita Express from Tokyo Station|transport|35.68124,139.76713|~12:00 PM|https://www.jreast.co.jp/multi/en/nex/|Head to Narita around noon.
Narita International Airport|transport|35.7732,140.3929|5:15 PM|https://www.narita-airport.jp/en/|Fly home to Newark; scheduled arrival 3:55 PM local time.`,
  ideas: `
Shimokitazawa|shopping|35.66156,139.66807||https://www.gotokyo.org/en/destinations/western-tokyo/shimokitazawa/index.html|Vintage shopping and cafés.
Shiro-Hige’s Cream Puff Factory|cafe|35.65896,139.66273||https://www.shiro-hige.net/|Totoro cream puffs in Setagaya-Daita.
Gotokuji Temple|sight|35.64862,139.64792||https://gotokuji.jp/en/|Temple filled with lucky cats.
Shinjuku Gyoen National Garden|sight|35.68517,139.71005||https://www.env.go.jp/garden/shinjukugyoen/english/|Landscaped gardens in central Tokyo.
Shinjuku Batting Center|sight|35.69650,139.70404||https://metro-net.co.jp/business/shinjuku-battingcenter/|Suggested batting cages in Kabukichō.
Imperial Palace|sight|35.68516,139.75280||https://sankan.kunaicho.go.jp/english/guide/koukyo.html|Check public access and tour options.
Tsukiji Outer Market|food|35.66539,139.77069||https://www.tsukiji.or.jp/english/|Street food and seafood vendors.
Toyosu Market|food|35.64478,139.78120||https://www.english.metro.tokyo.lg.jp/w/016-101-003992|Wholesale market and sushi counters.
Café Reissue|cafe|35.671176,139.707958||https://www.reissue.co.jp/latteart/|3D cat latte art.
UNIQLO custom embroidery|shopping|35.66984,139.76374||https://faq.uniqlo.com/articles/FAQ/100005886/|Check Ginza RE.UNIQLO Studio for embroidered bags and turnaround time.
Custom Onitsuka Tiger sneakers|shopping|35.67093,139.76189||https://www.onitsukatiger.com/jp/magazine/ginza-newstore_open/|Ask the Ginza store about customization before visiting.
Kabuki-za Theatre|sight|35.66947,139.76798||https://www.kabukiweb.net/theatres/kabukiza/|Traditional kabuki performances. Check schedule and ticket availability.
Mori Art Museum|sight|35.66046,139.72923||https://www.mori.art.museum/en/|Contemporary art at Roppongi Hills.`,
  akane: `
Sushi Panchi|food|35.653655,139.735753|*|https://tabelog.com/en/tokyo/A1307/A130702/13260762/|Japanese · Reservation-only sushi omakase in Azabu-Juban.
Kaikaya by the Sea|food|35.65749,139.69503|*|https://www.kaikaya.com/|Japanese · Seafood in Shibuya.
Kirimugiya Jinroku|food|35.689158,139.711862||https://r.goope.jp/jinroku-gyoen/|Japanese · Udon in Shinjuku.
Unkai|food|35.66849,139.74170||https://anaintercontinental-tokyo.jp/en/dine/unkai-restaurant/|Japanese · Kaiseki at the ANA InterContinental Tokyo, Akasaka.
Sakura-tei|food|35.67102,139.70708||https://www.sakuratei.co.jp/en/|Japanese · Make your own okonomiyaki in Harajuku.
Bassanova|food|35.663596,139.660308||https://bassanova.base.shop/|Japanese · Green curry ramen in Hanegi, near Shimokitazawa.
CRAFTALE|food|35.647421,139.696507|*|https://www.craftale-tokyo.com/|Date night · Japanese–French in Nakameguro.
Ahiru Store|food|35.665805,139.692026|||Date night · Cozy Tomigaya wine bar.
Enrico|food|35.658603,139.692468||https://enrico.wine/|Date night · Italian wine shop and counter in Shōtō.
Flamingo|nightlife|35.66260,139.69710||https://www.udagawacafe.com/cafe-flamingo/|Date night · Shibuya café-bar.
Camelback Sandwich|cafe|35.665578,139.692228||https://www.instagram.com/camelback_tokyo/|Breakfast · Egg sandwiches near Yoyogi.
Crisscross|cafe|35.66332,139.71345||https://www.tysons.jp/crisscross/|Breakfast · Terrace café in Omotesando.
Massif|cafe|35.649701,139.687596||https://www.massif.tokyo/|Breakfast · Bakery and café near Ikejiri-Ōhashi.
Breakfast Club Tokyo|cafe|35.64930,139.69109||https://www.instagram.com/breakfastclubtokyo/|Breakfast · Diner in Higashiyama.
Pain de LASA|cafe|35.656205,139.654813||http://www.umegaoka.net/shouten/pain_de_lasa/|Breakfast · Bakery in Umegaoka, near Shimokitazawa.
The Bellwood|nightlife|35.66310,139.69500||https://www.tablecheck.com/en/shops/thebellwood/reserve|Intimate cocktails.
A10|nightlife|35.647332,139.707351||https://a10club.jp/|Speakeasy behind coin lockers.
The SG Club|nightlife|35.66425,139.69924||https://sg-management.jp/en/establishments/sgclub/|Award-winning cocktails.
SG Low|nightlife|35.66401,139.701448||https://sg-management.jp/en/establishments/sglow/|Highballs and izakaya food.
Bar Benfiddich|nightlife|35.689482,139.696612|*|https://benfiddich.tokyo/|Bespoke cocktails.
Record Room|nightlife||||Listening bar from the itinerary. Tokyo venue not confirmed; no pin assigned.
Music Bar Bounce|nightlife|35.65934,139.69601||https://www.instagram.com/musicbarbounce/|DJs and vinyl in Shibuya. 2F, 2-19-12 Dogenzaka.
SWIG|nightlife|35.660883,139.705717||https://www.instagram.com/swigtokyo/|Casual, social drinks.
WOMB|nightlife|35.65874,139.69548||https://www.womb.co.jp/en/|House and techno nightclub.
CÉ LA VI Tokyo|nightlife|35.65796,139.70038||https://www.celavi.com/en/tokyo/|Rooftop overlooking Shibuya.
ØL by Oslo Brewing Company|nightlife|35.66225,139.69541||https://www.oltokyo.jp/|Craft beer in Shibuya.
Watering Hole|nightlife|35.685174,139.703488||http://wateringhole.jp/|Craft beer near Yoyogi.`,
};

export const seed = Object.entries(entries).flatMap(([day, rows]) =>
  rows.trim().split('\n').map((row, i) => {
    const [name, category, coords, time, website, notes] = row.split('|');
    const [lat, lng] = coords ? coords.split(',').map(Number) : [null, null];
    return { id: `${day}-${i + 1}`, day, name, category, lat, lng, time: time.replace('*', ''), book: time.includes('*'), website, notes };
  }),
);

export const lists = [
  { id: 'travel', title: 'Before travel', icon: 'luggage', items: [
    'Pre-register on Visit Japan Web for immigration and customs QR codes',
    'Download a Japan eSIM (Airalo or equivalent)',
    'Turn off US SIM data roaming and disable cellular data switching',
    'Add Suica to Apple Wallet and bring physical credit cards as backup',
    'Download offline Google Maps and Google Translate Japanese',
    'Download GO or Uber for taxis',
    '⭐ Reserve the Shinkansen both ways: Tokyo → Kyoto and Kyoto → Tokyo',
  ] },
  { id: 'food', title: 'Food bucket list', icon: 'utensils', items: [
    'Traditional Japanese breakfast', 'Omakase', 'Kaiseki', 'Buddhist temple food', 'Japanese egg sandos',
    'Tonkatsu', 'Tsukemen', 'Ramen from vending machine restaurants', 'Takoyaki', 'Okonomiyaki', 'Kushikatsu',
    'Japanese curry', 'High-quality matcha', 'Mochi', 'Japanese cheesecake', 'Japanese strawberries',
    'Totoro cream puffs', 'Natto', '7-Eleven and FamilyMart snacks',
  ] },
];
