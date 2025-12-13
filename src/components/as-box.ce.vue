<script setup>
const props = defineProps({
  dim: {
    type: String,
    default: 'false'
  },
  theme: {
    type: String,
    default: 'light'
  }
})
</script>

<template>
    <div class="as-box" :class="{ dim: dim === 'true', dark: theme === 'dark' }">
      <slot></slot>
    </div>
</template>

<style scoped>
.as-box {
  background-color: whitesmoke;
  box-shadow: 0 3px 10px 0 #aaa;
  border-radius: 5px;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #1f2937;
}

.as-box.dim {
  background-color: silver;
}

.as-box.dark {
  background-color: #374151;
  box-shadow: 0 3px 10px 0 #000;
  color: #f3f4f6;
}

.as-box.dark.dim {
  background-color: #1f2937;
}
</style>
