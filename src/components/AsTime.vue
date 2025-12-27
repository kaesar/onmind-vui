<script setup>
import { ref } from 'vue'
import DatePicker from '@/volt/DatePicker.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const timeValue = ref(props.value ? new Date(`1970-01-01T${props.value}`) : null)
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
