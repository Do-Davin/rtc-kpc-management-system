<template>
  <div class="schedule-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">កាលវិភាគបង្រៀន</h1>
        <p class="page-subtitle">គ្រប់គ្រងកាលវិភាគបង្រៀនរបស់អ្នក</p>
      </div>
    </div>

    <!-- Department Selection Layer -->
    <div class="selection-layer">
      <!-- Department Selection -->
      <div class="selection-group">
        <h3 class="selection-label">ជ្រើសរើសដេប៉ាតឺម៉ង់</h3>
        <div class="department-cards">
          <button
            v-for="dept in departments"
            :key="dept.id"
            :class="['dept-card', { active: selectedDepartment === dept.id }]"
            @click="selectDepartment(dept.id)"
            :style="selectedDepartment === dept.id ? { borderColor: dept.color, backgroundColor: dept.color + '10' } : {}"
          >
            <span class="dept-name">{{ dept.name }}</span>
            <span class="dept-color" :style="{ backgroundColor: dept.color }"></span>
          </button>
        </div>
      </div>

      <!-- Year Selection Disabled until department selected -->
      <div class="selection-group" :class="{ disabled: !selectedDepartment }">
        <h3 class="selection-label">ជ្រើសរើសឆ្នាំសិក្សា</h3>
        <div v-if="!selectedDepartment" class="year-placeholder">
          <p class="placeholder-text">សូមជ្រើសរើសដេប៉ាតឺម៉ង់ដំបូង</p>
        </div>
        <div v-else class="year-cards">
          <button
            v-for="year in availableYears"
            :key="year"
            :class="['year-card', { active: selectedYear === year }]"
            @click="selectedYear = year"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>

    <!-- Timetable Section -->
    <div v-if="selectedDepartment && selectedYear" class="timetable-section">
      <!-- Legend Section -->
      <div class="legend-section">
        <span class="legend-label">មុខវិជ្ជា:</span>
        <div class="legend-items">
          <div
            v-for="subject in uniqueSubjects"
            :key="subject.name"
            class="legend-item"
          >
            <span class="legend-color" :style="{ backgroundColor: subject.color }"></span>
            <span class="legend-text">{{ subject.name }}</span>
          </div>
        </div>
      </div>

      <!-- Add Button -->
      <div class="add-button-container">
        <button class="add-btn" @click="openAddModal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          បន្ថែមកាលវិភាគ
        </button>
      </div>

      <!-- Timetable Grid -->
      <div class="timetable-container">
        <div class="timetable">
          <!-- Header Row (Days) -->
          <div class="timetable-header">
            <div class="time-header">ម៉ោង / ថ្ងៃ</div>
            <div v-for="day in days" :key="day" class="day-header">
              {{ dayLabels[day] }}
            </div>
          </div>

          <!-- Time Rows -->
          <div v-for="slot in timeSlots" :key="slot.start" class="timetable-row">
            <div class="time-cell">
              <span class="time-range">{{ slot.start }} - {{ slot.end }}</span>
            </div>
            <div
              v-for="day in days"
              :key="day"
              class="schedule-cell"
              @click="handleCellClick(day, slot)"
            >
              <ScheduleCard
                v-for="schedule in getScheduleForCell(day, slot)"
                :key="schedule.id"
                :schedule="schedule"
                @edit="openEditModal"
                @delete="openDeleteConfirm"
              />
              <div v-if="!getScheduleForCell(day, slot).length" class="empty-cell">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State (When no selection) -->
    <div v-else class="empty-state">
      <div class="empty-state-content">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <h3 class="empty-title">សូមជ្រើសរើសដេប៉ាតឺម៉ង់ និង ឆ្នាំសិក្សា</h3>
        <p class="empty-text">ការជ្រើសរើសដេប៉ាតឺម៉ង់ និងឆ្នាំសិក្សាដើម្បីមើលលម្អិតពេលលេង</p>
      </div>
    </div>

    <!-- Schedule Modal -->
    <ScheduleModal
      :is-open="isModalOpen"
      :is-edit="isEditing"
      :schedule="selectedSchedule"
      :selected-year="selectedYear"
      @close="closeModal"
      @submit="handleSubmit"
    />

    <!-- Delete Confirm Modal -->
    <DeleteConfirmModal
      :is-open="isDeleteConfirmOpen"
      @close="closeDeleteConfirm"
      @confirm="handleDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import ScheduleCard from '../_components/ScheduleCard.vue';
import ScheduleModal from '../_components/ScheduleModal.vue';
import DeleteConfirmModal from '../_components/DeleteConfirmModal.vue';

const departments = [
  { id: 1, name: 'GIC', color: '#5B55F3' },
  { id: 2, name: 'IT', color: '#10B981' },
  { id: 3, name: 'Business', color: '#F59E0B' },
  { id: 4, name: 'Engineering', color: '#EF4444' },
];

const departmentYears = {
  1: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
  2: ['Year 1', 'Year 2', 'Year 3', 'Year 4'],
  3: ['Year 1', 'Year 2', 'Year 3'],
  4: ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'],
};

// Schedule Data
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayLabels = {
  Monday: 'ច័ន្ទ',
  Tuesday: 'អង្គារ',
  Wednesday: 'ពុធ',
  Thursday: 'ព្រហស្បតិ៍',
  Friday: 'សុក្រ',
  Saturday: 'សៅរ៍',
};

const timeSlots = [
  { start: '07:00', end: '09:00' },
  { start: '09:00', end: '11:00' },
  { start: '13:00', end: '15:00' },
  { start: '15:00', end: '17:00' },
];

const schedules = ref([
  {
    id: 1,
    subjectName: 'គណិតវិទ្យា',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 101',
    day: 'Monday',
    startTime: '07:00',
    endTime: '09:00',
    color: '#5B55F3',
  },
  {
    id: 2,
    subjectName: 'រូបវិទ្យា',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'B',
    year: 'Year 2',
    department: 1,
    room: 'Room 102',
    day: 'Monday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#10B981',
  },
  {
    id: 3,
    subjectName: 'គីមីវិទ្យា',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 103',
    day: 'Tuesday',
    startTime: '07:00',
    endTime: '09:00',
    color: '#F59E0B',
  },
  {
    id: 4,
    subjectName: 'ជីវវិទ្យា',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'C',
    year: 'Year 3',
    department: 1,
    room: 'Room 104',
    day: 'Wednesday',
    startTime: '13:00',
    endTime: '15:00',
    color: '#EF4444',
  },
  {
    id: 5,
    subjectName: 'ភាសាអង់គ្លេស',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'B',
    year: 'Year 2',
    department: 1,
    room: 'Room 105',
    day: 'Thursday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#8B5CF6',
  },
  {
    id: 6,
    subjectName: 'Python Programming',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'A',
    year: 'Year 1',
    department: 2,
    room: 'Lab 01',
    day: 'Monday',
    startTime: '07:00',
    endTime: '09:00',
    color: '#06B6D4',
  },
  {
    id: 7,
    subjectName: 'Web Development',
    teacherName: 'លោក​​​ ដូ​ ដាវីន',
    group: 'B',
    year: 'Year 2',
    department: 2,
    room: 'Lab 02',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#EC4899',
  },
  {
    id: 8,
    subjectName: 'Accounting',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'A',
    year: 'Year 1',
    department: 3,
    room: 'Room 201',
    day: 'Monday',
    startTime: '13:00',
    endTime: '15:00',
    color: '#84CC16',
  },
  {
    id: 9,
    subjectName: 'Civil Engineering',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'A',
    year: 'Year 1',
    department: 4,
    room: 'Room 301',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#14B8A6',
  },
  {
    id: 10,
    subjectName: 'Mechanics',
    teacherName: 'លោក ដូ​ ដាវីន',
    group: 'B',
    year: 'Year 2',
    department: 4,
    room: 'Room 302',
    day: 'Friday',
    startTime: '15:00',
    endTime: '17:00',
    color: '#F97316',
  },
]);

const selectedDepartment = ref(null);
const selectedYear = ref(null);

const availableYears = computed(() => {
  if (!selectedDepartment.value) return [];
  return departmentYears[selectedDepartment.value] || [];
});

const filteredSchedules = computed(() => {
  return schedules.value.filter(
    (s) => s.department === selectedDepartment.value && s.year === selectedYear.value
  );
});

const uniqueSubjects = computed(() => {
  const seen = new Map();
  filteredSchedules.value.forEach((s) => {
    if (!seen.has(s.subjectName)) {
      seen.set(s.subjectName, { name: s.subjectName, color: s.color });
    }
  });
  return Array.from(seen.values());
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const selectedSchedule = ref(null);

const isDeleteConfirmOpen = ref(false);
const scheduleToDelete = ref(null);

const selectDepartment = (deptId) => {
  selectedDepartment.value = deptId;
  selectedYear.value = null; // Reset year when department changes
};

const getScheduleForCell = (day, slot) => {
  return filteredSchedules.value.filter(
    (s) => s.day === day && s.startTime === slot.start && s.endTime === slot.end
  );
};

const handleCellClick = (day, slot) => {
  if (getScheduleForCell(day, slot).length === 0) {
    openAddModal(day, slot);
  }
};

const openAddModal = (day = null, slot = null) => {
  isEditing.value = false;
  selectedSchedule.value = {
    subjectName: '',
    teacherName: '',
    group: '',
    room: '',
    day: day || '',
    startTime: slot ? slot.start : '',
    endTime: slot ? slot.end : '',
    department: selectedDepartment.value,
    year: selectedYear.value,
    color: '#5B55F3',
  };
  isModalOpen.value = true;
};

const openEditModal = (schedule) => {
  isEditing.value = true;
  selectedSchedule.value = { ...schedule };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedSchedule.value = null;
  isEditing.value = false;
};

const handleSubmit = (formData) => {
  if (isEditing.value && selectedSchedule.value?.id) {
    const index = schedules.value.findIndex((s) => s.id === selectedSchedule.value.id);
    if (index !== -1) {
      schedules.value[index] = { ...formData, id: selectedSchedule.value.id };
    }
  } else {
    const newId = Math.max(...schedules.value.map((s) => s.id), 0) + 1;
    schedules.value.push({ ...formData, id: newId });
  }
  closeModal();
};

const openDeleteConfirm = (id) => {
  scheduleToDelete.value = id;
  isDeleteConfirmOpen.value = true;
};

const closeDeleteConfirm = () => {
  isDeleteConfirmOpen.value = false;
  scheduleToDelete.value = null;
};

const handleDelete = () => {
  if (scheduleToDelete.value) {
    schedules.value = schedules.value.filter((s) => s.id !== scheduleToDelete.value);
  }
  closeDeleteConfirm();
};
</script>

<style scoped>
.schedule-page {
  width: 100%;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

.selection-layer {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin-bottom: 32px;
  transition: all 0.3s ease;
}

.selection-group {
  margin-bottom: 28px;
  opacity: 1;
  transition: opacity 0.3s ease;
}

.selection-group:last-child {
  margin-bottom: 0;
}

.selection-group.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.selection-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.department-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.dept-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 20px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #374151;
  min-width: 140px;
}

.dept-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dept-card.active {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dept-name {
  font-size: 0.95rem;
  font-weight: 600;
}

.dept-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.year-cards {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.year-card {
  padding: 12px 18px;
  background: #f3f4f6;
  border: 2px solid #e5e7eb;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.year-card:hover {
  background: #e5e7eb;
  border-color: #d1d5db;
  transform: translateY(-1px);
}

.year-card.active {
  background: #5B55F3;
  border-color: #5B55F3;
  color: white;
  box-shadow: 0 4px 12px rgba(91, 85, 243, 0.3);
}

.year-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: #f9fafb;
  border-radius: 10px;
  border: 1px dashed #d1d5db;
}

.placeholder-text {
  color: #9ca3af;
  font-size: 0.9rem;
  margin: 0;
}

.timetable-section {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.add-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: #5B55F3;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-btn:hover {
  background: #4C46E0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(91, 85, 243, 0.3);
}

.legend-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background: white;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  flex-wrap: wrap;
}

.legend-label {
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
}

.legend-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 14px;
  height: 14px;
  border-radius: 4px;
}

.legend-text {
  font-size: 0.85rem;
  color: #6b7280;
}

.timetable-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
}

.timetable {
  min-width: 900px;
}

.timetable-header {
  display: grid;
  grid-template-columns: 120px repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.time-header,
.day-header {
  padding: 14px 12px;
  background: #5B55F3;
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
  border-radius: 8px;
}

.time-header {
  background: #4C46E0;
}

.timetable-row {
  display: grid;
  grid-template-columns: 120px repeat(6, 1fr);
  gap: 8px;
  margin-bottom: 8px;
}

.time-cell {
  padding: 16px 12px;
  background: #f8f9ff;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.time-range {
  font-size: 0.85rem;
  font-weight: 600;
  color: #5B55F3;
  text-align: center;
}

.schedule-cell {
  min-height: 130px;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  border: 2px dashed transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.schedule-cell:hover {
  background: #f3f4ff;
  border-color: #d1d5ff;
}

.empty-cell {
  width: 100%;
  height: 100%;
  min-height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d1d5db;
  transition: color 0.2s;
}

.schedule-cell:hover .empty-cell {
  color: #5B55F3;
}

/* Empty State */
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 16px;
  margin-top: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.empty-icon {
  color: #d1d5db;
  margin-bottom: 16px;
  display: block;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-text {
  color: #9ca3af;
  font-size: 0.95rem;
  margin: 0;
}

@media (max-width: 768px) {
  .schedule-page {
    padding: 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .selection-layer {
    padding: 20px;
  }

  .department-cards {
    gap: 8px;
  }

  .dept-card {
    min-width: auto;
    flex: 1;
    min-width: calc(50% - 6px);
  }

  .timetable-container {
    padding: 12px;
    overflow-x: auto;
  }
}
</style>
