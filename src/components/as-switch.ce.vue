<script setup>
import { ref } from 'vue'
import ToggleSwitch from 'primevue/toggleswitch'

const props = defineProps({
  label: { type: String, default: '' },
  checked: { type: Boolean, default: false }
})

const value = ref(props.checked)
</script>

<template>
  <ToggleSwitch v-model="value" />
  <label v-if="label" style="margin-left: 0.5rem;">{{ label }}</label>
</template>
