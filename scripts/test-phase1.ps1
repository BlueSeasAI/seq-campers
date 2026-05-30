<#
.SYNOPSIS
    Phase 1 smoke tests for the SEQ Campers website.

.DESCRIPTION
    Probes the running site for every Phase 1 change covering Brisbane Show
    readiness (June 2026): nav cleanup, hero video, trust strip, real
    testimonials, real bios, contact reflow, Brisbane Show page + QR codes,
    7 brand quote pages with correct content + mailto submit, caravan detail
    CTA routing, video placement, Authorised Dealer pill, Australian Made.

    Designed as quick smoke tests, not full E2E. Each test is independent so
    a failure does not block the rest.

.PARAMETER BaseUrl
    The base URL of the site to test. Defaults to localhost:4400 (dev server).
    Set to the preview URL (develop--new-seqcampers-website.netlify.app) or
    production (new-seqcampers-website.netlify.app) when testing remotely.

.EXAMPLE
    .\test-phase1.ps1
    Tests against local dev server at http://localhost:4400.

.EXAMPLE
    .\test-phase1.ps1 -BaseUrl "https://develop--new-seqcampers-website.netlify.app"
    Tests against the branch preview deployment.

.EXAMPLE
    .\test-phase1.ps1 -BaseUrl "https://new-seqcampers-website.netlify.app"
    Tests against production.
#>

[CmdletBinding()]
param(
    [string]$BaseUrl = "http://localhost:4400"
)

$BaseUrl = $BaseUrl.TrimEnd('/')

# Track pass/fail counts for the final summary
$script:passCount = 0
$script:failCount = 0
$script:skipCount = 0
$script:results = @()

function Test-Page {
    param(
        [string]$Name,
        [string]$Path,
        [string[]]$MustContain = @(),
        [string[]]$MustNotContain = @(),
        [int]$ExpectedStatus = 200
    )

    $url = "$BaseUrl$Path"
    $result = [PSCustomObject]@{
        Name    = $Name
        Path    = $Path
        Status  = $null
        Pass    = $true
        Reason  = $null
    }

    try {
        $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 20 -ErrorAction Stop
        $result.Status = $r.StatusCode

        if ($r.StatusCode -ne $ExpectedStatus) {
            $result.Pass = $false
            $result.Reason = "Expected HTTP $ExpectedStatus, got $($r.StatusCode)"
        }
        else {
            foreach ($needle in $MustContain) {
                if ($r.Content -notmatch [regex]::Escape($needle)) {
                    # Also try with HTML-encoded ampersand
                    $encoded = $needle.Replace('&', '&amp;')
                    if ($r.Content -notmatch [regex]::Escape($encoded)) {
                        $result.Pass = $false
                        $result.Reason = "Missing: '$needle'"
                        break
                    }
                }
            }
            if ($result.Pass) {
                foreach ($antineedle in $MustNotContain) {
                    if ($r.Content -match [regex]::Escape($antineedle)) {
                        $result.Pass = $false
                        $result.Reason = "Unexpected: '$antineedle' still present"
                        break
                    }
                }
            }
        }
    }
    catch {
        $result.Pass = $false
        $result.Reason = "Probe failed: $($_.Exception.Message)"
    }

    $script:results += $result
    if ($result.Pass) { $script:passCount++ } else { $script:failCount++ }

    $icon = if ($result.Pass) { "OK  " } else { "FAIL" }
    $reason = if ($result.Reason) { " - $($result.Reason)" } else { "" }
    Write-Output ("  [{0}] {1}{2}" -f $icon, $Name, $reason)
}

function Group-Section {
    param([string]$Title)
    Write-Output ""
    Write-Output "=== $Title ==="
}

Write-Output ""
Write-Output "Running Phase 1 smoke tests against: $BaseUrl"
Write-Output "Started: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
Write-Output ("=" * 70)

# Tier 1: Layout + Navigation (P1.3, P1.4)
Group-Section "Nav + global layout"

Test-Page -Name "Home page loads" -Path "/" -MustContain @(
    "SEQ Campers"
)

Test-Page -Name "Home button removed from nav" -Path "/" -MustNotContain @(
    '">Home</a>'
)

Test-Page -Name "Top-right CTA = 'Reserve a show slot'" -Path "/" -MustContain @(
    'href="/brisbane-show-2026" class="nav-cta"'
    'Reserve a show slot'
)

Test-Page -Name "Brisbane Show promoted to top nav" -Path "/" -MustContain @(
    "/brisbane-show-2026"
    "Brisbane Show"
)

# Tier 2: Hero video (P1.2)
Group-Section "Hero video"

Test-Page -Name "Hero YouTube iframe present" -Path "/" -MustContain @(
    'youtube.com/embed/tozC7prVbOg'
    'autoplay=1'
    'mute=1'
    'loop=1'
    'controls=0'
    'class="hero-video-bg"'
)

Test-Page -Name "Old sunset SVG removed" -Path "/" -MustNotContain @(
    'class="hero-svg"'
    'class="hero hero-landscape"'
)

# Tier 3: Trust strip + Australian Made (P1 content)
Group-Section "Trust strip + Australian Made"

Test-Page -Name "Trust strip on home" -Path "/" -MustContain @(
    "trust-strip"
    "Authorised Kimberley Kampers Dealer"
    "Authorised Stockman Dealer"
    "Australian Designed"
    "30 years on the Sunshine Coast"
)

Test-Page -Name "AU badge image present (not SVG fallback)" -Path "/" -MustContain @(
    '/au-built-badge.png'
)

Test-Page -Name "New SEQ logo present in header" -Path "/" -MustContain @(
    '/seq-logo-new.png'
    'Campers There'
)

# Verify static assets are reachable
try {
    $au = Invoke-WebRequest -Uri "$BaseUrl/au-built-badge.png" -UseBasicParsing -TimeoutSec 10 -Method Head
    $logo = Invoke-WebRequest -Uri "$BaseUrl/seq-logo-new.png" -UseBasicParsing -TimeoutSec 10 -Method Head
    $auOk = $au.StatusCode -eq 200
    $logoOk = $logo.StatusCode -eq 200
    $icon = if ($auOk -and $logoOk) { "OK  " } else { "FAIL" }
    Write-Output ("  [{0}] au-built-badge.png reachable ({1} bytes)" -f $(if ($auOk) {"OK  "} else {"FAIL"}), $au.Headers.'Content-Length')
    Write-Output ("  [{0}] seq-logo-new.png reachable ({1} bytes)" -f $(if ($logoOk) {"OK  "} else {"FAIL"}), $logo.Headers.'Content-Length')
    if ($auOk) { $script:passCount++ } else { $script:failCount++ }
    if ($logoOk) { $script:passCount++ } else { $script:failCount++ }
} catch {
    Write-Output ("  [FAIL] Could not HEAD static assets: " + $_.Exception.Message)
    $script:failCount += 2
}

Test-Page -Name "Trust strip on stock listing" -Path "/stock" -MustContain @(
    "trust-strip"
)

# Tier 4: Real testimonials (content swap)
Group-Section "Testimonials (real Google reviews)"

Test-Page -Name "Testimonials section present" -Path "/" -MustContain @(
    "testimonial-card"
    "Real owners"
)

Test-Page -Name "Catherine Fabris (Willie & Cathy) review" -Path "/" -MustContain @(
    "Willie & Cathy"
    "guide rollers"
)

Test-Page -Name "David Poole review" -Path "/" -MustContain @(
    "David Poole"
    "consignment"
    "warranty"
)

Test-Page -Name "T Ireland review" -Path "/" -MustContain @(
    "T Ireland"
    "bbq table"
    "Weber"
)

Test-Page -Name "Placeholder testimonials removed" -Path "/" -MustNotContain @(
    "Mark & Janelle Whitfield"
    "Peter Hollis"
    "Lorraine Pretorius"
)

# Tier 5: About page bios (content swap)
Group-Section "About page - Shane + Maud bios"

Test-Page -Name "About page loads" -Path "/about" -MustContain @(
    "Off-road experts"
)

Test-Page -Name "Real Shane bio" -Path "/about" -MustContain @(
    "Shane has called SEQ Campers home since 2013"
    "proud owner since 2019"
    "mechanical background"
)

Test-Page -Name "Real Maud bio" -Path "/about" -MustContain @(
    "Maud joined Shane in running the business in 2019"
    "ethical, people-first service"
    "SEQ Campers family"
)

Test-Page -Name "Placeholder bios removed" -Path "/about" -MustNotContain @(
    "30 years on the tools"
    "Runs the showroom, the listings, and the long conversations"
)

# Tier 6: Contact page reflow (P1.10)
Group-Section "Contact page reflow"

Test-Page -Name "Contact page loads" -Path "/contact" -MustContain @(
    "6 Bonanza Ct"
    "Marcoola QLD 4564"
)

Test-Page -Name "Hours block now collapsed at bottom" -Path "/contact" -MustContain @(
    "hours-block-collapsed"
)

Test-Page -Name "Map embed marked as small" -Path "/contact" -MustContain @(
    "map-embed-small"
)

# Tier 7: Brisbane Show page (P1.5)
Group-Section "Brisbane Show 2026 page + QR codes"

Test-Page -Name "Brisbane Show page loads" -Path "/brisbane-show-2026" -MustContain @(
    "Brisbane Caravan Show"
    "3 - 5 June 2026"
    "Brisbane Showgrounds"
)

Test-Page -Name "QR grid section present" -Path "/brisbane-show-2026" -MustContain @(
    "qr-grid"
    "Build your spec"
)

Test-Page -Name "All 7 brand cards present" -Path "/brisbane-show-2026" -MustContain @(
    "Stockman Rover"
    "Stockman Trekka"
    "Kimberley Karavan"
    "Kimberley Kube"
    "Kimberley Kruiswagen"
    "Kimberley Kruiser T Class"
    "Kimberley Kruiser S Class"
)

Test-Page -Name "QR codes link to qrserver.com" -Path "/brisbane-show-2026" -MustContain @(
    "api.qrserver.com"
)

Test-Page -Name "Show specials present" -Path "/brisbane-show-2026" -MustContain @(
    "Show special"
    "Free 2000W inverter"
)

Test-Page -Name "Event + FAQ schema present" -Path "/brisbane-show-2026" -MustContain @(
    "schema.org"
    "FAQPage"
    "Event"
)

# Tier 8: 7 quote pages (P1.6) - the big one
Group-Section "Quote pages (7 brands, P1.6)"

$quoteBrands = @(
    @{ slug = "rover"; name = "Stockman Rover"; family = "Stockman"; price = '$89,000' },
    @{ slug = "trekka"; name = "Stockman Trekka"; family = "Stockman"; price = '$62,000' },
    @{ slug = "karavan"; name = "Kimberley Karavan"; family = "Kimberley"; price = '$145,000' },
    @{ slug = "kube"; name = "Kimberley Kube"; family = "Kimberley"; price = '$115,000' },
    @{ slug = "kruiswagen"; name = "Kimberley Kruiswagen"; family = "Kimberley"; price = '$295,000' },
    @{ slug = "kruiser-t"; name = "Kimberley Kruiser T Class"; family = "Kimberley"; price = '$185,000' },
    @{ slug = "kruiser-s"; name = "Kimberley Kruiser S Class"; family = "Kimberley"; price = '$225,000' }
)

foreach ($b in $quoteBrands) {
    Test-Page -Name "Quote page /quote/$($b.slug) - core content" -Path "/quote/$($b.slug)" -MustContain @(
        $b.name
        $b.family
        $b.price
        "Build your spec"
        "Show special"
        "Tell us what you want"
        "Your name"
        "Phone"
        "Email"
        'name="customer_name"'
        'name="customer_phone"'
        'name="customer_email"'
        "sales@seqcampers.com.au"
    )
}

Test-Page -Name "Quote page has 5 radio key-choice groups (Rover)" -Path "/quote/rover" -MustContain @(
    'name="choice_power"'
    'name="choice_beds"'
    'name="choice_awning"'
    'name="choice_heater"'
    'name="choice_tow"'
)

Test-Page -Name "Quote submit JS builds correct mailto" -Path "/quote/rover" -MustContain @(
    'mailto:sales@seqcampers.com.au'
    'Quote enquiry -'
)

Test-Page -Name "Stockman Rover show special (free inverter)" -Path "/quote/rover" -MustContain @(
    "Free 2000W inverter"
)

Test-Page -Name "Kimberley Karavan show special ($3K credit)" -Path "/quote/karavan" -MustContain @(
    "3,000 accessory credit"
)

# Tier 9: Caravan detail CTA routing (P1.7)
Group-Section "Caravan detail CTA routing to /quote/{brand}"

# Pull caravan slugs from the stock listing
try {
    $stock = Invoke-WebRequest -Uri "$BaseUrl/stock" -UseBasicParsing -TimeoutSec 15
    $caravanSlugs = [regex]::Matches($stock.Content, '/stock/([a-z0-9][a-z0-9-]+)') |
        ForEach-Object { $_.Groups[1].Value } |
        Where-Object { $_ -ne 'index' } |
        Sort-Object -Unique

    if ($caravanSlugs.Count -eq 0) {
        Write-Output "  [SKIP] No caravan listings found in stock - cannot test detail page CTA routing"
        $script:skipCount++
    }
    else {
        foreach ($slug in $caravanSlugs) {
            # Check the detail page has either /quote/ link or /contact link
            Test-Page -Name "Caravan /stock/$slug detail page loads with CTA" -Path "/stock/$slug" -MustContain @(
                "btn-enquire"
                "Build your spec + get a quote"
            )
        }
    }
}
catch {
    Write-Output "  [SKIP] Could not enumerate caravan listings: $($_.Exception.Message)"
    $script:skipCount++
}

# Tier 10: Sanity video display (P1.8)
Group-Section "Sanity video display on caravan detail"

# Look at the first caravan
if ($caravanSlugs -and $caravanSlugs.Count -gt 0) {
    $firstCaravan = $caravanSlugs | Select-Object -First 1

    Test-Page -Name "Video section above description (when video added)" -Path "/stock/$firstCaravan" -MustContain @(
        "See it in motion"  # Will appear if videos exist
    )
    # Note: this test will FAIL if Maud hasn't added a video yet - that's expected and informational

    Test-Page -Name "Video YouTube embed has clean params" -Path "/stock/$firstCaravan" -MustContain @(
        "modestbranding=1"
        "rel=0"
    )
}

# Tier 11: Authorised Dealer pill (P1.1)
Group-Section "Authorised Dealer pill (P1.1)"

if ($caravanSlugs -and $caravanSlugs.Count -gt 0) {
    foreach ($slug in $caravanSlugs) {
        $detail = Invoke-WebRequest -Uri "$BaseUrl/stock/$slug" -UseBasicParsing -TimeoutSec 15 -ErrorAction SilentlyContinue
        if ($detail) {
            $brandMatch = [regex]::Match($detail.Content, 'class="listing-brand"[^>]*>([^<]+)<')
            $hasBadge = $detail.Content -match 'trust-badge-mini'
            $badgeText = if ($detail.Content -match 'Authorised (Kimberley Kampers|Stockman) Dealer') { $Matches[0] } else { "none" }

            $brandText = if ($brandMatch.Success) { $brandMatch.Groups[1].Value.Trim() } else { "(no brand tag)" }

            $pass = $true
            $reason = ""

            if ($brandText -match "Kimberley" -and $badgeText -notlike "*Kimberley*") {
                $pass = $false; $reason = "Brand=Kimberley but badge=$badgeText"
            }
            elseif ($brandText -match "Stockman" -and $badgeText -notlike "*Stockman*") {
                $pass = $false; $reason = "Brand=Stockman but badge=$badgeText"
            }
            elseif ($brandText -notmatch "Kimberley|Stockman" -and $hasBadge) {
                $pass = $false; $reason = "Brand=$brandText (non-K/S) but pill displayed anyway"
            }

            $icon = if ($pass) { "OK  " } else { "FAIL" }
            $extra = if ($reason) { " - $reason" } else { " (brand: $brandText, badge: $badgeText)" }
            Write-Output ("  [{0}] Pill correct for /stock/{1}{2}" -f $icon, $slug, $extra)
            if ($pass) { $script:passCount++ } else { $script:failCount++ }
        }
    }
}

# Tier 12: Footer changes
Group-Section "Footer with real address + hours"

Test-Page -Name "Footer shows real address" -Path "/" -MustContain @(
    "6 Bonanza Ct"
    "Marcoola QLD 4564"
)

Test-Page -Name "Footer shows showroom hours" -Path "/" -MustContain @(
    "7:30am - 3pm"
    "Mon - Wed"
    "Saturday"
    "8:30am - 12:30pm"
)

# Summary
Write-Output ""
Write-Output ("=" * 70)
Write-Output "RESULT: $script:passCount passed, $script:failCount failed, $script:skipCount skipped"
Write-Output ""

if ($script:failCount -gt 0) {
    Write-Output "Failed tests:"
    $script:results | Where-Object { -not $_.Pass } | ForEach-Object {
        Write-Output "  - $($_.Name) ($($_.Path)): $($_.Reason)"
    }
    Write-Output ""
    exit 1
}
else {
    Write-Output "All passing tests are clean."
    exit 0
}
