import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsEvent extends HTMLElement {
  private dispose?: () => void
  private _value: string = ''

  connectedCallback() {
    this._value = this._value || this.getAttribute('value') || ''

    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this._value)
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || '')
    const [event, setEvent] = createSignal(this.getAttribute('event') || 'event-trigger')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const isDark = () => theme() === 'dark'

    const handleClick = () => {
      if (disabled() || readonly()) return
      this.dispatchEvent(new CustomEvent(event(), { detail: { value: value() }, bubbles: true, composed: true }))
    }

    const handleKeydown = (e: KeyboardEvent) => {
      if (disabled() || readonly()) return
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick() }
    }

    const displayValue = () => value() || placeholder() || 'Select action'
    const isPlaceholder = () => !value()

    ;(this as any).updateValue = (newValue: string) => { this._value = newValue; setValue(newValue) }

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      event: [event, setEvent],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .field {
            display: flex; flex-direction: column; gap: 0.25rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            position: relative;
          }
          label { font-size: 0.875rem; font-weight: 500; color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; }
          .event-trigger {
            appearance: none; padding: 0.375rem 0.625rem; border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem; font-size: 0.875rem; font-family: inherit;
            background: ${isDark() ? '#09090b' : '#ffffff'}; color: ${isDark() ? '#ffffff' : '#3f3f46'};
            outline: none; cursor: pointer; transition: border-color 0.2s;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          .event-trigger.placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .event-trigger:hover:not([aria-disabled="true"]) { border-color: ${isDark() ? '#52525b' : '#a1a1aa'}; }
          .event-trigger:focus { border-color: #3b82f6; }
          .event-trigger[aria-disabled="true"] {
            background: ${isDark() ? '#3f3f46' : '#e4e4e7'}; color: ${isDark() ? '#a1a1aa' : '#71717a'}; cursor: not-allowed;
          }
          .arrow {
            margin-left: 0.5rem; width: 16px; height: 16px;
            display: flex; align-items: center; justify-content: center; flex-shrink: 0;
            color: ${isDark() ? '#a1a1aa' : '#71717a'};
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`event-trigger ${isPlaceholder() ? 'placeholder' : ''}`}
            tabindex={disabled() ? '-1' : '0'}
            aria-disabled={disabled()}
            onClick={handleClick}
            onKeyDown={handleKeydown}
          >
            <span>{displayValue()}</span>
            <span class="arrow">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.() }

  set value(newValue: string) { this._value = newValue; this.setAttribute('value', newValue); (this as any).updateValue?.(newValue) }
  get value() { return this._value || this.getAttribute('value') || '' }

  static get observedAttributes() { return ['label', 'value', 'placeholder', 'event', 'theme', 'readonly', 'disabled'] }
}

customElements.define('as-event', AsEvent)
