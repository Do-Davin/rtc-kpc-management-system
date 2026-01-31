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
        <h3 class="selection-label">ជ្រើសរើសឆ្នាំសិក្សា (អាចជ្រើសបានច្រើន)</h3>
        <div v-if="!selectedDepartment" class="year-placeholder">
          <p class="placeholder-text">សូមជ្រើសរើសដេប៉ាតឺម៉ង់ដំបូង</p>
        </div>
        <div v-else class="year-cards">
          <button
            v-for="year in availableYears"
            :key="year"
            :class="['year-card', { active: selectedYears.includes(year) }]"
            @click="toggleYear(year)"
          >
            {{ year }}
          </button>
        </div>
      </div>
    </div>

    <!-- Timetable Section -->
    <div v-if="selectedDepartment && selectedYears.length > 0" class="timetable-section">
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

      <!-- Loading Overlay -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <span>Loading...</span>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="error-toast">
        {{ error }}
        <button @click="error = null">✕</button>
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
                :is-other-teacher="!isOwnSchedule(schedule)"
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
        <p class="empty-text">ជ្រើសរើសដេប៉ាតឺម៉ង់ និងឆ្នាំសិក្សា (អាចជ្រើសច្រើន) ដើម្បីមើលកាលវិភាគ</p>
      </div>
    </div>

    <!-- Schedule Modal -->
    <ScheduleModal
      :is-open="isModalOpen"
      :is-edit="isEditing"
      :schedule="selectedSchedule"
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
import { ref, computed, onMounted } from 'vue';
import ScheduleCard from '../_components/ScheduleCard.vue';
import ScheduleModal from '../_components/ScheduleModal.vue';
import DeleteConfirmModal from '../_components/DeleteConfirmModal.vue';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '@/services/schedules.api';
import { getTeacherProfile } from '@/services/teacher-dashboard.api';
import adminService from '@/services/admin.service';

// Loading and error states
const isLoading = ref(false);
const error = ref(null);

// Current teacher info
const currentTeacherId = ref(null);
const currentTeacherDepartmentId = ref(null);

// Departments from API
const departments = ref([]);
const departmentColors = {
  'GIC': '#5B55F3',
  'IT': '#10B981',
  'Business': '#F59E0B',
  'Engineering': '#EF4444',
};

// Years available per department (will be populated based on schedules)
const departmentYears = ref({});

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

// 1-hour time slots from 7:00 to 5:00 PM
const timeSlots = [
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '11:00', end: '12:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
];

const schedules = ref([]);

const selectedDepartment = ref(null);
const selectedYears = ref([]); // Changed to array for multiple selection

const availableYears = computed(() => {
  if (!selectedDepartment.value) return [];
  const years = departmentYears.value[selectedDepartment.value] || [];
  // If no years from data, provide default years
  return years.length > 0 ? years : ['Year 1', 'Year 2', 'Year 3', 'Year 4', 'Year 5'];
});

const filteredSchedules = computed(() => {
  // Filter by department id and selected years
  const deptId = selectedDepartment.value;
  const years = selectedYears.value;

  if (years.length === 0) {
    return [];
  }

  return schedules.value.filter((s) => {
    const scheduleDeptId = s.department?.id || s.departmentId;
    return scheduleDeptId === deptId && years.includes(s.year);
  });
});

// Check if a schedule belongs to current teacher
const isOwnSchedule = (schedule) => {
  const teacherId = schedule.teacher?.id || schedule.teacherId;
  return teacherId === currentTeacherId.value;
};

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

// Load teacher profile to get current teacher ID
const loadTeacherProfile = async () => {
  try {
    const profile = await getTeacherProfile();
    currentTeacherId.value = profile.id;
    currentTeacherDepartmentId.value = profile.departmentId;
  } catch (err) {
    console.error('Failed to load teacher profile:', err);
  }
};

// Load departments from API
const loadDepartments = async () => {
  try {
    const response = await adminService.getDepartments();
    const depts = response.data || [];
    departments.value = depts.map(dept => ({
      id: dept.id,
      name: dept.name || dept.code,
      color: departmentColors[dept.code] || departmentColors[dept.name] || '#5B55F3'
    }));
  } catch (err) {
    console.error('Failed to load departments:', err);
    error.value = 'Failed to load departments';
  }
};

// Load schedules from API
const loadSchedules = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    // Load all schedules for the department (without year filter)
    // We'll filter by selected years on the frontend
    const schedulesData = await getSchedules(
      selectedDepartment.value || '',
      '' // Don't filter by year in API call
    );

    // Map schedules to expected format
    schedules.value = (schedulesData || []).map(schedule => ({
      id: schedule.id,
      subjectName: schedule.subjectName,
      teacherName: schedule.teacher?.fullName || schedule.teacherName,
      teacherId: schedule.teacher?.id,
      group: schedule.group,
      year: schedule.year,
      department: schedule.department,
      departmentId: schedule.department?.id,
      room: schedule.room,
      day: schedule.day,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      color: schedule.color || '#5B55F3',
      type: schedule.type || 'Lecture'
    }));

    // Build available years from schedules data
    buildDepartmentYears();
  } catch (err) {
    console.error('Failed to load schedules:', err);
    error.value = 'Failed to load schedules';
  } finally {
    isLoading.value = false;
  }
};

// Build department years from schedule data
const buildDepartmentYears = () => {
  const yearsMap = {};
  schedules.value.forEach(s => {
    const deptId = s.department?.id || s.departmentId;
    if (!yearsMap[deptId]) {
      yearsMap[deptId] = new Set();
    }
    yearsMap[deptId].add(s.year);
  });

  // Convert sets to sorted arrays
  Object.keys(yearsMap).forEach(deptId => {
    yearsMap[deptId] = Array.from(yearsMap[deptId]).sort();
  });

  departmentYears.value = yearsMap;
};

const selectDepartment = async (deptId) => {
  selectedDepartment.value = deptId;
  selectedYears.value = []; // Reset years when department changes
  await loadSchedules();
};

// Toggle year selection (allow multiple)
const toggleYear = (year) => {
  const index = selectedYears.value.indexOf(year);
  if (index > -1) {
    // Remove year if already selected
    selectedYears.value.splice(index, 1);
  } else {
    // Add year if not selected
    selectedYears.value.push(year);
  }
  // filteredSchedules will automatically update due to reactivity
};

const getScheduleForCell = (day, slot) => {
  return filteredSchedules.value.filter((s) => {
    // Check if schedule overlaps with this time slot
    const scheduleStart = s.startTime;
    const scheduleEnd = s.endTime;
    const slotStart = slot.start;
    const slotEnd = slot.end;

    // Check if the schedule starts at this slot's start time
    return s.day === day && scheduleStart === slotStart && scheduleEnd === slotEnd;
  });
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
    year: selectedYears.value[0] || 'Year 1', // Use first selected year or default
    color: '#5B55F3',
    type: 'Lecture'
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

const handleSubmit = async (formData) => {
  isLoading.value = true;
  try {
    if (isEditing.value && selectedSchedule.value?.id) {
      // Update existing schedule
      await updateSchedule(selectedSchedule.value.id, {
        subjectName: formData.subjectName,
        group: formData.group,
        year: formData.year,
        room: formData.room,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        color: formData.color,
        type: formData.type,
        teacherId: currentTeacherId.value,
        departmentId: selectedDepartment.value
      });
    } else {
      // Create new schedule
      await createSchedule({
        subjectName: formData.subjectName,
        group: formData.group,
        year: formData.year || selectedYears.value[0] || 'Year 1',
        room: formData.room,
        day: formData.day,
        startTime: formData.startTime,
        endTime: formData.endTime,
        color: formData.color,
        type: formData.type || 'Lecture',
        teacherId: currentTeacherId.value,
        departmentId: selectedDepartment.value
      });
    }

    // Reload schedules after change
    await loadSchedules();
    closeModal();
  } catch (err) {
    console.error('Failed to save schedule:', err);
    error.value = err.response?.data?.message || 'Failed to save schedule';
  } finally {
    isLoading.value = false;
  }
};

const openDeleteConfirm = (id) => {
  scheduleToDelete.value = id;
  isDeleteConfirmOpen.value = true;
};

const closeDeleteConfirm = () => {
  isDeleteConfirmOpen.value = false;
  scheduleToDelete.value = null;
};

const handleDelete = async () => {
  if (!scheduleToDelete.value) {
    closeDeleteConfirm();
    return;
  }

  isLoading.value = true;
  try {
    await deleteSchedule(scheduleToDelete.value);
    await loadSchedules();
  } catch (err) {
    console.error('Failed to delete schedule:', err);
    error.value = err.response?.data?.message || 'Failed to delete schedule';
  } finally {
    isLoading.value = false;
    closeDeleteConfirm();
  }
};

// Initialize on mount
onMounted(async () => {
  await Promise.all([
    loadTeacherProfile(),
    loadDepartments()
  ]);
});
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

/* Loading overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  z-index: 100;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #5B55F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error toast */
.error-toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 12px 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 1000;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.error-toast button {
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 2px;
  font-size: 16px;
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
