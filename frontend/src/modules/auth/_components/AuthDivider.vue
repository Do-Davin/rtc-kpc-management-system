<template>
  <div class="divider">
    <span>{{ text }}</span>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
  color: #9ca3af;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  padding: 0 4px;
  white-space: nowrap;
}
</style>
