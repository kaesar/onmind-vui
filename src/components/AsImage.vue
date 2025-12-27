<script setup>
const props = defineProps({
  url: { type: String, default: '' }
})
</script>

<template>
  <div class="flex justify-center">
    <img :src="url" class="m-2.5" />
  </div>
</template>
