# OnMind-VUI

Common User Interface (**VUI**), Vue components library based on [**PrimeVue Unstyled**](https://primevue.org/) with [**Tailwind CSS v4**](https://tailwindcss.com/) and **Volt** preset.

> **PrimeVue** is a rich set of open source UI Components for Vue. **Volt** is the Tailwind-based preset for PrimeVue Unstyled components.

These components use **Vue 3**, **PrimeVue Unstyled**, and **Tailwind CSS v4** for modern, customizable UI components.

**OnMind-VUI** includes:

Component | Description
-- | --
`AsComplete` | Autocomplete/ComboBox component (PrimeVue + Volt)
`AsBox` | Card-like container to group components (Custom)
`AsButton` | Button component (PrimeVue + Volt)
`AsCheck` | Checkbox component (PrimeVue + Volt)
`AsConfirm` | Confirmation dialog with modal (PrimeVue + Volt)
`AsDatagrid` | Data grid/table with sorting, filtering and pagination (Custom)
`AsDate` | Date picker component (PrimeVue + Volt)
`AsEmbed` | Embed web content component (Custom)
`AsEvent` | Input with icon to trigger custom events (Custom)
`AsForm` | Schema-based form component with validation (Custom)
`AsImage` | Image component (Custom)
`AsInput` | Input component for text, email, password, number (PrimeVue + Volt)
`AsModal` | Modal dialog component with slot support (Custom)
`AsPopup` | Context menu/popup component with smart positioning (Custom)
`AsRadio` | Radio button group component (PrimeVue + Volt)
`AsSelect` | Dropdown/Select component (PrimeVue + Volt)
`AsSwitch` | Toggle switch component (PrimeVue + Volt)
`AsText` | TextArea component (PrimeVue + Volt)
`AsTime` | Time picker component (PrimeVue + Volt)
`AsUpload` | File upload component with drag-and-drop support (Custom)
`AsVideo` | Video component for YouTube embeds (Custom)

## Development

1. Clone or download: `git clone https://github.com/kaesar/onmind-vui.git vui`
2. Open folder: `cd vui`
3. Install dependencies: `npm install`
4. Start dev server: `npm start`
5. Build for production: `npm run build`

> The build generates optimized files in the `dist` folder with Tailwind CSS compiled.

---

## Usage in Your Project

### Option 1: Standard Web Project (HTML/Templates)

For projects using plain HTML or template engines:

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="/node_modules/primeicons/primeicons.css">
  <link rel="stylesheet" href="/static/onmind-vui-v2.css">
</head>
<body>
  <div id="app">
    <!-- Your template content -->
  </div>
  
  <script type="module">
    import { createApp } from '/node_modules/vue/dist/vue.esm-browser.js'
    import PrimeVue from '/node_modules/primevue/config/config.esm.js'
    import ConfirmationService from '/node_modules/primevue/confirmationservice/confirmationservice.esm.js'
    import ToastService from '/node_modules/primevue/toastservice/toastservice.esm.js'
    import { AsButton, AsInput, AsSelect } from '/static/onmind-vui-v2.js'
    
    const app = createApp({
      components: { AsButton, AsInput, AsSelect },
      // Your app logic
    })
    
    app.use(PrimeVue, { unstyled: true })
    app.use(ConfirmationService)
    app.use(ToastService)
    app.mount('#app')
  </script>
</body>
</html>
```

> **Note:** You'll need a module bundler (JS) to use ES modules in the browser.

### Option 2: With Tailwind CSS (Recommended)

If your project already has Tailwind CSS v3 or v4:

```javascript
// main.js
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'

const app = createApp(App)
app.use(PrimeVue, { unstyled: true })
app.use(ConfirmationService)
app.use(ToastService)
app.mount('#app')
```

```javascript
// YourComponent.vue
import { AsButton, AsInput, AsSelect } from 'onmind-vui-v2'
// No need to import CSS - your Tailwind will generate the styles
```

**Important:** Configure Tailwind to scan onmind-vui components:

```javascript
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,vue,html}',
    './public/onmind-vui-v2/**/*.{js,vue}' // Scan onmind-vui components
  ]
}
```

### Option 3: Without Tailwind CSS

If your project doesn't have Tailwind CSS:

```javascript
// main.js
import { createApp } from 'vue'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import 'primeicons/primeicons.css'
import 'public/onmind-vui-v2.css' // Import precompiled CSS

const app = createApp(App)
app.use(PrimeVue, { unstyled: true })
app.use(ConfirmationService)
app.use(ToastService)
app.mount('#app')
```

And for Vue components

```javascript
// YourComponent.vue
import { AsButton, AsInput, AsSelect } from 'onmind-vui-v2'
```
