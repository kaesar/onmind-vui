<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  event: { type: String, default: 'event-trigger' },
  theme: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['event-trigger'])

const displayValue = computed(() => props.value || props.placeholder || '')

function handleClick() {
  if (props.disabled || props.readonly) return
  emit(props.event || 'event-trigger', { value: props.value })
}

function handleKeydown(e) {
  if (props.disabled || props.readonly) return
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault()
    handleClick()
  }
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label v-if="label" class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ label }}</label>
    <div
      class="flex justify-between items-center px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded cursor-pointer select-none transition-colors"
      :class="{
        'opacity-50 cursor-not-allowed': disabled,
        'cursor-default bg-gray-50 dark:bg-gray-800': readonly,
        'hover:bg-gray-200 dark:hover:bg-gray-600': !disabled && !readonly
      }"
      :tabindex="disabled ? '-1' : '0'"
      @click="handleClick"
      @keydown="handleKeydown"
    >
      <span class="text-gray-800 dark:text-gray-200">{{ displayValue }}</span>
      <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 10l5 5 5-5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>
</template>