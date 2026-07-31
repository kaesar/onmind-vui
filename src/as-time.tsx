import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsTime extends HTMLElement {
  private dispose?: () => void
  private _closeHandler?: (e: Event) => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [value, setValue] = createSignal(this.getAttribute('value') || '')
    const [placeholder, setPlaceholder] = createSignal(this.getAttribute('placeholder') || '')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [open, setOpen] = createSignal(false)
    const [hour, setHour] = createSignal('12')
    const [minute, setMinute] = createSignal('00')
    const [period, setPeriod] = createSignal('AM')
    const [valid, setValid] = createSignal(true)

    const isDark = () => theme() === 'dark'

    const updateValue = () => {
      let hour24 = parseInt(hour())
      if (period() === 'PM' && hour24 !== 12) hour24 += 12
      if (period() === 'AM' && hour24 === 12) hour24 = 0
      const newValue = `${hour24.toString().padStart(2, '0')}:${minute()}`
      setValue(newValue)
      this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: newValue }, bubbles: true, composed: true }))
    }

    const isPlaceholder = () => !value()

    const validateTime = (input: string) => {
      const match = input.match(/^([01]?\d|2[0-3]):([0-5]\d)$/)
      if (!match) return false
      return true
    }

    const formatTimeWithMask = (digits: string) => {
      if (digits.length <= 2) return digits
      return `${digits.slice(0, 2)}:${digits.slice(2, 4)}`
    }

    const handleInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const digits = target.value.replace(/\D/g, '')
      const formatted = formatTimeWithMask(digits)
      target.value = formatted
      setValue(formatted)
      if (validateTime(formatted)) {
        const [h, m] = formatted.split(':').map(Number)
        const h12 = h % 12 === 0 ? 12 : h % 12
        setHour(h12.toString().padStart(2, '0'))
        setMinute(m.toString().padStart(2, '0'))
        setPeriod(h < 12 ? 'AM' : 'PM')
        this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: formatted }, bubbles: true, composed: true }))
      }
    }

    const handleInputBlur = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value && !validateTime(target.value)) {
        target.value = value() || ''
        setValid(false)
      } else {
        setValid(true)
      }
      setOpen(false)
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host { display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; position: relative; }
          .field { display: flex; flex-direction: column; gap: 0.25rem; }
          label { font-size: 0.875rem; font-weight: 500; color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; }
          .time-trigger {
            appearance: none; padding: 0.375rem 0.625rem; border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem; font-size: 0.875rem; font-family: inherit;
            background: ${isDark() ? '#09090b' : '#ffffff'}; color: ${isDark() ? '#ffffff' : '#3f3f46'};
            outline: none; cursor: pointer; transition: border-color 0.2s;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          .time-trigger.placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .time-trigger:hover:not([aria-disabled="true"]) { border-color: ${isDark() ? '#52525b' : '#a1a1aa'}; }
          .time-trigger:focus-within:not([aria-disabled="true"]) { border-color: #3b82f6; }
          .time-trigger[aria-disabled="true"] { background: ${isDark() ? '#3f3f46' : '#e4e4e7'}; color: ${isDark() ? '#a1a1aa' : '#71717a'}; cursor: not-allowed; }
          .time-trigger.invalid { border-color: #ef4444; }
          .error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
          .time-input {
            flex: 1; border: none; outline: none; background: transparent;
            font-family: inherit; font-size: 0.875rem; color: inherit; cursor: pointer;
          }
          .time-input::placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .time-input:disabled { cursor: not-allowed; opacity: 0.5; }
          .icon { margin-left: 0.5rem; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .dropdown {
            position: absolute; top: 100%; left: 0;
            background: ${isDark() ? '#18181b' : '#ffffff'}; border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.375rem; margin-top: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            z-index: 10; padding: 0; width: 280px;
          }
          .time-display {
            text-align: center; font-size: 2.5rem; font-weight: 300; padding: 1.5rem 1rem 1rem 1rem;
            color: ${isDark() ? '#ffffff' : '#3f3f46'}; border-bottom: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
          }
          .selectors { display: flex; height: 240px; }
          .column { flex: 1; overflow-y: auto; overflow-x: hidden; border-right: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'}; }
          .column:last-child { border-right: none; }
          .period-column { flex: 0 0 60px; display: flex; flex-direction: column; }
          .option {
            padding: 0.75rem; cursor: pointer; font-size: 0.875rem;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; text-align: center;
            border-bottom: 1px solid transparent; transition: background-color 0.2s;
          }
          .option:hover { background: ${isDark() ? '#27272a' : '#f4f4f5'}; }
          .option.selected { background: ${isDark() ? '#1e3a5f' : '#eff6ff'}; color: #3b82f6; font-weight: 600; }
          .period-column .option { flex: 1; display: flex; align-items: center; justify-content: center; border-bottom: none; }
          .period-column .option.selected { background: #3b82f6; color: white; }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`time-trigger ${isPlaceholder() ? 'placeholder' : ''} ${!valid() && !disabled() ? 'invalid' : ''}`}
            aria-disabled={disabled()}
          >
            <input
              type="text"
              class="time-input"
              value={value() || ''}
              placeholder={placeholder() || 'Select time'}
              readonly={readonly()}
              disabled={disabled()}
              onKeyDown={(e) => { if (e.key === 'Tab') setOpen(false) }}
              onFocus={() => { setValid(true); if (!disabled() && !readonly()) setOpen(true) }}
              onBlur={(e) => { handleInputBlur(e); setOpen(false) }}
              onInput={handleInputChange}
            />
            <span class="icon" onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }} tabindex="-1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.2 3.2.8-1.3-4.5-2.7V7z"/>
              </svg>
            </span>
          </div>
          {!valid() && !disabled() && <span class="error-msg">* Use: HH:MM (24h)</span>}
          {open() && (
            <div class="dropdown" onMouseDown={(e) => e.preventDefault()}>
              <div class="time-display">{hour()}:{minute()} {period()}</div>
              <div class="selectors">
                <div class="column">
                  <For each={Array.from({length: 12}, (_, i) => (i + 1).toString().padStart(2, '0'))}>
                    {(h) => (
                      <div class={`option ${hour() === h ? 'selected' : ''}`}
                        onClick={() => { if (readonly() || disabled()) return; setHour(h); updateValue() }}
                      >{h}</div>
                    )}
                  </For>
                </div>
                <div class="column">
                  <For each={Array.from({length: 12}, (_, i) => (i * 5).toString().padStart(2, '0'))}>
                    {(m) => (
                      <div class={`option ${minute() === m ? 'selected' : ''}`}
                        onClick={() => { if (readonly() || disabled()) return; setMinute(m); updateValue() }}
                      >{m}</div>
                    )}
                  </For>
                </div>
                <div class="period-column">
                  <div class={`option ${period() === 'AM' ? 'selected' : ''}`}
                    onClick={() => { if (readonly() || disabled()) return; setPeriod('AM'); updateValue() }}
                  >AM</div>
                  <div class={`option ${period() === 'PM' ? 'selected' : ''}`}
                    onClick={() => { if (readonly() || disabled()) return; setPeriod('PM'); updateValue() }}
                  >PM</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)

    this._closeHandler = (e: Event) => {
      if (!this.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', this._closeHandler, true)
  }

  disconnectedCallback() {
    this.dispose?.()
    if (this._closeHandler) document.removeEventListener('click', this._closeHandler, true)
  }

  static get observedAttributes() {
    return ['label', 'value', 'placeholder', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-time', AsTime)
