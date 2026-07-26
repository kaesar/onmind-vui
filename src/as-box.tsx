import { render } from 'solid-js/web'
import { createThemeSync } from './theme-sync'

class AsBox extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private boxEl?: HTMLDivElement

  private applyStyles() {
    if (!this.boxEl) return
    const isDark = this.getAttribute('theme') === 'dark'
    const isDim = this.getAttribute('dim') === 'true'

    let bgColor: string
    let boxShadow: string
    let color: string

    if (isDark && isDim) {
      bgColor = '#3f3f46'
      boxShadow = '0 4px 6px -1px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)'
      color = '#f4f4f5'
    } else if (isDark) {
      bgColor = '#27272a'
      boxShadow = '0 4px 6px -1px rgba(0,0,0,0.4), 0 1px 3px rgba(0,0,0,0.3)'
      color = '#f4f4f5'
    } else if (isDim) {
      bgColor = '#e4e4e7'
      boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'
      color = '#27272a'
    } else {
      bgColor = '#f4f4f5'
      boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08)'
      color = '#27272a'
    }

    this.boxEl.style.backgroundColor = bgColor
    this.boxEl.style.boxShadow = boxShadow
    this.boxEl.style.color = color
  }

  private propagateTheme() {
    const isDark = this.getAttribute('theme') === 'dark'
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) return
    const elements = (slot as HTMLSlotElement).assignedElements()
    elements.forEach(el => {
      if (isDark) {
        el.setAttribute('theme', 'dark')
      } else {
        el.removeAttribute('theme')
      }
    })
  }

  private flush() {
    this.applyStyles()
    this.propagateTheme()
  }

  connectedCallback() {
    const handleSlotChange = () => this.propagateTheme()

    const Component = () => (
      <div class="box" ref={(el) => { this.boxEl = el; this.applyStyles() }}>
        <slot onSlotChange={handleSlotChange} />
      </div>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    const style = document.createElement('style')
    style.textContent = `
      :host { display: block; }
      .box {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.5rem;
        border-radius: 0.5rem;
        transition: background-color 0.2s, box-shadow 0.2s, color 0.2s;
      }
    `
    shadowRoot.appendChild(style)
    this.dispose = render(Component, shadowRoot)

    this.themeCleanup = createThemeSync(this)
  }

  disconnectedCallback() {
    this.dispose?.()
    this.themeCleanup?.()
  }

  attributeChangedCallback() {
    this.flush()
  }

  static get observedAttributes() {
    return ['dim', 'theme']
  }
}

customElements.define('as-box', AsBox)
