import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'
import { createStandardAttributes } from './attribute-observer'

class AsSelect extends HTMLElement {
  private dispose?: () => void
  private _value: string = ''

  connectedCallback() {
    this._value = this._value || this.getAttribute('value') || ''

    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this._value)
    const [options, setOptions] = createSignal(this.getAttribute('options') || 'label=A,value=A;label=B,value=B;label=C,value=C')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [open, setOpen] = createSignal(false)

    const items = () => (new Abstract()).planeDeserialize(options())
    const selectedItem = () => items().find(i => i.value === value()) || items()[0]

    const selectOption = (item: any) => {
      if (readonly()) return
      this._value = item.value
      setValue(item.value)
      this.setAttribute('value', item.value)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: item.value },
        bubbles: true,
        composed: true
      }))
    }

    ;(this as any).updateValue = (newValue: string) => {
      this._value = newValue
      setValue(newValue)
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
            position: relative;
          }
          .field {
            display: flex;
            flex-direction: column;
            gap: 0.25rem;
          }
          label {
            font-size: 0.875rem;
            font-weight: 500;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'};
          }
          .select-trigger {
            appearance: none;
            padding: 0.375rem 0.625rem;
            padding-right: 2.5rem;
            border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-family: inherit;
            background: ${isDark() ? '#09090b' : '#ffffff'};
            color: ${isDark() ? '#ffffff' : '#3f3f46'};
            outline: none;
            cursor: pointer;
            transition: border-color 0.2s, background-color 0.2s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            user-select: none;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          .select-trigger:hover:not([aria-disabled="true"]) {
            border-color: ${isDark() ? '#52525b' : '#a1a1aa'};
          }
          .select-trigger:focus {
            border-color: #3b82f6;
          }
          .select-trigger[aria-disabled="true"] {
            background: ${isDark() ? '#3f3f46' : '#e4e4e7'};
            color: ${isDark() ? '#a1a1aa' : '#71717a'};
            cursor: not-allowed;
          }
          .arrow {
            position: absolute;
            right: 0.75rem;
            top: 50%;
            transform: translateY(-50%);
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${isDark() ? '#a1a1aa' : '#71717a'};
            cursor: pointer;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 200px;
            overflow-y: auto;
            background: ${isDark() ? '#18181b' : '#ffffff'};
            border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            z-index: 10;
            padding: 0.25rem 0;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: ${isDark() ? '#ffffff' : '#3f3f46'};
            transition: background-color 0.2s;
          }
          .option:hover {
            background: ${isDark() ? '#27272a' : '#f4f4f5'};
          }
          .option.selected {
            background: ${isDark() ? '#1e3a5f' : '#eff6ff'};
            color: #3b82f6;
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div style="position: relative;">
            <div
              class="select-trigger"
              tabindex={disabled() ? '-1' : '0'}
              aria-disabled={disabled()}
              onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}
              onBlur={() => setTimeout(() => setOpen(false), 200)}
            >
              <span>{selectedItem()?.label || ''}</span>
            </div>
            <span
              class="arrow"
              onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }}
            >
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
            {open() && (
              <div class="dropdown">
                <For each={items()}>
                  {(item) => (
                    <div
                      class={`option ${value() === item.value ? 'selected' : ''}`}
                      onClick={() => selectOption(item)}
                    >
                      {item.label}
                    </div>
                  )}
                </For>
              </div>
            )}
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

  set value(newValue: string) {
    this._value = newValue
    this.setAttribute('value', newValue)
    ;(this as any).updateValue?.(newValue)
  }

  get value() {
    return this._value || this.getAttribute('value') || ''
  }

  static get observedAttributes() {
    return ['label', 'value', 'options', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-select', AsSelect)
