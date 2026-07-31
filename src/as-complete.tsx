import { render } from 'solid-js/web'
import { createSignal, For, createMemo } from 'solid-js'
import { Abstract } from './Abstract'
import { createStandardAttributes } from './attribute-observer'

interface OptionItem {
  label: string
  value: string
}

class AsComplete extends HTMLElement {
  private dispose?: () => void
  private _filterTimer?: ReturnType<typeof setTimeout>
  private _abortController?: AbortController
  private _parsedCache: OptionItem[] = []

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || '')
    const [, setValue] = createSignal(this.getAttribute('value') || '')
    const [options, setOptions] = createSignal(this.getAttribute('options') || '')
    const [src, setSrc] = createSignal(this.getAttribute('src') || '')
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [readonly, setReadonly] = createSignal(this.hasAttribute('readonly'))
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [rawFilter, setRawFilter] = createSignal('')
    const [filter, setFilter] = createSignal('')
    const [open, setOpen] = createSignal(false)
    const [loading, setLoading] = createSignal(false)

    const isDark = () => theme() === 'dark'

    const loadFromSrc = async (url: string) => {
      if (!url) return
      this._abortController?.abort()
      const controller = new AbortController()
      this._abortController = controller
      setLoading(true)
      try {
        const res = await fetch(url, { signal: controller.signal })
        const data = await res.json()
        if (controller.signal.aborted) return
        const list: OptionItem[] = (Array.isArray(data) ? data : []).map((item: any) => ({
          label: item.label || item.name || String(item),
          value: item.value ?? item.label ?? item.name ?? String(item)
        }))
        this._parsedCache = list
        setOptions('__SRC__' + Date.now())
      } catch (err) {
        if (err instanceof DOMException && err.name === 'AbortError') return
        console.error('as-complete fetch error:', err)
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    const items = createMemo(() => {
      const raw = options()
      if (src()) return this._parsedCache
      this._parsedCache = (new Abstract()).planeDeserialize(raw || 'label=A,value=A;label=B,value=B;label=C,value=C')
      return this._parsedCache
    })

    const filtered = createMemo(() => {
      const f = filter().toLowerCase()
      if (!f) return items()
      return items().filter(i => i.label.toLowerCase().includes(f))
    })

    const initialSrc = this.getAttribute('src')
    if (initialSrc) loadFromSrc(initialSrc)

    createStandardAttributes(this, {
      label: [label, setLabel],
      value: [setValue, setValue],
      options: [options, setOptions],
      src: [src, setSrc],
      theme: [theme, setTheme],
      readonly: { setter: setReadonly, isBoolean: true },
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const onInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setRawFilter(val)
      clearTimeout(this._filterTimer)
      this._filterTimer = setTimeout(() => {
        setFilter(val)
        setOpen(true)
      }, 150)
    }

    const selectOption = (item: OptionItem) => {
      setValue(item.value)
      setRawFilter(item.label)
      setFilter(item.label)
      setOpen(false)
      this.dispatchEvent(new CustomEvent('value-changed', {
        detail: { value: item.value },
        bubbles: true,
        composed: true
      }))
    }

    const Component = () => (
      <>
        <style>{`
          :host {
            display: block;
            position: relative;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
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
          input {
            appearance: none;
            padding: 0.375rem 0.625rem;
            border: 1px solid ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-family: inherit;
            background: ${isDark() ? '#09090b' : '#ffffff'};
            color: ${isDark() ? '#ffffff' : '#3f3f46'};
            outline: none;
            transition: border-color 0.2s, background-color 0.2s;
            box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
            width: 100%;
            box-sizing: border-box;
          }
          input:hover:not(:disabled) {
            border-color: ${isDark() ? '#52525b' : '#a1a1aa'};
          }
          input:focus:not(:disabled) { border-color: #3b82f6; }
          input::placeholder { color: ${isDark() ? '#a1a1aa' : '#71717a'}; }
          input:disabled {
            background: ${isDark() ? '#3f3f46' : '#e4e4e7'};
            color: ${isDark() ? '#a1a1aa' : '#71717a'};
            cursor: not-allowed;
          }
          .dropdown {
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            max-height: 240px;
            overflow-y: auto;
            background: ${isDark() ? '#18181b' : '#ffffff'};
            border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.375rem;
            margin-top: 0.25rem;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);
            z-index: 10;
          }
          .option {
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            font-size: 0.875rem;
            color: ${isDark() ? '#ffffff' : '#3f3f46'};
            transition: background-color 0.2s;
          }
          .option:hover { background: ${isDark() ? '#27272a' : '#f4f4f5'}; }
          .loading-msg {
            padding: 0.75rem;
            text-align: center;
            font-size: 0.875rem;
            color: ${isDark() ? '#a1a1aa' : '#71717a'};
          }
        `}</style>
        <div class="field">
          {label() && <label>{label()}</label>}
          <input
            type="text"
            value={rawFilter()}
            placeholder={label() || 'Search...'}
            readonly={readonly()}
            disabled={disabled()}
            onInput={onInput}
            onFocus={() => { if (rawFilter()) setOpen(true) }}
            onBlur={() => setTimeout(() => setOpen(false), 200)}
          />
          {open() && loading() && (
            <div class="dropdown">
              <div class="loading-msg">Loading...</div>
            </div>
          )}
          {open() && !loading() && filtered().length > 0 && (
            <div class="dropdown">
              <For each={filtered()}>
                {(item) => (
                  <div class="option" onMouseDown={(e) => e.preventDefault()} onClick={() => selectOption(item)}>
                    {item.label}
                  </div>
                )}
              </For>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
    clearTimeout(this._filterTimer)
    this._abortController?.abort()
  }

  static get observedAttributes() {
    return ['label', 'value', 'options', 'src', 'theme', 'readonly', 'disabled']
  }
}

customElements.define('as-complete', AsComplete)
