import { render } from 'solid-js/web'
import { createSignal, For, createMemo } from 'solid-js'
import { createThemeSync } from './theme-sync'

interface Column { key: string; header: string }

class AsDatagrid extends HTMLElement {
  private dispose?: () => void
  private themeCleanup?: () => void
  private _data: any[] = []
  private _columns: Column[] = []
  private _filterTimer?: ReturnType<typeof setTimeout>

  connectedCallback() {
    const [data, setData] = createSignal(this._data)
    const [columns, setColumns] = createSignal(this._columns)
    const [pageSize] = createSignal(parseInt(this.getAttribute('pageSize') || '15'))
    const [title] = createSignal(this.getAttribute('title') || '')
    const [selectable, setSelectable] = createSignal(this.hasAttribute('selectable'))
    const [pageable, setPageable] = createSignal(this.hasAttribute('pageable'))
    const [filterable, setFilterable] = createSignal(this.hasAttribute('filterable'))
    const [actionable, setActionable] = createSignal(this.hasAttribute('actionable'))

    const [rawFilter, setRawFilter] = createSignal('')
    const [filter, setFilter] = createSignal('')
    const [sortKey, setSortKey] = createSignal<string | null>(null)
    const [sortDir, setSortDir] = createSignal(1)
    const [page, setPage] = createSignal(0)
    const [selectedRow, setSelectedRow] = createSignal<any>(null)

    const onFilterInput = (e: Event) => {
      const val = (e.target as HTMLInputElement).value
      setRawFilter(val)
      clearTimeout(this._filterTimer)
      this._filterTimer = setTimeout(() => { setFilter(val); setPage(0) }, 300)
    }

    // NO theme observer - theme is handled by CSS + createThemeSync
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        if (m.type === 'attributes') {
          const a = m.attributeName
          if (a === 'selectable') setSelectable(this.hasAttribute('selectable'))
          if (a === 'pageable') setPageable(this.hasAttribute('pageable'))
          if (a === 'filterable') setFilterable(this.hasAttribute('filterable'))
          if (a === 'actionable') setActionable(this.hasAttribute('actionable'))
        }
      })
    })
    observer.observe(this, { attributes: true })

    const filteredData = createMemo(() => {
      const f = filter().toLowerCase()
      if (!f) return data()
      return data().filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(f)))
    })

    const sortedData = createMemo(() => {
      const d = filteredData()
      const key = sortKey()
      if (!key) return d
      const dir = sortDir()
      return [...d].sort((a, b) => { const av = a[key]; const bv = b[key]; return av < bv ? -dir : av > bv ? dir : 0 })
    })

    const paginatedData = createMemo(() => {
      if (!pageable()) return sortedData()
      const start = page() * pageSize()
      return sortedData().slice(start, start + pageSize())
    })

    const total = createMemo(() => sortedData().length)
    const pages = createMemo(() => Math.ceil(total() / pageSize()))

    const sort = (key: string) => {
      if (sortKey() === key) setSortDir(d => d === 1 ? -1 : 1)
      else { setSortKey(key); setSortDir(1) }
    }

    const selectRow = (row: any) => {
      if (!selectable()) return
      setSelectedRow(row)
      this.dispatchEvent(new CustomEvent('row-select', { detail: { row, id: row?.id }, bubbles: true, composed: true }))
    }

    ;(this as any).updateData = (newData: any[]) => { this._data = newData; setData(newData); setPage(0); setFilter(''); setRawFilter('') }
    ;(this as any).updateColumns = (newColumns: Column[]) => { this._columns = newColumns; setColumns(newColumns) }

    const Component = () => (
      <>
        <style>{`
          :host { display: block; }
          .container {
            border-radius: 0.5rem; overflow: hidden;
            background: #ffffff; color: #3f3f46;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
          }
          :host([theme="dark"]) .container {
            background: #27272a; color: #d4d4d8;
          }
          .header { padding: 1rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 1.25rem; font-weight: 600; }
          .filter-input {
            width: 12rem; padding: 0.375rem 0.625rem; border: 1px solid #d4d4d8;
            border-radius: 0.375rem; font-size: 0.875rem; outline: none;
            background: #ffffff; color: #3f3f46;
            transition: border-color 0.2s; box-shadow: 0 1px 2px 0 rgba(18,18,23,0.05);
          }
          :host([theme="dark"]) .filter-input {
            background: #09090b; color: #ffffff; border-color: #3f3f46;
          }
          :host([theme="dark"]) .filter-input:focus {
            border-color: #3b82f6;
          }
          .filter-input:not(:disabled):focus { border-color: #3b82f6; }
          .table-wrapper { overflow-x: auto; }
          table { width: 100%; border-collapse: collapse; }
          thead {
            background: #f4f4f5; border-bottom: 1px solid #e4e4e7;
          }
          :host([theme="dark"]) thead {
            background: #18181b; border-bottom-color: #3f3f46;
          }
          th {
            padding: 0.5rem 0.25rem; text-align: left; font-size: 0.75rem;
            font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;
            cursor: pointer; user-select: none; color: #3f3f46;
          }
          :host([theme="dark"]) th { color: #d4d4d8; }
          td {
            padding: 0.5rem 0.25rem; font-size: 0.9375rem;
            border-bottom: 1px solid #e4e4e7;
          }
          :host([theme="dark"]) td { border-bottom-color: #3f3f46; }
          tbody tr:nth-child(even) { background: #f4f4f5; }
          :host([theme="dark"]) tbody tr:nth-child(even) { background: #18181b; }
          tbody tr:hover { background: #eff6ff; }
          :host([theme="dark"]) tbody tr:hover { background: #3f3f46; }
          tbody tr.selectable { cursor: pointer; }
          tbody tr.selected { background: #dbeafe !important; }
          :host([theme="dark"]) tbody tr.selected { background: #1e3a5f !important; }
          td.first-col { border-left: 3px solid transparent; }
          tbody tr.selected td.first-col { border-left-color: #3b82f6; }
          th.action-col, td.action-col { width: 0.5rem; text-align: center; padding: 0; }
          .action-btn {
            background: transparent; border: none; cursor: pointer; font-size: 1.25rem;
            padding: 0 0.25rem; border-radius: 0.25rem; color: #3f3f46;
          }
          :host([theme="dark"]) .action-btn { color: #d4d4d8; }
          .action-btn:hover { background: rgba(0,0,0,0.05); }
          :host([theme="dark"]) .action-btn:hover { background: rgba(255,255,255,0.1); }
          .pagination {
            padding: 0.75rem 0.5rem; border-top: 1px solid #e4e4e7;
            display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem;
          }
          :host([theme="dark"]) .pagination { border-top-color: #3f3f46; }
          .pagination-controls { display: flex; gap: 0.5rem; align-items: center; }
          .page-btn {
            padding: 0.5rem 1rem; border: 1px solid #d4d4d8;
            border-radius: 0.375rem;
            background: #ffffff; color: #3f3f46;
            cursor: pointer; font-family: inherit; font-size: 0.875rem;
          }
          :host([theme="dark"]) .page-btn {
            background: #27272a; color: #d4d4d8; border-color: #3f3f46;
          }
          .page-btn:disabled { opacity: 0.5; cursor: not-allowed; }
          .page-btn:hover:not(:disabled) { background: #f4f4f5; }
          :host([theme="dark"]) .page-btn:hover:not(:disabled) { background: #3f3f46; }
        `}</style>
        <div class="container">
          {(title() || filterable()) && (
            <div class="header">
              <div class="title">{title()}</div>
              {filterable() && (
                <input type="text" class="filter-input" placeholder="Search..." value={rawFilter()} onInput={onFilterInput} />
              )}
            </div>
          )}
          <div class="table-wrapper">
            <table>
              <thead>
                <tr>
                  <For each={columns()}>
                    {(col) => <th onClick={() => sort(col.key)}>{col.header}{sortKey() === col.key ? (sortDir() === 1 ? ' \u2191' : ' \u2193') : ''}</th>}
                  </For>
                  {actionable() && <th class="action-col"></th>}
                </tr>
              </thead>
              <tbody>
                <For each={paginatedData()}>
                  {(row) => (
                    <tr class={`${selectable() ? 'selectable' : ''} ${selectedRow() === row ? 'selected' : ''}`}
                      onClick={() => selectRow(row)}>
                      <For each={columns()}>
                        {(col, idx) => <td class={idx() === 0 ? 'first-col' : ''}>{row[col.key]}</td>}
                      </For>
                      {actionable() && (
                        <td class="action-col">
                          <button class="action-btn" onClick={(e) => {
                            e.stopPropagation()
                            this.dispatchEvent(new CustomEvent('row-action', { detail: { row, id: row?.id, event: e }, bubbles: true, composed: true }))
                          }}>⋮</button>
                        </td>
                      )}
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>
          {pageable() && (
            <div class="pagination">
              <div># {total()}</div>
              <div class="pagination-controls">
                <button class="page-btn" onClick={() => setPage(page() - 1)} disabled={page() === 0}>&lt;</button>
                <span>{page() + 1} / {pages()}</span>
                <button class="page-btn" onClick={() => setPage(page() + 1)} disabled={page() >= pages() - 1}>&gt;</button>
              </div>
            </div>
          )}
        </div>
      </>
    )

    const shadowRoot = this.attachShadow({ mode: 'open' })
    this.dispose = render(Component, shadowRoot)
    this.themeCleanup = createThemeSync(this)
  }

  disconnectedCallback() { this.dispose?.(); this.themeCleanup?.(); clearTimeout(this._filterTimer) }

  set data(value: any[]) { this._data = value; (this as any).updateData?.(value) }
  get data() { return this._data }
  set columns(value: Column[]) { this._columns = value; (this as any).updateColumns?.(value) }
  get columns() { return this._columns }
  set selectable(value: boolean) { value ? this.setAttribute('selectable', '') : this.removeAttribute('selectable') }
  set filterable(value: boolean) { value ? this.setAttribute('filterable', '') : this.removeAttribute('filterable') }
  set pageable(value: boolean) { value ? this.setAttribute('pageable', '') : this.removeAttribute('pageable') }

  static get observedAttributes() { return ['selectable', 'pageable', 'filterable', 'actionable', 'theme', 'pageSize'] }
}

customElements.define('as-datagrid', AsDatagrid)
