<template>
  <p class="login-link">
    {{ text }}
    <router-link :to="to">{{ linkText }}</router-link>
  </p>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    required: true,
  },
  to: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.login-link {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #6b7280;
}

.login-link a {
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover a {
  text-decoration: underline;
}
</style>
