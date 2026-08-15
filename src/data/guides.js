// ---------------------------------------------------------------------------
// Resources - guides and articles
//
// Content source: Maud's email "Buyer's Guide and Camp Guide" (14 Aug 2026),
// seven standalone HTML files. We have taken ONLY her editorial sections and
// re-skinned them into the SEQ site template (Inter / Inter Tight, sand + ink
// + rust, .container, .page-header, .btn-primary). Her own page chrome, fonts
// and brown/gold palette are not used.
//
// Model: the free sections are the complete text of those sections, nothing
// held back. The paid PDF adds the remaining sections PLUS the fillable
// workbook, which is the thing you cannot get off a web page.
//
// !! TWO THINGS TO CONFIRM WITH MAUD BEFORE THIS GOES LIVE !!
//
// 1. PAGE COUNTS. Every source disagrees. Buyer's Guide is "4 pages of 23" on
//    the preview PDF cover, "the full 24-page guide" in the preview PDF body,
//    "31 pages" in her HTML, and "38 page, 31 page guide" on the Friday call.
//    Camp Set-Up is 16, then 17, then 37. The figures below are her HTML
//    figures. They are the least likely to be right and the most visible.
//
// 2. PRINTED COPIES. Her guide pages sell printed copies for $39 / $65 right
//    now, while her own printed-interest.html says "we are gauging numbers
//    before we commit to a print run, no payment now". Until that is settled,
//    printed renders as a register-interest link, not a buy button.
// ---------------------------------------------------------------------------

// Stripe Payment Links. Maud creates the products in Stripe and sends the
// three URLs; drop them in here and nothing else needs to change. Name and
// email are captured by Stripe at the checkout, so the site asks for nothing.
export const STRIPE = {
  buyersGuidePdf: '',
  campSetUpPdf: '',
  bundlePdf: '',
}

// Until a Stripe link exists, the buy button must NOT point at a dead URL on a
// live page. It degrades to an email-us-to-buy link instead, so the page can go
// live today and start earning its search ranking. Fill in STRIPE above and
// every button turns into a real checkout with no other change.
const BUY_EMAIL = 'office@seqcampers.com.au'

export function buyLink(url, subject) {
  if (url) return { href: url, label: 'Buy the PDF', pending: false }
  return {
    href: `mailto:${BUY_EMAIL}?subject=${encodeURIComponent(subject)}`,
    label: 'Email us to buy',
    pending: true,
  }
}

export const PRICES = {
  pdf: 9,
  bundle: 15,
  bundleWas: 18,
  printed: 39,
  printedBundle: 65,
}

// ---------------------------------------------------------------------------
// GUIDES - part free to read, complete book is paid
// ---------------------------------------------------------------------------

export const guides = [
  {
    slug: 'off-road-buyers-guide',
    kind: 'guide',
    title: 'The Off-Road Buyer’s Guide',
    edition: 'Edition 1 · 2026',
    tagline:
      'Campers, caravans and motorhomes. How to choose one that suits the trip you actually intend to take.',
    pages: 31,
    readMins: 22,
    updated: 'July 2026',
    cover: '/guides/cover-buyers-guide.jpg',
    ogImage: '/guides/cover-buyers-guide.jpg',
    meta: {
      title:
        'Off-Road Caravan Buyer’s Guide (2026) | Weights, Build Types & What to Ask | SEQ Campers',
      description:
        'Brand-neutral guidance on buying an off-road camper, caravan or motorhome in Australia. GVM, GCM, ATM and payload explained in full, build types compared, and what actually transfers when you buy privately.',
    },
    // Index card copy
    cardLede:
      'How to choose one that suits the trip you actually intend to take, working through the decisions in the order that matters: trip first, weights second, construction third, fit-out last.',
    whoFor:
      'If you are researching your first off-road van, or replacing one that turned out to be the wrong category. Also useful if you already have a shortlist and want to interrogate it properly.',
    cardPoints: [
      'GVM, GCM, ATM, GTM and ball weight explained, including the payload trap that catches most buyers',
      'Build types compared honestly, with no brand names',
      'Chassis, suspension and body construction: what corrugations actually do',
      'Off-grid power, water and waste in realistic daily numbers',
      'Twelve questions to ask any dealer, including us',
      'Dealer versus private: the five questions that explain the price gap',
      'A section on when not to buy off-road at all',
    ],
    standfirst:
      'Most people who regret their purchase did not buy a bad van. They bought a perfectly good van built for a different trip than the one they ended up taking. This guide works through the decisions in the order that matters: trip first, weights second, construction third, fit-out last. <strong>The four sections below are the complete text from the guide, nothing held back.</strong>',
    stripeUrl: STRIPE.buyersGuidePdf,
    sections: [
      {
        n: 1,
        id: 's1',
        title: 'Start with the trip, not the van',
        html: `<p class="standfirst">Every specification decision downstream, payload, water capacity, battery bank, suspension travel, bed layout, is answered by the trip. Get the trip honest and the van almost specifies itself.</p>
<h3>The honesty test</h3>
<p>There is a gap between the trip people describe when they walk onto a lot and the trip they take. The described trip is usually the Canning Stock Route. The actual trip is usually six weeks up the coast with a fortnight of genuine remote work in the middle. Both are excellent trips. They need different vans.</p>
<p>A useful way to cut through it: think about the last three holidays you actually took, not the ones you talked about. Then ask what would have had to change for the van to be the limiting factor.</p>
<h3>The nine questions</h3>
<ul><li><strong>How many nights a year?</strong> Under 30 nights changes the maths completely, depreciation and storage start to dominate over capability.</li><li><strong>How many consecutive nights off-grid?</strong> Two nights is a solar-and-battery question. Fourteen nights is a water-and-waste question, and water is heavier than everything else you carry.</li><li><strong>What is the worst surface you will genuinely tow on?</strong> Be specific. &ldquo;Gravel access road&rdquo; and &ldquo;Gibb River Road&rdquo; are not the same engineering problem.</li><li><strong>Who is travelling?</strong> Two adults, or two adults plus grandchildren twice a year? The second one has caught out a lot of people who bought a couples van.</li><li><strong>What is your tow vehicle, and will you change it?</strong> If not, the vehicle is a hard constraint and section 2 will do most of your shortlisting for you.</li><li><strong>How much setup are you willing to do at 4pm in the rain?</strong> The single most underrated question in the process.</li><li><strong>Caravan parks, national parks, or free camps?</strong> Park-heavy travel means powered sites and dump points, which relaxes almost every off-grid requirement.</li><li><strong>Do you need an internal bathroom?</strong> It costs length, weight, water, waste capacity and money. For some travellers it is non-negotiable; for others it is the thing they would drop first.</li><li><strong>What is the resale horizon?</strong> Three years and five years are different purchases.</li></ul>
<div class="note"><b>The setup question, expanded</b><p>We describe ourselves as lazy campers, and we mean it as a design standard rather than a confession. If setup takes forty minutes, you will stop doing one-night stays. You will push on to the next town instead of pulling into the good spot you passed. Over a long trip, slow setup quietly shrinks where you go. Time a full setup and pack-down on any van you are seriously considering, with a stopwatch, at the dealership, before you buy.</p></div>`,
      },
      {
        n: 2,
        id: 's2',
        title: 'The weights that bite',
        html: `<p class="standfirst">The least glamorous section here and the one that prevents the most expensive mistakes. Weight is where enthusiasm meets the law, and the law does not negotiate.</p>
<h3>The vocabulary</h3>
<div class="tw"><table><thead><tr><th scope="col">Term</th><th scope="col">What it means</th><th scope="col">Where to find it</th></tr></thead><tbody><tr><td>Tare</td><td>The van as it left the factory, empty. Check what the manufacturer included, gas bottles and water are treated inconsistently.</td><td>Compliance plate</td></tr><tr><td>ATM</td><td>Aggregate Trailer Mass. Maximum the loaded van may weigh when <em>not</em> coupled. Includes ball weight.</td><td>Compliance plate</td></tr><tr><td>GTM</td><td>Gross Trailer Mass. Maximum that may sit on the van&rsquo;s axles when it <em>is</em> coupled. ATM minus ball weight.</td><td>Compliance plate</td></tr><tr><td>Payload</td><td>ATM minus tare. Everything you own, eat, drink and carry.</td><td>Calculate it yourself</td></tr><tr><td>Ball weight</td><td>Downward mass on the tow ball. Commonly 8 to 12% of ATM on off-road vans.</td><td>Weigh it, do not trust the brochure</td></tr><tr><td>GVM</td><td>Gross Vehicle Mass. Maximum loaded weight of your tow vehicle alone, including the ball weight pressing down on it.</td><td>Vehicle placard</td></tr><tr><td>GCM</td><td>Gross Combination Mass. Maximum for vehicle and van together.</td><td>Vehicle placard</td></tr></tbody></table></div>
<h3>The GCM trap</h3>
<p>Here is the one that catches experienced people. Your vehicle has a GVM and a maximum towing capacity. Add them together and you will usually get a number <em>larger</em> than the GCM. That is not a misprint, it means you cannot legally use both maximums at once.</p>
<div class="note note--warn"><b>Worked example</b><p>A common dual-cab: GVM 3,050 kg. Braked towing capacity 3,500 kg. Added together, 6,550 kg. But the GCM is 6,000 kg.</p><p>So if you tow a van loaded to its full 3,500 kg ATM, your vehicle may only weigh 2,500 kg, roughly its kerb weight before you add passengers, fuel, a bullbar, drawers, a fridge, or the 350 kg of ball weight the van puts on your towbar. You are over before you pack a single shirt.</p><p>The shortfall is 550 kg. That is not a rounding error. That is the whole family.</p></div>
<h3>The payload trap</h3>
<p>Manufacturers advertise ATM because it is a big number. Payload is the number that governs your life. A van with a 3,500 kg ATM and a 2,900 kg tare gives you 600 kg. That sounds generous until you start filling it:</p>
<div class="tw"><table><thead><tr><th scope="col">Item</th><th scope="col">Realistic weight</th></tr></thead><tbody><tr><td>Fresh water, 180 L</td><td>180 kg</td></tr><tr><td>Two full gas bottles (9 kg)</td><td>38 kg</td></tr><tr><td>Food, clothing, bedding, kitchen for two</td><td>90 to 130 kg</td></tr><tr><td>Tools, recovery gear, spares, second spare wheel</td><td>60 to 100 kg</td></tr><tr><td>Generator or extra battery</td><td>20 to 40 kg</td></tr><tr><td>Awning walls, mats, chairs, table, camp kitchen</td><td>40 to 70 kg</td></tr><tr><td>E-bikes or similar, if carried</td><td>50 to 80 kg</td></tr><tr><td><strong>Typical total</strong></td><td><strong>478 to 638 kg</strong></td></tr></tbody></table></div>
<p>Water is the surprise for most people. It is the heaviest single thing you carry, and the more remote you go the more of it you need. A van marketed for extended off-grid travel with only 400 kg of payload is quietly telling you it does not expect you to fill its tanks and load it at the same time.</p>
<h4>What to actually do about it</h4>
<ul><li>Get the rig weighed loaded, at a public weighbridge, before your first big trip. Four corners if you can, side-to-side imbalance is common and rarely suspected.</li><li>Treat any payload figure under 500 kg on a full off-road van as a serious question, not a detail.</li><li>Ask whether the tare on the plate is for that exact van or a representative model. An option-heavy build can be 150 kg heavier than the brochure.</li><li>Remember ball weight is carried by the <em>vehicle</em>, not the van. It consumes your GVM, not your ATM.</li></ul>`,
      },
      {
        n: 3,
        id: 's3',
        title: 'Build categories, honestly described',
        html: `<p class="standfirst">The words &ldquo;off-road&rdquo; and &ldquo;outback&rdquo; appear on almost everything sold in this country, including vans that should not leave bitumen. There is no legal definition and no certifying body. Judge the build, not the badge.</p>
<div class="tw"><table><thead><tr><th scope="col">Category</th><th scope="col">Genuinely suited to</th><th scope="col">Trade-offs</th></tr></thead><tbody><tr><td>Touring / on-road</td><td>Bitumen and well-maintained gravel. Caravan parks and popular national parks.</td><td>Lightest and cheapest to buy and tow. Will be shaken apart by sustained corrugations.</td></tr><tr><td>Semi off-road</td><td>Formed dirt roads, station tracks, most gravel access to free camps.</td><td>The widest quality spread of any category. Some are genuinely capable; some are touring vans with chunky tyres.</td></tr><tr><td>Full off-road caravan</td><td>Sustained corrugations, remote travel, extended off-grid living with a full internal bathroom.</td><td>Heaviest and most expensive. Demands a serious tow vehicle. Length limits where you can turn around.</td></tr><tr><td>Hybrid / expedition camper</td><td>Difficult tracks, tight campsites, couples who prioritise access over interior space.</td><td>Compact and capable, with a far better departure angle. Less internal living space.</td></tr><tr><td>Off-road camper trailer</td><td>The most difficult terrain, shortest setup-to-sleep on soft ground, lowest cost of entry.</td><td>Setup time varies enormously by design. Limited wet-weather living space.</td></tr><tr><td>4WD motorhome</td><td>Solo travellers and couples who want one vehicle, no reversing, and fast overnight stops.</td><td>You lose your day vehicle once you set up camp. More complex and costly to service.</td></tr></tbody></table></div>
<h3>The one comparison worth making yourself</h3>
<p>Caravan versus hybrid is the decision most couples agonise over, and it comes down to a single trade: <strong>interior space against access and setup speed.</strong> A hybrid gets you into campsites a full-size van cannot reach and gets you sleeping faster. A caravan gives you somewhere pleasant to sit when it rains for three days.</p>
<p>A practical way to resolve it: think about your worst-weather day, not your best. If four wet days indoors sounds miserable in a hybrid, buy the caravan. If you would rather be somewhere a caravan cannot go, buy the hybrid and accept you will sit outside under an awning more often.</p>
<div class="note"><b>A note on motorhomes</b><p>Motorhomes are chronically under-considered in Australia because the caravan marketing budget is larger. For a solo traveller, or a couple doing lots of one-night stops between destinations, a 4WD motorhome can be the obvious answer: no reversing, no coupling, no setup beyond a handbrake. The real question is whether you can live without a separate day vehicle.</p></div>`,
      },
      {
        n: 8,
        id: 's8',
        title: 'Dealer or private',
        html: `<p class="standfirst">The same van is usually a few thousand dollars cheaper privately. That gap is not dealer greed, it is the cost of the work done to the van before it is offered, and the protections that work makes possible. Whether it is worth paying depends entirely on what you get for it, so ask.</p>
<h3>Five things to ask any dealer selling a used van</h3>
<p>None of these are universal. Some dealers do all five, some do none, and the price will look similar either way. The answers are the whole difference between the two prices.</p>
<h4>1. Has it been serviced, and is that included?</h4>
<p>A properly presented used van should come to you freshly serviced, so you are not due again for another year or ten thousand kilometres. Buy privately and you are almost always paying for a service in your first month, on top of the purchase.</p>
<h4>2. Is there an inspection report, and can I see it?</h4>
<p>A thorough pre-sale inspection runs to something like fifty points: brakes, bearings, suspension, chassis, seals, batteries, charging, water, gas, air-conditioning, appliances. What matters is not that it happened but that <strong>you get to read it.</strong> Something essential gets fixed before the van is offered; something non-essential gets disclosed so you can decide whether to upgrade it.</p>
<h4>3. Roadworthy, and is that the same as ready to camp in?</h4>
<div class="note note--warn"><b>Roadworthy is not the same as campable</b><p>A roadworthy asks whether the van is safe to tow on a public road. It does not ask whether the fridge works, whether the seals are sound, whether the hot water runs, whether the batteries hold charge, or whether you could live in it for a fortnight. Vans do pass a roadworthy while being perfectly towable and not remotely campable. If a seller offers a roadworthy as evidence of condition, they are answering a different question to the one you asked.</p></div>
<h4>4. Can I buy extended warranty cover with it?</h4>
<p>Extended warranty cover is issued <strong>as part of the contract of sale</strong>, and it requires the van to be roadworthy, structurally sound and with appliances operational when the cover is bought. That is only demonstrable off the back of a service, an inspection and a roadworthy, which is why it is available on a dealer sale and not a private one.</p>
<div class="note"><b>You cannot come back for it</b><p>You cannot buy privately, have the van serviced next month and then take out extended cover. The cover attaches to the sale. On a used van with appliances out of their original warranty, that usually matters.</p></div>
<h4>5. What does the handover involve?</h4>
<p>A private handover is whatever the seller knows and has time for. The difference shows up later and dealers see it plainly: in where owners are willing to travel, how the van has been maintained and stored, and what it is worth in five years. Someone shown how to level it properly, what to check after corrugations and how the charging system works looks after the van differently.</p>
<h4>A note on consignment</h4>
<p>Some used vans on a dealer&rsquo;s floor are consignment units, still owned by the previous owner and sold through the dealer&rsquo;s process. <strong>To you as a buyer this changes nothing</strong>, the same service, inspection, roadworthy and handover apply. It matters to the seller, who gets more than a trade-in price.</p>
<h3>If you are buying privately, do these five things</h3>
<ul><li><strong>Run a PPSR search</strong> before you hand over money. A couple of dollars tells you whether there is finance owing, whether it has been written off, and whether it is reported stolen. If money is owing, the financier can repossess it from you.</li><li><strong>Pay for an independent inspection</strong>, not the seller&rsquo;s mechanic. This is you buying the report a dealer would have handed you.</li><li><strong>Check the compliance plate against the paperwork</strong> and the VIN against the registration.</li><li><strong>Ask for all the service records</strong>, and budget for a service immediately.</li><li><strong>Weigh it loaded at a public weighbridge.</strong> Everything in section 2 applies to a used van.</li></ul>
<h3>What actually transfers with the van</h3>
<ul><li><strong>The builder&rsquo;s warranty</strong> often transfers, but rarely automatically, usually registration with the manufacturer inside a short window, thirty days being common.</li><li><strong>Component warranties frequently do not transfer at all.</strong> Fridges, heaters, air-conditioners, batteries and suspension are commonly warranted to the original owner only.</li><li><strong>An existing extended warranty can usually transfer</strong>, for a fee, within a deadline, and with the complete service history.</li></ul>
<p>Price this in. A private van with no appliance cover and no service, against a dealer van with both and an inspection report you can read, is a smaller gap than the sticker suggests, and sometimes no gap at all.</p>
<h4>When private genuinely is the better buy</h4>
<p>If the van is well out of its original warranty, if you are mechanically confident, and if you will do the PPSR check and pay for a proper inspection, private can be excellent value. Where it goes wrong is buying a van still inside warranty and assuming the cover comes with it, or treating a roadworthy as a condition report.</p>
<p><strong>General information, not legal advice.</strong> Consumer law varies by state and circumstance. Check your own state&rsquo;s fair trading guidance.</p>`,
      },
    ],
    locked: {
      heading: 'What the complete guide adds',
      blurb:
        'The four sections above are free and complete. The rest of the book covers the parts that need diagrams, tables and a workbook you can fill in.',
      items: [
        ['4', 'Chassis and suspension', 'What corrugations actually do to a trailer, and the difference between hot-dip galvanising and a thin zinc coating.'],
        ['5', 'Body construction', 'Timber, alloy frame, composite panel and moulded shell compared on how they behave over ten years.'],
        ['6', 'Living off-grid', 'Power, water and waste in realistic daily numbers, including what solar actually yields as opposed to what it is rated at.'],
        ['7', 'The options list trap', 'An 18-item checklist that forces every quote back to a like-for-like price.'],
        ['9', 'Twelve questions for any dealer', 'Ask all twelve, of everyone, including us. The answers do the sorting.'],
        ['10', 'When not to buy off-road', 'The section nobody else writes, because it occasionally costs us a sale.'],
      ],
      workbook: {
        name: 'The Trip Planning Workbook',
        detail:
          'Fillable. Your trip, your tow vehicle&rsquo;s numbers, your non-negotiables, your budget, and a three-van comparison table you can type into and save. Type into it on the iPad or print it and use a pen.',
      },
    },
    disclaimer:
      'This guide is general information prepared to help you ask better questions. It is not advice about any specific vehicle, and weight figures, regulations and specifications change. Always verify weights against the compliance plate of the actual van and the placard of your actual vehicle, and have any loaded rig weighed at a public weighbridge before travelling.',
    faqs: [
      {
        q: 'What is the difference between ATM and GTM on a caravan?',
        a: 'ATM (Aggregate Trailer Mass) is the maximum the loaded van may weigh when it is not coupled to a vehicle, and it includes the ball weight. GTM (Gross Trailer Mass) is the maximum that may sit on the van’s own axles when it is coupled, that is, ATM minus the ball weight. Both appear on the compliance plate.',
      },
      {
        q: 'Why can I not use my tow vehicle’s full towing capacity?',
        a: 'Because GCM (Gross Combination Mass) is usually less than GVM plus maximum towing capacity added together. A vehicle with a 3,050 kg GVM and a 3,500 kg tow rating may have a GCM of only 6,000 kg, not 6,550 kg. Towing a van at its full ATM therefore leaves far less vehicle weight available than most buyers expect.',
      },
      {
        q: 'How much payload does an off-road caravan need?',
        a: 'Payload is ATM minus tare. A realistic load for two people travelling off-grid, water, gas, food, clothing, tools, recovery gear, awning walls and camp furniture, commonly totals 478 to 638 kg. Treat any payload under 500 kg on a full off-road van as a serious question rather than a detail, because water alone can be 180 kg of it.',
      },
      {
        q: 'What is the difference between hot-dip galvanising and a zinc coating?',
        a: 'Hot-dip galvanising submerges the fabricated chassis in molten zinc at around 450 degrees Celsius, bonding it metallurgically to the steel and coating inside box sections and welds, typically 60 to 100 microns thick. Electroplated or zinc-coated finishes deposit a much thinner layer, often under 20 microns, and only where the current reaches. For a chassis they are not equivalent.',
      },
      {
        q: 'Should I buy a full off-road caravan or a hybrid?',
        a: 'It comes down to one trade: interior space against access and setup speed. A hybrid reaches campsites a full-size van cannot and gets you sleeping faster. A caravan gives you somewhere pleasant to sit when it rains for three days. Decide by picturing your worst-weather day rather than your best.',
      },
    ],
  },

  {
    slug: 'camp-set-up-guide',
    kind: 'guide',
    title: 'The Camp Set-Up Guide',
    edition: 'Edition 1 · 2026',
    tagline:
      'Arrive, set up, and be sitting down with a cold drink before anyone else has found their pegs.',
    pages: 37,
    readMins: 25,
    updated: 'July 2026',
    cover: '/guides/cover-camp-set-up-guide.jpg',
    ogImage: '/guides/cover-camp-set-up-guide.jpg',
    meta: {
      title:
        'Caravan Camp Set-Up Guide: Checklists, Levelling & Pack-Down | SEQ Campers',
      description:
        'A step-by-step guide to setting up and packing down an off-road camper, caravan or motorhome. Pre-departure checklists, site selection, levelling and stabilising, awnings and wind, plus a full pack-down list.',
    },
    cardLede:
      'The fix for slow setup is not expensive gear, it is sequence and habit. Checklists, tyre pressures, levelling in the right order, and a pack-down list that makes the costly omissions impossible.',
    whoFor:
      'Useful whether you already own something or are still shopping. If you are shopping, sections 1 and 4 tell you what to look for on a dealership floor and what to time with a stopwatch before you buy.',
    cardPoints: [
      'Pre-departure and fuel-stop checklists, including the walk-around that prevents the most common damage',
      'Tyre pressures for bitumen, gravel, corrugations and sand',
      'Levelling and stabilising in the right order, and why stabilisers are not jacks',
      'Power, water and waste, same sequence every time',
      'Awnings and wind: the most damaged item on any van',
      'A sixteen-point pack-down list, and managing resources on remote stays',
      'The after-trip hour: washing down, sealant inspection and battery storage',
    ],
    standfirst:
      'We are lazy campers, and we recommend it. Not lazy about the important things, lazy about the forty minutes of faffing that stands between arriving somewhere beautiful and actually enjoying it. The fix is not expensive gear. It is sequence and habit. <strong>The three sections below are the complete text from the guide, nothing held back.</strong>',
    stripeUrl: STRIPE.campSetUpPdf,
    sections: [
      {
        n: 1,
        id: 's1',
        title: 'Before you leave the driveway',
        html: `<p class="standfirst">Most of what goes wrong on a trip was already wrong before it started. Ten minutes in your own driveway, where you have tools, mains power and a phone signal, is worth two hours at a rest stop outside Roma.</p>
<h3>The night before</h3>
<ul class="check check--2"><li>Fresh water tanks filled to the level you actually need</li><li>Batteries charged and monitor showing what you expect</li><li>Fridge pre-cooled on mains power, and loaded cold</li><li>Gas bottles checked, turned off, and secured</li><li>Toilet cassette or tank emptied and rinsed</li><li>Grey water tank empty</li><li>Heavy items loaded low and over the axles, not in the rear</li><li>Everything that can slide, secured</li><li>Awning arms locked and travel catches engaged</li><li>Route planned, with a realistic arrival time before dark</li></ul>
<h3>The two-minute walk-around</h3>
<p>Do this every departure, in the same direction, starting at the coupling. Same direction every time is the whole trick, it turns a checklist into a habit you cannot skip halfway through.</p>
<ul class="check check--2"><li>Coupling seated, locked, and pin or lever secured</li><li>Safety chains crossed and shackled, not just hooked</li><li>Breakaway cable connected to the vehicle, not to the safety chain</li><li>Electrical plug in and seated; test lights</li><li>Jockey wheel fully wound up, swung clear and locked</li><li>All corner stabilisers fully retracted</li><li>Wheel nuts checked with a wrench, not a glance</li><li>Tyre pressures set for the road ahead, van and vehicle</li><li>Step retracted, doors and hatches latched, windows shut</li><li>TV aerial and satellite down; solar and roof items secure</li><li>Nothing left on the ground behind or beside the van</li><li>Mirrors adjusted for the van&rsquo;s width</li></ul>
<div class="note note--warn"><b>The one that catches everyone</b><p>Retracted stabilisers and a wound-up jockey wheel. Both are easy to forget because they are low and behind you, and both do expensive damage the moment you move. If you take one habit from this guide, make it the walk-around in a fixed direction.</p></div>`,
      },
      {
        n: 2,
        id: 's2',
        title: 'On the road',
        html: `<h3>Tyre pressures</h3>
<p>Pressures are the single biggest thing you control between the bitumen and the dirt, and the most commonly ignored. Running highway pressures on corrugations hammers the van, the contents and your fillings; running dirt pressures at highway speed builds heat and destroys tyres.</p>
<ul><li><strong>Bitumen:</strong> the manufacturer&rsquo;s placard figure, checked cold.</li><li><strong>Formed gravel and dirt:</strong> commonly 15 to 20% below highway pressure. The van rides noticeably better and so does everything inside it.</li><li><strong>Sustained corrugations:</strong> lower again, with speed reduced to match. Heat is the limit, stop and feel the tyres.</li><li><strong>Sand:</strong> substantially lower, with a very low speed and a compressor to reinflate before you return to a hard surface.</li></ul>
<p>Exact figures depend on your tyre, load and van, so establish yours with the manufacturer rather than borrowing someone else&rsquo;s from a forum. Then write them down so you are not guessing at a gate at dusk.</p>
<h3>At every fuel stop</h3>
<ul class="check check--2"><li>Walk a full lap of the rig</li><li>Hand on each wheel hub, unusual heat means a brake or bearing problem</li><li>Look at the tyres, including the inner tandem tyre people forget</li><li>Check coupling, chains and breakaway cable</li><li>Look underneath for anything hanging, dragging or dripping</li><li>Check the fridge is still running and holding temperature</li><li>Confirm nothing has shaken loose on the roof or A-frame</li></ul>
<h4>After the first hour of dirt</h4>
<p>Stop and check inside as well as out. Corrugations loosen things in a specific order: first the items you did not secure, then drawer catches, then fasteners. Finding a cupboard latch working itself open after an hour is useful information. Finding it after six hours, with the contents on the floor, is less so.</p>`,
      },
      {
        n: 4,
        id: 's4',
        title: 'Levelling and stabilising',
        html: `<p class="standfirst">This is the step everything else depends on. A van that is out of level cooks unevenly, drains badly, sleeps poorly and, with some absorption fridges, will not run properly at all.</p>
<h3>The order</h3>
<p><strong>Side to side first, then front to back.</strong> This order is not interchangeable and doing it backwards is why people end up levelling three times.</p>
<ul><li><strong>1. Side to side, while still hitched.</strong> Ramps or blocks under the low-side wheel, or air suspension if fitted. Tandem axles need both wheels supported, one ramp under a tandem lifts one wheel and loads the other.</li><li><strong>2. Chock the wheels.</strong> Both directions, before you unhitch. Not optional on any slope, however gentle.</li><li><strong>3. Unhitch and level front to back</strong> with the jockey wheel. Check with a level inside the van rather than the small bubble on the A-frame.</li><li><strong>4. Wind down the stabilisers last.</strong> All four, evenly, until they are firm, not until they lift the van.</li></ul>
<div class="note note--warn"><b>Stabilisers are not jacks</b><p>This is the most common preventable damage we see in the workshop. Corner steadies are designed to stop the van rocking, not to carry its weight or to level it. Winding them down hard enough to lift a corner bends the leg, twists the chassis mount and, on some builds, racks the body enough that doors and windows stop closing properly. Firm contact is the whole job. If the van still rocks, use pads under the feet on soft ground rather than more force.</p></div>
<h3>Soft and uneven ground</h3>
<ul><li>Use a broad pad under every stabiliser foot on sand, gravel or soft soil. A stabiliser that sinks overnight leaves you unlevel by morning.</li><li>On genuinely soft ground, put a pad under the jockey wheel too.</li><li>On a slope, always chock before unhitching. Always.</li><li>If you cannot get level within the range of your ramps and jockey wheel, move. It is not worth four days of a sloping bed.</li></ul>
<h4>If you are still shopping</h4>
<p>This section is a specification test. Ask to level and stabilise a van yourself on the lot, and time it. Electric or automatic levelling turns a ten-minute job into a button press, which sounds indulgent until you have done it three hundred times. Whether that is worth the money and the added complexity is a genuine question, but answer it deliberately rather than by accident.</p>`,
      },
    ],
    locked: {
      heading: 'What the complete guide adds',
      blurb:
        'The three sections above are free and complete. The rest of the book covers the parts you want in your hand at 4pm in the rain.',
      items: [
        ['3', 'Choosing your site', 'Walking it before you drive it, which way to point, and the unhitching rule.'],
        ['5', 'Power, water and waste', 'The same order every time, and why grey water containment is now enforced in more places than people realise.'],
        ['6', 'Outdoor living', 'Awnings, the most damaged item on any van, and almost all of it preventable.'],
        ['7', 'Weather and wind', 'Wind is what damages campers. What to do the evening before, not at 2am.'],
        ['8', 'Pack-down', 'A 16-point reverse sequence that makes the costly omissions impossible.'],
        ['9', 'Extended and remote stays', 'Resource budgeting past day four, when water and waste run out well before power does.'],
      ],
      workbook: {
        name: 'The Trip Log',
        detail:
          'Fillable. Your rig&rsquo;s numbers, your tyre pressures, emergency contacts, route and a sixteen-night log. It lives in the van and gets reused every trip.',
      },
    },
    disclaimer:
      'General guidance only, prepared to help you build good habits. Always follow the manufacturer’s instructions for your specific van and its appliances, and comply with the road rules and site regulations that apply where you are travelling.',
    faqs: [
      {
        q: 'What order should you level and stabilise a caravan?',
        a: 'Side to side first, while still hitched, using ramps or blocks under the low side. Then chock the wheels in both directions. Then unhitch and level front to back with the jockey wheel. Then wind the stabilisers down last, all four, evenly, until firm. Doing front to back before side to side is why people end up levelling three times.',
      },
      {
        q: 'Can you use caravan stabiliser legs to level the van?',
        a: 'No. Corner steadies are designed to stop the van rocking, not to carry its weight or to level it. Winding them down hard enough to lift a corner bends the leg, twists the chassis mount and can rack the body enough that doors and windows stop closing properly. Firm contact is the whole job.',
      },
      {
        q: 'What tyre pressure should you run on corrugated dirt roads?',
        a: 'Commonly 15 to 20 per cent below your highway pressure on formed gravel and dirt, lower again on sustained corrugations with speed reduced to match, and substantially lower on sand. Exact figures depend on your tyre, load and van, so establish yours with the manufacturer rather than borrowing them from a forum.',
      },
      {
        q: 'How much water do you need per person per day when camping off-grid?',
        a: 'Plan on 12 to 15 litres per person per day for frugal off-grid living, including drinking, cooking and quick showers. Two people for ten days is about 280 litres, which is also 280 kg of payload.',
      },
      {
        q: 'What is the most commonly forgotten caravan pre-departure check?',
        a: 'Retracted stabilisers and a wound-up jockey wheel. Both are easy to forget because they are low and behind you, and both do expensive damage the moment you move. Doing the walk-around in the same direction every time is what prevents it.',
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// ARTICLES - free, complete, no paywall. These are the AEO workhorses: they
// answer one high-intent search question properly and then point at the book.
// ---------------------------------------------------------------------------

export const articles = [
  {
    slug: 'caravan-weights-explained',
    kind: 'article',
    title: 'Caravan weights explained',
    eyebrow: 'Free · The whole section',
    tagline:
      'ATM, GTM, GVM, GCM, tare, payload and ball weight. What each one means, and the subtraction that catches people out.',
    readMins: 6,
    updated: 'July 2026',
    publishedAt: '2026-07-31',
    meta: {
      title:
        'Caravan Weights Explained: ATM, GTM, GVM, GCM and Payload | SEQ Campers',
      description:
        'ATM, GTM, GVM, GCM, tare, payload and ball weight explained in plain English, with the GCM calculation that catches out more Australian caravan buyers than anything else.',
    },
    cardLede:
      'Every buyer hits this and almost nobody is given a straight answer. The whole thing on one page: what each term means, where the numbers hide, and the calculation that catches out more caravan buyers in Australia than anything else.',
    standfirst:
      'Every buyer hits this and almost nobody is given a straight answer. Here is the whole thing in one page: what each term means, where the numbers hide, and the calculation that catches out more caravan buyers in Australia than anything else.',
    // Points at the Buyer's Guide, since this is section 2 of it
    relatedGuide: 'off-road-buyers-guide',
    relatedNote:
      'This is section 2 of the Off-Road Buyer&rsquo;s Guide. The rest covers build categories, chassis and suspension, body construction, off-grid systems, buying privately versus through a dealer, and twelve questions to ask anyone selling you a van, plus the fillable Trip Planning Workbook.',
    sections: [
      {
        n: 1,
        id: 's1',
        title: 'The words, in plain English',
        html: `<div class="tw"><table><thead><tr><th scope="col">Term</th><th scope="col">What it means</th><th scope="col">Where to find it</th></tr></thead><tbody><tr><td>Tare</td><td>The van as it left the factory, empty. Check what the manufacturer included, gas bottles and water are treated inconsistently.</td><td>Compliance plate</td></tr><tr><td>ATM</td><td>Aggregate Trailer Mass. The maximum the loaded van may weigh when it is <em>not</em> coupled. Includes ball weight.</td><td>Compliance plate</td></tr><tr><td>GTM</td><td>Gross Trailer Mass. The maximum that may sit on the van&rsquo;s own axles when it <em>is</em> coupled. ATM minus ball weight.</td><td>Compliance plate</td></tr><tr><td>Payload</td><td>ATM minus tare. Everything you own, eat, drink and carry.</td><td>Calculate it yourself</td></tr><tr><td>Ball weight</td><td>Downward mass on the tow ball. Commonly 8 to 12% of ATM on off-road vans.</td><td>Weigh it, do not trust the brochure</td></tr><tr><td>GVM</td><td>Gross Vehicle Mass. Maximum loaded weight of your tow vehicle alone, including the ball weight pressing down on it.</td><td>Vehicle placard</td></tr><tr><td>GCM</td><td>Gross Combination Mass. Maximum for vehicle and van together.</td><td>Vehicle placard</td></tr></tbody></table></div>`,
      },
      {
        n: 2,
        id: 's2',
        title: 'The GCM trap',
        html: `<p>Your vehicle has a GVM and a maximum braked towing capacity. Add them together and you will usually get a number <strong>larger</strong> than the GCM. That is not a misprint, it means you cannot legally use both maximums at once.</p>
<div class="note note--warn"><b>Worked example</b><p>A common dual-cab: GVM 3,050 kg. Braked towing capacity 3,500 kg. Added together, 6,550 kg. But the GCM is 6,000 kg. So if you tow a van loaded to its full 3,500 kg ATM, your vehicle may only weigh 2,500 kg, roughly its kerb weight before you add passengers, fuel, a bullbar, drawers, a fridge, or the 350 kg of ball weight the van puts on your towbar. The shortfall is 550 kg. That is not a rounding error.</p></div>`,
      },
      {
        n: 3,
        id: 's3',
        title: 'The payload trap',
        html: `<p>Manufacturers advertise ATM because it is a big number. Payload is the number that governs your life. A van with a 3,500 kg ATM and a 2,900 kg tare gives you 600 kg. That sounds generous until you start filling it:</p>
<div class="tw"><table><thead><tr><th scope="col">Item</th><th scope="col">Realistic weight</th></tr></thead><tbody><tr><td>Fresh water, 180 L</td><td>180 kg</td></tr><tr><td>Two full gas bottles (9 kg)</td><td>38 kg</td></tr><tr><td>Food, clothing, bedding, kitchen for two</td><td>90 to 130 kg</td></tr><tr><td>Tools, recovery gear, spares, second spare wheel</td><td>60 to 100 kg</td></tr><tr><td>Generator or extra battery</td><td>20 to 40 kg</td></tr><tr><td>Awning walls, mats, chairs, table, camp kitchen</td><td>40 to 70 kg</td></tr><tr><td>E-bikes or similar, if carried</td><td>50 to 80 kg</td></tr><tr><td><strong>Typical total</strong></td><td><strong>478 to 638 kg</strong></td></tr></tbody></table></div>
<p>Water is the surprise. It is the heaviest single thing you carry, and the more remote you go the more of it you need. A van marketed for extended off-grid travel with only 400 kg of payload is quietly telling you it does not expect you to fill its tanks and load it at the same time.</p>`,
      },
      {
        n: 4,
        id: 's4',
        title: 'Ball weight, and why the brochure figure misleads',
        html: `<p>Ball weight is the downward force the drawbar puts on your tow ball. It is carried by the <strong>vehicle</strong>, not the van, so it consumes your GVM, not your ATM. Commonly 8 to 12 per cent of ATM on an off-road van.</p>
<p>Published figures are almost always measured at tare, on an empty van. Loaded with water and gear it climbs, sometimes considerably. Many dual-cabs rated to tow 3,500 kg cap tow ball download at 350 kg, so a heavy van loaded to 10 per cent can sit within a few kilograms of the vehicle&rsquo;s limit.</p>
<div class="note"><b>Ask for a measured figure</b><p>Any dealer can tell you the brochure number. Ask what it weighs loaded, and whether they have actually put it on a scale. The answer tells you something either way.</p></div>`,
      },
      {
        n: 5,
        id: 's5',
        title: 'What to actually do about it',
        html: `<ul><li>Get the rig weighed loaded, at a public weighbridge, before your first big trip. Four corners if you can, side-to-side imbalance is common and rarely suspected.</li><li>Treat any payload under 500 kg on a full off-road van as a serious question, not a detail.</li><li>Ask whether the tare on the plate is for that exact van or a representative model. An option-heavy build can be 150 kg heavier than the brochure.</li><li>Do the GCM subtraction before you fall in love with anything: GCM minus the van&rsquo;s ATM equals the most your loaded vehicle may weigh.</li></ul>`,
      },
    ],
    faqs: [
      {
        q: 'What is the difference between ATM and GTM on a caravan?',
        a: 'ATM is the maximum the loaded van may weigh when it is not coupled to a vehicle, and it includes the ball weight. GTM is the maximum that may sit on the van’s own axles when it is coupled, ATM minus the ball weight. Both appear on the compliance plate.',
      },
      {
        q: 'Why can I not use my tow vehicle’s full towing capacity?',
        a: 'Because GCM is usually less than GVM plus maximum towing capacity added together. A vehicle with a 3,050 kg GVM and a 3,500 kg tow rating may have a GCM of only 6,000 kg, not 6,550 kg. Towing at full ATM therefore leaves far less vehicle weight available than most buyers expect.',
      },
      {
        q: 'How much payload does an off-road caravan need?',
        a: 'Payload is ATM minus tare. A realistic load for two people travelling off-grid commonly totals 478 to 638 kg. Treat any payload under 500 kg on a full off-road van as a serious question, because water alone can be 180 kg of it.',
      },
      {
        q: 'What is a normal ball weight for a caravan?',
        a: 'Commonly 8 to 12 per cent of ATM on an off-road van. It is carried by the tow vehicle, so it consumes your GVM rather than your ATM. Published figures are usually measured on an empty van and climb once it is loaded.',
      },
      {
        q: 'Does tare weight include water and gas?',
        a: 'It depends on the manufacturer, which is why it is worth asking. Some quote tare with empty tanks and no gas bottles; others include one bottle. Since 180 litres of water is 180 kg, the difference is not trivial.',
      },
    ],
    disclaimer:
      'General information only. Always verify weights and specifications against the compliance plate of the actual van and the placard of your actual vehicle, and have any loaded rig weighed at a public weighbridge before travelling.',
  },
]

export const allResources = [...guides, ...articles]

export function getResource(slug) {
  return allResources.find((r) => r.slug === slug)
}
