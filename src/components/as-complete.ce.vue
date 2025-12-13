<script setup>
import { ref, computed } from 'vue'
import AutoComplete from 'primevue/autocomplete'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  options: { type: String, default: 'label=A,value=A;label=B,value=B;label=C,value=C' }
})

const selectedValue = ref(props.value)
const filteredItems = ref([])

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

const search = (event) => {
  if (!event.query.trim().length) {
    filteredItems.value = [...items.value]
  } else {
    filteredItems.value = items.value.filter((item) => {
      return item.label.toLowerCase().includes(event.query.toLowerCase())
    })
  }
}
</script>

<template>
    <AutoComplete 
      v-model="selectedValue" 
      :suggestions="filteredItems" 
      @complete="search"
      optionLabel="label"
      :placeholder="label || 'Buscar...'"
    />
</template>
