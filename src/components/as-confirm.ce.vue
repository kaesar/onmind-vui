<script setup>
import { ref } from 'vue'
import Button from 'primevue/button'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

const props = defineProps({
  label: {
    type: String,
    default: 'Oops!'
  },
  link: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  }
})

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
      console.log('Confirmed!')
      if (props.link) {
        location.assign(props.link)
      }
    }
  })
}
</script>

<template>
  <Button :label="label" @click="handleConfirm" severity="danger" style="cursor: pointer;" />
  <ConfirmDialog />
</template>
