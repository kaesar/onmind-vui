import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsCheck extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [checked, setChecked] = createSignal(this.hasAttribute('checked'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const onChange = (e: Event) => {
      if (readonly()) {
        (e.target as HTMLInputElement).checked = checked()
        return
      }
      const newValue = (e.target as HTMLInputElement).checked
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
          .checkbox-wrapper {
            position: relative;
            width: 1.25rem;
            height: 1.25rem;
          }
          input[type="checkbox"] {
            width: 1.25rem;
            height: 1.25rem;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            border: 1px solid ${theme() === 'dark' ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.25rem;
            background: ${theme() === 'dark' ? '#09090b' : '#ffffff'};
            position: relative;
            transition: border-color 0.2s, background-color 0.2s;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          input[type="checkbox"]:hover:not(:disabled) {
            border-color: ${theme() === 'dark' ? '#52525b' : '#a1a1aa'};
          }
          input[type="checkbox"]:checked {
            background: #3b82f6;
            border-color: #3b82f6;
          }
          input[type="checkbox"]:checked::after {
            content: '';
            position: absolute;
            left: 0.3rem;
            top: 0.05rem;
            width: 0.35rem;
            height: 0.65rem;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
          }
          input[type="checkbox"]:focus-visible {
            outline: 1px solid #3b82f6;
            outline-offset: 2px;
          }
          input[type="checkbox"]:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
        `}</style>
        <div class="checkbox-wrapper">
          <input
            type="checkbox"
            checked={checked()}
            disabled={disabled()}
            onChange={onChange}
          />
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

customElements.define('as-check', AsCheck)
