<template>
  <button
    class="auth-btn"
    type="submit"
    :disabled="loading"
  >
    <slot />
    <AuthSpinner v-if="loading" />
  </button>
</template>

<script setup>
import AuthSpinner from './AuthSpinner.vue';

defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
})
</script>

<style scoped>
.auth-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #5B55F3 100%);
  color: white;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.auth-btn:hover {
  scale: 1.025;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.auth-btn:active {
  scale: 0.98;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}
</style>
