<template>
  <div class="schedule-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">{{ t('schedulePage.title') }}</h1>
        <p class="page-subtitle">{{ t('schedulePage.subtitle') }}</p>
      </div>
    </div>

    <!-- Current Info Banner -->
    <div class="info-banner">
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
        <span>{{ t('schedulePage.department') }}: <strong>{{ currentDepartment }}</strong></span>
      </div>
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>{{ t('schedulePage.academicYear') }}: <strong>{{ currentYear }}</strong></span>
      </div>
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>{{ t('schedulePage.group') }}: <strong>{{ currentGroup }}</strong></span>
      </div>
    </div>

    <!-- Legend Section -->
    <div class="legend-section">
      <span class="legend-label">{{ t('schedulePage.subjects') }}:</span>
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

    <!-- Timetable Grid -->
    <div class="timetable-container">
      <div class="timetable">
        <!-- Header Row (Days) -->
        <div class="timetable-header">
          <div class="time-header">{{ t('schedulePage.timeDay') }}</div>
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
          >
            <div
              v-for="schedule in getScheduleForCell(day, slot)"
              :key="schedule.id"
              class="schedule-card"
              :style="{ 
                backgroundColor: schedule.color + '15', 
                borderColor: schedule.color
              }"
            >
              <!-- Type Badge -->
              <div class="card-type" :style="{ color: schedule.color }">
                {{ getTypeLabel(schedule.type) }}
              </div>
              <div class="card-header">
                <span class="subject-name" :style="{ color: schedule.color }">{{ schedule.subjectName }}</span>
              </div>
              <div class="card-body">
                <div class="card-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{{ schedule.teacherName }}</span>
                </div>
                <div class="card-info" v-if="schedule.room">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                    <polyline points="9 22 9 12 15 12 15 22"></polyline>
                  </svg>
                  <span>{{ schedule.room }}</span>
                </div>
              </div>
            </div>
            <div v-if="!getScheduleForCell(day, slot).length" class="empty-cell">
              <span class="empty-text">{{ t('schedulePage.noClass') }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useTranslation } from '@/composables/useTranslation'
import * as studentDashboardApi from '@/services/student-dashboard.api'

const { t, currentLanguage } = useTranslation()

// Loading state
const loading = ref(true)

// Student's current info (fetched from API)
const currentDepartment = ref('');
const currentYear = ref('');
const currentGroup = ref('');

// Schedule Data
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const dayLabels = computed(() => ({
  Monday: t('schedulePage.monday'),
  Tuesday: t('schedulePage.tuesday'),
  Wednesday: t('schedulePage.wednesday'),
  Thursday: t('schedulePage.thursday'),
  Friday: t('schedulePage.friday'),
  Saturday: t('schedulePage.saturday'),
}));

// 1-hour time slots from 7:00 to 5:00 PM (matching teacher schedule)
const timeSlots = [
  { start: '07:00', end: '08:00' },
  { start: '08:00', end: '09:00' },
  { start: '09:00', end: '10:00' },
  { start: '10:00', end: '11:00' },
  { start: '13:00', end: '14:00' },
  { start: '14:00', end: '15:00' },
  { start: '15:00', end: '16:00' },
  { start: '16:00', end: '17:00' },
];

// Schedule data from API
const schedules = ref([]);

// Fetch schedule data from API
const fetchSchedule = async () => {
  try {
    loading.value = true
    const data = await studentDashboardApi.getMySchedule()
    
    // Set student info
    if (data.student) {
      currentDepartment.value = data.student.departmentCode || data.student.department || 'N/A'
      currentYear.value = data.student.year || 'N/A'
      currentGroup.value = data.student.group || 'A'
    }
    
    // Set schedules
    schedules.value = data.schedules || []
  } catch (error) {
    console.error('Failed to fetch schedule:', error)
    schedules.value = []
  } finally {
    loading.value = false
  }
}

// Filter schedules for student's group (already filtered by department and year from API)
const filteredSchedules = computed(() => {
  return schedules.value.filter(
    (s) => !s.group || s.group === currentGroup.value || s.group === 'ALL'
  );
});

// Get unique subjects for legend
const uniqueSubjects = computed(() => {
  const seen = new Map();
  filteredSchedules.value.forEach((s) => {
    if (!seen.has(s.subjectName)) {
      seen.set(s.subjectName, { name: s.subjectName, color: s.color || '#5B55F3' });
    }
  });
  return Array.from(seen.values());
});

// Convert time string to minutes for comparison
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

// Get schedule for a specific cell - show in ALL slots that the schedule covers
const getScheduleForCell = (day, slot) => {
  const slotStartMinutes = timeToMinutes(slot.start);
  const slotEndMinutes = timeToMinutes(slot.end);
  
  return filteredSchedules.value.filter((s) => {
    if (s.day !== day) return false;
    
    const scheduleStartMinutes = timeToMinutes(s.startTime);
    const scheduleEndMinutes = timeToMinutes(s.endTime);
    
    // Check if this slot overlaps with the schedule
    return slotStartMinutes >= scheduleStartMinutes && slotEndMinutes <= scheduleEndMinutes;
  });
};

// Get type label (LECTURE, LAB, PRACTICE)
const getTypeLabel = (type) => {
  if (!type) return 'LECTURE';
  const typeMap = {
    'Lecture': 'LECTURE',
    'Lab': 'LAB',
    'Practice': 'PRACTICE',
    'Tutorial': 'TUTORIAL',
    'Seminar': 'SEMINAR',
  };
  return typeMap[type] || type.toUpperCase();
};

// Initialize on mount
onMounted(() => {
  fetchSchedule()
})
</script>

<style scoped>
.schedule-page {
  width: 100%;
  background: #f9fafb;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  flex-direction: column;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0 0 4px 0;
}

.page-subtitle {
  font-size: 0.95rem;
  color: #6b7280;
  margin: 0;
}

/* Info Banner */
.info-banner {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  background: white;
  padding: 16px 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #6b7280;
  font-size: 0.95rem;
}

.info-item svg {
  color: var(--purple-500);
}

.info-item strong {
  color: #374151;
  font-weight: 600;
}

/* Legend Section */
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

/* Timetable */
.timetable-container {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-x: auto;
  margin-bottom: 32px;
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
  background: var(--purple-500, #5B55F3);
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
  color: var(--purple-500, #5B55F3);
  text-align: center;
}

.schedule-cell {
  min-height: 130px;
  padding: 8px;
  background: #fafafa;
  border-radius: 8px;
  transition: all 0.2s;
}

/* Schedule Card in Cell */
.schedule-card {
  padding: 10px;
  border-radius: 8px;
  border-left: 3px solid;
  height: 100%;
}

.card-type {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.card-header {
  margin-bottom: 8px;
}

.subject-name {
  font-weight: 600;
  font-size: 0.85rem;
  display: block;
  line-height: 1.3;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.card-info {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #6b7280;
}

.card-info svg {
  flex-shrink: 0;
  color: #9ca3af;
}

.empty-cell {
  width: 100%;
  height: 100%;
  min-height: 114px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-text {
  color: #d1d5db;
  font-size: 0.85rem;
}

/* Today's Classes Section */
.today-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin: 0 0 20px 0;
}

.section-title svg {
  color: var(--purple-500, #5B55F3);
}

.today-classes {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

.today-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border-left: 4px solid;
  transition: transform 0.2s, box-shadow 0.2s;
}

.today-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.today-time {
  display: flex;
  align-items: flex-start;
}

.time-badge {
  background: white;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--purple-500, #5B55F3);
  white-space: nowrap;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.today-info {
  flex: 1;
}

.today-subject {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 4px 0;
}

.today-teacher {
  font-size: 0.85rem;
  color: #6b7280;
  margin: 0 0 6px 0;
}

.today-room {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  color: #9ca3af;
  margin: 0;
}

.today-room svg {
  flex-shrink: 0;
}

/* No Classes */
.no-classes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #9ca3af;
}

.no-classes svg {
  margin-bottom: 12px;
  color: #d1d5db;
}

.no-classes p {
  margin: 0;
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .info-banner {
    flex-direction: column;
    gap: 12px;
  }

  .timetable-container {
    padding: 12px;
  }

  .today-classes {
    grid-template-columns: 1fr;
  }
}
</style>
