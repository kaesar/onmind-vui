<script setup>
import { ref } from 'vue'
import Textarea from 'primevue/textarea'

const value = ref('')
</script>

<template>
    <Textarea v-model="value" rows="5" style="width: 100%; max-width: 15rem;" />
</template>
