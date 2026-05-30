# SEQ Campers - test scripts

Quick smoke tests for the Phase 1 (Brisbane Show 2026) website changes.

## Available scripts

| Script | What it does |
|---|---|
| `test-phase1.ps1` | Probes a running site against ~60 Phase 1 assertions. Pass `-BaseUrl` to point at any environment. |
| `test-local.ps1` | Starts the Astro dev server in the background, runs `test-phase1.ps1` against it, then stops the server. Run before pushing. |

## Usage

### Test the local dev server (recommended before pushing)

```powershell
.\scripts\test-local.ps1
```

This auto-starts/stops the dev server. Takes ~45 seconds end-to-end.

### Test against a manually-started dev server

In one terminal:
```powershell
npm run dev
```

In another:
```powershell
.\scripts\test-phase1.ps1
```

### Test against the branch preview

```powershell
.\scripts\test-phase1.ps1 -BaseUrl "https://develop--new-seqcampers-website.netlify.app"
```

### Test against production

```powershell
.\scripts\test-phase1.ps1 -BaseUrl "https://new-seqcampers-website.netlify.app"
```

## What's tested

The script runs ~60 assertions grouped into 12 tiers:

1. **Nav + global layout** - "Home" removed, "Reserve a show slot" CTA, Brisbane Show in top nav
2. **Hero video** - YouTube embed with autoplay/mute/loop/no-controls params, old SVG removed
3. **Trust strip + Australian Made** - all 4 trust items on home + stock pages
4. **Testimonials** - 3 real Google reviews (Catherine Fabris, David Poole, T Ireland), placeholders removed
5. **About bios** - real Shane (since 2013) + Maud (since 2019) bios wired in
6. **Contact reflow** - hours collapsed at bottom, smaller map
7. **Brisbane Show page** - 7 brand cards, QR codes via qrserver.com, show specials, FAQ + Event schema
8. **7 quote pages** - every `/quote/{slug}` page has correct brand content, indicative price, 5 radio key-choice groups, customer form, sales@seqcampers.com.au mailto target
9. **Stock detail CTA routing** - "Build your spec" button points at the right `/quote/{brand}` for each caravan
10. **Video display** - video block above description on detail pages, clean YouTube embed params
11. **Authorised Dealer pill** - matches actual brand on each caravan detail page (catches the Range Rover bug)
12. **Footer** - real Marcoola address + showroom hours

## Reading the output

- `[OK  ]` - assertion passed
- `[FAIL]` - assertion failed with reason
- `[SKIP]` - skipped (e.g. no caravan listings exist to test against)

Exit code is 0 if all green, 1 if any test failed. Run via CI by checking `$LASTEXITCODE`.

## Adding new tests

Open `test-phase1.ps1`, find the relevant `Group-Section` block, and add a new `Test-Page` call:

```powershell
Test-Page -Name "Friendly name" -Path "/some-path" -MustContain @(
    "expected substring"
) -MustNotContain @(
    "should-not-appear"
)
```

Each `Test-Page` is independent - a failure does not block subsequent tests.
