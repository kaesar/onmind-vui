import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { Abstract } from './Abstract'

class AsPopup extends HTMLElement {
  private dispose?: () => void
  private _options: string = 'label=Edit,value=edit;label=Duplicate,value=duplicate;label=Delete,value=delete'
  private _observer?: MutationObserver
  public _currentRow: any = null

  connectedCallback() {
    const [options, setOptions] = createSignal(this._options)
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [open, setOpen] = createSignal(false)
    const [x, setX] = createSignal(0)
    const [y, setY] = createSignal(0)
    const [showConfirm, setShowConfirm] = createSignal(false)
    const [pendingItem, setPendingItem] = createSignal<any>(null)

    let ignoreClick = false

    let modalElement: HTMLElement | null = null

    const isDark = () => theme() === 'dark'
    const items = () => (new Abstract()).planeDeserialize(options())

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes' && m.attributeName === 'theme') setTheme(this.getAttribute('theme') || '')
      })
    })
    this._observer = observer
    observer.observe(this, { attributes: true })

    const show = (xPos: number, yPos: number) => {
      ignoreClick = true
      setTimeout(() => { ignoreClick = false }, 100)
      const viewportHeight = window.innerHeight
      const popupWidth = 142
      const popupHeight = items().length * 40
      let adjustedX = xPos - popupWidth
      if (adjustedX < 10) adjustedX = xPos + 10
      let adjustedY = yPos + 10
      if (yPos + popupHeight > viewportHeight - 20) adjustedY = yPos - popupHeight - 10
      setX(adjustedX)
      setY(adjustedY)
      setOpen(true)
      setTimeout(() => addOutsideClickListener(), 0)
    }

    const hide = () => { setOpen(false); removeOutsideClickListener() }

    const isDangerOption = (value: string) => {
      return ['delete', 'remove', 'destroy', 'eliminar', 'borrar'].some(k => value.toLowerCase().includes(k))
    }

    const handleOptionClick = (item: any) => {
      if (isDangerOption(item.value)) { setPendingItem(item); setShowConfirm(true); showModalOutside() }
      else executeOption(item)
    }

    const showModalOutside = () => {
      if (modalElement) document.body.removeChild(modalElement)
      modalElement = document.createElement('div')
      modalElement.innerHTML = `
        <div style="position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;z-index:10000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="background:#fff;border:1px solid #e4e4e7;border-radius:0.75rem;padding:1.5rem;min-width:300px;max-width:500px;box-shadow:0 10px 25px rgba(0,0,0,0.2);">
            <div style="font-size:1.25rem;font-weight:600;margin-bottom:1rem;color:#3f3f46;">Confirm action</div>
            <div style="margin-bottom:1.5rem;color:#52525b;font-size:0.875rem;">Are you sure you want to ${pendingItem()?.label?.toLowerCase()}?</div>
            <div style="display:flex;gap:0.5rem;justify-content:flex-end;">
              <button id="cancel-btn" style="padding:0.375rem 0.75rem;background:#f4f4f5;color:#52525b;border:none;border-radius:0.375rem;font-size:0.875rem;cursor:pointer;font-family:inherit;">Cancel</button>
              <button id="confirm-btn" style="padding:0.375rem 0.75rem;background:#3b82f6;color:white;border:none;border-radius:0.375rem;font-size:0.875rem;cursor:pointer;font-family:inherit;">${pendingItem()?.label}</button>
            </div>
          </div>
        </div>
      `
      modalElement.querySelector('#cancel-btn')?.addEventListener('click', () => { cancelAction(); hideModalOutside() })
      modalElement.querySelector('#confirm-btn')?.addEventListener('click', () => { confirmAction(); hideModalOutside() })
      modalElement.addEventListener('click', (e) => { if (e.target === modalElement) { cancelAction(); hideModalOutside() } })
      document.body.appendChild(modalElement)
    }

    const hideModalOutside = () => {
      if (modalElement && document.body.contains(modalElement)) { document.body.removeChild(modalElement); modalElement = null }
    }

    const executeOption = (item: any) => {
      this.dispatchEvent(new CustomEvent('option-select', { detail: { value: item.value, label: item.label }, bubbles: true, composed: true }))
      hide()
    }

    const confirmAction = () => {
      const item = pendingItem()
      if (item) { executeOption(item); setPendingItem(null) }
      setShowConfirm(false)
      hideModalOutside()
    }

    const cancelAction = () => { setShowConfirm(false); setPendingItem(null); hideModalOutside(); hide() }

    const outsideClickHandler = (e: Event) => {
      if (ignoreClick) return
      const target = e.target as Element
      if (!target.closest('as-popup') && !showConfirm()) hide()
    }

    const addOutsideClickListener = () => document.addEventListener('click', outsideClickHandler)
    const removeOutsideClickListener = () => document.removeEventListener('click', outsideClickHandler)

    ;(this as any).show = show
    ;(this as any).hide = hide
    ;(this as any).updateOptions = (newOptions: string) => { this._options = newOptions; setOptions(newOptions) }

    const Component = () => (
      <>
        <style>{`
          :host { position: fixed; z-index: 1000; pointer-events: none; }
          .popup {
            background: ${isDark() ? '#18181b' : '#ffffff'};
            border: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
            border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
            min-width: 140px; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            pointer-events: auto; padding: 0.25rem 0;
          }
          .option {
            padding: 0.5rem 0.75rem; cursor: pointer; font-size: 0.875rem;
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'}; transition: background-color 0.2s;
          }
          .option:hover { background: ${isDark() ? '#27272a' : '#f4f4f5'}; }
          .option.danger { color: #ef4444; }
        `}</style>
        <div style={`position: fixed; left: ${x()}px; top: ${y()}px; z-index: 1000;`}>
          {open() && (
            <div class="popup">
              <For each={items()}>
                {(item) => (
                  <div class={`option ${isDangerOption(item.value) ? 'danger' : ''}`}
                    data-value={item.value}
                    onClick={() => handleOptionClick(item)}
                  >{item.label}</div>
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

  disconnectedCallback() { this.dispose?.(); this._observer?.disconnect() }

  set options(value: string) { this._options = value; (this as any).updateOptions?.(value) }
  get options() { return this._options }

  show(x: number, y: number) { (this as any).show?.(x, y) }
  hide() { (this as any).hide?.() }
}

customElements.define('as-popup', AsPopup)