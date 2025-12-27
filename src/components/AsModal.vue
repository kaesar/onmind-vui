<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  title: { type: String, default: '' },
  open: { type: Boolean, default: false },
  theme: { type: String, default: '' }
})

const emit = defineEmits(['modal-close'])

const isOpen = ref(props.open)

function show() {
  isOpen.value = true
  document.addEventListener('keydown', handleKeyDown)
  // Notify slotted forms to hide their titles
  notifySlottedForm(true)
}

function hide() {
  isOpen.value = false
  document.removeEventListener('keydown', handleKeyDown)
  // Restore form titles when modal closes
  notifySlottedForm(false)
  emit('modal-close')
}

function handleOverlayClick(e) {
  if (e.target === e.currentTarget) {
    hide()
  }
}

function handleKeyDown(e) {
  if (e.key === 'Escape' && isOpen.value) {
    hide()
  }
}

function notifySlottedForm(hideTitle) {
  // This would need to be implemented based on how forms are structured in Vue
  // For now, it's a placeholder for the functionality
}

onMounted(() => {
  if (props.open) {
    show()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})

// Expose methods for external use
defineExpose({
  show,
  hide
})
</script>

<template>
  <Teleport to="body">
    <div v-if="isOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]" @click="handleOverlayClick">
      <div 
        class="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="flex justify-between items-center p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-gray-100">{{ title }}</h2>
          <button 
            @click="hide"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
        <div class="p-6 text-gray-700 dark:text-gray-300">
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>
</template>