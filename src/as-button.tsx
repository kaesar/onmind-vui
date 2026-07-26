import { render } from 'solid-js/web'
import { createSignal } from 'solid-js'
import { createStandardAttributes } from './attribute-observer'

class AsButton extends HTMLElement {
  private dispose?: () => void

  connectedCallback() {
    const [label, setLabel] = createSignal(this.getAttribute('label') || 'Oops!')
    const [link, setLink] = createSignal(this.getAttribute('link') || '')
    const [message, setMessage] = createSignal(this.getAttribute('message') || '')
    const [variant, setVariant] = createSignal(this.getAttribute('variant') || 'primary')
    const [disabled, setDisabled] = createSignal(this.hasAttribute('disabled'))

    const onClick = () => {
      if (disabled()) return

      if (link()) {
        location.assign(link())
      } else if (message()) {
        showNotification(message())
      } else {
        this.dispatchEvent(new CustomEvent('button-tap', {
          bubbles: true,
          composed: true
        }))
      }
    }

    const showNotification = (msg: string) => {
      const notification = document.createElement('div')
      notification.textContent = msg
      notification.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#18181b;color:white;padding:0.75rem 1.5rem;border-radius:0.375rem;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);z-index:9999;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;'
      document.body.appendChild(notification)
      setTimeout(() => notification.remove(), 3500)
    }

    createStandardAttributes(this, {
      label: [label, setLabel],
      link: [link, setLink],
      message: [message, setMessage],
      variant: [variant, setVariant],
      disabled: { setter: setDisabled, isBoolean: true }
    })

    const Component = () => (
      <>
        <style>{`
          :host { display: inline-block; }
          button {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0.5rem 0.75rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            cursor: pointer;
            transition: background-color 0.2s, border-color 0.2s, color 0.2s;
            gap: 0.5rem;
          }
          button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          .primary {
            background: #3b82f6;
            color: #ffffff;
            border: 1px solid #3b82f6;
          }
          .primary:hover:not(:disabled) {
            background: #2563eb;
            border-color: #2563eb;
          }
          .primary:active:not(:disabled) {
            background: #1d4ed8;
            border-color: #1d4ed8;
          }
          .primary:focus-visible {
            outline: 1px solid #3b82f6;
            outline-offset: 2px;
          }
          .secondary {
            background: #f4f4f5;
            color: #52525b;
            border: 1px solid #f4f4f5;
          }
          .secondary:hover:not(:disabled) {
            background: #e4e4e7;
            border-color: #e4e4e7;
          }
          .secondary:active:not(:disabled) {
            background: #d4d4d8;
            border-color: #d4d4d8;
          }
          .secondary:focus-visible {
            outline: 1px solid #52525b;
            outline-offset: 2px;
          }
        `}</style>
        <button
          class={variant()}
          disabled={disabled()}
          onClick={onClick}
        >
          {label()}
        </button>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() {
    this.dispose?.()
  }

  static get observedAttributes() {
    return ['label', 'link', 'message', 'variant', 'disabled']
  }
}

customElements.define('as-button', AsButton)
