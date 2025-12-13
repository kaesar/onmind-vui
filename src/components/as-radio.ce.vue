<script setup>
import { ref, computed } from 'vue'
import RadioButton from 'primevue/radiobutton'

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
    <div style="display: flex; flex-wrap: wrap; gap: 1rem;">
        <div v-if="label" style="width: 100%; font-weight: 500;">{{ label }}</div>
        <div v-for="(item, index) in items" :key="index" style="display: flex; align-items: center;">
            <RadioButton 
              v-model="selectedValue" 
              :inputId="`radio-${index}`" 
              :value="item.value" 
            />
            <label :for="`radio-${index}`" style="margin-left: 0.5rem;">{{ item.label }}</label>
        </div>
    </div>
</template>
