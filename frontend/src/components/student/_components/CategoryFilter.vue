<template>
  <div class="category-filter">
    <button
      v-for="category in categories"
      :key="category"
      :class="['filter-btn', { active: modelValue === category }]"
      @click="$emit('update:modelValue', category)"
    >
      {{ category }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: 'All'
  },
  categories: {
    type: Array,
    default: () => ['All']
  }
});

defineEmits(['update:modelValue']);
</script>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 25px;
}

.filter-btn {
  padding: 8px 18px;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  background: white;
  color: #6b7280;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: var(--purple-500, #8b5cf6);
  color: var(--purple-500, #8b5cf6);
}

.filter-btn.active {
  background: var(--purple-500, #8b5cf6);
  border-color: var(--purple-500, #8b5cf6);
  color: white;
}
</style>
