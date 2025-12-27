<script setup>
import { ref, computed } from 'vue'
import RadioButton from '@/volt/RadioButton.vue'

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
  <div class="flex flex-wrap gap-4">
    <div v-if="label" class="w-full font-medium">{{ label }}</div>
    <div v-for="(item, index) in items" :key="index" class="flex items-center" @click="selectedValue = item.value" style="cursor: pointer;">
      <RadioButton 
        v-model="selectedValue" 
        :inputId="`radio-${index}`" 
        :value="item.value" 
      />
      <label :for="`radio-${index}`" class="ml-2">{{ item.label }}</label>
    </div>
  </div>
</template>
