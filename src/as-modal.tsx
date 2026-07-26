import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createThemeSync } from './theme-sync'

class AsModal extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _observer?: MutationObserver

  connectedCallback() {
    this.themeCleanup = createThemeSync(this)

    const [title, setTitle] = createSignal(this.getAttribute('title') || '')
    const [open, setOpen] = createSignal(false)
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')

    const isDark = () => theme() === 'dark'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open()) hide()
    }

    const handleFormEvents = (e: Event) => {
      if (e.type === 'form-submit' || e.type === 'form-cancel') {
        this.dispatchEvent(new CustomEvent(e.type, {
          detail: (e as CustomEvent).detail,
          bubbles: true,
          composed: true
        }))
      }
    }

    const handleSlotChange = (e: Event) => {
      const slot = e.target as HTMLSlotElement
      slot.assignedElements().forEach(el => {
        if (isDark()) el.setAttribute('theme', 'dark')
        else el.removeAttribute('theme')
      })
    }

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes') {
          if (m.attributeName === 'title') setTitle(this.getAttribute('title') || '')
          if (m.attributeName === 'theme') setTheme(this.getAttribute('theme') || '')
        }
      })
    })
    this._observer = observer
    observer.observe(this, { attributes: true })

    const notifySlottedForm = (hideTitle: boolean) => {
      const slot = this.shadowRoot?.querySelector('slot')
      if (!slot) return
      const assignedElements = (slot as HTMLSlotElement).assignedElements()
      assignedElements.forEach(element => {
        if (element.tagName.toLowerCase() === 'as-form') {
          ;(element as any).hideTitle = hideTitle
          if (hideTitle) {
            ;(element as any)._cancelled = false
          }
        }
      })
    }

    const show = () => {
      setOpen(true)
      document.addEventListener('keydown', handleKeyDown)
      this.addEventListener('form-submit', handleFormEvents)
      this.addEventListener('form-cancel', handleFormEvents)
      notifySlottedForm(true)
    }

    const hide = () => {
      setOpen(false)
      document.removeEventListener('keydown', handleKeyDown)
      this.removeEventListener('form-submit', handleFormEvents)
      this.removeEventListener('form-cancel', handleFormEvents)
      notifySlottedForm(false)
      this.dispatchEvent(new CustomEvent('modal-close', { bubbles: true, composed: true }))
    }

    const handleOverlayClick = (e: Event) => {
      if (e.target === e.currentTarget) hide()
    }

    ;(this as any).show = show
    ;(this as any).hide = hide

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .modal-overlay {
            position: fixed; top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center;
            z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .modal-content {
            background: #ffffff;
            border: 1px solid #e4e4e7;
            border-radius: 0.5rem; padding: 1.5rem; min-width: 300px; max-width: 32rem;
            box-shadow: 0 10px 25px rgba(0,0,0,0.2); position: relative;
            max-height: 90vh; overflow-y: auto;
            color: #3f3f46;
          }
          :host([theme="dark"]) .modal-content {
            background: #27272a; border-color: #3f3f46; color: #f4f4f5;
          }
          .modal-header {
            display: flex; justify-content: space-between; align-items: center;
            padding-bottom: 1rem; border-bottom: 1px solid #e4e4e7;
            margin-bottom: 1rem;
          }
          :host([theme="dark"]) .modal-header { border-bottom-color: #3f3f46; }
          .modal-title { font-size: 1.125rem; font-weight: 600; }
          .close-button {
            background: none; border: none; cursor: pointer; color: #71717a;
            padding: 0; width: 1.5rem; height: 1.5rem; display: flex; align-items: center; justify-content: center;
            transition: color 0.2s;
          }
          :host([theme="dark"]) .close-button { color: #a1a1aa; }
          .close-button:hover { color: #3f3f46; }
          :host([theme="dark"]) .close-button:hover { color: #d4d4d8; }
          .modal-body { font-size: 0.875rem; }
        `}</style>
        {open() && (
          <div class="modal-overlay" onClick={handleOverlayClick}>
            <div class="modal-content">
              <div class="modal-header">
                <h2 class="modal-title">{title()}</h2>
                <button class="close-button" onClick={hide}>
                  <svg width="1.25rem" height="1.25rem" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <slot onSlotChange={handleSlotChange} />
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

  show() { (this as any).show?.() }
  hide() { (this as any).hide?.() }

  static get observedAttributes() { return ['title', 'theme'] }
}

customElements.define('as-modal', AsModal)
