import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsDate extends HTMLElement {
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
    const [year, setYear] = createSignal(new Date().getFullYear())
    const [month, setMonth] = createSignal(new Date().getMonth())
    const [valid, setValid] = createSignal(true)

    const isDark = () => theme() === 'dark'

    const getMonthName = () => {
      return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][month()]
    }

    const changeMonth = (delta: number) => {
      const newMonth = month() + delta
      if (newMonth < 0) { setMonth(11); setYear(year() - 1) }
      else if (newMonth > 11) { setMonth(0); setYear(year() + 1) }
      else { setMonth(newMonth) }
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [value, setValue],
      placeholder: [placeholder, setPlaceholder],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const getDays = () => {
      const firstDay = new Date(year(), month(), 1).getDay()
      const daysInMonth = new Date(year(), month() + 1, 0).getDate()
      const prevMonthDays = new Date(year(), month(), 0).getDate()
      const days: any[] = []
      for (let i = firstDay - 1; i >= 0; i--) days.push({ day: prevMonthDays - i, otherMonth: true, date: null })
      for (let i = 1; i <= daysInMonth; i++) {
        const date = `${year()}-${String(month() + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
        days.push({ day: i, otherMonth: false, selected: value() === date, date })
      }
      const remaining = 42 - days.length
      for (let i = 1; i <= remaining; i++) days.push({ day: i, otherMonth: true, date: null })
      return days
    }

    const selectDay = (date: string | null) => {
      if (!date || readonly() || disabled()) return
      setValue(date)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: date }, bubbles: true, composed: true }))
    }

    const isPlaceholder = () => !value()

    const validateDate = (input: string) => {
      const match = input.match(/^(\d{4})-(\d{2})-(\d{2})$/)
      if (!match) return false
      const [, , m, d] = match.map(Number)
      if (m < 1 || m > 12) return false
      if (d < 1 || d > 31) return false
      return true
    }

    const formatDateWithMask = (digits: string) => {
      if (digits.length <= 4) return digits
      if (digits.length <= 6) return `${digits.slice(0, 4)}-${digits.slice(4)}`
      return `${digits.slice(0, 4)}-${digits.slice(4, 6)}-${digits.slice(6, 8)}`
    }

    const handleInputChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const digits = target.value.replace(/\D/g, '')
      const formatted = formatDateWithMask(digits)
      target.value = formatted
      setValue(formatted)
      if (validateDate(formatted)) {
        const [y, m] = formatted.split('-').map(Number)
        setYear(y)
        setMonth(m - 1)
        this.dispatchEvent(new CustomEvent('value-changed', { detail: { value: formatted }, bubbles: true, composed: true }))
      }
    }

    const handleInputBlur = (e: Event) => {
      const target = e.target as HTMLInputElement
      if (target.value && !validateDate(target.value)) {
        target.value = value() || ''
        setValid(false)
      } else {
        setValid(true)
      }
      setOpen(false)
    }

    const Component = () => (
      <>
        <style>{`
          :host { display: block; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; position: relative; }
          .field { display: flex; flex-direction: column; gap: 0.25rem; }
          label { font-size: 0.875rem; font-weight: 500; color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; }
          .date-trigger {
            appearance: none; padding: 0.375rem 0.625rem; border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem; font-size: 0.875rem; font-family: inherit;
            background: ${isDark() ? '#09090b' : '#ffffff'}; color: ${isDark() ? '#ffffff' : '#3f3f46'};
            outline: none; cursor: pointer; transition: border-color 0.2s;
            display: flex; justify-content: space-between; align-items: center; user-select: none;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          .date-trigger.placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .date-trigger:hover:not([aria-disabled="true"]) { border-color: ${isDark() ? '#52525b' : '#a1a1aa'}; }
          .date-trigger:focus-within:not([aria-disabled="true"]) { border-color: #3b82f6; }
          .date-trigger[aria-disabled="true"] { background: ${isDark() ? '#3f3f46' : '#e4e4e7'}; color: ${isDark() ? '#a1a1aa' : '#71717a'}; cursor: not-allowed; }
          .date-trigger.invalid { border-color: #ef4444; }
          .error-msg { font-size: 0.75rem; color: #ef4444; margin-top: 0.25rem; }
          .date-input {
            flex: 1; border: none; outline: none; background: transparent;
            font-family: inherit; font-size: 0.875rem; color: inherit; cursor: pointer;
          }
          .date-input::placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .date-input:disabled { cursor: not-allowed; opacity: 0.5; }
          .icon { margin-left: 0.5rem; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .dropdown {
            position: absolute; top: 100%; left: 0;
            background: ${isDark() ? '#18181b' : '#ffffff'}; border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.375rem; margin-top: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            z-index: 10; padding: 0.75rem; min-width: 280px;
          }
          .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; padding: 0.25rem; }
          .header button {
            background: none; border: none; cursor: pointer; padding: 0.25rem 0.5rem;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; font-size: 1.125rem; border-radius: 0.375rem;
          }
          .header button:hover { background: ${isDark() ? '#27272a' : '#f4f4f5'}; }
          .month-year { font-weight: 500; font-size: 0.875rem; color: ${isDark() ? '#ffffff' : '#3f3f46'}; }
          .weekdays { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; margin-bottom: 2px; }
          .weekday { text-align: center; font-size: 0.75rem; font-weight: 500; padding: 0.25rem; color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          .days { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
          .day {
            text-align: center; padding: 0.5rem; cursor: pointer; border-radius: 50%;
            font-size: 0.875rem; color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; width: 2rem; height: 2rem;
            display: flex; align-items: center; justify-content: center; transition: background-color 0.2s;
          }
          .day:hover { background: ${isDark() ? '#27272a' : '#f4f4f5'}; }
          .day.selected { background: #3b82f6; color: white; }
          .day.other-month { opacity: 0.3; }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <div
            class={`date-trigger ${isPlaceholder() ? 'placeholder' : ''} ${!valid() && !disabled() ? 'invalid' : ''}`}
            aria-disabled={disabled()}
          >
            <input
              type="text"
              class="date-input"
              value={value() || ''}
              placeholder={placeholder() || 'Select date'}
              readonly={readonly()}
              disabled={disabled()}
              onKeyDown={(e) => { if (e.key === 'Tab') setOpen(false) }}
              onFocus={() => { setValid(true); if (!disabled() && !readonly()) setOpen(true) }}
              onBlur={(e) => { handleInputBlur(e); setOpen(false) }}
              onInput={handleInputChange}
            />
            <span class="icon" onClick={() => { if (disabled() || readonly()) return; setOpen(!open()) }} tabindex="-1">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
              </svg>
            </span>
          </div>
          {!valid() && !disabled() && <span class="error-msg">* Use: YYYY-MM-DD</span>}
          {open() && (
            <div class="dropdown" onMouseDown={(e) => e.preventDefault()}>
              <div class="header">
                <button onClick={() => { if (readonly() || disabled()) return; changeMonth(-1) }}>&lsaquo;</button>
                <div class="month-year">{getMonthName()} {year()}</div>
                <button onClick={() => { if (readonly() || disabled()) return; changeMonth(1) }}>&rsaquo;</button>
              </div>
              <div class="weekdays">
                <For each={['S', 'M', 'T', 'W', 'T', 'F', 'S']}>
                  {(d) => <div class="weekday">{d}</div>}
                </For>
              </div>
              <div class="days">
                <For each={getDays()}>
                  {(day) => (
                    <div
                      class={`day ${day.selected ? 'selected' : ''} ${day.otherMonth ? 'other-month' : ''}`}
                      onClick={() => selectDay(day.date)}
                    >
                      {day.day}
                    </div>
                  )}
                </For>
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

customElements.define('as-date', AsDate)
