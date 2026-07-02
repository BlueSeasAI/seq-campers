import React from 'react'

// Renders a standard Sanity field with a small coloured @sanity/icons SVG to
// the LEFT of its label. It delegates to props.renderDefault(props), so every
// default behaviour is preserved - validation, the required marker, the
// description, presence avatars, dropdowns, etc. We only add a left gutter and
// drop the icon into it.
//
// Usage in a schema field:
//   import { EditIcon } from '@sanity/icons'
//   import { withFieldIcon } from '../components/fieldIcon.jsx'
//   { name: 'title', type: 'string', components: { field: withFieldIcon(EditIcon) } }
//
// `color` defaults to the SEQ "muted" brand brown so the icons read as tasteful
// grey-with-a-touch-of-colour rather than flat grey or childish full-colour
// emoji. Pass a second arg to override per field, e.g. withFieldIcon(Icon, '#C0341A').
export function withFieldIcon(Icon, color = '#8B6A40') {
  return function FieldWithIcon(props) {
    return (
      <div style={{ position: 'relative', paddingLeft: '1.6em' }}>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: 0,
            top: '0.1em',
            color,
            display: 'inline-flex',
            fontSize: '1.15em',
            lineHeight: 1,
          }}
        >
          <Icon />
        </span>
        {props.renderDefault(props)}
      </div>
    )
  }
}
