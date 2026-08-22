// ---------------------------------------------------------------------------
// quote-email - sends the customer their own copy of the indicative quote.
//
// WHY THIS EXISTS
// Both /quote forms are Netlify Forms and both notify SEQ only. The page has
// always said "We'll send the indicative quote to your email" and the button
// has always said "Email me my quote", but nothing ever sent it. Netlify's
// free tier silently drops template variables such as {{email}} in the
// notification recipient field (the UI accepts the save and then ignores it),
// so an autoresponder cannot be built in the Netlify dashboard at all. A
// function plus a transactional sender is the only route.
//
// WHAT IT DOES NOT DO
// It does not replace the Netlify Forms submission. The browser still posts
// the form to Netlify exactly as before, so SEQ's notification to
// sales@seqcampers.com.au is untouched and the form record is still the
// system of record. This is additive: one extra email to the buyer, with
// sales@ on BCC so the team sees the exact document the buyer received.
//
// CONFIGURATION (Netlify -> Site configuration -> Environment variables)
//   RESEND_API_KEY   required. Without it this function no-ops and returns
//                    200 {skipped:"not configured"}, so an unconfigured site
//                    behaves exactly like today rather than throwing errors
//                    at visitors.
//   QUOTE_FROM_EMAIL optional. Default "SEQ Campers <quotes@seqcampers.com.au>".
//                    The domain MUST be verified in Resend or every send
//                    fails with a 403.
//   QUOTE_BCC_EMAIL  optional. Default sales@seqcampers.com.au. Set to the
//                    string "none" to disable the BCC.
//   QUOTE_REPLY_TO   optional. Default sales@seqcampers.com.au.
// ---------------------------------------------------------------------------

const RESEND_ENDPOINT = 'https://api.resend.com/emails'

const BRAND = {
  sand: '#F4EDE0',
  sandDeep: '#E8E0D0',
  tan: '#DCCBA8',
  ink: '#2A1608',
  inkDeep: '#1a0e06',
  muted: '#8B6A40',
  rust: '#C0341A',
  gold: '#D4943A',
}

const SITE = 'https://seqcampers.com.au'
const PHONE_DISPLAY = '(07) 5370 7933'
const PHONE_HREF = '+61753707933'
const ADDRESS = '3B/6 Bonanza Court, Marcoola QLD 4564'

// Escape anything that reaches the HTML body. Every field here is visitor
// supplied, including the free-text message.
function esc(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function isEmail(value) {
  return typeof value === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

// The form posts total_indicative_price as a raw number string. Anything that
// is not a clean number passes through untouched so "POA" still reads.
function money(value) {
  const n = Number(value)
  if (!Number.isFinite(n) || String(value).trim() === '') return String(value || '')
  return '$' + Math.round(n).toLocaleString('en-AU')
}

// selected_options arrives as "Label ($1234) | Label (POA)". Split it back out
// so each option gets its own row.
function parseOptions(raw) {
  if (!raw) return []
  return String(raw)
    .split('|')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((entry) => {
      const m = entry.match(/^(.*)\s\(([^()]*)\)$/)
      if (!m) return { label: entry, price: '' }
      return { label: m[1].trim(), price: m[2].trim() }
    })
}

function buildHtml(d) {
  const options = parseOptions(d.selected_options)

  const optionRows = options.length
    ? options
        .map(
          (o) => `
            <tr>
              <td style="padding:9px 0;border-bottom:1px solid ${BRAND.tan};font:15px/1.45 Helvetica,Arial,sans-serif;color:${BRAND.ink};">${esc(o.label)}</td>
              <td style="padding:9px 0;border-bottom:1px solid ${BRAND.tan};font:15px/1.45 Helvetica,Arial,sans-serif;color:${BRAND.muted};text-align:right;white-space:nowrap;">${esc(o.price)}</td>
            </tr>`
        )
        .join('')
    : `<tr><td colspan="2" style="padding:9px 0;border-bottom:1px solid ${BRAND.tan};font:15px/1.45 Helvetica,Arial,sans-serif;color:${BRAND.muted};">No extra options selected. This is the standard build.</td></tr>`

  const messageBlock = d.message
    ? `
      <tr><td style="padding:0 32px 8px;">
        <div style="font:600 13px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.rust};padding-top:20px;">What you told us</div>
        <div style="font:15px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.ink};padding-top:8px;white-space:pre-wrap;">${esc(d.message)}</div>
      </td></tr>`
    : ''

  const specLink = d.spec_url || d.page_url || SITE + '/quote/'
  const modelLine = [d.brand_name, d.variant_name].filter(Boolean).map(esc).join(' ')
  const headline = esc(d.variant_name || d.brand_name || 'camper')

  return `<!doctype html>
<html lang="en-AU">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Your ${esc(d.brand_name)} quote</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.sandDeep};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your indicative ${headline} quote, ${money(d.total_indicative_price)}, plus the link to reopen and change your spec.</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.sandDeep};">
<tr><td align="center" style="padding:28px 12px;">

<table role="presentation" width="620" cellpadding="0" cellspacing="0" style="width:620px;max-width:100%;background:${BRAND.sand};border:1px solid ${BRAND.tan};border-radius:14px;overflow:hidden;">

  <tr><td style="background:${BRAND.ink};padding:24px 32px;">
    <div style="font:700 21px/1.2 Helvetica,Arial,sans-serif;color:${BRAND.sand};letter-spacing:.02em;">SEQ CAMPERS</div>
    <div style="font:13px/1.5 Helvetica,Arial,sans-serif;color:${BRAND.gold};padding-top:4px;">Your indicative quote</div>
  </td></tr>

  <tr><td style="padding:30px 32px 6px;">
    <div style="font:700 25px/1.25 Helvetica,Arial,sans-serif;color:${BRAND.ink};">Here is your ${headline} spec${d.lead_first_name ? ', ' + esc(d.lead_first_name) : ''}</div>
    <div style="font:16px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.muted};padding-top:12px;">
      This is the build you put together on our site, with the indicative pricing attached to it. Shane or one of the team will follow up within one business day. If you would rather talk it through now, call us on <a href="tel:${PHONE_HREF}" style="color:${BRAND.rust};text-decoration:none;font-weight:600;">${PHONE_DISPLAY}</a>.
    </div>
  </td></tr>

  <tr><td style="padding:24px 32px 0;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border:1px solid ${BRAND.tan};border-radius:10px;">
      <tr><td style="padding:20px 22px;">

        <div style="font:600 13px/1.4 Helvetica,Arial,sans-serif;letter-spacing:.08em;text-transform:uppercase;color:${BRAND.rust};">Your build</div>
        <div style="font:700 19px/1.3 Helvetica,Arial,sans-serif;color:${BRAND.ink};padding-top:6px;">${modelLine}</div>

        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;">
          <tr>
            <td style="padding:9px 0;border-bottom:1px solid ${BRAND.tan};font:15px/1.45 Helvetica,Arial,sans-serif;color:${BRAND.ink};font-weight:600;">Base ${headline}</td>
            <td style="padding:9px 0;border-bottom:1px solid ${BRAND.tan};font:15px/1.45 Helvetica,Arial,sans-serif;color:${BRAND.ink};font-weight:600;text-align:right;white-space:nowrap;">${money(d.variant_base_price)}</td>
          </tr>
          ${optionRows}
          <tr>
            <td style="padding:14px 0 0;font:700 17px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.ink};">Indicative total</td>
            <td style="padding:14px 0 0;font:700 17px/1.4 Helvetica,Arial,sans-serif;color:${BRAND.rust};text-align:right;white-space:nowrap;">${money(d.total_indicative_price)}</td>
          </tr>
        </table>

      </td></tr>
    </table>
  </td></tr>

  <tr><td style="padding:14px 32px 0;">
    <div style="font:13px/1.6 Helvetica,Arial,sans-serif;color:#6E5230;">
      Indicative only. It is a guide to help you plan, not a contract or a fixed offer. Final pricing depends on your build slot, the options confirmed at order, and any change to supplier pricing. Nothing here is binding until you have a signed order from us.
    </div>
  </td></tr>

  ${messageBlock}

  <tr><td align="center" style="padding:26px 32px 8px;">
    <a href="${esc(specLink)}" style="display:inline-block;background:${BRAND.rust};color:#ffffff;font:700 16px/1 Helvetica,Arial,sans-serif;text-decoration:none;padding:15px 30px;border-radius:8px;">Reopen and change your spec &rarr;</a>
  </td></tr>

  <tr><td align="center" style="padding:0 32px 28px;">
    <div style="font:13px/1.6 Helvetica,Arial,sans-serif;color:${BRAND.muted};">That link keeps every option you ticked. Change it as many times as you like, or send it to whoever is coming with you.</div>
  </td></tr>

  <tr><td style="background:${BRAND.inkDeep};padding:22px 32px;">
    <div style="font:600 15px/1.5 Helvetica,Arial,sans-serif;color:${BRAND.sand};">SEQ Campers</div>
    <div style="font:14px/1.7 Helvetica,Arial,sans-serif;color:${BRAND.tan};padding-top:6px;">
      ${ADDRESS}<br />
      <a href="tel:${PHONE_HREF}" style="color:${BRAND.gold};text-decoration:none;">${PHONE_DISPLAY}</a>
      &nbsp;&middot;&nbsp;
      <a href="${SITE}" style="color:${BRAND.gold};text-decoration:none;">seqcampers.com.au</a>
    </div>
    <div style="font:12px/1.6 Helvetica,Arial,sans-serif;color:#B79A6E;padding-top:12px;">You are getting this because you asked us to email you this quote from our website. Reply to this email and it comes straight to our sales team.</div>
  </td></tr>

</table>

</td></tr>
</table>
</body>
</html>`
}

function buildText(d) {
  const options = parseOptions(d.selected_options)
  const headline = d.variant_name || d.brand_name || 'camper'
  const lines = []
  lines.push(`Here is your ${headline} spec${d.lead_first_name ? ', ' + d.lead_first_name : ''}.`)
  lines.push('')
  lines.push([d.brand_name, d.variant_name].filter(Boolean).join(' '))
  lines.push(`Base ${headline}: ${money(d.variant_base_price)}`)
  if (options.length) {
    lines.push('')
    lines.push('Options you selected:')
    options.forEach((o) => lines.push(`- ${o.label}${o.price ? ' (' + o.price + ')' : ''}`))
  } else {
    lines.push('No extra options selected. This is the standard build.')
  }
  lines.push('')
  lines.push(`Indicative total: ${money(d.total_indicative_price)}`)
  lines.push('')
  lines.push('Indicative only. It is a guide to help you plan, not a contract or a fixed offer. Nothing here is binding until you have a signed order from us.')
  if (d.message) {
    lines.push('')
    lines.push('What you told us:')
    lines.push(String(d.message))
  }
  lines.push('')
  lines.push(`Reopen and change your spec: ${d.spec_url || d.page_url || SITE + '/quote/'}`)
  lines.push('')
  lines.push('Shane or one of the team will follow up within one business day.')
  lines.push('')
  lines.push('SEQ Campers')
  lines.push(ADDRESS)
  lines.push(`${PHONE_DISPLAY} . seqcampers.com.au`)
  return lines.join('\n')
}

export default async (req) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let data
  try {
    data = await req.json()
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Honeypot. The form carries the same bot-field Netlify Forms uses.
  if (data['bot-field']) {
    return new Response(JSON.stringify({ ok: true, skipped: 'honeypot' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const to = String(data.lead_email || '').trim()
  if (!isEmail(to)) {
    // Not an error the visitor should ever see. The Netlify Forms record
    // still exists, so SEQ can act on the lead regardless.
    return new Response(JSON.stringify({ ok: true, skipped: 'no valid email' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('quote-email: RESEND_API_KEY not set, customer copy not sent')
    return new Response(JSON.stringify({ ok: true, skipped: 'not configured' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const from = process.env.QUOTE_FROM_EMAIL || 'SEQ Campers <quotes@seqcampers.com.au>'
  const bcc = process.env.QUOTE_BCC_EMAIL || 'sales@seqcampers.com.au'
  const replyTo = process.env.QUOTE_REPLY_TO || 'sales@seqcampers.com.au'

  const subjectModel = [data.brand_name, data.variant_name].filter(Boolean).join(' ')
  const payload = {
    from,
    to: [to],
    reply_to: replyTo,
    subject: `Your ${subjectModel || 'SEQ Campers'} quote`,
    html: buildHtml(data),
    text: buildText(data),
  }
  if (bcc && bcc !== 'none') payload.bcc = [bcc]

  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const detail = await res.text()
      console.error('quote-email: Resend rejected the send', res.status, detail)
      return new Response(JSON.stringify({ ok: false, error: 'send failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await res.json()
    console.log('quote-email: sent', body.id, 'to', to)
    return new Response(JSON.stringify({ ok: true, id: body.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('quote-email: send threw', err)
    return new Response(JSON.stringify({ ok: false, error: 'send failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/quote-email' }
