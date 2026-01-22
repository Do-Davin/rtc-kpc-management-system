<template>
  <div class="category-section">
    <button
      v-for="category in categories"
      :key="category"
      @click="$emit('update:modelValue', category)"
      :class="['category-btn', { active: modelValue === category }]"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    required: true,
  },
  categories: {
    type: Array,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.category-section {
  display: flex;
  gap: 10px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.category-btn {
  padding: 10px 20px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.category-btn:hover {
  border-color: #5d5fef;
  color: #5d5fef;
  background: #f8f9ff;
}

.category-btn.active {
  background: #5d5fef;
  color: white;
  border-color: #5d5fef;
}
</style>
