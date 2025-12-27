<script setup>
import Button from '@/volt/Button.vue'
import ConfirmDialog from '@/volt/ConfirmDialog.vue'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  label: { type: String, default: 'Oops!' },
  link: { type: String, default: '' },
  message: { type: String, default: '' }
})

const emit = defineEmits(['confirm-tap'])
const confirm = useConfirm()

function handleConfirm() {
  confirm.require({
    message: props.message || 'Are you sure?',
    header: 'Confirm',
    icon: 'pi pi-exclamation-triangle',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: props.label,
      severity: 'danger'
    },
    accept: () => {
      if (props.link) {
        location.assign(props.link)
      }
      emit('confirm-tap')
    }
  })
}
</script>

<template>
  <Button :label="label" @click="handleConfirm" severity="danger" class="cursor-pointer" />
  <ConfirmDialog />
</template>
