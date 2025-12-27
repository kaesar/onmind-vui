<script setup>
import { ref } from 'vue'
import Checkbox from '@/volt/Checkbox.vue'

const checked = ref(false)
</script>

<template>
  <Checkbox v-model="checked" :binary="true" />
</template>
