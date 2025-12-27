<script setup>
import { ref } from 'vue'
import ToggleSwitch from '@/volt/ToggleSwitch.vue'

const props = defineProps({
  label: { type: String, default: '' },
  checked: { type: Boolean, default: false }
})

const value = ref(props.checked)

const toggle = () => {
  value.value = !value.value
}
</script>

<template>
  <div @click.stop="toggle" style="display: inline-block; cursor: pointer;">
    <ToggleSwitch :key="value" :modelValue="value" @update:modelValue="value = $event" />
  </div>
  <label v-if="label" class="ml-2">{{ label }}</label>
</template>
