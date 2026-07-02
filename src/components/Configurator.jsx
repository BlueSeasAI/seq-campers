import { useState, useMemo } from 'react'

/**
 * Caravan configurator - lets buyers toggle add-on options and see a live
 * running total. CTA opens an email to SEQ with the spec pre-filled.
 *
 * Props:
 *   basePrice (number)   - the caravan's base price in AUD
 *   options (array)      - [{ name, priceAdd }] from Sanity caravan.configurator
 *   caravanTitle (str)   - shown in the quote email subject + body
 *   caravanSlug (str)    - used to build the listing URL in the email body
 *   contactEmail (str)   - destination for the quote request (defaults to office@)
 *   siteBase (str)       - base URL of the site (used to build listing URL in email)
 *   isPlaceholder (bool) - if true, render a subtle note that these are sample options
 */
export default function Configurator({
  basePrice = 0,
  options = [],
  caravanTitle = 'this caravan',
  caravanSlug = '',
  contactEmail = 'sales@seqcampers.com.au',
  siteBase = 'https://seqcampers.com.au',
  isPlaceholder = false,
}) {
  const [selected, setSelected] = useState({})

  if (!options || options.length === 0) return null

  const toggle = (name) => {
    setSelected((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const selectedOptions = useMemo(
    () => options.filter((o) => selected[o.name]),
    [options, selected]
  )

  const addonsTotal = useMemo(
    () => selectedOptions.reduce((sum, o) => sum + (Number(o.priceAdd) || 0), 0),
    [selectedOptions]
  )

  const total = basePrice + addonsTotal

  const fmt = (n) => '$' + (Number(n) || 0).toLocaleString('en-AU')

  const mailto = useMemo(() => {
    const subject = `Quote request: ${caravanTitle}`
    const listingUrl = caravanSlug ? `${siteBase}/stock/${caravanSlug}` : ''
    const lines = [
      'Hi SEQ Campers,',
      '',
      `I am interested in: ${caravanTitle}`,
      listingUrl ? `Listing: ${listingUrl}` : '',
      `Base price: ${fmt(basePrice)}`,
      '',
      selectedOptions.length
        ? 'Optional extras I would like:'
        : 'Just the base unit for now - no extras.',
      ...selectedOptions.map((o) => `  - ${o.name} (+${fmt(o.priceAdd)})`),
      '',
      `Indicative total: ${fmt(total)}`,
      '',
      'Please send me a quote and let me know when I could come and inspect.',
      '',
      'Thanks,',
    ].filter(Boolean)

    return `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join('\n'))}`
  }, [caravanTitle, caravanSlug, basePrice, selectedOptions, total, contactEmail, siteBase])

  const resetAll = () => setSelected({})
  const anySelected = selectedOptions.length > 0

  return (
    <section className="configurator" aria-label="Build your spec">
      <div className="configurator-header">
        <div>
          <div className="page-eyebrow" style={{ color: '#C0341A' }}>Build your spec</div>
          <h2 className="configurator-title">Customise this caravan</h2>
          <p className="configurator-sub">
            Tick the upgrades you would like. Your total updates as you choose.
            When you are ready, hit "Get a quote" and we will reply with a written
            quote tailored to your selections.
          </p>
        </div>
        <div className="configurator-running">
          <div className="configurator-running-label">Indicative total</div>
          <div className="configurator-running-amount">{fmt(total)}</div>
          {anySelected && (
            <div className="configurator-running-breakdown">
              {fmt(basePrice)} base + {fmt(addonsTotal)} extras
            </div>
          )}
        </div>
      </div>

      {isPlaceholder && (
        <div className="configurator-placeholder-note">
          Sample options shown for illustration. The final option list for this
          caravan will appear here once SEQ Campers has loaded its specific
          configuration data into the system.
        </div>
      )}

      <ul className="configurator-options">
        {options.map((o, i) => {
          const checked = !!selected[o.name]
          return (
            <li key={o.name + i} className={'configurator-option' + (checked ? ' is-selected' : '')}>
              <label>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(o.name)}
                  aria-label={o.name}
                />
                <span className="opt-name">{o.name}</span>
                <span className="opt-price">+{fmt(o.priceAdd)}</span>
              </label>
            </li>
          )
        })}
      </ul>

      <div className="configurator-footer">
        <div className="configurator-total">
          <div>
            <div className="configurator-total-label">Total with selected extras</div>
            <div className="configurator-total-amount">{fmt(total)}</div>
          </div>
          {anySelected && (
            <button type="button" className="configurator-reset" onClick={resetAll}>
              Clear selections
            </button>
          )}
        </div>

        <a
          href={mailto}
          className="btn-primary configurator-cta"
          rel="nofollow"
        >
          Get a quote for {anySelected ? 'this build' : 'this caravan'}
        </a>

        <p className="configurator-note">
          Prices include GST. Final on-road quote will be confirmed in writing within
          one business day, including delivery, registration and any options not listed.
        </p>
      </div>
    </section>
  )
}
