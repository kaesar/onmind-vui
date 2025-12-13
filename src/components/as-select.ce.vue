<script setup>
import { ref, computed } from "vue"
import Select from 'primevue/select'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  options: { type: String, default: 'label=A,value=A;label=B,value=B;label=C,value=C' }
})

const selectedValue = ref(props.value)

const items = computed(() => {
  if (!props.options) return []
  return props.options.split(';').map(entry => {
    const obj = {}
    entry.split(',').forEach(attr => {
      const [key, val] = attr.split('=')
      obj[key] = val
    })
    return obj
  })
})
</script>

<template>
    <Select 
      v-model="selectedValue" 
      :options="items" 
      optionLabel="label" 
      optionValue="value"
      :placeholder="label || 'Select'"
      style="width: 100%; max-width: 15rem;" 
    />
</template>
