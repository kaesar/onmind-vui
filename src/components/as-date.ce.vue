<script setup>
import { ref } from 'vue'
import DatePicker from 'primevue/datepicker'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' }
})

const dateValue = ref(props.value ? new Date(props.value) : null)
</script>

<template>
  <DatePicker 
    v-model="dateValue"
    :placeholder="placeholder || label"
    dateFormat="yy-mm-dd"
  />
</template>
