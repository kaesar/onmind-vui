import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsUpload extends HTMLElement {
  private dispose?: () => void
  private fileInputRef?: HTMLInputElement

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || 'Upload files')
    const [accept, setAccept] = createSignal(this.getAttribute('accept') || '*')
    const [multiple, setMultiple] = createSignal(this.hasAttribute('multiple'))
    const [theme, setTheme] = createSignal(this.getAttribute('theme') || '')
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))
    const [dragOver, setDragOver] = createSignal(false)

    const isDark = () => theme() === 'dark'

    const handleClick = () => { if (!disabled()) this.fileInputRef?.click() }

    const handleFileChange = (e: Event) => {
      const files = (e.target as HTMLInputElement).files
      if (files) {
        this.dispatchEvent(new CustomEvent('files-selected', {
          detail: { files: Array.from(files) }, bubbles: true, composed: true
        }))
      }
    }

    const handleDragOver = (e: DragEvent) => { if (!disabled()) { e.preventDefault(); setDragOver(true) } }
    const handleDragLeave = () => setDragOver(false)

    const handleDrop = (e: DragEvent) => {
      if (disabled()) return
      e.preventDefault()
      setDragOver(false)
      const files = e.dataTransfer?.files
      if (files) {
        this.dispatchEvent(new CustomEvent('files-selected', {
          detail: { files: Array.from(files) }, bubbles: true, composed: true
        }))
      }
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      accept: [accept, setAccept],
      multiple: { setter: setMultiple, isBoolean: true },
      theme: [theme, setTheme],
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          .upload-area {
            border: 2px dashed ${isDark() ? '#3f3f46' : '#d4d4d8'};
            border-radius: 0.5rem; padding: 2rem; text-align: center;
            background: ${isDark() ? '#09090b' : '#ffffff'};
            color: ${isDark() ? '#d4d4d8' : '#3f3f46'};
            cursor: pointer; transition: all 0.2s;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          .upload-area:hover:not(.disabled) {
            border-color: #3b82f6;
            background: ${isDark() ? '#18181b' : '#eff6ff'};
          }
          .upload-area.drag-over {
            border-color: #3b82f6;
            background: ${isDark() ? '#1e3a5f' : '#dbeafe'};
          }
          .upload-area.disabled { opacity: 0.5; cursor: not-allowed; }
          .upload-icon { font-size: 2rem; margin-bottom: 0.5rem; }
          .upload-text { font-size: 0.875rem; margin-bottom: 0.25rem; }
          .upload-hint { font-size: 0.875rem; opacity: 0.7; }
          input[type="file"] { display: none; }
        `}</style>
        <div
          class={`upload-area ${dragOver() ? 'drag-over' : ''} ${disabled() ? 'disabled' : ''}`}
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div class="upload-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/>
            </svg>
          </div>
          <div class="upload-text">{label()}</div>
          <div class="upload-hint">Click or drag files here</div>
          <input
            ref={(el) => this.fileInputRef = el}
            type="file"
            accept={accept()}
            multiple={multiple()}
            onChange={handleFileChange}
          />
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.() }

  static get observedAttributes() {
    return ['label', 'accept', 'multiple', 'theme', 'disabled']
  }
}

customElements.define('as-upload', AsUpload)
