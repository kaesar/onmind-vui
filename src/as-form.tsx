import { render } from 'solid-js/web'
import { createSignal, For } from 'solid-js'
import { createThemeSync } from './theme-sync'

class AsForm extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _schema: any = {}
  private _hideTitle = false
  private _handleKeyDown?: (e: KeyboardEvent) => void

  connectedCallback() {
    this.themeCleanup = createThemeSync(this)

    const [schema, setSchema] = createSignal(this._schema)
    const [theme] = createSignal(this.getAttribute('theme') || 'light')
    const [successMessage] = createSignal(this.getAttribute('successMessage') || '')
    const [hideTitle, setHideTitle] = createSignal(this._hideTitle || this.hasAttribute('hideTitle'))
    const [formData, setFormData] = createSignal<any>({})
    const [errors, setErrors] = createSignal<any>({})
    const [cancelled, setCancelled] = createSignal(false)

    const isDark = () => theme() === 'dark'

    const handleFieldChange = (fieldName: string, value: any) => {
      setFormData({ ...formData(), [fieldName]: value })
      if (errors()[fieldName]) { const ne = { ...errors() }; delete ne[fieldName]; setErrors(ne) }
      this.dispatchEvent(new CustomEvent('field-change', { detail: { fieldName, value, formData: formData() }, bubbles: true, composed: true }))
    }

    const validateField = (value: any, rules: string[]) => {
      const validators: Record<string, { validate: (v: any, p: string) => boolean; message: (p: string) => string }> = {
        required: { validate: (v) => v && v.toString().trim().length > 0, message: () => 'This field is required' },
        email: { validate: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), message: () => 'Please enter a valid email address' },
        min: { validate: (v, p) => !v || v.toString().length >= parseInt(p), message: (p) => `Minimum ${p} characters required` },
        max: { validate: (v, p) => !v || v.toString().length <= parseInt(p), message: (p) => `Maximum ${p} characters allowed` },
        number: { validate: (v) => !v || !isNaN(Number(v)), message: () => 'Please enter a valid number' },
        positive: { validate: (v) => !v || Number(v) > 0, message: () => 'Please enter a positive number' },
        url: { validate: (v) => !v || /^https?:\/\/.+/.test(v), message: () => 'Please enter a valid URL' },
        pattern: { validate: (v, p) => !v || new RegExp(p).test(v), message: (p) => `Value must match pattern: ${p}` },
        enum: { validate: (v, p) => !v || p.split(',').includes(v), message: (p) => `Value must be one of: ${p.replace(/,/g, ', ')}` },
        password: { validate: (v) => !v || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v), message: () => 'Password must be at least 8 characters with uppercase, lowercase and number' }
      }
      for (const rule of rules) {
        const [ruleName, ruleParam] = rule.split(':')
        const validator = validators[ruleName]
        if (validator && !validator.validate(value, ruleParam)) return { valid: false, message: validator.message(ruleParam) }
      }
      return { valid: true }
    }

    const handleSubmit = () => {
      const s = schema(); let hasErrors = false; const ne: any = {}
      const allFields = [...(s.fields || []), ...(s.sections?.flatMap((sec: any) => sec.fields) || [])]
      allFields.forEach((field: any) => {
        if (field.validation) {
          const value = formData()[field.name] || field.value || ''
          const result = validateField(value, field.validation)
          if (!result.valid) { ne[field.name] = result.message; hasErrors = true }
        }
      })
      setErrors(ne)
      if (!hasErrors) {
        if (successMessage()) showNotification(successMessage())
        this.dispatchEvent(new CustomEvent('form-submit', { detail: { formData: formData() }, bubbles: true, composed: true }))
      } else if (this.getAttribute('errorMessage')) {
        showNotification(this.getAttribute('errorMessage')!, 'error')
      }
    }

    const handleCancel = () => { setCancelled(true); this.dispatchEvent(new CustomEvent('form-cancel', { bubbles: true, composed: true })) }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleCancel()
      else if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit() }
    }
    this._handleKeyDown = handleKeyDown
    document.addEventListener('keydown', handleKeyDown)

    const showNotification = (msg: string, type: 'success' | 'error' = 'success') => {
      const n = document.createElement('div'); n.textContent = msg
      n.style.cssText = `position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:${type === 'error' ? '#ef4444' : '#059669'};color:white;padding:0.75rem 1.5rem;border-radius:0.375rem;box-shadow:0 4px 6px rgba(0,0,0,0.1);z-index:9999;font-family:-apple-system,BlinkMacSystemFont,sans-serif;`
      document.body.appendChild(n); setTimeout(() => n.remove(), 3500)
    }

    const formatOptions = (options: any) => {
      if (!options) return ''
      return Array.isArray(options) ? options.map(opt => `label=${opt.label},value=${opt.value}`).join(';') : options
    }

    const renderField = (field: any) => {
      const value = formData()[field.name] || field.value || ''
      const fieldTheme = (theme() === 'dark' ? 'dark' : 'light') as 'light' | 'dark'
      const commonProps = { label: field.label || field.name, value, placeholder: field.placeholder || '', theme: fieldTheme, disabled: field.disabled || false, readonly: field.readonly || false }

      switch (field.type) {
        case 'text': case 'email': case 'password': case 'number':
          return <as-input {...commonProps} kind={field.type} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'textarea':
          return <as-text {...commonProps} rows={field.rows || 3} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'select':
          return <as-select {...commonProps} options={formatOptions(field.options)} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'complete':
          return <as-complete {...commonProps} options={formatOptions(field.options)} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'date':
          return <as-date {...commonProps} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'time':
          return <as-time {...commonProps} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'checkbox':
          return <as-check label={field.label || field.name} checked={Boolean(value)} theme={fieldTheme} disabled={field.disabled} readonly={field.readonly} required={field.required} onCheckedChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'switch':
          return <as-switch label={field.label || field.name} checked={Boolean(value)} theme={fieldTheme} disabled={field.disabled} readonly={field.readonly} required={field.required} onCheckedChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'radio':
          return <as-radio label={field.label || field.name} value={value} options={formatOptions(field.options)} theme={fieldTheme} disabled={field.disabled} readonly={field.readonly} required={field.required} onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
        case 'upload':
          return <as-upload label={field.label || field.name} accept={field.accept || '*'} multiple={field.multiple || false} theme={fieldTheme} disabled={field.disabled} required={field.required} onFilesSelected={(e: CustomEvent) => handleFieldChange(field.name, e.detail.files)} />
        default:
          return <as-input {...commonProps} kind="text" onValueChanged={(e: CustomEvent) => handleFieldChange(field.name, e.detail.value)} />
      }
    }

    ;(this as any).clearErrors = () => setErrors({})
    ;(this as any).validate = () => Object.keys(errors()).length === 0
    ;(this as any).getFormData = () => ({ ...formData() })
    ;(this as any).setFormData = (data: any) => setFormData({ ...data })
    ;(this as any).updateSchema = (newSchema: any) => { this._schema = newSchema; setSchema(newSchema) }
    ;(this as any).updateHideTitle = (value: boolean) => { this._hideTitle = value; setHideTitle(value) }

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .form-container {
            display: flex; flex-direction: column; gap: 1rem;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          .form-title { font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; color: ${isDark() ? '#f4f4f5' : '#3f3f46'}; }
          .form-section { display: flex; flex-direction: column; gap: 0.75rem; }
          .section-title { font-size: 1.125rem; font-weight: 500; color: ${isDark() ? '#f4f4f5' : '#52525b'}; margin-bottom: 0.5rem; }
          .form-actions {
            display: flex; gap: 0.75rem; justify-content: flex-end;
            margin-top: 1.5rem; padding-top: 1rem;
            border-top: 1px solid ${isDark() ? '#3f3f46' : '#e4e4e7'};
          }
          .error-msg { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }
          button {
            padding: 0.375rem 0.75rem; border: none; border-radius: 0.375rem;
            font-size: 0.875rem; font-weight: 500; cursor: pointer; transition: background-color 0.2s;
            font-family: inherit;
          }
          .btn-primary { background: #3b82f6; color: white; }
          .btn-primary:hover { background: #2563eb; }
          .btn-secondary { background: ${isDark() ? '#27272a' : '#f4f4f5'}; color: ${isDark() ? '#d4d4d8' : '#52525b'}; }
          .btn-secondary:hover { background: ${isDark() ? '#3f3f46' : '#e4e4e7'}; }
        `}</style>
        <div class="form-container">
          {schema().title && !hideTitle() && <h2 class="form-title">{schema().title}</h2>}
          {schema().sections ? (
            <For each={schema().sections}>
              {(section) => (
                <div class="form-section">
                  {section.title && <h3 class="section-title">{section.title}</h3>}
                  <For each={section.fields}>{(field) => renderField(field)}</For>
                </div>
              )}
            </For>
          ) : (
            <For each={schema().fields || []}>{(field) => renderField(field)}</For>
          )}
          {!schema().skipActions && (
            <div class="form-actions">
              {!schema().hideCancelButton && <button class="btn-secondary" onClick={handleCancel}>{schema().cancelLabel || 'Cancel'}</button>}
              <button class="btn-primary" disabled={cancelled()} onClick={handleSubmit}>{schema().submitLabel || 'Save'}</button>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
  }

  disconnectedCallback() { this.dispose?.(); this.themeCleanup?.(); if (this._handleKeyDown) document.removeEventListener('keydown', this._handleKeyDown) }

  set schema(value: any) { this._schema = value; (this as any).updateSchema?.(value) }
  get schema() { return this._schema }
  set hideTitle(value: boolean) { this._hideTitle = value; (this as any).updateHideTitle?.(value) }
  get hideTitle() { return this._hideTitle }

  clearErrors() { (this as any).clearErrors?.() }
  validate() { return (this as any).validate?.() }
  getFormData() { return (this as any).getFormData?.() }
  setFormData(data: any) { (this as any).setFormData?.(data) }
}

customElements.define('as-form', AsForm)
