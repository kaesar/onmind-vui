<script setup>
import { ref } from 'vue'

const props = defineProps({
  label: { type: String, default: 'Upload files' },
  accept: { type: String, default: '*' },
  multiple: { type: Boolean, default: false },
  theme: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['files-selected'])

const dragOver = ref(false)
const fileInput = ref(null)

function handleClick() {
  if (props.disabled) return
  fileInput.value?.click()
}

function handleFileChange(e) {
  const files = e.target.files
  if (files) {
    emit('files-selected', { files: Array.from(files) })
  }
}

function handleDragOver(e) {
  if (props.disabled) return
  e.preventDefault()
  dragOver.value = true
}

function handleDragLeave() {
  dragOver.value = false
}

function handleDrop(e) {
  if (props.disabled) return
  e.preventDefault()
  dragOver.value = false
  const files = e.dataTransfer?.files
  if (files) {
    emit('files-selected', { files: Array.from(files) })
  }
}
</script>

<template>
  <div 
    class="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all"
    :class="{
      'border-surface-300 dark:border-surface-600 bg-surface-50 dark:bg-surface-100': !dragOver && !disabled,
      'border-primary bg-primary-50 dark:bg-primary-50': dragOver,
      'opacity-50 cursor-not-allowed': disabled,
      'hover:border-primary hover:bg-primary-50 dark:hover:bg-primary-50': !disabled && !dragOver
    }"
    @click="handleClick"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
  >
    <div class="text-2xl mb-2">📁</div>
    <div class="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">{{ label }}</div>
    <div class="text-xs text-surface-500 dark:text-surface-400">Click or drag files here</div>
    
    <input 
      ref="fileInput"
      type="file" 
      :accept="accept"
      :multiple="multiple"
      @change="handleFileChange"
      class="hidden"
    />
  </div>
</template>