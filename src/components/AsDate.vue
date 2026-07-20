<script setup>
import { ref, watch } from 'vue'
import DatePicker from '@/volt/DatePicker.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const emit = defineEmits(['value-changed'])

const dateValue = ref(props.value ? new Date(props.value) : null)

const formatDate = (d) => {
  if (!d) return ''
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

watch(dateValue, (val) => {
  emit('value-changed', { detail: { value: formatDate(val) } })
})
</script>

<template>
  <DatePicker 
    v-model="dateValue"
    :placeholder="placeholder || label"
    :readonly="readonly"
    :disabled="disabled"
    dateFormat="yy-mm-dd"
  />
</template>
