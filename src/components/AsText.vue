<script setup>
import { ref } from 'vue'
import Textarea from '@/volt/Textarea.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  rows: { type: Number, default: 5 },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const textValue = ref(props.value)
</script>

<template>
  <Textarea 
    v-model="textValue" 
    :rows="rows" 
    :placeholder="placeholder || label"
    :readonly="readonly"
    :disabled="disabled"
    class="w-full max-w-60" 
  />
</template>
