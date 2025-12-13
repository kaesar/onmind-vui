import { createApp, defineCustomElement, h } from "vue";
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';
import { definePreset } from '@primevue/themes';
import Nora from '@primevue/themes/nora';

import AsButtonCE from "./components/as-button.ce.vue";
import AsInputCE from "./components/as-input.ce.vue";
import AsCheckCE from "./components/as-check.ce.vue";
import AsSwitchCE from "./components/as-switch.ce.vue";
import AsSelectCE from "./components/as-select.ce.vue";
import AsDateCE from "./components/as-date.ce.vue";
import AsTimeCE from "./components/as-time.ce.vue";
import AsTextCE from "./components/as-text.ce.vue";
import AsRadioCE from "./components/as-radio.ce.vue";
import AsBoxCE from "./components/as-box.ce.vue";
import AsConfirmCE from "./components/as-confirm.ce.vue";
import AsImageCE from "./components/as-image.ce.vue";
import AsVideoCE from "./components/as-video.ce.vue";
import AsEmbedCE from "./components/as-embed.ce.vue";
import AsDatagridCE from "./components/as-datagrid.ce.vue";
import AsCompleteCE from "./components/as-complete.ce.vue";

// Inject font styles
const style = document.createElement('style');
style.textContent = `
  * {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  }
`;
document.head.appendChild(style);

// Setup PrimeVue Nora Blue Theme
const NoraBlue = definePreset(Nora, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}'
    }
  }
});

// Init Styles for PrimeVue
const app = createApp({});
app.use(PrimeVue, {
  theme: {
    preset: NoraBlue,
    options: {
      cssLayer: false,
      darkModeSelector: false,
      prefix: 'p'
    }
  },
  ripple: false
});
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app');


// Context Wrapper for PrimeVue
const createPrimeVueElement = (component) => {
  return defineCustomElement({
    props: component.props,
    setup(props, { emit }) {
      return () => h(component, { ...props });
    },
    shadowRoot: false,
    configureApp(app) {
      app.use(PrimeVue, {
        theme: {
          preset: NoraBlue,
          options: {
            cssLayer: false,
            darkModeSelector: false,
            prefix: 'p'
          }
        },
        ripple: false
      });
    }
  });
};

const AsButton = defineCustomElement({
  props: AsButtonCE.props,
  setup(props, { emit }) {
    return () => h(AsButtonCE, { ...props });
  },
  shadowRoot: false,
  configureApp(app) {
    app.use(PrimeVue, {
      theme: {
        preset: NoraBlue,
        options: {
          cssLayer: false,
          darkModeSelector: false,
          prefix: 'p'
        }
      },
      ripple: false
    });
    app.use(ToastService);
  }
});
const AsInput = createPrimeVueElement(AsInputCE);
const AsCheck = createPrimeVueElement(AsCheckCE);
const AsSwitch = createPrimeVueElement(AsSwitchCE);
const AsSelect = createPrimeVueElement(AsSelectCE);
const AsDate = createPrimeVueElement(AsDateCE);
const AsTime = createPrimeVueElement(AsTimeCE);
const AsText = createPrimeVueElement(AsTextCE);
const AsRadio = createPrimeVueElement(AsRadioCE);
const AsBox = defineCustomElement(AsBoxCE);  // as-box usa shadowRoot (no depende de PrimeVue)
const AsConfirm = defineCustomElement({
  props: AsConfirmCE.props,
  setup(props, { emit }) {
    return () => h(AsConfirmCE, { ...props });
  },
  shadowRoot: false,
  configureApp(app) {
    app.use(PrimeVue, {
      theme: {
        preset: NoraBlue,
        options: {
          cssLayer: false,
          darkModeSelector: false,
          prefix: 'p'
        }
      },
      ripple: false
    });
    app.use(ConfirmationService);
  }
});
const AsImage = defineCustomElement(AsImageCE);
const AsVideo = defineCustomElement(AsVideoCE);
const AsEmbed = defineCustomElement(AsEmbedCE);
const AsDatagrid = defineCustomElement(AsDatagridCE);
const AsComplete = createPrimeVueElement(AsCompleteCE);

customElements.define("as-button", AsButton);
customElements.define("as-input", AsInput);
customElements.define("as-check", AsCheck);
customElements.define("as-switch", AsSwitch);
customElements.define("as-select", AsSelect);
customElements.define("as-date", AsDate);
customElements.define("as-time", AsTime);
customElements.define("as-text", AsText);
customElements.define("as-radio", AsRadio);
customElements.define("as-box", AsBox);
customElements.define("as-confirm", AsConfirm);
customElements.define("as-image", AsImage);
customElements.define("as-video", AsVideo);
customElements.define("as-embed", AsEmbed);
customElements.define("as-datagrid", AsDatagrid);
customElements.define("as-complete", AsComplete);

export { AsButton, AsInput, AsCheck, AsSwitch, AsSelect, AsDate, AsTime, AsText, AsRadio, AsBox, AsConfirm, AsImage, AsVideo, AsEmbed, AsDatagrid, AsComplete };
