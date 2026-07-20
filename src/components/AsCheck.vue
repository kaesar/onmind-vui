<script setup>
import { ref, watch } from 'vue'
import Checkbox from '@/volt/Checkbox.vue'

const props = defineProps({
  label: { type: String, default: '' },
  checked: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['checked-changed'])

const checkedValue = ref(props.checked)

watch(checkedValue, (val) => {
  emit('checked-changed', { detail: { value: val } })
})
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox v-model="checkedValue" :binary="true" :readonly="readonly" :disabled="disabled" />
    <label v-if="label">{{ label }}</label>
  </div>
</template>
