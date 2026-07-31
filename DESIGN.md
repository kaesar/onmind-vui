# VUI Design System Documentation

## Overview

VUI (Visual User Interface) is a collection of native Web Components (custom elements) built with **SolidJS** for form data capture and content display. Inspired by Volt/PrimeVue design principles but implemented without external dependencies for minimal bundle size.

## Design Principles

1. **Native Web Components** - Standard `<custom-element>` tags with Shadow DOM encapsulation (`mode: 'open'`)
2. **Framework Agnostic** - Works with any framework or vanilla HTML/JS via standard custom element interop
3. **Lightweight** - SolidJS runtime (~7KB gzipped) for minimal bundle size, zero external dependencies
4. **Accessible** - Semantic HTML, ARIA attributes, keyboard navigation
5. **Themeable** - Light/Dark mode support via `theme` attribute
6. **Composable** - Components work standalone or combined (e.g., `as-form` inside `as-modal`)
7. **Inline Styles** - All CSS is inline template-literal strings inside each component. No CSS files, no CSS variables, no Tailwind runtime

## Theming Architecture

### Two Theming Patterns

VUI uses two distinct patterns for theme-based color interpolation:

#### Pattern A: JS Interpolation (13 components)
Components read the `theme` signal and interpolate hex values directly into CSS via SolidJS template expressions. Re-rendering occurs when `theme` changes.

```typescript
const isDark = () => theme() === 'dark'
// ...
`border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};`
```

**Components using this pattern:** `as-input`, `as-text`, `as-complete`, `as-select`, `as-check`, `as-radio`, `as-switch`, `as-button`, `as-event`, `as-confirm`, `as-upload`

#### Pattern B: CSS `:host()` Selectors (2 components)
Components use CSS `:host([theme="dark"])` selectors for theme variants. CSS is static — no re-renders on theme change.

```css
.filter-input { border: 1px solid #d4d4d8; }
:host([theme="dark"]) .filter-input { border-color: #3f3f46; }
```

**Components using this pattern:** `as-index`, `as-datagrid`

### Theme Synchronization

Components that need to react to global page theme (VitePress/Astro/system) use `createThemeSync(this)` in `connectedCallback`:

**Components using global sync:** `as-index`, `as-box`, `as-modal`, `as-form`, `as-confirm`, `as-datagrid`

**Resolution order (first match wins):**
1. **Local lock** — if the element has a `theme` attribute at mount time, sync never overwrites it
2. **Explicit page theme** — `data-theme="dark|light"` or `data-appearance="dark|light"` on `<html>`, or `.dark`/`.light` class
3. **System/auto** — `data-theme="system"` or `"auto"`, follows `prefers-color-scheme: dark`
4. **Default** — `light`

---

## Input Surface Consistency

Input fields use theme-reactive backgrounds that adapt to the current theme, providing a cohesive visual experience within themed containers.

| Element | Light Theme | Dark Theme |
|---------|-------------|------------|
| Input / textarea / trigger background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> |
| Input / textarea / trigger text | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Input / textarea / trigger border | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> |
| Label | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> |
| SVG icon / chevron | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> |
| Placeholder | `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> |
| Hover border | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> | `#52525b` <span style="color: #52525b">&block;&block;&block;&block;</span> |
| Disabled background | `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;</span> | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> |
| Disabled text | `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> |

**Focus indicator:** `#3b82f6` (blue-500) — applied via border-color change on `:focus`/`:focus-within` for input-like components, and via `outline` on `:focus-visible` for custom-styled controls (checkboxes, radios, switches, buttons).

---

## Color System

### Light Theme (Default)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Primary actions, focus rings, active states |
| `--color-primary-hover` | `#2563eb` <span style="color: #2563eb">&block;&block;&block;&block;</span> | Primary button hover |
| `--color-primary-active` | `#1d4ed8` <span style="color: #1d4ed8">&block;&block;&block;&block;</span> | Primary button active |
| `--color-secondary-bg` | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> | Secondary buttons, input backgrounds |
| `--color-secondary-hover` | `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;</span> | Secondary button hover |
| `--color-background` | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | Page/card backgrounds |
| `--color-input-bg` | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | Input/textarea/trigger surfaces |
| `--color-text-primary` | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | Primary text, labels |
| `--color-text-secondary` | `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> | Muted text, disabled |
| `--color-text-disabled` | `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> | Disabled input text |
| `--color-border` | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> | Input borders, dividers |
| `--color-border-hover` | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> | Hover border states |
| `--color-border-focus` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | **Focus indicator** |
| `--color-border-disabled` | `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;</span> | Disabled border |
| `--color-checkbox-border` | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> | Checkbox borders |
| `--color-checkbox-bg` | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | Checkbox background |
| `--color-checkbox-checked` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Checked checkbox |
| `--color-switch-off` | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> | Switch off background |
| `--color-switch-on` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Switch on background |
| `--color-error` | `#ef4444` <span style="color: #ef4444">&block;&block;&block;&block;</span> | Error messages, destructive actions |
| `--color-success` | `#059669` <span style="color: #059669">&block;&block;&block;&block;</span> | Success messages |
| `--color-dropdown-bg` | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | Dropdown/overlay background |
| `--color-dropdown-border` | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> | Dropdown/overlay border |
| `--color-option-hover` | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> | Dropdown option hover |
| `--color-shadow` | `0 1px 2px 0 rgba(18,18,23,0.05)` | Input shadow |
| `--color-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1)` | Dropdown/modal shadow |

### Dark Theme (`theme="dark"`)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-primary` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Primary actions, focus rings |
| `--color-background` | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> | Container backgrounds |
| `--color-input-bg` | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> | Input/textarea/trigger surfaces |
| `--color-text-primary` | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> | Primary text |
| `--color-text-secondary` | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> | Secondary text |
| `--color-text-disabled` | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> | Disabled text |
| `--color-border` | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | Input borders, dividers |
| `--color-border-hover` | `#52525b` <span style="color: #52525b">&block;&block;&block;&block;</span> | Hover border states |
| `--color-border-focus` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | **Focus indicator** |
| `--color-checkbox-border` | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | Checkbox borders |
| `--color-checkbox-bg` | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> | Checkbox background |
| `--color-checkbox-checked` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Checked checkbox |
| `--color-switch-off` | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> | Switch off background |
| `--color-switch-on` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Switch on background |
| `--color-dropdown-bg` | `#18181b` <span style="color: #18181b">&block;&block;&block;&block;</span> | Dropdown/overlay background |
| `--color-dropdown-border` | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> | Dropdown/overlay border |
| `--color-option-hover` | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;</span> | Dropdown option hover |
| `--color-shadow` | `0 1px 2px 0 rgba(18,18,23,0.05)` | Input shadow |
| `--color-shadow-md` | `0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.4)` | Dropdown/modal shadow |

### Special Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-selected-option` | Light: `#eff6ff` <span style="color: #eff6ff">&block;&block;&block;&block;</span> / Dark: `#1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;</span> | Selected dropdown option background |
| `--color-selected-option-text` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Selected dropdown option text |
| `--color-row-hover` | Light: `#eff6ff` <span style="color: #eff6ff">&block;&block;&block;&block;</span> / Dark: `#1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;</span> | Datagrid row hover |
| `--color-row-selected` | Light: `#dbeafe` <span style="color: #dbeafe">&block;&block;&block;&block;</span> / Dark: `#1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;</span> | Datagrid selected row |
| `--color-tag-bg` | Light: `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> / Dark: `rgba(255,255,255,0.08)` | Tag background |
| `--color-tag-border` | Light: `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;</span> / Dark: `#6b7280` <span style="color: #6b7280">&block;&block;&block;&block;</span> | Tag border |
| `--color-tag-text` | Light: `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> / Dark: `#f3f4f6` <span style="color: #f3f4f6">&block;&block;&block;&block;</span> | Tag text |
| `--color-tag-selected-bg` | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> | Selected tag background |
| `--color-card-title` | Light: `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> / Dark: `#60a5fa` <span style="color: #60a5fa">&block;&block;&block;&block;</span> | Index card title |
| `--color-card-bg` | Light: `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> / Dark: `rgba(255,255,255,0.06)` | Index card background |

---

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
```

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| Datagrid Title | 1.25rem (20px) | 600 | 1.25 |
| Index Card Title | 0.9375rem (15px) | 600 | — |
| Label | 0.875rem (14px) | 500 | 1.43 |
| Input Text | 0.875rem (14px) | 400 | — |
| Button Text | 0.875rem (14px) | 500 | — |
| Small / Helper Text | 0.875rem (14px) | 400 | 1.43 |
| Datagrid Header | 0.75rem (12px) | 500 | 1.5 |
| Datagrid Cell | 0.9375rem (15px) | 400 | 1.5 |
| Time Display | 2.5rem (40px) | 300 | — |
| Notification Toast | 0.875rem (14px) | — | — |

---

## Spacing System

Based on 4px base unit (0.25rem):

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 0.25rem (4px) | Gap between label/input |
| `--space-2` | 0.5rem (8px) | Field gaps, padding |
| `--space-3` | 0.75rem (12px) | Option padding |
| `--space-4` | 1rem (16px) | Card padding |
| `--space-5` | 1.25rem (20px) | Switch width |
| `--space-6` | 1.5rem (24px) | Form section gaps |

### Input Padding

| Element | Padding | Height |
|---------|---------|--------|
| Text inputs | `0.375rem 0.625rem` (6px 10px) | ~24px |
| Select trigger | `0.375rem 0.625rem` (6px 10px) | ~32px (with arrow) |
| Filter input (datagrid) | `0.375rem 0.625rem` | ~24px |
| Filter input (index) | `0.5rem 0.75rem` | ~32px (pill-shaped) |
| Button | `0.5rem 0.75rem` | ~32px |
| Page button (datagrid) | `0.5rem 1rem` | ~32px |

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 0.25rem (4px) | Checkboxes |
| `--radius-md` | 0.375rem (6px) | Inputs, buttons, dropdowns, cards |
| `--radius-lg` | 0.5rem (8px) | Modals, upload area, datagrid |
| `--radius-full` | 20px | Index filter input (pill) |
| `--radius-switch` | 30px | Switch track |
| `--radius-switch-thumb` | 50% | Switch thumb |

---

## Focus Indicator System

### CSS Specificity Rule (Critical)

When a component has both `:hover` and `:focus` styles on the same element, the `:hover` selector must **not** have higher CSS specificity than the `:focus` selector. Otherwise, clicking an input (which activates both `:hover` and `:focus` simultaneously) will show the hover border instead of the focus border. The focus color only appears after moving the mouse (deactivating `:hover`).

**Correct pattern:**
```css
input:hover:not(:disabled) { border-color: <hover-color>; }  /* specificity: (0,0,2,1) */
input:focus:not(:disabled) { border-color: #3b82f6; }         /* specificity: (0,0,2,1) — equal, source order wins */
```

**Broken pattern:**
```css
input:hover:not(:disabled) { border-color: <hover-color>; }  /* specificity: (0,0,2,1) */
input:focus { border-color: #3b82f6; }                         /* specificity: (0,0,1,1) — loses! */
```

### Focus Strategies by Component Type

#### Strategy A: Border-color on `:focus` (input-like components)
Native `input`/`textarea` elements and custom trigger divs that use border-color for focus:

| Component | Selector | Focus Color |
|-----------|----------|-------------|
| `as-input` | `input:focus:not(:disabled)` | `#3b82f6` |
| `as-text` | `textarea:focus:not(:disabled)` | `#3b82f6` |
| `as-complete` | `input:focus:not(:disabled)` | `#3b82f6` |
| `as-select` | `.select-trigger:focus:not([aria-disabled="true"])` | `#3b82f6` |
| `as-event` | `.event-trigger:focus:not([aria-disabled="true"])` | `#3b82f6` |
| `as-date` | `.date-trigger:focus-within:not([aria-disabled="true"])` | `#3b82f6` |
| `as-time` | `.time-trigger:focus-within:not([aria-disabled="true"])` | `#3b82f6` |
| `as-datagrid` | `:host([theme="dark"]) .filter-input:focus` + `.filter-input:not(:disabled):focus` | `#3b82f6` |
| `as-index` | `.filter-input:focus` | `#3b82f6` |

All use `transition: border-color 0.2s` for smooth animation and `outline: none` to suppress native outline.

#### Strategy B: Outline on `:focus-visible` (custom-styled controls)
Components where native element appearance is fully replaced (`appearance: none`):

| Component | Selector | Focus Indicator |
|-----------|----------|----------------|
| `as-button` (primary) | `.primary:focus-visible` | `outline: 1px solid #3b82f6; outline-offset: 2px` |
| `as-button` (secondary) | `.secondary:focus-visible` | `outline: 1px solid #52525b; outlineOffset: 2px` |
| `as-check` | `input[type="checkbox"]:focus-visible` | `outline: 1px solid #3b82f6; outline-offset: 2px` |
| `as-radio` | `input[type="radio"]:focus-visible` | `outline: 1px solid #3b82f6; outline_offset: 2px` |
| `as-switch` | `.switch:focus-visible` | `outline: 1px solid #3b82f6; outline_offset: 2px` |

**Note:** `:focus-visible` only triggers on keyboard navigation (not mouse clicks), avoiding visual noise for mouse users. These components don't have `:hover` rules that conflict with `:focus-visible` since `outline` and `border-color` are independent properties.

---

## Component Specifications

### Form Input Components

#### `as-input`
Text input with label, supporting `text`, `email`, `password`, `number` types via `kind` attribute.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `''` | Label text |
| `value` | string | `''` | Input value |
| `placeholder` | string | `label` | Placeholder text |
| `kind` | `text\|email\|password\|number` | `'text'` | Input type |
| `theme` | `light\|dark` | `''` | Theme variant |
| `readonly` | boolean | `false` | Read-only state |
| `disabled` | boolean | `false` | Disabled state |

**Events:** `value-changed` (detail: `{ value }`)

**Styling:**
- Label: 14px, 500 weight, `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> / `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> (dark)
- Input surface: `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> / `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> (dark)
- Focus border: `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> via `input:focus:not(:disabled)`
- Placeholder: `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> / `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> (dark)
- Disabled: `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;"></span> bg / `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;"></span> bg (dark)

#### `as-text`
Multi-line textarea component.

**Attributes:** Same as `as-input` plus `rows` (default: 3)

**Styling:** Same input surface consistency as `as-input`.

#### `as-select`
Dropdown/select component with options format `label=Label,value=value`.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `''` | Label text |
| `value` | string | `''` | Selected value |
| `options` | string | `'label=A,value=A;label=B,value=B'` | Options in delimited format |
| `theme` | `light\|dark` | `''` | Theme variant |
| `readonly` | boolean | `false` | Read-only state |
| `disabled` | boolean | `false` | Disabled state |

**Options format:** `label=Label,value=value;label=Label2,value=value2`

**Events:** `value-changed` (detail: `{ value }`)

**Styling:** Trigger uses `:focus:not([aria-disabled="true"])` for focus border. Dropdown adapts to theme.

#### `as-complete`
Autocomplete/combobox with filtering and optional remote data loading.

**Performance:** Options are parsed once via `createMemo` (re-parsed only when `options` attribute changes). Filtering is also memoized and debounced (150ms) to avoid churn on rapid typing.

**Light theme:**
| Element | Style |
|---------|-------|
| Input background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Dropdown background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> |
| Option hover | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> |

**Dark theme:**
| Element | Style |
|---------|-------|
| Input background | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;</span> |
| Input text | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Dropdown background | `#18181b` <span style="color: #18181b">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> |
| Option hover | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;</span> |

**Attributes:** Same as `as-select` plus:
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `src` | string | `''` | URL to fetch options JSON from |
| `placeholder` | string | label value | Input placeholder text |

**Events:** `value-changed` (detail: `{ value }`)

**Data sources (either works):**
```html
<!-- Via options attribute (local) -->
<as-complete options="label=JS,value=js;label=TS,value=ts"></as-complete>

<!-- Via src attribute (fetch JSON array with label/value) -->
<as-complete src="/api/tags.json"></as-complete>
```

#### `as-date`
Date picker with calendar dropdown. Uses `focus-within` on a composite trigger div containing an inner `<input class="date-input">`.

**Styling:** Trigger follows surface consistency. Calendar dropdown adapts to theme.

**Light theme:**
| Element | Style |
|---------|-------|
| Trigger surface | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> bg, `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> text |
| Dropdown background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> |
| Day hover | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> |
| Day selected | `background: #3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span>, text `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Day text | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> |
| Weekday label | `#71717a` <span style="color: #71717a">&block;&block;&block;&block;</span> |

**Dark theme:**
| Element | Style |
|---------|-------|
| Dropdown background | `#18181b` <span style="color: #18181b">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> |
| Day hover | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;</span> |
| Day selected | `background: #3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span>, text `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Day text | `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;</span> |
| Weekday label | `#a1a1aa` <span style="color: #a1a1aa">&block;&block;&block;&block;</span> |

**Attributes:** `label`, `value` (YYYY-MM-DD), `placeholder`, `theme`, `readonly`, `disabled`

**Events:** `value-changed` (detail: `{ value }`)

**Input mask & validation:** The input applies a mask that auto-inserts `-` separators as the user types digits (e.g., `20241212` → `2024-12-12`). When the masked result is a complete valid date, the calendar syncs to the typed month/year and `value-changed` is dispatched. Validation runs on blur: if the value is incomplete or invalid, the border turns red (`#ef4444`), an error message appears below the input, and the input restores to the last valid value. The blue focus border (`#3b82f6`) takes precedence over red while focused. Pressing Tab while the popup is open closes it before moving focus to the next field (the icon span has `tabindex="-1"` to exclude it from the tab order).

#### `as-time`
Time picker with hour/minute/AM-PM selectors. Uses `focus-within` on a composite trigger.

**Light theme:**
| Element | Style |
|---------|-------|
| Trigger surface | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> bg |
| Dropdown background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;</span> |
| Time display | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;</span> |
| Option hover | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> |
| Option selected (column) | `#eff6ff` <span style="color: #eff6ff">&block;&block;&block;&block;</span> bg, `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> text |
| Option selected (AM/PM) | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> bg, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |

**Dark theme:**
| Element | Style |
|---------|-------|
| Dropdown background | `#18181b` <span style="color: #18181b">&block;&block;&block;&block;</span> |
| Dropdown border | `#d4d4e7` <span style="color: #d4d4e7">&block;&block;&block;&block;"></span> |
| Time display | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> |
| Option hover | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;"></span> |
| Option selected (column) | `#1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;"></span> bg, `#60a5fa` <span style="color: #60a5fa">&block;&block;&block;&block;"></span> text |
| Option selected (AM/PM) | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> bg, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |

**Input mask & validation:** The input applies a mask that auto-inserts the `:` separator as the user types digits (e.g., `1430` → `14:30`). When the masked result is a complete valid time, the clock selector syncs and `value-changed` is dispatched. Validation runs on blur: if the value is incomplete or invalid, the border turns red (`#ef4444`), an error message appears below the input, and the input restores to the last valid value. The blue focus border takes precedence while focused. Pressing Tab while the popup is open closes it before moving focus to the next field (the icon span has `tabindex="-1"` to exclude it from the tab order).

#### `as-check`
Single checkbox with label.

**Attributes:** `label`, `checked` (boolean), `theme`, `readonly`, `disabled`

**Events:** `checked-changed` (detail: `{ value: boolean }`)

**Styling:** `appearance: none`, 1.25rem square, `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span> for checked state. Focus via `:focus-visible` with `outline: 1px solid #3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span>; outline-offset: 2px`.

#### `as-switch`
Toggle switch component. Uses a custom `<div role="switch">` with `tabIndex={0}`.

**Attributes:** Same as `as-check`

**Events:** `checked-changed` (detail: `{ value: boolean }`)

**Styling:** 2.5rem × 1.5rem track with 1rem handle. `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> when on. Focus via `:focus-visible` with outline.

#### `as-radio`
Radio button group.

**Attributes:** `label`, `value`, `options` (same format as select), `theme`, `readonly`, `disabled`

**Events:** `value-changed` (detail: `{ value }`)

**Styling:** 1.25rem circle, `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> for checked state. Focus via `:focus-visible` with outline.

#### `as-upload`
File upload with drag-and-drop.

**Attributes:**
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `'Upload files'` | Label text |
| `accept` | string | `'*'` | File accept types |
| `multiple` | boolean | `false` | Allow multiple files |
| `theme` | `light\|dark` | `''` | Theme variant |
| `disabled` | boolean | `false` | Disabled state |

**Events:** `files-selected` (detail: `{ files: File[] }`)

---

### Layout Components

#### `as-box`
Container card component. Manually applies theme-based styles via imperative `applyStyles()`.

**Attributes:**
| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `dim` | `true\|false` | `'false'` | Dimmed variant |
| `theme` | `light\|dark` | `'light'` | Theme |

**Slots:** Default slot for child components

**Theme Propagation:** Automatically sets `theme` attribute on slotted child elements when container has `theme="dark"`.

#### `as-modal`
Modal dialog with slot for content.

**Attributes:** `title`, `theme`

**Methods:** `show()`, `hide()`

**Events:** `modal-close`

**Slots:** Default slot for form/content

**Theme Sync:** Uses `createThemeSync(this)` — automatically reacts to VitePress/Astro/system theme changes. Propagates theme to slotted content.

---

### Data Display Components

#### `as-datagrid`
Feature-rich data table with filtering, sorting, pagination, and row selection.

**Performance:** The data pipeline (filter → sort → paginate) is fully memoized with `createMemo`. Each step only recomputes when its direct dependencies change. Filter input has 300ms debounce. CSS is static via `:host()` selectors — theme changes do not cause re-renders.

**Properties (JavaScript):**

| Property | Type | Description |
|----------|------|-------------|
| `data` | `Array<Object>` | Row data |
| `columns` | `Array<{key, header}>` | Column definitions |
| `selectable` | boolean | Enable row selection |
| `pageable` | boolean | Enable pagination |
| `filterable` | boolean | Enable filtering |
| `actionable` | boolean | Show action menu |
| `pageSize` | number | Rows per page (default: 50) |
| `title` | string | Table title |

**Events:**
- `row-select` (detail: `{ row, id }`)
- `row-action` (detail: `{ row, id, event }`)

**Styling — Light theme:**
| Element | Style |
|---------|-------|
| Container background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Thead background | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span> |
| Row hover | `#eff6ff` <span style="color: #eff6ff">&block;&block;&block;&block;"></span> |
| Row selected | `background: #dbeafe` <span style="color: #dbeafe">&block;&block;&block;&block;"></span> |
| Filter input | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> bg, `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;"></span> border |
| Focus border | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> via `:host([theme="dark"]) .filter-input:focus` (dark mode) and `.filter-input:not(:disabled):focus` (light mode) |
| Page buttons | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> bg, `#d4d4d8` <span style="color: #d4d4d8">&block;&block;&block;&block;"></span> border |

**Styling — Dark theme (`theme="dark"`):**
| Element | Style |
|---------|-------|
| Container background | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;"></span> |
| Thead background | `#18181b` <span style="color: #18181b">&block;&block;&block;&block;"></span> |
| Row hover | `#1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;"></span> |
| Row selected | `background: #1e3a5f` <span style="color: #1e3a5f">&block;&block;&block;&block;"></span> |
| Filter input | `#09090b` <span style="color: #09090b">&block;&block;&block;&block;"></span> bg, `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;"></span> border |
| Page buttons | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;"></span> bg, `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;"></span> border |

**Attributes:** `selectable`, `pageable`, `filterable`, `actionable`, `theme`, `title`

#### `as-image`
Centered image display.

**Attributes:** `url`

#### `as-video`
Responsive video iframe (YouTube/Vimeo).

**Attributes:**
| Attribute | Type | Default |
|-----------|------|---------|
| `url` | string | `''` |
| `width` | number | `560` |
| `height` | number | `315` |

Responsive - auto-adjusts to 310×175 on screens < 560px.

#### `as-embed`
Responsive iframe embed (16:9 aspect ratio).

**Attributes:** `url`, `width` (default: 1200), `height` (default: 675)

---

### Form Composition

#### `as-form`
Schema-driven form generator with validation.

**Attributes:** `theme`, `successMessage`, `errorMessage`, `hideTitle`

**Properties (JavaScript):**

```javascript
form.schema = {
  title: 'Form Title',
  sections: [
    { title: 'Section', fields: [ ... ] }
  ],
  // or flat fields:
  fields: [ ... ],
  submitLabel: 'Save',
  cancelLabel: 'Cancel',
  hideCancelButton: false,
  skipActions: false
}
```

**Field Schema:**

```javascript
{
  name: 'fieldName',         // required
  type: 'text|email|password|number|textarea|select|switch|date|time|complete|radio|checkbox|upload',
  label: 'Field Label',
  value: '',                 // default value
  placeholder: '',
  required: false,
  disabled: false,
  readonly: false,
  validation: ['required', 'email', 'min:8'],  // validation rules
  options: [                 // for select/radio/complete
    { label: 'Option', value: 'value' }
  ],
  rows: 3,                   // for textarea
  accept: '*',               // for upload
  multiple: false            // for upload
}
```

**Methods:**
- `form.getFormData()` → `Object`
- `form.setFormData(data)` → `void`
- `form.clearErrors()` → `void`
- `form.validate()` → `boolean`

**Events:** `form-submit` (detail: `{ formData }`), `form-cancel`, `field-change` (detail: `{ fieldName, value, formData }`)

#### `as-index`
Card index with filtering and tag-based search. Displays a responsive grid of linked cards.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `title` | string | `''` | Optional heading |
| `src` | string | `''` | URL to fetch JSON data from |
| `lang` | string | `''` | Language filter (e.g. `en`, `es`) |
| `filtering` | boolean | `false` | Enable filter input + tag filter |
| `theme` | `light\|dark` | `''` | Theme |

**Properties (JavaScript):**

| Property | Type | Description |
|----------|------|-------------|
| `items` | `CardItem[]` | Array of card objects |

**CardItem shape:**

| Field | Type | Description |
|-------|------|-------------|
| `title` / `name` | string | Card heading |
| `description` | string | Card body text |
| `url` | string | Link target |
| `tags` | string[] | Tag labels (for tag filter) |
| `language` | string | Language code for filtering |
| `hide` | boolean | If true, item is filtered out |

**Events:**
- `card-click` (detail: `{ item }`)

**Styling — Light theme:**
| Element | Style |
|---------|-------|
| Card background | `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;</span> |
| Card shadow | `0 3px 10px 0 #aaa` |
| Card hover | `scale(1.05)`, shadow `0 4px 14px 0 #3b82f6` |
| Card title | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span>, `font-weight: 600` |
| Card description | `#4b5563` (via label-style color) |
| Tag background | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;"></span> |
| Tag border | `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;"></span> |
| Tag text | `#3f3f46` <span style="color: #3f3f46">&block;&block;&block;&block;"></span> |
| Tag hover | `#e4e4e7` <span style="color: #e4e4e7">&block;&block;&block;&block;"></span> bg, `#111827` <span style="color: #111827">&block;&block;&block;&block;"></span> text |
| Tag selected | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> bg/border, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |
| Filter input | `#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;"></span> bg, `border-radius: 20px` (pill) |

**Styling — Dark theme (`theme="dark"`):**
| Element | Style |
|---------|-------|
| Card background | `rgba(255,255,255,0.06)` |
| Card shadow | Layered: `0 1px 2px 0 rgba(0,0,0,0.85)`, `0 2px 8px 0 rgba(0,0,0,0.45)`, `0 4px 14px 0 rgba(156,163,175,0.28)` |
| Card backdrop-filter | `blur(2px)` |
| Card hover | `scale(1.03)`, shadow `0 3px 12px 0 #3b82f6` |
| Card title | `#60a5fa` <span style="color: #60a5fa">&block;&block;&block;&block;"></span> |
| Card description | `#d1d5db` <span style="color: #d1d5db">&block;&block;&block;&block;"></span> |
| Tag background | `rgba(255,255,255,0.08)` |
| Tag border | `#6b7280` <span style="color: #6b7280">&block;&block;&block;&block;"></span> |
| Tag text | `#f3f4f6` <span style="color: #f3f4f6">&block;&block;&block;&block;"></span> |
| Tag hover | `rgba(255,255,255,0.14)` bg, `#60a5fa` <span style="color: #60a5fa">&block;&block;&block;&block;"></span> border, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |
| Tag selected | `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;"></span> bg/border, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |
| Filter input | `#27272a` <span style="color: #27272a">&block;&block;&block;&block;"></span> bg, `#ffffff` <span style="color: #ffffff">&block;&block;&block;&block;"></span> text |

**Shared rules:**
- `.card-title` always has `border-bottom: 0.1px solid #aaa` (light) / `#6b7280` (dark)
- Grid collapses to single column at ≤580px
- Grid: `repeat(auto-fit, minmax(12rem, 1fr))`, `gap: 1.5rem`, `grid-auto-rows: 12rem`

**Data sources:**
```html
<!-- Via src attribute (auto-fetch) -->
<as-index src="/api/data.json" filtering></as-index>

<!-- Via JS property (manual) -->
<as-index id="myCards" filtering></as-index>
<script>
  myCards.items = [
    { title: 'Hello', description: 'World', tags: ['demo'], url: '/page' }
  ]
</script>
```

---

### Interaction Components

#### `as-button`
Action button with variants.

**Attributes:**

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `label` | string | `'Oops!'` | Button text |
| `variant` | `primary\|secondary` | `'primary'` | Visual style |
| `link` | string | `''` | Navigate to URL on click |
| `message` | string | `''` | Show toast notification on click |
| `disabled` | boolean | `false` | Disabled state |

**Events:** `button-tap` (when no link/message)

**Variants:**
- **Primary**: Blue background (`#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span>), white text, focus outline `#3b82f6` <span style="color: #3b82f6">&block;&block;&block;&block;</span>
- **Secondary**: Gray background (`#f4f4f5` <span style="color: #f4f4f5">&block;&block;&block;&block;</span>), dark text, focus outline `#52525b` <span style="color: #52525b">&block;&block;&block;&block;</span>

#### `as-confirm`
Confirmation dialog triggered by button.

**Attributes:** `label`, `value`, `message`, `theme` (light|dark)

**Behavior:** Clicking the trigger button shows a modal with confirm/cancel. On confirm: navigates to `link` OR dispatches `confirm-tap` OR shows `message` toast.

**Theme support:** Full dark/light theme support via `createThemeSync`.

#### `as-event`
Button-like input that dispatches a custom event (for triggering popups/modals). Uses a composite trigger div with `tabindex={0}`.

**Attributes:** `label`, `value`, `placeholder`, `event` (event name, default: `'event-trigger'`), `theme`, `readonly`, `disabled`

**Events:** Dispatches custom event named by `event` attribute with `{ value }` detail

#### `as-popup`
Context menu/popup with smart positioning.

**Attributes:** `options` (same format as select), `theme`

**Methods:** `show(x, y)`, `hide()`

**Properties:** `options` (get/set)

**Events:** `option-select` (detail: `{ value, label }`)

**Features:** Auto-closes on outside click, confirms dangerous actions (delete/remove/destroy).

---

## Browser Support

VUI uses native Web Components (custom elements) with Shadow DOM v1 and ES2020 features.

- Chrome 90+
- Firefox 88+
- Safari 15+
- Edge 90+

**Requires:** `Custom Elements v1`, `Shadow DOM v1`, `ES2020` (nullish coalescing, optional chaining)

---

## Usage

### HTML / Module Script

```html
<script type="module" src="dist/vui.js"></script>

<as-box theme="dark">
  <as-input label="Email" kind="email"></as-input>
  <as-button label="Submit" variant="primary"></as-button>
</as-box>
```

### JavaScript / TypeScript

```typescript
import 'vui'; // or import './src/index.ts'

const form = document.createElement('as-form');
form.schema = { title: 'Login', fields: [...] };
document.body.appendChild(form);
```

---

## Extending the Design System

### Adding a New Component

1. Create `src/as-new-component.tsx`
2. Follow the SolidJS component pattern:

```typescript
import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsNewComponent extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [prop, setProp] = createSignal(this.getAttribute('prop') || '')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const isDark = () => theme() === 'dark'

    createStandardAttributes(this, {
      prop: [prop, setProp],
      theme: [theme, setTheme],
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .my-prop {
            border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
          }
          .my-prop:hover:not(:disabled) {
            border-color: ${isDark() ? '#52525b' : '#a1a1aa'};
          }
          .my-prop:focus:not(:disabled) {
            border-color: #3b82f6;
          }
        `}</style>
        <div class="my-prop">{prop()}</div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.() }

  static get observedAttributes() {
    return ['prop', 'theme', 'disabled']
  }
}

customElements.define('as-new-component', AsNewComponent)
```

**Key requirements for new components:**

| File | Purpose |
|------|---------|
| `src/as-new-component.tsx` | Component implementation |
| `src/index.ts` | Import the component |
| `src/custom-elements.d.ts` | Add to TypeScript JSX types |
| `index.html` | Demo/example usage |
| `README.md` | Update component table |

### Focus Indicator Checklist

When adding a new component with focus styles, verify:

- [ ] `:focus` selector has **equal or higher specificity** than any `:hover:not(:disabled)` selector that modifies the same CSS property (typically `border-color`)
- [ ] Focus rule appears **after** hover rule in source order (for equal specificity)
- [ ] Use `:not(:disabled)` on focus rule to match hover selector specificity
- [ ] For `:host([theme="dark"])` consumers: add explicit `:focus` rule with equal or higher specificity for dark theme
- [ ] `outline: none` is set on the base element to suppress native outline (focus is shown via border-color or custom outline)
- [ ] `transition: border-color 0.2s` is present for smooth focus animation

### Theme Checklist

When adding a new component:

- [ ] Supports `theme="light|dark"` attribute
- [ ] Uses `isDark()` helper or `:host([theme="dark"])` CSS selector consistently
- [ ] Uses `createThemeSync(this)` if the component needs global theme reactiveness
- [ ] Cleans up theme sync in `disconnectedCallback`
- [ ] Filter input focus works in both light and dark themes (verify specificity)

### Color Palette Checklist

When adding colors:

- [ ] Primary/focus color: `#3b82f6` (blue-500)
- [ ] Light theme border: `#d4d4d8`, hover: `#a1a1aa`
- [ ] Dark theme border: `#3f3f46`, hover: `#52525b`
- [ ] Light theme text: `#3f3f46`, dark theme text: `#ffffff`
- [ ] Light theme input bg: `#ffffff`, dark theme input bg: `#09090b`
- [ ] Error: `#ef4444`, Success: `#059669`
- [ ] Dropdown bg: light `#ffffff`, dark `#18181b`

### Attribute Observer Checklist

- [ ] Uses `createStandardAttributes` for standard attributes (label, value, theme, etc.)
- [ ] Boolean attributes use `{ setter, isBoolean: true }` form
- [ ] Declares `static get observedAttributes()` with all observed attributes
- [ ] Dispatches standard events (`value-changed`, `checked-changed`, etc.)
- [ ] Cleanup in `disconnectedCallback` (`this.dispose?.()`)