<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
})

const width = ref(560)
const height = ref(315)

onMounted(() => {
  if (window.innerWidth < 560) {
    width.value = 310
    height.value = 175
  }
})
</script>

<template>
    <div class="video">
      <iframe
        :width="width"
        :height="height"
        frameborder="0"
        :src="url"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
</template>

<style scoped>
.video {
  display: grid;
  grid-template-areas: stack;
  place-items: center;
  width: max(320px, 100%);
}
</style>
