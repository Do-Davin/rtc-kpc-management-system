<template>
  <div class="image-section">
    <img
      :src="src"
      :alt="alt"
    />
  </div>
</template>

<script setup>
defineProps({
  src: {
    type: String,
    default: '/images/library.avif',
  },
  alt: {
    type: String,
    default: 'Auth image',
  },
})
</script>

<style scoped>
.image-section {
  flex: 1;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}

@media (max-width: 1024px) {
  .image-section {
    display: none;
  }
}
</style>
