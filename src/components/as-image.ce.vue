<script setup>
const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})
</script>

<template>
    <div class="image-container">
      <img :src="url" />
    </div>
</template>

<style scoped>
.image-container {
  display: flex;
  justify-content: center;
}

img {
  margin: 10px;
}
</style>
