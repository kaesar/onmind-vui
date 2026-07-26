import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createThemeSync } from './theme-sync'

class AsConfirm extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _observer?: MutationObserver

  connectedCallback() {
    this.themeCleanup = createThemeSync(this)

    const [label, setLabel] = createSignal(this.getAttribute('label') || 'Confirm')
    const [link, setLink] = createSignal(this.getAttribute('link') || '')
    const [message, setMessage] = createSignal(this.getAttribute('message') || '')
    const [dialogOpened, setDialogOpened] = createSignal(false)
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')

    const isDark = () => theme() === 'dark'
    const open = () => setDialogOpened(true)
    const close = () => setDialogOpened(false)

    const onClick = () => {
      setDialogOpened(false)
      if (link()) location.assign(link())
      this.dispatchEvent(new CustomEvent('confirm-tap', { bubbles: true, composed: true }))
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes') {
          if (m.attributeName === 'label') setLabel(this.getAttribute('label') || 'Confirm')
          if (m.attributeName === 'link') setLink(this.getAttribute('link') || '')
          if (m.attributeName === 'message') setMessage(this.getAttribute('message') || '')
          if (m.attributeName === 'theme') setTheme(this.getAttribute('theme') || '')
        }
      })
    })
    observer.observe(this, { attributes: true })
    this._observer = observer

    const Component = () => (
      <>
        <style>{`
          .trigger-btn {
            display: inline-flex; align-items: center; justify-content: center;
            padding: 0.5rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem;
            font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            cursor: pointer; transition: background-color 0.2s, border-color 0.2s;
            background: #3b82f6; color: white; border: 1px solid #3b82f6;
          }
          .trigger-btn:hover { background: #2563eb; border-color: #2563eb; }
          .overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .dialog {
            background: ${isDark() ? '#27272a' : '#ffffff'};
            border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.75rem; padding: 1.5rem; min-width: 300px; max-width: 32rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2);
            color: ${isDark() ? '#f4f4f5' : '#3f3f46'};
          }
          .dialog-header {
            font-size: 1.25rem; font-weight: 600; margin-bottom: 1rem;
            color: ${isDark() ? '#f4f4f5' : '#3f3f46'};
          }
          .dialog-content {
            margin-bottom: 1.5rem; color: ${isDark() ? '#d4d4d8' : '#52525b'}; font-size: 0.875rem;
            display: flex; align-items: center; gap: 0.75rem;
          }
          .dialog-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
          .btn-cancel {
            padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem;
            font-weight: 500; cursor: pointer; font-family: inherit; border: none;
            background: ${isDark() ? '#27272a' : '#f4f4f5'}; color: ${isDark() ? '#d4d4d8' : '#52525b'};
          }
          .btn-cancel:hover { background: ${isDark() ? '#3f3f46' : '#e4e4e7'}; }
          .btn-confirm {
            padding: 0.375rem 0.75rem; border-radius: 0.375rem; font-size: 0.875rem;
            font-weight: 500; cursor: pointer; font-family: inherit; border: none;
            background: #3b82f6; color: white;
          }
          .btn-confirm:hover { background: #2563eb; }
        `}</style>
        <button class="trigger-btn" onClick={open}>{label()}</button>
        {dialogOpened() && (
          <div class="overlay" onClick={close}>
            <div class="dialog" onClick={(e) => e.stopPropagation()}>
              <div class="dialog-header">Confirm</div>
              <div class="dialog-content">
                <svg width="1.5rem" height="1.5rem" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                {message()}
              </div>
              <div class="dialog-actions">
                <button class="btn-cancel" onClick={close}>Cancel</button>
                <button class="btn-confirm" onClick={onClick}>{label()}</button>
              </div>
            </div>
          </div>
        )}
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
    this.themeCleanup?.()
    this._observer?.disconnect()
  }

  static get observedAttributes() { return ['label', 'link', 'message', 'theme'] }
}

customElements.define('as-confirm', AsConfirm)
