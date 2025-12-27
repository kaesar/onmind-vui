<script setup>
import { useToast } from 'primevue/usetoast'
import Button from '@/volt/Button.vue'
import SecondaryButton from '@/volt/SecondaryButton.vue'
import Toast from '@/volt/Toast.vue'

const props = defineProps({
  label: String,
  link: String,
  message: String,
  variant: { type: String, default: 'primary' }
})
const emit = defineEmits(['button-tap'])
const toast = useToast()

function handleButton() {
  if (props.link)
    location.assign(props.link)
  else if (props.message)
    toast.add({ severity: 'info', summary: props.message, life: 3500 })
  else {
    emit('button-tap')
  }
}
</script>

<template>
  <SecondaryButton v-if="variant === 'secondary'" :label="label" @click="handleButton" />
  <Button v-else :label="label" @click="handleButton" />
  <Toast position="bottom-center" />
</template>
