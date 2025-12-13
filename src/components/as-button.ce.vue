<script setup>
import { useToast } from 'primevue/usetoast'
import Button from 'primevue/button'
import Toast from 'primevue/toast'

const props = defineProps(['label', 'link', 'message'])
const emit = defineEmits(['button-tap'])
const toast = useToast()

function handleButton () {
    if (!!props.link)
        location.assign(props.link)
    else if (!!props.message)
        toast.add({ severity: 'info', summary: props.message, life: 3500 })
    else {
        emit('button-tap')
    }
}
</script>

<template>
    <Button :label="label" @click="handleButton" />
    <Toast position="bottom-center" />
</template>
