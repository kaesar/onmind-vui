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

const dateValue = ref(props.value ? new Date(props.value) : null)
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
