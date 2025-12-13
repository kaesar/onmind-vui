<script setup>
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' }
})

const timeValue = ref(props.value ? new Date(`1970-01-01T${props.value}`) : null)
</script>

<template>
  <DatePicker 
    v-model="timeValue"
    :placeholder="placeholder || label"
    timeOnly
  />
</template>
