import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsSwitch extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [checked, setChecked] = createSignal(this.hasAttribute('checked'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const onClick = () => {
      if (disabled() || readonly()) return
      const newValue = !checked()
      setChecked(newValue)
      this.dispatchEvent(new CustomEvent('checked-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      checked: { setter: setChecked, isBoolean: true },
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            font-size: 0.875rem;
            color: ${theme() === 'dark' ? '#d4d4d8' : '#3f3f46'};
          }
          .switch {
            position: relative;
            width: 2.5rem;
            height: 1.5rem;
            background: ${checked() ? '#3b82f6' : (theme() === 'dark' ? '#3f3f46' : '#d4d4d8')};
            border-radius: 30px;
            transition: background-color 0.2s;
            cursor: pointer;
            border: 1px solid transparent;
          }
          .switch:hover:not(.disabled) {
            background: ${checked() ? '#2563eb' : (theme() === 'dark' ? '#52525b' : '#a1a1aa')};
          }
          .switch.disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
          .handle {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            background: ${theme() === 'dark' ? '#a1a1aa' : '#ffffff'};
            transition: left 0.2s, background-color 0.2s;
            left: ${checked() ? '1.25rem' : '0.25rem'};
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          .switch:focus-visible {
            outline: 1px solid #3b82f6;
            outline-offset: 2px;
          }
        `}</style>
        <div
          class={`switch ${disabled() ? 'disabled' : ''}`}
          role="switch"
          aria-checked={checked()}
          aria-disabled={disabled()}
          tabIndex={0}
          onClick={onClick}
        >
          <div class="handle" />
        </div>
        {label() && <label>{label()}</label>}
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'checked', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-switch', AsSwitch)
