<script setup>
import { ref, watch } from 'vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'

const props = defineProps({
  label: { type: String, default: '' },
  checked: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['checked-changed'])

const value = ref(props.checked)

watch(value, (val) => {
  emit('checked-changed', { detail: { value: val } })
})
</script>

<template>
  <div class="flex items-center gap-2">
    <ToggleSwitch
      v-model="value"
      :readonly="readonly"
      :disabled="disabled"
    />
    <label v-if="label" class="ml-2">{{ label }}</label>
  </div>
</template>
