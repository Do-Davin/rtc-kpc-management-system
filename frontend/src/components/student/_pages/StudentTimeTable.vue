<template>
  <div class="schedule-page">
    <!-- Header Section -->
    <div class="page-header">
      <div class="header-content">
        <h1 class="page-title">កាលវិភាគសិក្សា</h1>
        <p class="page-subtitle">មើលកាលវិភាគថ្នាក់រៀនរបស់អ្នក</p>
      </div>
    </div>

    <!-- Current Info Banner -->
    <div class="info-banner">
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
          <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
        </svg>
        <span>ដេប៉ាតឺម៉ង់: <strong>{{ currentDepartment }}</strong></span>
      </div>
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
        <span>ឆ្នាំសិក្សា: <strong>{{ currentYear }}</strong></span>
      </div>
      <div class="info-item">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
          <circle cx="9" cy="7" r="4"></circle>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
        <span>ក្រុម: <strong>{{ currentGroup }}</strong></span>
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
              :style="{ backgroundColor: schedule.color + '15', borderColor: schedule.color }"
            >
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
                <div class="card-info">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
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

    <!-- Today's Classes Section -->
    <div class="today-section">
      <h2 class="section-title">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
        {{ t('schedulePage.todayClasses') }}
      </h2>
      <div v-if="todayClasses.length > 0" class="today-classes">
        <div
          v-for="schedule in todayClasses"
          :key="schedule.id"
          class="today-card"
          :style="{ borderLeftColor: schedule.color }"
        >
          <div class="today-time">
            <span class="time-badge">{{ schedule.startTime }} - {{ schedule.endTime }}</span>
          </div>
          <div class="today-info">
            <h3 class="today-subject" :style="{ color: schedule.color }">{{ schedule.subjectName }}</h3>
            <p class="today-teacher">{{ schedule.teacherName }}</p>
            <p class="today-room">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {{ schedule.room }}
            </p>
          </div>
        </div>
      </div>
      <div v-else class="no-classes">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
          <line x1="9" y1="9" x2="9.01" y2="9"></line>
          <line x1="15" y1="9" x2="15.01" y2="9"></line>
        </svg>
        <p>{{ t('schedulePage.noTodayClasses') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useTranslation } from '@/composables/useTranslation'

const { t, currentLanguage } = useTranslation()

// Student's current info (will come from auth/API later)
const currentDepartment = ref('GIC');
const currentYear = ref('Year 1');
const currentGroup = ref('A');
const studentDepartmentId = ref(1);

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

const timeSlots = [
  { start: '07:00', end: '09:00' },
  { start: '09:00', end: '11:00' },
  { start: '13:00', end: '15:00' },
  { start: '15:00', end: '17:00' },
];

// Sample schedule data (will come from API later)
const schedules = ref([
  {
    id: 1,
    subjectName: 'គណិតវិទ្យា',
    teacherName: 'លោក សុខ វិសាល',
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
    teacherName: 'លោកស្រី ចាន់ សុភា',
    group: 'A',
    year: 'Year 1',
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
    teacherName: 'លោក រស្មី ពេជ្រ',
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
    subjectName: 'ភាសាអង់គ្លេស',
    teacherName: 'អ្នកគ្រូ មាលា សុវណ្ណ',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 104',
    day: 'Tuesday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#8B5CF6',
  },
  {
    id: 5,
    subjectName: 'ព័ត៌មានវិទ្យា',
    teacherName: 'លោក ដារា សុភាព',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Lab 01',
    day: 'Wednesday',
    startTime: '07:00',
    endTime: '09:00',
    color: '#06B6D4',
  },
  {
    id: 6,
    subjectName: 'ជីវវិទ្យា',
    teacherName: 'លោកស្រី សុខ លក្ខណា',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 105',
    day: 'Wednesday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#EF4444',
  },
  {
    id: 7,
    subjectName: 'គណិតវិទ្យា',
    teacherName: 'លោក សុខ វិសាល',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 101',
    day: 'Thursday',
    startTime: '13:00',
    endTime: '15:00',
    color: '#5B55F3',
  },
  {
    id: 8,
    subjectName: 'រូបវិទ្យា',
    teacherName: 'លោកស្រី ចាន់ សុភា',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 102',
    day: 'Thursday',
    startTime: '15:00',
    endTime: '17:00',
    color: '#10B981',
  },
  {
    id: 9,
    subjectName: 'ភាសាអង់គ្លេស',
    teacherName: 'អ្នកគ្រូ មាលា សុវណ្ណ',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Room 104',
    day: 'Friday',
    startTime: '07:00',
    endTime: '09:00',
    color: '#8B5CF6',
  },
  {
    id: 10,
    subjectName: 'ព័ត៌មានវិទ្យា',
    teacherName: 'លោក ដារា សុភាព',
    group: 'A',
    year: 'Year 1',
    department: 1,
    room: 'Lab 01',
    day: 'Friday',
    startTime: '09:00',
    endTime: '11:00',
    color: '#06B6D4',
  },
]);

// Filter schedules for student's department, year, and group
const filteredSchedules = computed(() => {
  return schedules.value.filter(
    (s) => s.department === studentDepartmentId.value && 
           s.year === currentYear.value && 
           s.group === currentGroup.value
  );
});

// Get unique subjects for legend
const uniqueSubjects = computed(() => {
  const seen = new Map();
  filteredSchedules.value.forEach((s) => {
    if (!seen.has(s.subjectName)) {
      seen.set(s.subjectName, { name: s.subjectName, color: s.color });
    }
  });
  return Array.from(seen.values());
});

// Get today's day name
const getTodayName = () => {
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[new Date().getDay()];
};

// Get today's classes
const todayClasses = computed(() => {
  const today = getTodayName();
  return filteredSchedules.value
    .filter((s) => s.day === today)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
});

// Get schedule for a specific cell
const getScheduleForCell = (day, slot) => {
  return filteredSchedules.value.filter(
    (s) => s.day === day && s.startTime === slot.start && s.endTime === slot.end
  );
};
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
