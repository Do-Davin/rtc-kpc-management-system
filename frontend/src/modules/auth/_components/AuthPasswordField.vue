<template>
  <div class="field">
    <label>{{ label }}</label>

    <div class="input-wrapper">
      <span class="icon">
        <Lock />
      </span>

      <input
        :type="visible ? 'text' : 'password'"
        :placeholder="label"
        :value="modelValue"
        :class="{ error: error }"
        @input="onInput"
      />

      <span class="toggle" @click="visible = !visible">
        <EyeOff v-if="visible" class="toggle-icon" />
        <Eye v-else class="toggle-icon" />
      </span>
    </div>

    <p v-if="error" class="error-text">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock, Eye, EyeOff } from 'lucide-vue-next'

defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  error: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue'])

const visible = ref(false)

const onInput = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<style scoped>
.field {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #6366f1;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 16px;
  top: 9.5px;
  font-size: 18px;
  opacity: 0.2;
}

input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border-radius: 12px;
  border: none;
  background: #f3f4f6;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s ease;
}

input::placeholder {
  color: #d1d5db;
}

input:focus {
  outline: none;
  background: #ede9fe;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

input.error {
  background: #fff5f5;
  box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.25);
}

.error-text {
  color: #ef4444;
  font-size: 12px;
  margin-top: 6px;
}

.toggle {
  position: absolute;
  right: 16px;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.toggle:hover {
  opacity: 0.8;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s ease, transform 0.15s ease;
}

.toggle:hover .toggle-icon {
  color: #6366f1;
  transform: scale(1.05);
}
</style>
