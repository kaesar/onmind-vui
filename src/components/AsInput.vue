<script setup>
import { ref } from 'vue'
import InputText from '@/volt/InputText.vue'
import Password from '@/volt/Password.vue'
import InputNumber from '@/volt/InputNumber.vue'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  kind: { type: String, default: 'text' },
  readonly: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})

const inputValue = ref(props.value)
</script>

<template>
  <Password 
    v-if="kind === 'password'"
    v-model="inputValue"
    :placeholder="placeholder || label"
    :feedback="false"
    :readonly="readonly"
    :disabled="disabled"
    toggleMask
  />
  <InputNumber
    v-else-if="kind === 'number'"
    v-model="inputValue"
    :placeholder="placeholder || label"
    :readonly="readonly"
    :disabled="disabled"
  />
  <InputText 
    v-else
    v-model="inputValue"
    :type="kind === 'email' ? 'email' : 'text'"
    :placeholder="placeholder || label"
    :readonly="readonly"
    :disabled="disabled"
  />
</template>
