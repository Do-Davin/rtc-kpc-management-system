<template>
  <div class="auth-header">
    <div class="logo-wrapper">
      <img
        src="/images/logo.png"
        alt="Logo"
        class="logo"
      />
    </div>

    <h1>{{ title }}</h1>
    <p class="subtitle">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  subtitle: {
    type: String,
    required: true,
  },
})
</script>

<style scoped>
.logo-wrapper {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
  scale: 1.25;
}

h1 {
  display: flex;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #5B55F3;
  margin-bottom: 8px;
}

.subtitle {
  display: flex;
  justify-content: center;
  color: #818cf8;
  margin-bottom: 32px;
  font-size: 15px;
}
</style>
