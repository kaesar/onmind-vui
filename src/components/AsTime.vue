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

const timeValue = ref(props.value ? new Date(`1970-01-01T${props.value}`) : null)

const formatTime = (d) => {
  if (!d) return ''
  const h = String(d.getHours()).padStart(2, '0')
  const m = String(d.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

watch(timeValue, (val) => {
  emit('value-changed', { detail: { value: formatTime(val) } })
})
</script>

<template>
  <DatePicker 
    v-model="timeValue"
    :placeholder="placeholder || label"
    :readonly="readonly"
    :disabled="disabled"
    timeOnly
  />
</template>
