import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'
import { createStandardAttributes } from './attribute-observer'

class AsRadio extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [options, setOptions] = createSignal(this.getAttribute('options') || 'label=A,value=A;label=B,value=B;label=C,value=C')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const items = () => (new Abstract()).planeDeserialize(options())

    const onChange = (e: Event, itemValue: string) => {
      if (readonly()) {
        (e.target as HTMLInputElement).checked = value() === itemValue
        return
      }
      setValue((e.target as HTMLInputElement).value)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: (e.target as HTMLInputElement).value },
        bubbles: true,
        composed: true
      }))
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      options: [options, setOptions],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const isDark = () => theme() === 'dark'

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          .group {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          .group-label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'};
            margin-bottom: 0.25rem;
          }
          .options {
            display: flex;
            gap: 1rem;
          }
          .option {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'};
          }
          .radio-wrapper {
            position: relative;
            width: 1.25rem;
            height: 1.25rem;
          }
          input[type="radio"] {
            width: 1.25rem;
            height: 1.25rem;
            cursor: pointer;
            appearance: none;
            -webkit-appearance: none;
            border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 50%;
            background: ${isDark() ? '#09090b' : '#ffffff'};
            position: relative;
            transition: border-color 0.2s, background-color 0.2s;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          input[type="radio"]:hover:not(:disabled) {
            border-color: ${isDark() ? '#52525b' : '#a1a1aa'};
          }
          input[type="radio"]:checked {
            border-color: #3b82f6;
            background: #3b82f6;
          }
          input[type="radio"]:checked::after {
            content: '';
            position: absolute;
            left: 0.2rem;
            top: 0.2rem;
            width: 0.65rem;
            height: 0.65rem;
            border-radius: 50%;
            background: white;
          }
          input[type="radio"]:focus-visible {
            outline: 1px solid #3b82f6;
            outline-offset: 2px;
          }
          input[type="radio"]:disabled {
            cursor: not-allowed;
            opacity: 0.6;
          }
        `}</style>
        <div class="group">
          {label() && <div class="group-label">{label()}</div>}
          <div class="options">
            <For each={items()}>
              {(item) => (
                <label class="option">
                  <div class="radio-wrapper">
                    <input
                      type="radio"
                      name={`radio-group-${Math.random().toString(36).slice(2, 8)}`}
                      value={item.value}
                      checked={value() === item.value}
                      disabled={disabled()}
                      onChange={(e) => onChange(e, item.value)}
                    />
                  </div>
                  {item.label}
                </label>
              )}
            </For>
          </div>
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'value', 'options', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-radio', AsRadio)
