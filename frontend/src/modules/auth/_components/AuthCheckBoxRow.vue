<template>
  <div class="checkbox-row">
    <label class="checkbox">
      <input type="checkbox" />
      <span>
        <slot />
      </span>
    </label>

    <!-- Optional right-side action -->
    <slot name="action" />
  </div>
</template>

<script setup>
</script>

<style scoped>
.checkbox-row {
  display: flex;
  align-items: center;
  margin: 20px 0;
  font-size: 13px;
  color: #6366f1;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
}

.checkbox input[type="checkbox"] {
  width: auto;
  cursor: pointer;
  margin: 0;
}

.checkbox a {
  color: #6366f1;
  text-decoration: underline;
}

:slotted(.forgot-password) {
  margin-left: auto;
  color: #6366f1;
  cursor: pointer;
}

:slotted(.forgot-password:hover) {
  color: #4f46e5;
  text-decoration: underline;
}

:slotted(.forgot-password:active) {
  color: #4338ca;
}
</style>
