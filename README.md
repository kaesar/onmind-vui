# OnMind-VUI v3

Visual User Interface (**VUI**) is a collection of native Web Components built with **SolidJS** for form data capture and content display. Inspired by **PrimeVue Volt** design principles but implemented without external dependencies for minimal bundle size.

## What's New in v3

- **SolidJS** instead of Vue 3 — framework-agnostic Web Components
- **Zero external dependencies** — only `solid-js` (~7KB gzipped)
- **Inline styles** — no CSS files, no Tailwind runtime
- **Dark mode support** — fully themed via `theme` attribute
- **Shadow DOM** — complete style encapsulation
- **`as-index` component** — card grid with filtering and tag search

## Components

Component | Description
-- | --
`as-input` | Text input with label, supports text/email/password/number
`as-text` | Multi-line textarea with label
`as-select` | Dropdown/select with options
`as-complete` | Autocomplete/combobox with filtering
`as-date` | Date picker with calendar dropdown
`as-time` | Time picker with hour/minute/AM-PM
`as-check` | Checkbox with label
`as-switch` | Toggle switch
`as-radio` | Radio button group
`as-upload` | File upload with drag-and-drop
`as-button` | Button with primary/secondary variants
`as-confirm` | Confirmation dialog
`as-event` | Input that dispatches custom events
`as-box` | Container card with theme propagation
`as-modal` | Modal dialog with slot
`as-popup` | Context menu with smart positioning
`as-datagrid` | Data table with sort, filter, pagination
`as-form` | Schema-driven form with validation
`as-index` | Card index with filtering and tag search
`as-image` | Centered image display
`as-video` | Video embed (YouTube/Vimeo)
`as-embed` | Responsive iframe embed (16:9)

## Usage

```html
<script type="module" src="dist/vui.js"></script>

<as-box theme="dark">
  <as-input label="Email" kind="email"></as-input>
  <as-button label="Submit" variant="primary"></as-button>
</as-box>
```

```javascript
import 'vui';

const form = document.createElement('as-form');
form.schema = { title: 'Login', fields: [...] };
document.body.appendChild(form);
```

## Development

1. Install dependencies: `bun install`
2. Start dev server: `bun start`
3. Build for production: `bun run build`

> Build output in: `dist/vui.js` (ESM, ~26KB gzipped)
