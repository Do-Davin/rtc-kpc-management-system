<template>
  <Teleport to="body">
    <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-container">
        <div class="modal-header">
          <h2 class="modal-title">{{ isEdit ? 'កែប្រែកាលវិភាគ' : 'បន្ថែមកាលវិភាគថ្មី' }}</h2>
          <button class="close-btn" @click="$emit('close')">
            <svg
              width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <!-- Department & Year (Read-only when creating) -->
          <div class="form-row">
            <div class="form-group">
              <label for="department">ដេប៉ាតឺម៉ង់</label>
              <input
                id="department"
                :value="getDepartmentName(form.department)"
                type="text"
                disabled
                class="disabled-field"
              />
              <p class="field-hint">ដេប៉ាតឺម៉ង់ត្រូវបានកំណត់ដោយការជ្រើសរើស</p>
            </div>

            <div class="form-group">
              <label for="year">ឆ្នាំសិក្សា</label>
              <input
                id="year"
                :value="form.year"
                type="text"
                disabled
                class="disabled-field"
              />
              <p class="field-hint">ឆ្នាំត្រូវបានកំណត់ដោយការជ្រើសរើស</p>
            </div>
          </div>

          <div class="form-group">
            <label for="subjectName">មុខវិជ្ជា <span class="required">*</span></label>
            <input
              id="subjectName"
              v-model="form.subjectName"
              type="text"
              placeholder="បញ្ចូលឈ្មោះមុខវិជ្ជា"
              required
            />
          </div>

          <div class="form-group">
            <label for="teacherName">ឈ្មោះគ្រូ <span class="required">*</span></label>
            <input
              id="teacherName"
              v-model="form.teacherName"
              type="text"
              placeholder="បញ្ចូលឈ្មោះគ្រូ (ឧ. លោក ដូ ដាវីន)"
              required
            />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="group">ក្រុម <span class="required">*</span></label>
              <select id="group" v-model="form.group" required>
                <option value="">ជ្រើសរើសក្រុម</option>
                <option value="A">Group A</option>
                <option value="B">Group B</option>
                <option value="C">Group C</option>
                <option value="D">Group D</option>
              </select>
            </div>

            <div class="form-group">
              <label for="room">បន្ទប់រៀន <span class="required">*</span></label>
              <input
                id="room"
                v-model="form.room"
                type="text"
                placeholder="ឧ. Room 101"
                required
              />
            </div>
          </div>

          <div class="form-group">
            <label for="day">ថ្ងៃ <span class="required">*</span></label>
            <select id="day" v-model="form.day" required>
              <option value="">ជ្រើសរើសថ្ងៃ</option>
              <option value="Monday">ច័ន្ទ (Monday)</option>
              <option value="Tuesday">អង្គារ (Tuesday)</option>
              <option value="Wednesday">ពុធ (Wednesday)</option>
              <option value="Thursday">ព្រហស្បតិ៍ (Thursday)</option>
              <option value="Friday">សុក្រ (Friday)</option>
              <option value="Saturday">សៅរ៍ (Saturday)</option>
            </select>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startTime">ម៉ោងចាប់ផ្តើម <span class="required">*</span></label>
              <select id="startTime" v-model="form.startTime" required>
                <option value="">ជ្រើសរើសម៉ោង</option>
                <option value="07:00">07:00</option>
                <option value="09:00">09:00</option>
                <option value="13:00">13:00</option>
                <option value="15:00">15:00</option>
              </select>
            </div>

            <div class="form-group">
              <label for="endTime">ម៉ោងបញ្ចប់ <span class="required">*</span></label>
              <select id="endTime" v-model="form.endTime" required>
                <option value="">ជ្រើសរើសម៉ោង</option>
                <option value="09:00">09:00</option>
                <option value="11:00">11:00</option>
                <option value="15:00">15:00</option>
                <option value="17:00">17:00</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>ពណ៌មុខវិជ្ជា</label>
            <div class="color-picker">
              <button
                v-for="color in colors"
                :key="color"
                type="button"
                :class="['color-option', { active: form.color === color }]"
                :style="{ backgroundColor: color }"
                @click="form.color = color"
              />
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" @click="$emit('close')">
              បោះបង់
            </button>
            <button type="submit" class="btn-submit">
              {{ isEdit ? 'រក្សាទុក' : 'បន្ថែម' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  schedule: {
    type: Object,
    default: null,
  },
  isEdit: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close', 'submit']);

const departments = [
  { id: 1, name: 'GIC' },
  { id: 2, name: 'IT' },
  { id: 3, name: 'Business' },
  { id: 4, name: 'Engineering' },
];

const colors = [
  '#5B55F3',
  '#10B981',
  '#F59E0B',
  '#EF4444',
  '#8B5CF6',
  '#EC4899',
  '#06B6D4',
  '#84CC16',
];

const defaultForm = {
  subjectName: '',
  teacherName: '',
  group: '',
  room: '',
  day: '',
  startTime: '',
  endTime: '',
  department: null,
  year: '',
  color: '#5B55F3',
};

const form = ref({ ...defaultForm });

const getDepartmentName = (deptId) => {
  const dept = departments.find(d => d.id === deptId);
  return dept ? dept.name : '';
};

watch(
  () => props.isOpen,
  (newVal) => {
    if (newVal && props.schedule) {
      form.value = { ...props.schedule };
    } else if (newVal) {
      form.value = { ...defaultForm };
    }
  }
);

const handleSubmit = () => {
  // Validate that all required fields are filled
  if (!form.value.subjectName || !form.value.teacherName || !form.value.group || !form.value.room || !form.value.day || !form.value.startTime || !form.value.endTime) {
    alert('សូមបំពេញឯកសារទាំងអស់');
    return;
  }

  emit('submit', { ...form.value });
  form.value = { ...defaultForm };
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 550px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  position: sticky;
  top: 0;
  background: white;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: #6b7280;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #111827;
}

.modal-form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.required {
  color: #EF4444;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 0.95rem;
  transition: all 0.2s;
  outline: none;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #5B55F3;
  box-shadow: 0 0 0 3px rgba(91, 85, 243, 0.1);
}

.disabled-field {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.disabled-field:focus {
  border-color: #d1d5db;
  box-shadow: none;
}

.field-hint {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

.required {
  color: #EF4444;
}

.disabled-field {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.disabled-field:focus {
  border-color: #d1d5db;
  box-shadow: none;
}

.field-hint {
  margin: 4px 0 0 0;
  font-size: 0.75rem;
  color: #9ca3af;
  font-style: italic;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.color-picker {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.color-option {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.color-option:hover {
  transform: scale(1.15);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.color-option.active {
  border-color: #111827;
  box-shadow: 0 0 0 2px white, 0 0 0 4px #111827;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn-cancel,
.btn-submit {
  flex: 1;
  padding: 14px 24px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancel {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}

.btn-cancel:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-submit {
  background: #5B55F3;
  color: white;
}

.btn-submit:hover {
  background: #4C46E0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 85, 243, 0.3);
}

@media (max-width: 640px) {
  .modal-container {
    max-width: 95%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
