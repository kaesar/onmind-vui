<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  data: { type: Array, default: () => [] },
  columns: { type: Array, default: () => [] },
  pageSize: { type: Number, default: 15 },
  title: { type: String, default: '' },
  theme: { type: String, default: '' },
  selectable: { type: [Boolean, String], default: false },
  pageable: { type: [Boolean, String], default: false },
  filterable: { type: [Boolean, String], default: false },
  actionable: { type: [Boolean, String], default: false }
})

const isSelectable = computed(() => props.selectable === true || props.selectable === '' || props.selectable === 'true')
const isPageable = computed(() => props.pageable === true || props.pageable === '' || props.pageable === 'true')
const isFilterable = computed(() => props.filterable === true || props.filterable === '' || props.filterable === 'true')
const isActionable = computed(() => props.actionable === true || props.actionable === '' || props.actionable === 'true')

const emit = defineEmits(['row-select', 'row-action'])

const sampleData = Array.from({length: 57}, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  email: `user${i + 1}@ejemplo.com`,
  role: ['Admin', 'Editor', 'Viewer'][Math.floor(Math.random()*3)],
  status: Math.random() > 0.5 ? 'Activo' : 'Inactivo'
}))

const sampleColumns = [
  { key: 'name', header: 'Nombre' },
  { key: 'email', header: 'Correo' },
  { key: 'role', header: 'Rol' },
  { key: 'status', header: 'Estado' }
]

const tableData = computed(() => props.data.length > 0 ? props.data : sampleData)
const tableColumns = computed(() => props.columns.length > 0 ? props.columns : sampleColumns)

const filter = ref('')
const sortKey = ref(null)
const sortDir = ref(1)
const page = ref(0)
const selectedRowId = ref(null)

const filteredData = computed(() => {
  if (!filter.value) return tableData.value
  const f = filter.value.toLowerCase()
  return tableData.value.filter(row => 
    Object.values(row).some(v => String(v).toLowerCase().includes(f))
  )
})

const sortedData = computed(() => {
  if (!sortKey.value) return filteredData.value
  return [...filteredData.value].sort((a, b) => {
    const av = a[sortKey.value]
    const bv = b[sortKey.value]
    return av < bv ? -sortDir.value : av > bv ? sortDir.value : 0
  })
})

const paginatedData = computed(() => {
  if (!isPageable.value) return sortedData.value
  const start = page.value * props.pageSize
  return sortedData.value.slice(start, start + props.pageSize)
})

const totalPages = computed(() => Math.ceil(sortedData.value.length / props.pageSize))

function sort(key) {
  if (sortKey.value === key) {
    sortDir.value = sortDir.value === 1 ? -1 : 1
  } else {
    sortKey.value = key
    sortDir.value = 1
  }
}

function selectRow(row) {
  if (!isSelectable.value) return
  selectedRowId.value = row.id
  emit('row-select', { row, id: row.id })
}

function handleAction(row) {
  if (isSelectable.value) {
    selectedRowId.value = row.id
  }
  emit('row-action', { row, id: row.id })
}
</script>

<template>
  <div v-if="tableData.length && tableColumns.length" class="container" :data-theme="theme">
    <div v-if="title || isFilterable" class="header">
      <div v-if="title" class="title">{{ title }}</div>
      <div v-else></div>
      <input
        v-if="isFilterable"
        type="text"
        placeholder="🔍" 
        :value="filter"
        @input="e => { filter = e.target.value; page = 0 }"
      />
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th v-for="col in tableColumns" :key="col.key" @click="sort(col.key)">
              {{ col.header }}
              {{ sortKey === col.key ? (sortDir === 1 ? ' ↑' : ' ↓') : '' }}
            </th>
            <th v-if="isActionable" class="action-col"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in paginatedData" 
            :key="row.id"
            :class="{ selectable: isSelectable, selected: selectedRowId === row.id }"
            @click="selectRow(row)"
          >
            <td v-for="(col, idx) in tableColumns" :key="col.key" :class="{ 'first-col': idx === 0 }">{{ row[col.key] }}</td>
            <td v-if="isActionable" class="action-col">
              <button class="action-btn" @click.stop="handleAction(row)">⋮</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isPageable" class="pagination">
      <div># {{ sortedData.length }}</div>
      <div class="pagination-controls">
        <button @click="page--" :disabled="page === 0">&lt;</button>
        <span>{{ page + 1 }} / {{ totalPages }}</span>
        <button @click="page++" :disabled="page >= totalPages - 1">&gt;</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  background: var(--table-bg, white);
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
  color: var(--table-text, #1f2937);
  --table-bg: white;
  --table-text: #1f2937;
  --table-border: #e5e7eb;
  --table-border-strong: #d1d5db;
  --table-row-even: #f9fafb;
  --table-row-hover: #eff6ff;
  --table-row-selected: #dbeafe;
  --input-bg: white;
  --input-border: #d1d5db;
  --button-bg: white;
  --button-hover: #f3f4f6;
}
.container[data-theme="dark"] {
  --table-bg: #1f2937;
  --table-text: #f3f4f6;
  --table-border: #374151;
  --table-border-strong: #4b5563;
  --table-row-even: #111827;
  --table-row-hover: #1e3a5f;
  --table-row-selected: #1e40af;
  --input-bg: #374151;
  --input-border: #4b5563;
  --button-bg: #374151;
  --button-hover: #4b5563;
}
.header {
  padding: 0.4rem 0.5rem 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.title {
  font-size: 1.25rem;
  font-weight: 600;
}
input {
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--input-border);
  border-radius: 4px;
  max-width: 400px;
  background: var(--input-bg);
  color: var(--table-text);
  font-size: 1rem;
  font-family: inherit;
  outline: none;
  transition: border-color 0.2s;
}
input:focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px #3b82f6;
}
.container[data-theme="dark"] input:focus {
  border-color: #60a5fa;
  box-shadow: 0 0 0 1px #60a5fa;
}
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}
table {
  width: 100%;
}
thead {
  background-color: var(--table-row-even);
  border-bottom: 1px solid var(--table-border);
}
th {
  padding: 0.5rem 0.25rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  user-select: none;
  color: var(--table-text);
  opacity: 0.7;
}
th.action-col {
  width: 0.5rem;
  text-align: center;
  cursor: default;
  padding: 0;
}
tbody tr {
  border-bottom: 1px solid var(--table-border);
  transition: background-color 0.15s;
}
td {
  padding: 0.5rem 0.25rem;
  font-size: 0.9375rem;
  color: var(--table-text);
}
td.first-col {
  border-left: 3px solid transparent;
}
td.action-col {
  width: 0.5rem;
  text-align: center;
  padding: 0;
}
.action-btn {
  background: transparent;
  border: none;
  color: var(--table-text);
  cursor: pointer;
  font-size: 1.25rem;
  padding: 0;
  border-radius: 4px;
  line-height: 1;
}
.action-btn:hover {
  background: var(--button-hover);
}
tbody tr:nth-child(even) {
  background-color: var(--table-row-even);
}
tbody tr:hover {
  background-color: var(--table-row-hover);
}
tbody tr.selectable {
  cursor: pointer;
}
tbody tr.selected {
  background-color: var(--table-row-selected) !important;
  height: auto;
}
tbody tr.selected td.first-col {
  border-left-color: #3b82f6;
}
.pagination {
  padding: 0.6rem 0.5rem 0.5rem 0.5rem;
  border-top: 1px solid var(--table-border);
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.875rem;
}
.pagination-controls {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}
button {
  padding: 0.5rem 1rem;
  border: 1px solid var(--table-border-strong);
  border-radius: 4px;
  background: var(--button-bg);
  color: var(--table-text);
  cursor: pointer;
}
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
button:hover:not(:disabled) {
  background: var(--button-hover);
}
@media (max-width: 768px) {
  .container {
    padding: 0.5rem;
  }
  .header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }
  .title {
    font-size: 1rem;
  }
  input {
    max-width: 100%;
    font-size: 0.875rem;
  }
  th, td {
    padding: 0.25rem 0.5rem;
    font-size: 0.875rem;
  }
  .pagination {
    font-size: 0.75rem;
  }
  button {
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
