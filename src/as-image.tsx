import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsImage extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [url, setUrl] = createSignal(this.getAttribute('url') || '')

    createStandardAttributes(this, { url: [url, setUrl] })

    const Component = () => (
      <>
        <style>{`
          :host { display: flex; justify-content: center; }
          .image-container { display: flex; justify-content: center; }
          img { max-width: 100%; border-radius: 0.5rem; }
        `}</style>
        <div class="image-container">
          {url() && <img src={url()} />}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.() }
  static get observedAttributes() { return ['url'] }
}

customElements.define('as-image', AsImage)
