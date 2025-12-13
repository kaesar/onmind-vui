<script setup>
const props = defineProps({
  url: {
    type: String,
    default: ''
  },
  width: {
    type: Number,
    default: 1200
  },
  height: {
    type: Number,
    default: 675
  }
})
</script>

<template>
    <div class="embed-container">
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
      ></iframe>
    </div>
</template>

<style scoped>
.embed-container {
  position: relative;
  padding-bottom: 56.25%;
  padding-top: 0;
  height: 0;
  width: 100%;
}

iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
