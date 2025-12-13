# OnMind-VUI

Variation in User Interface (**VUI**), Native Web Components for cross use in **UI** with Content Pages (like Markdown) and Simple Web Apps. Based in a tiny selection from [**PrimeVue**](https://primevue.org/).

> **PrimeVue** is a rich set of open source UI Components for Vue. It provides a comprehensive collection of customizable components.

These components are an alternative to [**OnMind-CUI**](https://github.com/kaesar/onmind-cui) but using technologies like **Vue** and **Javascript**, it allows the standard way to include as `html` tags in simple Markdown (`.md`) files, for example with `markdown-it` parser (or similar feature in `remark` and others parsers).

The idea with Native Web Components is use with any other technologies because this is like simple `html` tag (with a Shadow DOM), and it could encapsulates even the styles.

**OnMind-VUI** includes just this...

Component | Description
-- | --
`as-complete` | Autocomplete/ComboBox component
`as-box` | Similar to Card to group components inside
`as-button` | Common Button component
`as-check` | Common Checkbox component
`as-confirm` | Dialog with Modal with confirm action
`as-datagrid` | Data grid/table with sorting, filtering and pagination
`as-date` | Date picker component
`as-embed` | Component to Embed content for the web (url)
`as-image` | Common Image component
`as-input` | Common Input component (text, email, password, number)
`as-radio` | Common Radio button group component
`as-select` | Dropdown/Select component
`as-switch` | Toggle switch component
`as-text` | TextArea component
`as-time` | Time picker component
`as-video` | Common Video component (for YouTube links)

> To use, you can include these `tags` in simple Markdown files or Web Apps.

## How to install it ?

1. Clone it or download: `git clone https://github.com/kaesar/onmind-vui.git vui`
2. Open the folder from terminal: `cd vui`
3. Install modules: `npm install`
4. Launch vite: `npm start`

> You get the `vui.js` file under `dist` folder and put in a `script` tag in `html` (e.g. in `head`)
