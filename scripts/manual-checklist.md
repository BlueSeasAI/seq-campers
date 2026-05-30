# Phase 1 Manual Verification Checklist

Run the automated test suite first (`.\scripts\test-local.ps1`). These manual checks cover the visual/interactive things the script cannot verify on its own.

Walk through them on the **preview URL** first (`develop--new-seqcampers-website.netlify.app`) before merging to main. Then repeat on production after Monday cutover.

## Home page

- [ ] **YouTube hero video** loops silently in the background, no controls visible, no "Watch on YouTube" suggestions at end of clip
- [ ] **Trust strip** under the hero shows 4 items in order:
  - [ ] Authorised Kimberley Kampers Dealer (with red tick)
  - [ ] Authorised Stockman Dealer (with red tick)
  - [ ] Australian Designed & Built (with circular green/gold AU badge image - the Nano Banana one)
  - [ ] 30 years on the Sunshine Coast (with red tick)
- [ ] **New SEQ logo** in the header (mountain illustration + "Campers There & Back")
- [ ] **Top-right nav CTA** says "Reserve a show slot" and links to `/brisbane-show-2026`
- [ ] **No "Home" item** in the nav
- [ ] **Real testimonials** section ("In their own words"):
  - [ ] Catherine Fabris quote about guide rollers + Grant fixing the van
  - [ ] David Poole quote about consignment + warranty work
  - [ ] T Ireland quote about KK Karavan + custom bbq table
- [ ] **Footer** shows real Marcoola address + showroom hours

## About page

- [ ] **Shane bio** says "Shane has called SEQ Campers home since 2013 and has been the proud owner since 2019"
- [ ] **Maud bio** says "Maud joined Shane in running the business in 2019"
- [ ] Page CTAs (bottom) point at Brisbane Show, not /contact

## Brisbane Show page (`/brisbane-show-2026`)

- [ ] **Hero band** shows dates (3-5 June 2026) and venue (Brisbane Showgrounds)
- [ ] **When/Where/Stand cards** at top
- [ ] **7 brand cards** in the grid:
  - [ ] Stockman Rover (with show special: Free 2000W inverter)
  - [ ] Stockman Trekka
  - [ ] Kimberley Karavan ($3,000 accessory credit)
  - [ ] Kimberley Kube
  - [ ] Kimberley Kruiswagen
  - [ ] Kimberley Kruiser T Class
  - [ ] Kimberley Kruiser S Class
- [ ] **On desktop:** each card shows a QR code on the right
- [ ] **On mobile:** QR codes are hidden, only "Build your spec" button shows
- [ ] **Scanning any QR code with phone camera** opens `seqcampers.com.au/quote/{brand}` (test against production once domain is live; on preview URL it'll point at the production domain regardless - that's intentional)

## Caravan detail pages (any caravan from /stock)

- [ ] **Video walkaround** section appears above the description (if Maud has added a video URL)
- [ ] **"Walkaround video" placeholder** shows when no video added yet
- [ ] **First video autoplays muted on loop** when present
- [ ] **Authorised Dealer mini-badge** matches the actual brand:
  - Kimberley listing → "Authorised Kimberley Kampers Dealer"
  - Stockman listing → "Authorised Stockman Dealer"
  - Non-K/S listing → no badge
- [ ] **"Build your spec + get a quote" button** routes to the right `/quote/{brand}` page based on the caravan's brand

## Quote pages (`/quote/{brand}` - test at least 2)

- [ ] **Brand-specific intro + indicative price** present
- [ ] **Show special** call-out present
- [ ] **5 radio key-choice groups** rendered (Power, Beds/Layout, Awning, Heater, Tow vehicle etc.)
- [ ] **Customer fields:** Name, Phone, Email, Additional notes
- [ ] **Click Send my spec to SEQ Campers**:
  - [ ] If you didn't fill in name/phone/email, an alert appears
  - [ ] If all filled, **your default email client opens** (Outlook, Gmail web, etc.)
  - [ ] The email is **prefilled to sales@seqcampers.com.au**
  - [ ] Subject = "Quote enquiry - [brand name]"
  - [ ] Body contains: greeting, brand name, build page URL, your details, your selected choices, your notes, sign-off
- [ ] **Once you send it (in your email client), check your sent folder** - the email should be there

## Contact page

- [ ] Phone, email, address cards at the top
- [ ] Map embed shows Marcoola (smaller than before)
- [ ] **Hours table is collapsed at the bottom** as a `<details>` element with summary "Mon-Wed 7:30am-3pm · Thu-Fri 8:30am-3pm · Sat 8:30am-12:30pm · Sun closed"
- [ ] Click "Show full week" to expand the full hours table

## Mobile-specific checks (open dev tools, set narrow viewport)

- [ ] Header collapses to hamburger menu
- [ ] Hero video still plays
- [ ] Brisbane Show QR cards stack vertically, QR codes hidden
- [ ] "Build your spec" button still visible on each brand card
- [ ] Quote page form is touch-friendly (radios easy to tap, inputs full-width)
- [ ] Contact page hours block summary readable on one or two lines

## Cross-cutting

- [ ] All pages load in < 3 seconds on the preview URL
- [ ] No console errors in browser dev tools
- [ ] Page titles + meta descriptions look right (View Source on any page, check `<title>` and `<meta name="description">`)

## After all the above pass

Only remaining must-have items:
1. **Sanity Studio redeploy** (Bart - `cd sanity && npm run deploy`)
2. **Range Rover data fix** in Sanity (Maud OR Bart)
3. **Domain cutover Monday 2026-06-01** (WP backup + DNS + verify)

Once all three are done, Phase 1 is shipped. Brisbane Show ready Wednesday 2026-06-03.
