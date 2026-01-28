<template>
  <button
    class="btn btn-primary"
    @click="emit('click')"
  >
    <slot name="icon" />
    <span>{{ label }}</span>
  </button>
</template>

<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
})

const emit = defineEmits(['click']);
</script>
