<script setup>
import { ref } from 'vue'
import Checkbox from 'primevue/checkbox'

const checked = ref(false)
</script>

<template>
    <Checkbox v-model="checked" :binary="true" />
</template>
