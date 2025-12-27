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

function handleAction(row, event) {
  if (isSelectable.value) {
    selectedRowId.value = row.id
  }
  emit('row-action', { row, id: row.id, event })
}
</script>

<template>
  <div 
    v-if="tableData.length && tableColumns.length" 
    class="rounded-lg shadow overflow-hidden"
    :class="theme === 'dark' ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'"
  >
    <div v-if="title || isFilterable" class="pt-[0.4rem] px-2 pb-4 px-6 flex justify-between items-center flex-col md:flex-row gap-2">
      <div v-if="title" class="text-xl font-semibold">{{ title }}</div>
      <div v-else></div>
      <input
        v-if="isFilterable"
        type="text"
        placeholder="🔍" 
        :value="filter"
        @input="e => { filter = e.target.value; page = 0 }"
        class="w-48 px-2.5 py-1.5 border border-surface-300 dark:border-surface-700 rounded text-base outline-none transition-colors duration-200 bg-surface-0 dark:bg-surface-950 text-surface-700 dark:text-surface-0 placeholder:text-surface-500 dark:placeholder:text-surface-400 hover:border-surface-400 dark:hover:border-surface-600 focus:border-primary shadow-[0_1px_2px_0_rgba(18,18,23,0.05)]"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="w-full">
        <thead :class="theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'">
          <tr class="border-b" :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
            <th 
              v-for="col in tableColumns" 
              :key="col.key" 
              @click="sort(col.key)"
              class="px-1 py-2 text-left text-xs font-medium uppercase tracking-wide cursor-pointer select-none opacity-70"
              style="padding: 0.5rem 0.25rem;"
            >
              {{ col.header }}
              {{ sortKey === col.key ? (sortDir === 1 ? ' ↑' : ' ↓') : '' }}
            </th>
            <th v-if="isActionable" class="w-2 text-center py-2 px-0"></th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="row in paginatedData" 
            :key="row.id"
            @click="selectRow(row)"
            :class="[
              isSelectable && 'cursor-pointer',
              selectedRowId === row.id && (theme === 'dark' ? 'bg-blue-800' : 'bg-blue-100'),
              selectedRowId !== row.id && (theme === 'dark' ? 'even:bg-gray-900 hover:bg-gray-700' : 'even:bg-gray-50 hover:bg-blue-50')
            ]"
          >
            <td 
              v-for="(col, idx) in tableColumns" 
              :key="col.key"
              :class="[
                'border-b',
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
                idx === 0 && 'border-l-[3px]',
                idx === 0 && selectedRowId === row.id ? 'border-l-blue-500' : idx === 0 && 'border-l-transparent'
              ]"
              style="padding: 0.5rem 0.25rem; font-size: 0.9375rem;"
            >
              {{ row[col.key] }}
            </td>
            <td v-if="isActionable" class="w-2 text-center py-0 px-0">
              <button 
                @click.stop="handleAction(row, $event)"
                class="text-xl leading-none p-0 border-none bg-transparent cursor-pointer rounded"
                :class="theme === 'dark' ? 'text-gray-100 hover:bg-gray-600' : 'text-gray-800 hover:bg-gray-200'"
              >
                ⋮
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="isPageable" class="pt-[0.6rem] px-2 pb-2 border-t flex justify-between items-center text-sm" :class="theme === 'dark' ? 'border-gray-700' : 'border-gray-200'">
      <div># {{ sortedData.length }}</div>
      <div class="flex gap-2 items-center">
        <button 
          @click="page--" 
          :disabled="page === 0"
          class="px-4 py-2 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :class="theme === 'dark' 
            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
            : 'bg-white border-gray-400 hover:bg-gray-100'"
        >
          &lt;
        </button>
        <span>{{ page + 1 }} / {{ totalPages }}</span>
        <button 
          @click="page++" 
          :disabled="page >= totalPages - 1"
          class="px-4 py-2 border rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          :class="theme === 'dark' 
            ? 'bg-gray-700 border-gray-600 hover:bg-gray-600' 
            : 'bg-white border-gray-400 hover:bg-gray-100'"
        >
          &gt;
        </button>
      </div>
    </div>
  </div>
</template>
