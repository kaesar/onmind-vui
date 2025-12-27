<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  options: { type: String, default: 'label=Edit,value=edit;label=Duplicate,value=duplicate;label=Delete,value=delete' },
  theme: { type: String, default: '' },
  open: { type: Boolean, default: false }
})

const emit = defineEmits(['option-select'])

const isOpen = ref(props.open)
const x = ref(0)
const y = ref(0)
const showConfirm = ref(false)
const pendingItem = ref(null)

const items = computed(() => {
  if (!props.options) return []
  return props.options.split(';').map(entry => {
    const obj = {}
    entry.split(',').forEach(attr => {
      const [key, val] = attr.split('=')
      obj[key] = val
    })
    return obj
  })
})

function show(clientX, clientY) {
  x.value = clientX
  y.value = clientY
  isOpen.value = true
  addOutsideClickListener()
}

function hide() {
  isOpen.value = false
  removeOutsideClickListener()
}

function adjustPosition() {
  // This would need DOM manipulation to adjust position
  // For now, using fixed positioning
}

function handleOptionClick(item) {
  if (isDangerOption(item.value)) {
    pendingItem.value = item
    showConfirm.value = true
  } else {
    executeOption(item)
  }
}

function executeOption(item) {
  emit('option-select', { value: item.value, label: item.label })
  hide()
}

function confirmAction() {
  if (pendingItem.value) {
    executeOption(pendingItem.value)
    pendingItem.value = null
  }
  showConfirm.value = false
}

function cancelAction() {
  pendingItem.value = null
  showConfirm.value = false
  hide()
}

function isDangerOption(value) {
  const dangerKeywords = ['delete', 'remove', 'destroy', 'eliminar', 'borrar']
  return dangerKeywords.some(keyword => value.toLowerCase().includes(keyword))
}

const outsideClickHandler = (e) => {
  if (!e.target.closest('.popup-container')) {
    hide()
  }
}

function addOutsideClickListener() {
  setTimeout(() => {
    document.addEventListener('click', outsideClickHandler)
  }, 0)
}

function removeOutsideClickListener() {
  document.removeEventListener('click', outsideClickHandler)
}

onUnmounted(() => {
  removeOutsideClickListener()
})

// Expose methods for external use
defineExpose({
  show,
  hide
})
</script>

<template>
  <Teleport to="body">
    <div 
      v-if="isOpen" 
      class="popup-container fixed z-[1000] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg min-w-[120px] transform -translate-x-full"
      :style="{ left: x + 'px', top: y + 'px' }"
    >
      <div
        v-for="item in items"
        :key="item.value"
        class="px-3 py-2 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
        :class="{
          'text-red-600 dark:text-red-400': isDangerOption(item.value),
          'text-gray-800 dark:text-gray-200': !isDangerOption(item.value)
        }"
        @click="handleOptionClick(item)"
      >
        {{ item.label }}
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirm && pendingItem" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000]" @click="cancelAction">
      <div class="bg-white dark:bg-gray-800 rounded-lg p-6 min-w-[300px] max-w-[500px] shadow-xl" @click.stop>
        <div class="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Confirmar acción</div>
        <div class="mb-6 text-gray-700 dark:text-gray-300">
          ¿Estás seguro de que deseas {{ pendingItem.label.toLowerCase() }}?
        </div>
        <div class="flex justify-end gap-2">
          <button 
            @click="cancelAction"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
          >
            Cancelar
          </button>
          <button 
            @click="confirmAction"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            {{ pendingItem.label }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>