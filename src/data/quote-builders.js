// Full quote builder data mirrored from Maud's rainbow-babka pages.
// 6 brands have working source data. Trekka is rebuilt from scratch
// because Maud's /trekka page is currently broken (404).
//
// Data shape per brand:
// {
//   slug: 'karavan',                  // URL slug
//   brandFamily: 'Kimberley',         // group/manufacturer
//   name: 'Kimberley Karavan',        // public-facing name
//   intro: '...',                     // page subtitle
//   variants: [                       // 1 or more model variants
//     { id, name, basePrice, included: [strings] }
//   ],
//   categories: [
//     {
//       id, title,
//       options: [
//         {
//           id,
//           label,
//           priceClassic: number | 'POA' | 'INCLUDED' | null,
//           priceVariant2: ... (per variant id, optional)
//           note: optional string
//         }
//       ]
//     }
//   ]
// }
//
// Price values:
// - number = dollar amount added when selected
// - 0 = free / no charge (still shows as "Included")
// - 'POA' = price on application (renders as POA, no dollar value)
// - null = not available for this variant
// - negative numbers = credit (e.g. -1000 for "$1,000 credit" when downgrading)

export const quoteBuilders = [
  // -------------------------------------------------------------------------
  // KIMBERLEY KARAVAN - ported from Bart's karavan.html (18 Jun 2026)
  // 2 variants (Classic + Eco-Suite). Ex-factory Ballina NSW.
  // Dealer delivery $3,500 (subject to fuel surcharge).
  // -------------------------------------------------------------------------
  {
    slug: 'karavan',
    brandFamily: 'Kimberley',
    name: 'Kimberley Karavan',
    intro: "Australia's first genuine expanding hybrid - forge your own path.",
    delivery: 3500,
    variants: [
      {
        id: 'classic',
        name: 'Karavan Classic',
        basePrice: 125885,
        included: [
          'Galvanised chassis + air suspension',
          'Hydraulic disc brakes + actuator lift',
          'McHitch off-road hitch',
          'Dual water system (70L + 120L)',
          'Kwik Awning 2.2x3.0m',
          '130L upright 12V fridge (inside)',
          'Galley kitchen (2-burner + griller)',
          'Diesel hot water system',
          'Inside shower',
          'SMART 48V Power Hub + 2000Wh battery',
          '240W Merlin NASA solar panels',
          'Foam mattress',
          'Bluetooth sound system',
          'Vegan leather seating',
        ],
      },
      {
        id: 'eco-suite',
        name: 'Karavan Eco-Suite',
        basePrice: 153935,
        included: [
          'Everything in Classic, plus:',
          'Air Suspension PLUS (compressor, tank, electronic fill, remote)',
          'Air kit & hoses',
          'Airbag monitor (in-vehicle)',
          'Turning drawbar extension',
          '2.5" Mono-tube shocks + remote reservoir & damping adjustor',
          'Remote greasing kit (Zerk fitting)',
          'KK Alloy Off-Road Wheels 17" AT Tyres',
          'Bedouin Extendable Awning (removable)',
          'Waterless composting toilet (up to 80 uses)',
          'Full shower stall + swing-away toilet',
          'Grey water tank 60L',
          'Offgrid water filter',
          'Smart Touch PLUS monitor',
          '5000Wh SMART 48V Battery',
          '480W Merlin NASA solar',
          'Surge protector',
          'Rooftop reverse cycle A/C',
          'Dual plate induction (built-in)',
          'Leather seating + vinyl floor + comfort trim pak',
        ],
      },
    ],
    categories: [
      {
        id: 'suspension',
        title: 'Suspension & Chassis',
        options: [
          { id: 'turning-drawbar', label: 'Revolutionary Turning Drawbar Extension', priceByVariant: { classic: 555, 'eco-suite': 0 } },
          { id: 'air-susp-plus', label: 'Air Suspension PLUS', note: 'Compressor, tank, electronic fill, remote.', priceByVariant: { classic: 2370, 'eco-suite': 0 } },
          { id: 'air-kit', label: 'Air Kit & Hoses', note: '3-in-1 gauge, blow gun, air chuck.', priceByVariant: { classic: 225, 'eco-suite': 0 } },
          { id: 'airbag-monitor', label: 'KK Airbag Monitor Sensors (in-vehicle app)', priceByVariant: { classic: 215, 'eco-suite': 0 } },
          { id: 'mono-shocks', label: '2.5" Mono-tube Shocks + Remote Reservoir + Damping Adjustor', priceByVariant: { classic: 1125, 'eco-suite': 0 } },
          { id: 'remote-greasing', label: 'Remote Zerk Fitting Greasing Points', priceByVariant: { classic: 260, 'eco-suite': 0 } },
          { id: 'mchitch', label: 'McHitch Off-Road Hitch (Standard hitch)', note: 'Choose this OR the DO35 below.', price: 0 },
          { id: 'do35-hitch', label: 'VC DO35 3500kg Off-Road Hitch', note: 'Choose this INSTEAD of the McHitch above.', price: 0 },
          { id: 'stone-deflector', label: 'Custom Stone Deflector (vehicle-to-Karavan barrier)', price: 895 },
          { id: 'reverse-camera', label: 'SMART Wireless WiFi Reverse Camera + side sensors + dashcam', price: 1245 },
        ],
      },
      {
        id: 'wheels',
        title: 'Wheels',
        options: [
          { id: 'wheel-steel16', label: '16" Steel Off-Road Wheels & AT Tyres', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 0, 'eco-suite': null } },
          { id: 'wheel-steel17', label: '17" Steel Wheels & AT Tyres', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 300, 'eco-suite': null } },
          { id: 'wheel-steel18', label: '18" Steel Wheels & AT Tyres', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 600, 'eco-suite': null } },
          { id: 'wheel-alloy16', label: '16" Alloy Wheels & AT Tyres', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 700, 'eco-suite': null } },
          { id: 'wheel-alloy17', label: '17" Alloy Wheels & AT Tyres', priceByVariant: { classic: 1000, 'eco-suite': 0 } },
          { id: 'wheel-alloy18', label: '18" Alloy Wheels & AT Tyres', priceByVariant: { classic: 1300, 'eco-suite': 300 } },
        ],
      },
      {
        id: 'water',
        title: 'Water',
        options: [
          { id: 'grey-tank', label: '60L Grey Water Tank', priceByVariant: { classic: 1060, 'eco-suite': 0 } },
          { id: 'water-filter', label: 'Offgrid Water Filter & Purification System', priceByVariant: { classic: 395, 'eco-suite': 0 } },
        ],
      },
      {
        id: 'awnings',
        title: 'Canvas & Awnings',
        options: [
          { id: 'kwik', label: 'Kwik Awning 2.2x3.0m with Valance & Zip', note: 'Standard. Removable if swapping awning type.', price: 0 },
          { id: 'remove-kwik', label: 'Remove Kwik Awning (credit)', price: -890 },
          { id: 'bedouin', label: 'Bedouin Extendable Awning', priceByVariant: { classic: 865, 'eco-suite': 0 } },
          { id: 'remove-bedouin', label: 'Remove Bedouin Awning (credit, Eco-Suite only)', naNote: 'Classic does not include Bedouin', priceByVariant: { classic: null, 'eco-suite': -865 } },
          { id: 'kwik-rear-wall', label: 'Kwik Awning Rear Wall', price: 1095 },
          { id: 'kwik-front-wall', label: 'Kwik Awning Front Wall with roll-up door', price: 1275 },
          { id: 'full-walls', label: 'Full Walls Kit', note: 'Draft skirt + front & rear walls.', price: 3120 },
          { id: 'bedroom-annex', label: 'Karavan Bedroom Annex', price: 1150 },
          { id: 'draft-skirt', label: 'Draft Skirt', price: 590 },
          { id: 'sailtrack-rhs', label: 'RHS Sail Track to Canopy', price: 190 },
          { id: 'rollout-awning', label: '3.2m Aftermarket Roll-Out Awning', requires: ['sailtrack-rhs'], depNote: 'Add Sail Track first', price: 920 },
          { id: 'fiamma-awning', label: '3.2m Fiamma F45 Wind-Out Awning', requires: ['remove-kwik'], depNote: 'Remove Kwik first', price: 1820 },
        ],
      },
      {
        id: 'comfort',
        title: 'Comfort & Heating',
        options: [
          { id: 'composting-toilet', label: 'Waterless Composting Toilet', note: 'Separates #1/#2, up to 80 uses.', priceByVariant: { classic: 2320, 'eco-suite': 0 } },
          { id: 'outside-shower', label: 'Outside Hot & Cold Shower (AUX water source)', price: 870 },
          { id: 'ensuite-curtain', label: 'Ensuite Curtain (divides living / ensuite)', price: 395 },
          { id: 'full-shower-stall', label: 'Full Size Shower Stall + Swing-Away Toilet', note: 'Requires composting toilet.', priceByVariant: { classic: 2210, 'eco-suite': 0 } },
          { id: 'bed-step-heater', label: 'Bed Step + Diesel Space Heater', note: 'Uses HWS.', priceByVariant: { classic: 1380, 'eco-suite': 0 } },
          { id: 'diesel-ducted', label: 'Diesel Air Heater Ducted 2kW', note: 'Eco-Suite price is net of $1,030 credit (replaces bed step heater).', priceByVariant: { classic: 2380, 'eco-suite': 1350 } },
          { id: 'rooftop-ac', label: 'Lightweight Rooftop Reverse Cycle A/C', priceByVariant: { classic: 2975, 'eco-suite': 0 } },
          { id: 'fan-12v', label: '12V Sirocco Fan with Timer', price: 295 },
          { id: 'fan-12v-2', label: 'Second 12V Sirocco Fan with Timer', price: 295 },
          { id: 'mattress-heater', label: 'Underbed Mattress Di-Electric Membrane Heater', priceByVariant: { classic: 410, 'eco-suite': 0 } },
          { id: 'magnetic-blinds', label: 'Magnetic Curtains', priceByVariant: { classic: 275, 'eco-suite': 0 } },
          { id: 'comfort-trim', label: 'Comfort Trim Pak (bolster cover + SS utensil covers)', priceByVariant: { classic: 430, 'eco-suite': 0 } },
          { id: 'innerspring', label: 'Upgrade to Innerspring Mattress (net upgrade)', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 120, 'eco-suite': null } },
          { id: 'airsoft', label: 'Queen AIRSOFT Mattress (Classic, net upgrade from foam)', naNote: 'Not on Eco-Suite', priceByVariant: { classic: 1080, 'eco-suite': null } },
          { id: 'airsoft-eco', label: 'Queen AIRSOFT Mattress (Eco-Suite, net upgrade from innerspring)', naNote: 'Classic uses the AIRSOFT option above', priceByVariant: { classic: null, 'eco-suite': 960 } },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'dual-induction', label: 'Smart RV Dual Plate Induction Cooktop (built-in)', priceByVariant: { classic: 1100, 'eco-suite': 0 } },
          { id: 'microwave', label: 'Microwave Oven (inside)', price: 435 },
          { id: 'wireless-charging', label: 'Wireless Benchtop Charging', priceByVariant: { classic: 240, 'eco-suite': 0 } },
          { id: 'wok-burner', label: 'Large Single WOK Burner with wind deflector', price: 565 },
          { id: 'kitchen-standard', label: 'Outside Kitchen: Double Burner + Grill (Standard)', note: 'Choose ONE outside kitchen option.', price: 0 },
          { id: 'weber-bbq', label: 'Weber Baby Q BBQ (replaces 2-burner)', note: 'Choose this INSTEAD of the Standard kitchen.', price: 445 },
          { id: 'e-galley', label: 'E-Galley Kitchen with Ninja Electric BBQ/Airfryer', note: 'Electric only (no gas). Choose INSTEAD of Standard kitchen.', price: 690 },
        ],
      },
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'smart-touch-plus', label: 'Smart Touch PLUS Upgraded Monitor', priceByVariant: { classic: 755, 'eco-suite': 0 } },
          { id: 'extra-2000wh', label: 'Extra 2000Wh SMART 48V Battery', priceByVariant: { classic: 3380, 'eco-suite': null } },
          { id: 'upgrade-5000wh', label: 'Upgrade to 5000Wh SMART 48V Battery', priceByVariant: { classic: 4442, 'eco-suite': 0 } },
          { id: 'second-5000wh', label: 'Add 2nd 5000Wh SMART 48V Battery', note: 'Classic: only available after the 5000Wh upgrade above.', requires: ['upgrade-5000wh'], depNote: 'Add 5000Wh first', priceByVariant: { classic: 7822, 'eco-suite': 7822 } },
          { id: 'surge-protector', label: '240V Surge Protector (DIN rail mounted)', price: 275 },
          { id: 'solar-360', label: 'Upgrade to 360W Merlin NASA Solar', priceByVariant: { classic: 890, 'eco-suite': null } },
          { id: 'solar-480', label: 'Upgrade to 480W Merlin NASA Solar', priceByVariant: { classic: 1860, 'eco-suite': 0 } },
          { id: 'portable-solar', label: 'Portable 220W EcoFlow Bifacial Solar', price: 1150 },
          { id: 'witi-tracking', label: 'WiTi Anti-theft + GPS Tracking + Wireless Trailer Plug', price: 1845 },
        ],
      },
      {
        id: 'storage',
        title: 'Storage & Carriers',
        options: [
          { id: 'side-pak', label: 'Side Storage Pak - Rear', price: 650 },
          { id: 'kargo-karrier', label: 'Kargo Karrier (luggage rack on Multibox)', price: 1290 },
          { id: 'isi-bike-carrier', label: 'iSi Twin Bike Carrier (drawbar-mounted)', price: 1890 },
        ],
      },
      {
        id: 'multimedia',
        title: 'Interior & Multimedia',
        options: [
          { id: 'vinyl-floor', label: 'Premium Vinyl Plank Flooring Upgrade', priceByVariant: { classic: 645, 'eco-suite': 0 } },
          { id: 'extra-lighting', label: 'Additional Lighting (underbench LEDs + console)', price: 390 },
          { id: 'underbody-leds', label: 'Underbody Surround Multi-Colour LED Lights (WiFi App)', price: 680 },
          { id: 'tv-antenna', label: 'Compact TV Antenna System', price: 450 },
          { id: 'smart-tv', label: '28" Smart LED TV + SS Bracket + Swivel Knuckle + External Mounting', price: 1650 },
          { id: 'starlink-ready', label: 'Starlink Ready (pre-wire & mounting kit)', price: 399 },
          { id: 'starlink', label: 'Starlink Synchro-Kit', note: 'Upgraded WiFi modem + internal/external sockets.', price: 2690 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // KIMBERLEY KUBE
  // -------------------------------------------------------------------------
  {
    slug: 'kube',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kube',
    intro: 'King of the off-road - bold, compact adventure.',
    delivery: 3500,
    variants: [
      {
        id: 'classic',
        name: 'Kube Classic',
        basePrice: 76865,
        included: [
          'Laser-cut galvanised chassis',
          'Independent air suspension',
          'Hydraulic disc brakes',
          '200Ah Lithium battery',
          '130L upright fridge (internal)',
          'Slide-out SS kitchen + 2-burner gas',
          'Diesel hot water system',
          'Kwik Awning 2.2x4.1m',
          'King foam mattress',
          'Steel off-road wheels 16" AT tyres',
        ],
      },
      {
        id: 'ecotrek',
        name: 'Kube EcoTrek',
        basePrice: 85010,
        included: [
          'Everything in Classic, plus:',
          '460Ah Lithium battery',
          'Alloy off-road wheels 17" AT tyres',
          'Airbag monitor kit (in-vehicle)',
          'Rock rails / steps',
          'Outside hot & cold shower',
          'Fly screens to cabin doors',
          'DC-DC booster (40A)',
          '200W roof solar + MPPT',
          'Bedouin awning extension',
          'Breakfast table (slide-out)',
          'Bluetooth sound system',
          'Dual reading LED lights',
          'Premium vinyl floor planks',
          'Underbed storage drawer',
        ],
      },
    ],
    categories: [
      {
        id: 'suspension',
        title: 'Suspension & Braking',
        options: [
          { id: 'air-susp-plus', label: 'Air Suspension PLUS', note: 'Compressor, tank, electronic fill, remote.', price: 2520 },
          { id: 'airbag-monitor', label: 'Airbag Monitor Kit in Vehicle', priceByVariant: { classic: 215, ecotrek: 0 } },
          { id: 'airbag-tyre-monitor', label: 'Airbag & Tyre Pressure Monitor Kit in Vehicle', price: 360 },
          { id: 'mono-shocks', label: '2.5" Mono-tube Shocks with Remote Reservoir & Damping Adjustor', price: 1125 },
          { id: 'greasing-kit', label: 'Swingarm Remote Greasing Kit', priceByVariant: { classic: 285, ecotrek: 0 } },
          { id: 'electric-brakes', label: 'Electric over Hydraulic Disc Brakes', note: 'One-touch parking brake.', price: 2550 },
          { id: 'mchitch', label: 'McHitch 3500kg Off-Road Hitch', note: 'Choose ONE hitch. Requires electric brakes.', requires: ['electric-brakes'], depNote: 'Add Electric Brakes first', price: 460 },
          { id: 'do35-hitch', label: 'Cruisemaster DO35 3500kg Off-Road Hitch', note: 'Choose this INSTEAD of the McHitch. Requires electric brakes.', requires: ['electric-brakes'], depNote: 'Add Electric Brakes first', price: 410 },
          { id: 'rock-rails', label: 'Large Slide-Out Alloy Rock Rails / Steps & Bench', priceByVariant: { classic: 860, ecotrek: 0 } },
          { id: 'stone-deflector', label: 'Custom Kube Stone Deflector', note: 'Vehicle-to-Kube barrier.', price: 895 },
          { id: 'reverse-camera', label: 'SMART Wireless WiFi Reverse Camera + side sensors + dashcam', price: 1245 },
        ],
      },
      {
        id: 'wheels',
        title: 'Wheels',
        options: [
          { id: 'wheel-steel16', label: '16" Steel Wheels - 265/75 R16 AT Tyres', note: 'Standard on Classic.', naNote: 'Not on EcoTrek', priceByVariant: { classic: 0, ecotrek: null } },
          { id: 'wheel-alloy17', label: 'Upgrade to 17" Alloy Wheels & AT Tyres', priceByVariant: { classic: 1250, ecotrek: 0 } },
          { id: 'wheel-alloy18', label: 'Upgrade to 18" Alloy Wheels & AT Tyres', priceByVariant: { classic: 1580, ecotrek: 330 } },
        ],
      },
      {
        id: 'water',
        title: 'Water',
        options: [
          { id: 'front-tank', label: '60L Front Water Tank', price: 1060 },
        ],
      },
      {
        id: 'awnings',
        title: 'Canvas & Awnings',
        options: [
          { id: 'bedouin', label: 'Bedouin Awning Extension & rope/peg kit', priceByVariant: { classic: 865, ecotrek: 0 } },
          { id: 'full-walls', label: 'Full Canvas & Mesh Wall Kit', note: 'Includes draft skirt.', price: 3120 },
          { id: 'draft-skirt', label: 'Kube Draft Skirt (awning)', price: 690 },
          { id: 'ensuite-tent', label: 'Ensuite Change Room & Shower/Toilet Cubicle', price: 1650 },
          { id: 'remove-kwik', label: 'Remove standard Kwik Awning (credit)', price: -1420 },
          { id: 'darche-270', label: 'Darche 270° Standalone Awning', note: 'Passenger side, in lieu of Kwik. Requires Kwik removal.', requires: ['remove-kwik'], depNote: 'Remove Kwik first', price: 2550 },
          { id: 'darche-shower', label: 'Darche Drop-Down Ensuite Shower Cubicle', price: 750 },
          { id: 'sailtrack', label: 'RHS Sail Track to Canopy', price: 220 },
        ],
      },
      {
        id: 'comfort',
        title: 'Comfort & Heating',
        options: [
          { id: 'outside-shower', label: 'Outside Hot & Cold Shower (rear, AUX water source)', priceByVariant: { classic: 920, ecotrek: 0 } },
          { id: 'space-heater', label: 'Internal Comfort Space Heater (diesel hot water system)', note: 'Choose ONE heater.', price: 980 },
          { id: 'diesel-heater', label: 'Diesel Air Heater Ducted 2kW with thermostat', note: 'Choose this INSTEAD of the space heater.', price: 2680 },
          { id: 'rooftop-ac-240', label: 'Lightweight Reverse Cycle 240V Rooftop A/C', note: 'Choose ONE A/C.', price: 2975 },
          { id: 'rooftop-ac-24v', label: 'Efficient 24V Rooftop A/C (6,800 BTU)', note: 'Choose this INSTEAD of the 240V A/C.', price: 3945 },
          { id: 'pressure-cabin', label: 'Positive Pressure Cabin System (dust reduction)', price: 565 },
          { id: 'fly-screens', label: 'Fly Screens for Cabin Doors (magnetic)', priceByVariant: { classic: 620, ecotrek: 0 } },
          { id: 'storage-pouches', label: 'Side Storage Pouches x4 (cabin door & wall)', priceByVariant: { classic: 480, ecotrek: 0 } },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'breakfast-table', label: 'Integrated Stainless Steel Breakfast Table (slide-out kitchen)', priceByVariant: { classic: 790, ecotrek: 0 } },
          { id: 'kitchen-standard', label: 'Kitchen: Double Burner + Grill (Standard)', note: 'Choose ONE outside kitchen option.', price: 0 },
          { id: 'wok-cooker', label: 'High Powered WOK Cooker (in kitchen drawer)', note: 'Choose INSTEAD of Standard kitchen.', price: 565 },
          { id: 'induction-cooker', label: 'Standalone 1800W Portable Induction Cooker', note: 'Choose INSTEAD of Standard kitchen. Requires Inverter.', requires: ['inverter-2000'], depNote: 'Add Inverter first', price: 690 },
        ],
      },
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'upgrade-460ah', label: 'Upgrade to 460Ah Lightweight Lithium Battery', priceByVariant: { classic: 1450, ecotrek: 0 } },
          { id: 'second-460ah', label: 'Second 460Ah Battery (total 920Ah) + upgrade to 60A charger', requires: ['upgrade-460ah'], depNote: 'Add 460Ah first', price: 3450 },
          { id: 'anderson-solar', label: 'Anderson Portable Solar Input', priceByVariant: { classic: 275, ecotrek: 0 } },
          { id: 'inverter-2000', label: 'Inverter 2000W Pure Sine Wave & Remote Monitor', price: 2890 },
          { id: 'dc-dc-booster', label: '12V 40A DC-DC Booster (suits Lithium, incl. Anderson input)', priceByVariant: { classic: 920, ecotrek: 0 } },
          { id: 'solar-200', label: '200W Roof Solar + 20A MPPT', note: 'Includes KK Backbone rail system.', priceByVariant: { classic: 1360, ecotrek: 0 } },
          { id: 'solar-400', label: 'Upgrade to 400W Solar with Kruz Rack "Flyover" setup', price: 1175 },
          { id: 'portable-solar', label: 'Portable 220W EcoFlow Bifacial Solar Panel', price: 1100 },
        ],
      },
      {
        id: 'multimedia',
        title: 'Entertainment & Connectivity',
        options: [
          { id: 'bluetooth', label: 'Bluetooth Sound System (smartphone / USB / MP3)', priceByVariant: { classic: 390, ecotrek: 0 } },
          { id: 'smart-tv', label: '24" Smart LED TV + SS Bracket & Swivel + External Mounting', price: 1650 },
          { id: 'starlink-mini', label: 'Starlink Kit for Starlink Mini (24V DC converter)', note: 'Choose ONE Starlink kit.', price: 495 },
          { id: 'starlink-gen', label: 'Starlink Kit for Gen 1/2/3 (RJ45 internal socket)', note: 'Choose this INSTEAD of the Mini kit.', price: 495 },
        ],
      },
      {
        id: 'lighting',
        title: 'Lighting',
        options: [
          { id: 'reading-led', label: 'Dual Reading LED Stalk Lights', priceByVariant: { classic: 230, ecotrek: 0 } },
          { id: 'extra-led', label: 'Additional Lighting - Underbench LED + Kitchen LED', priceByVariant: { classic: 360, ecotrek: 0 } },
          { id: 'pod-led', label: 'LED Lights in Multibox / POD', priceByVariant: { classic: 120, ecotrek: 0 } },
          { id: 'work-lights', label: 'Work Lights x4 for Expedition Rack', requires: ['kruz-rack'], depNote: 'Add Kruz Rack first', price: 640 },
          { id: 'lightbar', label: 'LED Light Bar 50" (mounted to Expedition Rack)', requires: ['kruz-rack'], depNote: 'Add Kruz Rack first', price: 895 },
          { id: 'underglow', label: 'Underbody Surround Multi-Colour LED Lights (WiFi App)', price: 650 },
        ],
      },
      {
        id: 'storage',
        title: 'Storage & Carriers',
        options: [
          { id: 'underbed-drawer', label: 'Large Underbed Storage Drawer', priceByVariant: { classic: 650, ecotrek: 0 } },
          { id: 'kargo-karrier', label: 'Kargo Karrier (luggage rack on Multibox)', price: 1290 },
          { id: 'underbed-bags', label: 'Underbed Storage Bags (clear-top, x4)', price: 420 },
          { id: 'rhino-bars', label: 'Rhino Aero Vortex Bars x3 (fitted, no Kruz rack)', price: 940 },
          { id: 'kruz-rack', label: 'KK Expedition Kruz Roof Rack with Platform', price: 2500 },
          { id: 'bike-carrier', label: 'iSi x2 Bike Carrier (drawbar-mounted, suits e-bikes)', price: 1980 },
        ],
      },
      {
        id: 'interior',
        title: 'Interior Finish',
        options: [
          { id: 'floor-upgrade', label: 'Premium Vinyl Plank Flooring Upgrade', priceByVariant: { classic: 265, ecotrek: 0 } },
          { id: 'finish-natural', label: 'Interior Finish: Natural (fawn roof, sand walls, brown timber floor)', note: 'Choose ONE interior finish.', price: 0 },
          { id: 'finish-contemporary', label: 'Interior Finish: Contemporary (grey roof, slate floor)', note: 'Choose this INSTEAD of Natural.', price: 0 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // KIMBERLEY KRUISWAGEN
  // -------------------------------------------------------------------------
  {
    slug: 'kruiswagen',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiswagen',
    intro: 'Mercedes Sprinter 419 LWB AWD - the ultimate off-road motorhome.',
    variants: [
      {
        id: 'classic',
        name: 'Kruiswagen Classic',
        basePrice: 199850,
        included: [
          'Mercedes Sprinter 419 LWB AWD 2.0L Bi-Turbo A4M 4x4',
          'Factory off-road lift kit',
          'Navigation with 7-year map updates',
          'Active Distance Assist (DISTRONIC)',
          'KK Kruz Rack roof rack backbone',
          'Composting toilet (OGO)',
          'Full-size ensuite with gelcoat shower',
          'Diesel HWS (Webasto)',
          'SMART 48V Power Hub + 2000Wh battery',
          '200W roof solar',
          '2.2x4.5m HD manual roll-out awning',
          '130L upright 12V fridge',
          'Outside cook\'s kitchen (sink + 2-burner)',
          'KK PowerGlide drop-down double bed',
        ],
      },
      {
        id: 'ecoscape',
        name: 'Kruiswagen EcoScape',
        basePrice: 247990,
        included: [
          'Everything in Classic, plus:',
          '360° parking camera',
          'Electric sliding door',
          'Long-range 93L fuel tank',
          'KK Alloy Sports Bar with LED light bar',
          '86L second water tank',
          'Electric awning with dual options',
          '5000Wh battery',
          '400W solar',
          '190L fridge/freezer',
          'Dual induction + microwave',
          'Smart TV',
          'Solid leather seating',
        ],
      },
    ],
    categories: [
      {
        id: 'vehicle-protection',
        title: 'Vehicle Body & Protection',
        options: [
          { id: '360-camera', label: '360° Parking Camera Assist', priceByVariant: { classic: 582, ecoscape: 0 } },
          { id: 'electric-door', label: 'Electric Sliding Door', priceByVariant: { classic: 1650, ecoscape: 0 } },
          { id: 'fuel-93l', label: 'Long Range Fuel Tank 93L', priceByVariant: { classic: 1220, ecoscape: 0 } },
          { id: 'fuel-151l', label: 'Long Range 151L Polyethylene Fuel Tank', price: 3575 },
          { id: 'mercedes-infotainment', label: '10.25" Mercedes Infotainment Upgrade', price: 890 },
          { id: 'heavy-alternator', label: '250A Heavy Duty Alternator', price: 910 },
          { id: 'upgraded-paint', label: 'Upgraded Paint (multiple colours)', price: 1950 },
          { id: 'permaguard', label: 'Mercedes Permaguard Lifetime Warranty', price: 3160 },
          { id: 'gvm-upgrade', label: 'GVM Upgrade Kit (4,430kg)', price: 8645 },
          { id: 'outback-snorkel', label: 'Outback Snorkel (Black)', price: 2540 },
          { id: 'sports-bar-led', label: 'KK Alloy Sports Bar with LED', priceByVariant: { classic: 2650, ecoscape: 0 } },
          { id: 'attitude-bullbar', label: 'KK ATTITUDE Bullbar', price: 5100 },
          { id: 'warn-winch', label: 'Warn Winch 12-S Evo', price: 3290 },
          { id: 'rear-bumper', label: 'KK Alloy Rear Bumper', price: 1820 },
          { id: 'kruz-rack-led', label: 'KK Expedition Kruz Rack + 50" LED', price: 7050 },
          { id: 'security-worklights', label: 'x4 Corner LED Security Worklights', price: 1240 },
          { id: 'swing-spare', label: 'KK Rear Swing-Away (spare tyre)', price: 2995 },
          { id: 'swing-gear', label: 'KK Rear Swing-Away Gear Rack', price: 2470 },
          { id: 'delta-gullwing', label: 'Delta Gullwing Storage Box', price: 2250 },
          { id: 'rear-bike', label: 'KK Rear Drop Bike Carrier', price: 1980 },
          { id: 'aeropod', label: 'Motorhome AeroPod Storage Box', price: 2150 },
          { id: 'electric-steps', label: 'Electric Automatic Side Steps', price: 2850 },
          { id: 'underbody-protection', label: 'Underbody Protection', price: 2550 },
          { id: 'arb-compressor', label: 'Built-in ARB Compressor', price: 1750 },
          { id: 'towbar-pack', label: 'Towbar Pack & Electrics', price: 3220 },
          { id: 'uhf', label: 'UHF Uniden Radio', price: 1050 },
          { id: 'maxtrax', label: 'Set of Maxtrax x2 + Mount', price: 535 },
        ],
      },
      {
        id: 'wheels',
        title: 'Wheels',
        options: [
          { id: 'steel-bfg', label: 'Steel Rims + BFG A/T Tyres', priceByVariant: { classic: 1900, ecoscape: null } },
          { id: 'alloy-16', label: 'KK Alloy Off-Road Wheels 16"', priceByVariant: { classic: 3575, ecoscape: null } },
        ],
      },
      {
        id: 'water',
        title: 'Water',
        options: [
          { id: 'water-86l', label: '86L Dedicated Second Water Tank', priceByVariant: { classic: 1570, ecoscape: 0 } },
          { id: 'best-filter', label: 'BEST Water Filter', price: 465 },
          { id: 'spare-tank', label: '80L Spare Wheel Emergency Tank', price: 1570 },
        ],
      },
      {
        id: 'awnings',
        title: 'Canvas & Awnings',
        options: [
          { id: 'electric-awning', label: 'Electric Open/Close Awning Upgrade', priceByVariant: { classic: 780, ecoscape: 0 } },
          { id: 'bedouin', label: 'Bedouin Extendable Awning', price: 1310 },
          { id: 'draft-skirt', label: 'Vinyl Draft Skirt', price: 840 },
          { id: 'full-walls', label: 'Full Canvas Mesh Walls', price: 4590 },
        ],
      },
      {
        id: 'comfort',
        title: 'Comfort & Heating',
        options: [
          { id: 'space-heater', label: 'Space Heater', price: 1180 },
          { id: 'diesel-heater', label: 'Diesel Air Heater 2kW', price: 2750 },
          { id: 'rooftop-ac', label: 'Rooftop Reverse Cycle A/C', price: 3100 },
          { id: 'outside-shower', label: 'Outside Hot & Cold Shower', price: 820 },
          { id: 'internal-shower-furniture', label: 'Internal Shower Furniture', price: 275 },
          { id: 'door-screens', label: 'Main Door & Rear Canvas Screens', price: 1150 },
          { id: 'magnetic-blinds', label: 'Magnetic Thermal Blinds', price: 880 },
          { id: 'fan-12v', label: '12V Sirocco Fan with Timer', price: 290 },
          { id: 'office-desk', label: 'Office Desk (Lagun)', price: 1450 },
          { id: 'shower-walls', label: 'Shower Walls', price: 1125 },
          { id: 'blackout-ensuite', label: 'Blackout Ensuite Curtain', price: 590 },
          { id: 'cockpit-curtain', label: 'Cockpit Blackout Curtain', price: 785 },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'fridge-190l', label: 'Upgrade to 190L Fridge/Freezer', priceByVariant: { classic: 1880, ecoscape: 0 } },
          { id: 'induction', label: 'Smart RV Dual Plate Induction', priceByVariant: { classic: 1100, ecoscape: 0 } },
          { id: 'microwave', label: 'Microwave Oven', priceByVariant: { classic: 475, ecoscape: 0 } },
          { id: 'wireless-charging', label: 'Wireless Benchtop USB Charging', price: 240 },
          { id: 'gas-bbq', label: 'Upgrade to Marine Hooded Gas BBQ', price: 390 },
          { id: 'wok-burner', label: 'Upgrade to WOK Burner', price: 390 },
          { id: 'ninja-bbq', label: 'Upgrade to Galley Kitchen + Ninja BBQ', price: 590 },
          { id: 'gas-bottle-2kg', label: 'Rear Mount Gas Bottle 2kg', priceByVariant: { classic: 365, ecoscape: 0 } },
        ],
      },
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'battery-5000', label: 'Upgrade to 5000Wh SMART 48V', priceByVariant: { classic: 3720, ecoscape: 0 } },
          { id: 'battery-second', label: 'Second 5000Wh Battery', price: 7820 },
          { id: 'solar-400', label: 'Upgrade to 400W Solar', priceByVariant: { classic: 1250, ecoscape: 0 } },
          { id: 'solar-800', label: 'Upgrade to 800W Solar (flyover)', price: 2330 },
          { id: 'solar-1200', label: 'Upgrade to 1200W Solar', priceByVariant: { classic: 3410, ecoscape: 2160 } },
          { id: 'portable-solar', label: 'Portable 220W EcoFlow Bifacial', price: 1710 },
        ],
      },
      {
        id: 'multimedia',
        title: 'Multimedia & Connectivity',
        options: [
          { id: 'smart-tv', label: 'Smart LED TV + Mounting', priceByVariant: { classic: 1730, ecoscape: 0 } },
          { id: 'starlink-mini', label: 'Starlink Mini Kit', price: 365 },
          { id: 'starlink-roof', label: 'Starlink Roof-Mounted Gen 3/4', price: 960 },
        ],
      },
      {
        id: 'interior',
        title: 'Interior Fit-Out',
        options: [
          { id: 'leather-seating', label: 'Solid Leather Seating (27 colours)', priceByVariant: { classic: 800, ecoscape: 0 } },
          { id: 'dual-hide', label: 'Dual-Hide Leather Seating', priceByVariant: { classic: 1580, ecoscape: 780 } },
          { id: 'vinyl-floor', label: 'Premium Vinyl Floor Upgrade', priceByVariant: { classic: 645, ecoscape: 0 } },
          { id: 'underbench-led', label: 'Underbench LED Lights', price: 330 },
          { id: 'charge-points', label: 'Charge Points (USB-C + 12V)', price: 280 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // KIMBERLEY KRUISER T CLASS
  // -------------------------------------------------------------------------
  {
    slug: 'kruiser-t',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiser T Class',
    intro: '7.3m luxury - sleeps 6 - satellite TV - washing machine - full ensuite.',
    delivery: 3500,
    variants: [
      {
        id: 't3',
        name: 'Kruiser T3 - Fully Loaded',
        basePrice: 220100,
        included: [
          '7.3m luxury off-road caravan, sleeps 6',
          'Galvanised chassis + air suspension',
          'Hydraulic disc brakes',
          'Dual water tanks (120L + 200L)',
          'Full ensuite (shower / toilet / vanity)',
          'Diesel heating + cooling',
          '48V power system with 5000Wh battery',
          '800W solar',
          'Washing machine',
          '190L fridge',
          '2-burner galley kitchen',
          'LED lighting throughout',
          'Satellite TV system',
          'Leather seating',
          'Innerspring mattress',
        ],
      },
    ],
    categories: [
      {
        id: 'suspension',
        title: 'Suspension & Chassis',
        options: [
          { id: 'stone-deflector', label: 'Custom Stone Deflector', price: 820 },
          { id: 'fold-steps', label: 'Internal Fold-Down Entry Steps', price: 990 },
          { id: 'do45-hitch', label: 'VC DO45 4500kg Off-Road Hitch (upgrade from McHitch)', price: 0 },
        ],
      },
      {
        id: 'wheels',
        title: 'Wheels',
        options: [
          { id: 'alloy-18', label: 'Upgrade to 18" Alloys', price: 550 },
        ],
      },
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'smart-touch-plus', label: 'Smart Touch PLUS Monitor', price: 990 },
          { id: 'battery-extra-5000', label: 'Extra 5000Wh Battery (10kWh total)', price: 7100 },
          { id: 'solar-900', label: 'Upgrade to 900W Merlin NASA Solar', note: 'Selecting this removes the rooftop A/C (a $3,910 credit will apply on your quote).', price: 970 },
          { id: 'gps-tracking', label: 'GPS Tracking System', price: 1650 },
          { id: 'portable-solar', label: 'Portable 170W Solar', price: 1710 },
        ],
      },
      {
        id: 'awnings',
        title: 'Canvas & Awnings',
        options: [
          { id: 'full-walls', label: 'Full Canvas Mesh Wall Set', price: 4300 },
          { id: 'draft-skirt', label: 'Draft Skirt', price: 790 },
          { id: 'bedroom-curtain', label: 'Bedroom Curtain', price: 880 },
        ],
      },
      {
        id: 'comfort',
        title: 'Comfort',
        options: [
          { id: 'airsoft-mattress', label: 'Queen AIRSOFT Mattress upgrade', price: 1255 },
          { id: 'air-purifier', label: 'Air Purifier / Sanitiser', price: 840 },
          { id: 'winterise-plumbing', label: 'Winterise Plumbing', price: 2500 },
          { id: 'isotherm-40l', label: '40L Isotherm Fridge/Freezer', price: 1920 },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'bbq-upgrade', label: 'Hooded BBQ / Weber Upgrade', price: 390 },
          { id: 'wok-burner', label: 'Single WOK Burner', price: 530 },
          { id: 'fridge-130l-alt', label: 'Alternative 130L Fridge Setup', price: 1700 },
          { id: 'fridge-tunnel-80l', label: '80L Fridge in Tunnel Boot', price: 3300 },
        ],
      },
      {
        id: 'storage',
        title: 'Storage',
        options: [
          { id: 'side-pak-driver', label: 'Side Storage Pak (Rear Driver)', price: 580 },
          { id: 'upright-ensuite', label: 'Upright Ensuite Cupboard', price: 790 },
        ],
      },
      {
        id: 'connectivity',
        title: 'Connectivity',
        options: [
          { id: 'celfi-go', label: 'Celfi Go Telstra Repeater', price: 2040 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // KIMBERLEY KRUISER S CLASS
  // -------------------------------------------------------------------------
  {
    slug: 'kruiser-s',
    brandFamily: 'Kimberley',
    name: 'Kimberley Kruiser S Class',
    intro: 'Sleeps 6 - full ensuite - 48V Smart Power - king of the off road.',
    delivery: 3500,
    variants: [
      {
        id: 'classic',
        name: 'Kruiser S Classic',
        basePrice: 135800,
        included: [
          'Galvanised chassis with manual air suspension',
          'Swingarm remote greasing, hydraulic disc brakes, McHitch',
          'Anti-sway bar, stone protection, triple fold-out steps',
          'Dual water system (70L + 120L)',
          'Manual wind-out awning',
          'Full-width ensuite (shower, toilet, vanity)',
          'Diesel Webasto HWS + diesel air heater',
          '130L upright fridge + 2-burner galley',
          'SMART 48V Power Hub + 2000Wh battery',
          '300W Merlin NASA solar + Anderson plug',
          'Single plate induction (standalone)',
          'Bluetooth soundbar',
          'Vegan leather seating',
          'Foam mattress',
          'Smart Touch PLUS monitor',
        ],
      },
      {
        id: 's3',
        name: 'Kruiser S3 30th Anniversary',
        basePrice: 172100,
        included: [
          'Everything in Classic, plus:',
          'Electronic air suspension with remote fill',
          'Alloy off-road wheels, 17" AT tyres',
          '50L extra water tank + 60L grey water tank',
          'Electric awning with open/close',
          'Bedouin extendable awning',
          'Rooftop reverse cycle A/C',
          '5000Wh SMART 48V Battery',
          '500W Merlin NASA solar',
          'Dual plate induction cooktop (built-in)',
          'Top-loading washing machine',
          '28" Smart LED TV with antenna',
          'Real leather seating',
          'Innerspring plush mattress',
        ],
      },
    ],
    categories: [
      {
        id: 'suspension',
        title: 'Suspension & Chassis',
        options: [
          { id: 'turning-drawbar', label: 'Turning Drawbar Extension', price: 500 },
          { id: 'air-susp-plus', label: 'Air Suspension PLUS (compressor + tank + remote)', priceByVariant: { classic: 2255, s3: 0 } },
          { id: 'air-kit', label: 'Air Kit & Hoses', price: 285 },
          { id: 'mono-shocks', label: '2.5" Remote Reservoir Mono-tube Shocks', price: 1060 },
          { id: 'stone-deflector', label: 'Custom Stone Deflector', price: 820 },
          { id: 'fold-steps', label: 'Internal Fold-Down Entry Steps', price: 990 },
        ],
      },
      {
        id: 'wheels',
        title: 'Wheels',
        options: [
          { id: 'alloy-17', label: 'KK Alloy Off-Road Wheels 17" AT', priceByVariant: { classic: 1250, s3: 0 } },
          { id: 'alloy-18', label: 'Upgrade to 18" Alloys & Rims', priceByVariant: { classic: 1580, s3: 1580 } },
        ],
      },
      {
        id: 'water',
        title: 'Water',
        options: [
          { id: 'water-50l-extra', label: '50L Extra Water Tank (under shower)', priceByVariant: { classic: 790, s3: 0 } },
          { id: 'grey-tank', label: '60L Grey Water Tank', priceByVariant: { classic: 1060, s3: 0 } },
        ],
      },
      {
        id: 'awnings',
        title: 'Awnings & Canvas',
        options: [
          { id: 'electric-awning', label: 'Electric Open & Close Awning', priceByVariant: { classic: 1050, s3: 0 } },
          { id: 'bedouin', label: 'Bedouin Extendable Awning', priceByVariant: { classic: 1310, s3: 0 } },
          { id: 'full-walls', label: 'Full Canvas Mesh Wall Set', price: 4170 },
          { id: 'draft-skirt', label: 'Draft Skirt', price: 740 },
          { id: 'kwik-sun', label: 'Kwik Sun Awning (sun reduction)', price: 1390 },
        ],
      },
      {
        id: 'comfort',
        title: 'Comfort & Heating',
        options: [
          { id: 'rooftop-ac', label: 'Harrier Rooftop Reverse Cycle A/C', priceByVariant: { classic: 3910, s3: 0 } },
          { id: 'midge-screens', label: 'Midge Screen Magnetic Doors', price: 380 },
          { id: 'fan-12v', label: '12V Fan with Timer', price: 275 },
        ],
      },
      {
        id: 'ensuite',
        title: 'Ensuite',
        options: [
          { id: 'washing-machine', label: 'Top-Loading Washing Machine', priceByVariant: { classic: 790, s3: 0 } },
          { id: 'isotherm-40l', label: '40L Isotherm Upright Freezer/Fridge', priceByVariant: { classic: 1920, s3: null } },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'induction', label: 'Smart RV Dual Plate Induction (built-in)', priceByVariant: { classic: 1100, s3: 0 } },
          { id: 'microwave', label: 'Microwave Oven (inside)', price: 420 },
          { id: 'gas-bbq', label: 'Galley Kitchen - Marine Hooded Gas BBQ', price: 390 },
          { id: 'weber-bbq', label: 'Galley Kitchen - Weber BabyQ', price: 390 },
          { id: 'wok-burner', label: 'Large Single WOK Burner', price: 530 },
          { id: 'fridge-tunnel-80l', label: '80L Fridge/Freezer in Tunnel Boot', price: 3300 },
        ],
      },
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'battery-5000', label: 'Upgrade to 5000Wh SMART 48V', priceByVariant: { classic: 4030, s3: 0 } },
          { id: 'battery-second', label: 'Extra 5000Wh SMART 48V Battery', note: 'Classic: only available after the 5000Wh upgrade above.', requires: ['battery-5000'], depNote: 'Add 5000Wh first', price: 7100 },
          { id: 'solar-400', label: 'Upgrade to 400W Merlin NASA Solar', priceByVariant: { classic: 650, s3: null } },
          { id: 'solar-500', label: 'Upgrade to 500W Merlin NASA Solar', priceByVariant: { classic: 1420, s3: 0 } },
          { id: 'witi-tracking', label: 'WiTi Anti-theft + GPS Tracking', price: 1650 },
          { id: 'portable-solar', label: 'Portable 170W Solar (10m lead)', price: 1710 },
        ],
      },
      {
        id: 'storage',
        title: 'Storage',
        options: [
          { id: 'unipod', label: 'UniPod Fibreglass Multibox Upgrade', priceByVariant: { classic: 1120, s3: 0 } },
          { id: 'side-pak-passenger', label: 'Side Storage Pak - Rear Passenger', price: 580 },
          { id: 'side-pak-driver', label: 'Side Storage Pak - Rear Driver', price: 580 },
        ],
      },
      {
        id: 'multimedia',
        title: 'Multimedia & Connectivity',
        options: [
          { id: 'stereo-panel', label: 'Premium All-in-One Panel Stereo', priceByVariant: { classic: 570, s3: 0 } },
          { id: 'tv-antenna', label: 'Compact TV Antenna - King Aerial', priceByVariant: { classic: 680, s3: 0 } },
          { id: 'smart-tv', label: '28" Smart LED TV + Bracket', priceByVariant: { classic: 1630, s3: 0 } },
          { id: '4g-comms', label: '4G Digital Communication System', priceByVariant: { classic: 1150, s3: 0 } },
          { id: '5g-antenna', label: '5G Shark Fin Antenna Upgrade', price: 780 },
        ],
      },
      {
        id: 'interior',
        title: 'Seating & Bed',
        options: [
          { id: 'latin-chaise', label: 'Latin Chaise Lounge Seat Upgrade', price: 790 },
          { id: 'innerspring', label: 'Upgrade to Innerspring Mattress (Superb Luxury)', priceByVariant: { classic: 320, s3: null } },
          { id: 'airsoft-mattress', label: 'Queen AIRSOFT Mattress (memory foam + air core)', priceByVariant: { classic: 1575, s3: 1255 } },
          { id: 'real-leather', label: 'Real Leather Seating (27 colours)', priceByVariant: { classic: 970, s3: 0 } },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // STOCKMAN ROVER 02
  // -------------------------------------------------------------------------
  {
    slug: 'rover',
    brandFamily: 'Stockman',
    name: 'Stockman Rover 02',
    intro: 'Configure your perfect Rover in minutes.',
    // Per Bart's hand-verified quote guide. Base prices are TRUE ex-factory
    // (Melbourne) - delivery is a separate line, never baked into the base.
    delivery: 3500,
    variants: [
      {
        id: 'xt-intrepid',
        name: 'Rover 02 XT - Intrepid',
        basePrice: 59990,
        flags: { ultra: false, lite: false },
        included: [
          'Hot-dip galvanised chassis, independent coil springs, dual Pedders shockers',
          '12" electric drum brakes, 17" alloy wheels, 265/65R17 A/T tyres',
          'ATM 1,800kg, Tare from 1,260kg',
          '12V Direct system, 40A DC-DC, 120Ah lithium, 100W solar',
          'Joolca instant gas shower (external)',
        ],
      },
      {
        id: 'xt-ultra',
        name: 'Rover 02 XT - Ultra',
        basePrice: 74990,
        flags: { ultra: true, lite: false },
        included: [
          'Everything in XT Intrepid, plus:',
          'REDARC RedVision system, 300Ah lithium, 400W solar',
          'Reverse-cycle A/C, diesel hot water shower, 240V system',
          'Stone guard',
          'ATM 1,800kg, Tare from 1,350kg',
        ],
      },
    ],
    categories: [
      {
        id: 'comfort-power',
        title: 'Comfort & Power Upgrades',
        options: [
          { id: 'redvision', label: 'REDARC RedVision Power System', note: 'Smartphone app control, nationwide RedNetwork support.', priceByVariant: { 'xt-intrepid': 3700, 'xt-ultra': 0 } },
          { id: 'rooftop-ac', label: '240V Reverse-Cycle Air Conditioning', note: 'Roof-mounted. Can run off-grid with a 2000W inverter.', requires: ['redvision'], depNote: 'Add RedVision', priceByVariant: { 'xt-intrepid': 3800, 'xt-ultra': 0 } },
          { id: 'battery-300ah', label: 'Upgrade to 300Ah Lithium Battery', note: 'More off-grid power capacity.', priceByVariant: { 'xt-intrepid': 1900, 'xt-ultra': 0 } },
          { id: 'battery-600ah', label: 'Upgrade to 600Ah Lithium Battery', note: 'Maximum off-grid capacity, on top of the 300Ah upgrade.', requires: ['battery-300ah'], depNote: 'Add 300Ah', price: 1850 },
          { id: 'manager-50', label: 'REDARC Manager 50', note: 'Battery management, recommended with 600Ah.', requires: ['redvision'], depNote: 'Add RedVision', price: 800 },
          { id: 'shore-power', label: '240V Shore Power System', note: '15A inlet, kitchen and bedroom double power outlets.', priceByVariant: { 'xt-intrepid': 1200, 'xt-ultra': 0 } },
          { id: 'inverter-12v', label: '2000W 12V Inverter', note: 'Intrepid models. Run appliances off battery.', blockedBy: ['redvision'], blockedNote: 'Use REDARC', naNote: 'Ultra: REDARC', priceByVariant: { 'xt-intrepid': 1600, 'xt-ultra': null } },
          { id: 'inverter-redarc', label: '2000W REDARC Inverter', note: 'Requires the RedVision power system.', requires: ['redvision'], depNote: 'Add RedVision', price: 2300 },
          { id: 'portable-solar', label: 'Portable 220W Solar Panels', note: 'Top up batteries on the move.', priceByVariant: { 'xt-intrepid': 950, 'xt-ultra': 0 } },
          { id: 'diesel-shower', label: 'Diesel Hot Water Heater + Shower Kit', note: 'Darche drop-down shower tent, hot and cold mixer, shower rose.', priceByVariant: { 'xt-intrepid': 4900, 'xt-ultra': 0 } },
          { id: 'diesel-heater', label: 'Diesel Air Heater', note: 'Fitted to diesel water heater, includes cabinetry change.', price: 3150 },
          { id: 'kitchen-wall-roof', label: 'Kitchen Wall & Roof Kit', note: 'Tailgate cover plus two polyester walls for weather protection.', priceByVariant: { 'xt-intrepid': 900, 'xt-ultra': 0 } },
          { id: 'stone-guard', label: 'Stone Guard', note: 'Required with the diesel heater option to mount the diesel tank.', priceByVariant: { 'xt-intrepid': 900, 'xt-ultra': 0 } },
        ],
      },
      {
        id: 'awnings',
        title: 'Awnings & Outdoor Living',
        options: [
          { id: 'darche-180-walls', label: 'Awning Walls for Darche 180 Awning', note: 'Enclose your alfresco area.', price: 800 },
          { id: 'darche-eclipse', label: 'Darche 2m Eclipse Side Awning with LED Lights', note: 'Driver side, adds extra shade.', price: 1800 },
          { id: 'darche-retreat', label: 'Darche Retreat Annex', note: 'Requires awning moved forward plus kitchen wall kit.', price: 900 },
          { id: 'draft-skirt', label: 'Draft Skirt - Side & Back', note: 'Heavy-duty Australian-made vinyl.', price: 1150 },
          { id: 'woodbox', label: 'Woodbox', note: 'Secure storage box for firewood.', price: 650 },
        ],
      },
      {
        id: 'suspension',
        title: 'Suspension & Towing',
        options: [
          { id: 'airbag-suspension', label: 'Airbag Suspension Upgrade', note: 'Manual height adjust, compressor and remote.', price: 4990 },
          { id: 'brake-controller', label: 'Electric Brake Controller (trailer-mounted)', note: 'No remote.', price: 1300 },
          { id: 'brake-remote', label: 'Electric Brakes Remote Control', price: 250 },
        ],
      },
      {
        id: 'tech',
        title: 'Entertainment & Tech',
        options: [
          { id: 'smart-tv', label: '24" Smart HD TV', note: 'Wi-Fi, USB, HDMI inputs, removable mounts, no aerial.', price: 900 },
          { id: 'reverse-camera', label: 'Furrion Rear-Vision Camera + 7" Display', note: 'Wireless, fitted on rear door.', price: 1300 },
          { id: 'sirocco-fan', label: 'Sirocco Fan', note: 'Mounted and wired in.', price: 450 },
          { id: 'sirocco-fan-2', label: 'Second Sirocco Fan', note: 'Add a second fan.', requires: ['sirocco-fan'], depNote: 'Add 1st fan', price: 450 },
          { id: 'water-filter', label: 'Water Filter - Silver GAC Carbon', price: 250 },
          { id: 'wine-storage', label: 'Wine Bottle Storage Cupboard', note: 'Soft foam sleeves protect bottles from breakage.', price: 300 },
        ],
      },
      {
        id: 'carriers',
        title: 'Bike & Gear Carrying',
        options: [
          { id: 'gripsport-bike', label: 'GripSport 2-Bike Rack (front mounted)', note: 'Suitable for e-bikes.', price: 1380 },
          { id: 'rhino-roof', label: 'Rhino Aero Roof Racks 1550mm Black', note: 'For Rovers with air conditioning, 50kg max rated.', price: 450 },
        ],
      },
      {
        id: 'weather',
        title: 'Weather Shields',
        options: [
          { id: 'vinyl-pass', label: 'Front Curved Vinyl Weather Shield - Passenger Side', price: 150 },
          { id: 'vinyl-driver', label: 'Front Curved Vinyl Weather Shield - Driver Side', price: 150 },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // STOCKMAN TREKKA (rebuilt - Maud's source page is broken)
  // Placeholder configurator - real options to be confirmed with Shane.
  // -------------------------------------------------------------------------
  {
    slug: 'trekka',
    brandFamily: 'Stockman',
    name: 'Stockman Trekka',
    intro: 'The serious off-road camper trailer - tough, light, made for tracks.',
    placeholderNote: "Trekka configurator is being rebuilt. The options below are indicative - send us your spec and we'll come back with an accurate quote.",
    variants: [
      {
        id: 'trekka-standard',
        name: 'Trekka Standard',
        basePrice: 62000,
        included: [
          'Australian-built galvanised chassis',
          'Independent off-road suspension',
          'Hot-dip galvanised everywhere',
          'Hard-floor camper trailer design',
          '150Ah AGM battery',
          '200W solar',
          'Slide-out kitchen (sink + cooker)',
          'Standard roll-out awning',
        ],
      },
      {
        id: 'trekka-plus',
        name: 'Trekka Plus',
        basePrice: 71000,
        included: [
          'Everything in Standard, plus:',
          '200Ah lithium battery',
          '400W solar',
          'Slide-out kitchen with fridge',
          'Premium awning with walls',
          'Internal upgrades',
        ],
      },
    ],
    categories: [
      {
        id: 'power',
        title: 'Power & Solar',
        options: [
          { id: 'battery-300ah', label: 'Upgrade to 300Ah lithium', price: 'POA' },
          { id: 'solar-600', label: 'Upgrade to 600W solar', price: 'POA' },
        ],
      },
      {
        id: 'kitchen',
        title: 'Kitchen',
        options: [
          { id: 'internal-kitchen', label: 'Internal kitchen layout', price: 'POA' },
          { id: 'fridge-upgrade', label: 'Fridge upgrade', price: 'POA' },
        ],
      },
      {
        id: 'awnings',
        title: 'Awnings & Annex',
        options: [
          { id: 'premium-walls', label: 'Premium awning with walls + floor', price: 'POA' },
        ],
      },
    ],
  },
]

export function getQuoteBuilder(slug) {
  return quoteBuilders.find((b) => b.slug === slug) ?? null
}

// Legacy compatibility - some pages still import the simpler shape.
export const quoteBrands = quoteBuilders.map((b) => ({
  slug: b.slug,
  brandFamily: b.brandFamily,
  name: b.name,
  headline: b.intro,
  intro: b.intro,
  indicativePrice: `From $${(b.variants[0]?.basePrice || 0).toLocaleString('en-AU')} ex-factory`,
  showSpecial: 'Show pricing available at the stand',
  keyChoices: [],
  inclusions: [],
}))

export function getQuoteBrand(slug) {
  return quoteBrands.find((b) => b.slug === slug) ?? null
}
