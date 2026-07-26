import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsInput extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || '')
    const [kind, setKind] = createSignal(this.getAttribute('kind') || 'text')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const getInputType = () => {
      const k = kind()
      return ['text', 'email', 'password', 'number'].includes(k) ? k : 'text'
    }

    const onInput = (e: Event) => {
      const newValue = (e.target as HTMLInputElement).value
      setValue(newValue)
      this.setAttribute('value', newValue)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: newValue },
        bubbles: true,
        composed: true
      }))
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      kind: [kind, setKind],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${theme() === 'dark' ? '#d4d4d8' : '#3f3f46'};
          }
          input {
            appearance: none;
            padding: 0.375rem 0.625rem;
            border: 1px solid ${theme() === 'dark' ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-family: inherit;
            background: ${theme() === 'dark' ? '#09090b' : '#ffffff'};
            color: ${theme() === 'dark' ? '#ffffff' : '#3f3f46'};
            outline: none;
            transition: border-color 0.2s, background-color 0.2s, color 0.2s;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          input:hover:not(:disabled) {
            border-color: ${theme() === 'dark' ? '#52525b' : '#a1a1aa'};
          }
          input:focus {
            border-color: #3b82f6;
          }
          input::placeholder {
            color: ${theme() === 'dark' ? '#a1a1aa' : '#71717a'};
          }
          input:disabled {
            background: ${theme() === 'dark' ? '#3f3f46' : '#e4e4e7'};
            color: ${theme() === 'dark' ? '#a1a1aa' : '#71717a'};
            cursor: not-allowed;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <input
            type={getInputType()}
            value={value()}
            placeholder={placeholder() || label()}
            readonly={readonly()}
            disabled={disabled()}
            onInput={onInput}
          />
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
    return ['label', 'value', 'placeholder', 'kind', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-input', AsInput)
