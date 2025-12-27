<script setup>
const props = defineProps({
  dim: { type: String, default: 'false' },
  theme: { type: String, default: 'light' }
})
</script>

<template>
  <div 
    class="rounded-lg p-2 flex flex-col gap-2"
    :class="[
      theme === 'dark' 
        ? dim === 'true' ? 'bg-gray-800 text-gray-100' : 'bg-gray-700 text-gray-100 shadow-lg shadow-black/50'
        : dim === 'true' ? 'bg-gray-300 text-gray-800' : 'bg-gray-100 text-gray-800 shadow-lg shadow-gray-400/50'
    ]"
  >
    <slot></slot>
  </div>
</template>
