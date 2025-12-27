<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: { type: String, default: '' }
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
  <div class="grid place-items-center w-full min-w-80">
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
