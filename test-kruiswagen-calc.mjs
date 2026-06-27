// Standalone test harness - imports the REAL quote-builders data and
// replicates the exact on-road + weight formulas from quote/[slug].astro,
// then cross-checks against Maud's two spreadsheets.
import { getQuoteBuilder } from './src/data/quote-builders.js'

const brand = getQuoteBuilder('kruiswagen')
const onRoad = brand.onRoad
const w = brand.weight

// Flatten options to a lookup: id -> option
const optById = {}
brand.categories.forEach((c) => c.options.forEach((o) => { optById[o.id] = o }))

// getOptionPrice(optId, variantId) - mirrors the server-side pricePerVariant
function priceOf(optId, vid) {
  const o = optById[optId]
  if (!o) return undefined
  return o.priceByVariant ? o.priceByVariant[vid] : o.price
}
// isPresent - included on this variant (price 0) OR ticked
function isPresent(optId, vid, selected) {
  if (priceOf(optId, vid) === 0) return true
  return selected.has(optId)
}

function variantOf(vid) { return brand.variants.find((v) => v.id === vid) }

function onRoadFor(unitTotal) {
  const stamp = Math.round((onRoad.stampDutyRate || 0) * unitTotal)
  const rego = onRoad.registration || 0
  const delivery = onRoad.dealerDelivery || 0
  return { stamp, rego, delivery, total: stamp + rego + delivery }
}

function calc(vid, optIds) {
  const v = variantOf(vid)
  const selected = new Set(optIds)

  // options total (numeric prices only)
  let optionsTotal = 0
  for (const id of selected) {
    const p = priceOf(id, vid)
    if (typeof p === 'number') optionsTotal += p
  }
  const unitTotal = v.basePrice + optionsTotal
  const road = onRoadFor(unitTotal)
  const grand = unitTotal + road.total

  // weight: hardware kg only when a genuine paid add (price > 0)
  let added = 0
  for (const id of selected) {
    const p = priceOf(id, vid)
    if (typeof p === 'number' && p > 0) added += (w.weights[id] || 0)
  }
  const estTare = Math.round(v.tare + added)
  const hasGvmKit = isPresent(w.gvmOptionId, vid, selected)
  const gvm = hasGvmKit ? w.upgradedGvm : w.baseGvm
  const gross = gvm - estTare

  let fuel = w.fuelBase
  for (const f of (w.fuelExtra || [])) if (isPresent(f.optId, vid, selected)) fuel += f.kg
  let water = w.waterBase
  for (const wt of (w.waterExtra || [])) if (isPresent(wt.optId, vid, selected)) water += wt.kg
  const travel = w.passengers + fuel + water
  const ready = Math.round(gross - travel)

  let status
  if (ready >= 0) status = `WITHIN GVM (+${ready}kg spare)`
  else if (!hasGvmKit) status = `OVER by ${-ready}kg -> needs GVM kit`
  else status = `OVER by ${-ready}kg even WITH upgrade`

  return { optionsTotal, unitTotal, road, grand, estTare, gvm, hasGvmKit, fuel, water, travel, ready, status }
}

const money = (n) => '$' + n.toLocaleString('en-AU')
function show(title, vid, optIds) {
  const r = calc(vid, optIds)
  console.log(`\n=== ${title} ===`)
  console.log(`  base+options (unit): ${money(r.unitTotal)}   (options ${money(r.optionsTotal)})`)
  console.log(`  on-road: stamp ${money(r.road.stamp)} + rego ${money(r.road.rego)} + delivery ${money(r.road.delivery)} = ${money(r.road.total)}`)
  console.log(`  DRIVEAWAY: ${money(r.grand)}`)
  console.log(`  TARE ${r.estTare}kg | GVM ${r.gvm}kg${r.hasGvmKit ? ' (upgraded)' : ''} | fuel ${r.fuel} water ${r.water} travel-load ${r.travel}`)
  console.log(`  PAYLOAD ready-to-travel: ${r.ready}kg  ->  ${r.status}`)
  return r
}

console.log('################ KRUISWAGEN CALC TEST ################')

// A. Base Classic, no options - cross-check spreadsheet (payload 421kg)
const A = show('A. Base Classic (no options)', 'classic', [])

// B. Direct on-road formula vs Maud's Rego sheet example (C4=282,770 -> 19,829)
const B = onRoadFor(282770)
console.log(`\n=== B. On-road formula @ unit $282,770 (Maud's sheet example) ===`)
console.log(`  stamp ${money(B.stamp)} + rego ${money(B.rego)} + delivery ${money(B.delivery)} = ${money(B.total)}  (sheet: stamp 14,139 / total 19,829)`)

// C. Base EcoScape, no options (includes 86L tank as standard)
const C = show('C. Base EcoScape (no options)', 'ecoscape', [])

// D. Heavy Classic off-road build, no GVM kit -> should be OVER
const heavy = ['bullbar','winch','towbar','expedition-rack','swingaway-tyre','swingaway-gear',
  'gullwing','aeropod','sidesteps','underbody','large-fridge','battery-wiring','2nd-5000wh',
  '5000wh','spare-well-tank','2nd-tank','longtank2','snorkel','alloy-rims','full-walls']
const D = show('D. Heavy Classic build, NO GVM kit', 'classic', heavy)

// E. Same heavy build + GVM kit
const E = show('E. Heavy Classic build, WITH GVM kit', 'classic', [...heavy, 'gvm'])

// F. Moderate Classic + GVM kit -> within
const F = show('F. Moderate Classic + GVM kit', 'classic',
  ['alloy-rims','gvm','bullbar','winch','sidesteps','snorkel','bedouin'])

// G. Classic + BOTH water tanks - Bart/Maud logic test from the meeting: ~158kg
const G = show('G. Classic + both water tanks (2nd-tank 86L + spare-well 80L)', 'classic', ['2nd-tank','spare-well-tank'])

// ---- assertions ----
console.log('\n################ ASSERTIONS ################')
let pass = 0, fail = 0
function assert(name, cond) { if (cond) { pass++; console.log(`  PASS  ${name}`) } else { fail++; console.log(`  FAIL  ${name}`) } }

assert('A. base Classic payload == 421kg (spreadsheet)', A.ready === 421)
assert('A. base Classic on-road == $15,683', A.road.total === 15683)
assert('A. base Classic stamp == round(5% of 199,850) = 9,993', A.road.stamp === 9993)
assert("B. Maud's example total == $19,829", B.total === 19829)
assert("B. Maud's example stamp == $14,139", B.stamp === 14139)
assert('C. EcoScape counts included 86L water (water == 196)', C.water === 196)
assert('C. EcoScape base payload == 110kg', C.ready === 110)
assert('D. heavy no-kit is OVER GVM', D.ready < 0 && !D.hasGvmKit)
assert('D. heavy no-kit GVM still 4100', D.gvm === 4100)
assert('E. heavy WITH kit reads upgraded GVM 4430', E.gvm === 4430 && E.hasGvmKit)
assert('E. GVM kit adds 39kg vs scenario D', E.estTare === D.estTare + 39)
assert('F. moderate + kit is WITHIN GVM', F.ready >= 0 && F.hasGvmKit)
assert('on-road slides up with options (D total > A total)', D.road.total > A.road.total)
assert('G. Classic + both water tanks payload == 158kg (Bart/Maud logic test)', G.ready === 158)
assert('G. water deduction == 110 + 86 + 80 = 276kg', G.water === 276)

console.log(`\nRESULT: ${pass} passed, ${fail} failed`)
