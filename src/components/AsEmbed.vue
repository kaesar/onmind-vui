<script setup>
const props = defineProps({
  url: { type: String, default: '' },
  width: { type: Number, default: 1200 },
  height: { type: Number, default: 675 }
})
</script>

<template>
  <div class="relative pb-[56.25%] pt-0 h-0 w-full">
    <iframe
      :width="width"
      :height="height"
      frameborder="0"
      :src="url"
      type="text/html"
      allowScriptAccess="always"
      allowFullScreen
      scrolling="yes"
      allowNetworking="all"
      class="absolute top-0 left-0 w-full h-full"
    ></iframe>
  </div>
</template>
