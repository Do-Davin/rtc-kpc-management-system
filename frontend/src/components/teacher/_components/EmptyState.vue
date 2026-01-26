<template>
  <div class="empty-state">
    <svg
      width="80"
      height="80"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="1.5"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path
        d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
      />
    </svg>

    <p class="empty-text">
      {{ message }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'No data found',
  },
});
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #999;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}
</style>
