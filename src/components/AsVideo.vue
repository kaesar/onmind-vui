<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  url: { type: String, default: '' },
  width: { type: [Number, String], default: 560 },
  height: { type: [Number, String], default: 315 }
})

const videoWidth = ref(props.width)
const videoHeight = ref(props.height)

onMounted(() => {
  if (window.innerWidth < 560) {
    if (props.width === 560) videoWidth.value = 310
    if (props.height === 315) videoHeight.value = 175
  }
})
</script>

<template>
  <div class="grid place-items-center w-full min-w-80">
    <iframe
      :width="videoWidth"
      :height="videoHeight"
      frameborder="0"
      :src="url"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>
