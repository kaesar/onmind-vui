<script setup>
import { ref } from 'vue'
import InputText from 'primevue/inputtext'
import Password from 'primevue/password'
import InputNumber from 'primevue/inputnumber'

const props = defineProps({
  label: { type: String, default: '' },
  value: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  kind: { type: String, default: 'text' }
})

const inputValue = ref(props.value)
</script>

<template>
  <Password 
    v-if="kind === 'password'"
    v-model="inputValue"
    :placeholder="placeholder || label"
    :feedback="false"
    toggleMask
  />
  <InputNumber
    v-else-if="kind === 'number'"
    v-model="inputValue"
    :placeholder="placeholder || label"
  />
  <InputText 
    v-else
    v-model="inputValue"
    :type="kind === 'email' ? 'email' : 'text'"
    :placeholder="placeholder || label"
  />
</template>
