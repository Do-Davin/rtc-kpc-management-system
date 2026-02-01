<template>
  <div class="dashboard-content">
    <header class="page-header">
      <h1>{{ t('dashboard.title') }}</h1>
      <p>{{ t('dashboard.welcome') }}</p>
    </header>

    <!-- Stats Grid - Student's Personal Stats -->
    <div class="stats-grid">
      <!-- Loading State for Cards -->
      <template v-if="loadingStats">
        <div v-for="i in 4" :key="i" class="stat-card skeleton-card"></div>
      </template>

      <template v-else>
        <!-- My Present Days -->
        <div class="stat-card">
          <div class="icon-box green">
            <CheckCircle :size="24" />
          </div>
          <div class="stat-info">
            <p>{{ t('stats.myPresence') }}</p>
            <h3>{{ stats.presentDays || 0 }} <span class="unit">{{ t('stats.days') }}</span></h3>
          </div>
        </div>

        <!-- My Late Days -->
        <div class="stat-card">
          <div class="icon-box orange">
            <Clock :size="24" />
          </div>
          <div class="stat-info">
            <p>{{ t('stats.lateDays') }}</p>
            <h3>{{ stats.lateDays || 0 }} <span class="unit">{{ t('stats.days') }}</span></h3>
          </div>
        </div>

        <!-- My Absent Days -->
        <div class="stat-card">
          <div class="icon-box red">
            <XCircle :size="24" />
          </div>
          <div class="stat-info">
            <p>{{ t('stats.absentDays') }}</p>
            <h3>{{ stats.absentDays || 0 }} <span class="unit">{{ t('stats.days') }}</span></h3>
          </div>
        </div>

        <!-- My Attendance Rate -->
        <div class="stat-card">
          <div class="icon-box blue">
            <Percent :size="24" />
          </div>
          <div class="stat-info">
            <p>{{ t('stats.myAttendanceRate') }}</p>
            <h3>{{ stats.attendanceRate || 0 }}%</h3>
          </div>
        </div>
      </template>
    </div>

    <!-- Main Content Grid -->
    <div class="content-grid">
      <!-- Left Column: Attendance Chart -->
      <div class="chart-section">
        <div class="section-header">
          <h2><TrendingUp :size="20" /> {{ t('chart.title') }}</h2>
          <select class="filter-select" v-model="selectedRange" @change="fetchAttendanceHistory">
            <option value="7">{{ t('chart.last7Days') }}</option>
            <option value="30">{{ t('chart.thisMonth') }}</option>
            <option value="90">{{ t('chart.last3Months') }}</option>
          </select>
        </div>
        <div class="chart-container">
          <AttendanceChart
            :data="attendanceData"
            :loading="loadingChart"
            :error="chartError"
            :show-attendance-percent="true"
            @retry="fetchAttendanceHistory"
          />
        </div>
      </div>
    </div>

    <!-- Today's Classes Section -->
    <div class="classes-section">
      <div class="section-header">
        <h2><CalendarDays :size="20" /> {{ t('classes.title') }}</h2>
        <router-link to="/student/timetable" class="view-all-link">
          {{ t('classes.viewSchedule') }} <ChevronRight :size="16" />
        </router-link>
      </div>

      <!-- Classes Loading -->
      <div v-if="loadingClasses" class="classes-loading">
        <div class="skeleton-row" v-for="i in 3" :key="i"></div>
      </div>

      <!-- Classes Empty -->
      <div v-else-if="todayClasses.length === 0" class="classes-empty">
        <Calendar :size="48" />
        <p>{{ t('classes.noClasses') }}</p>
      </div>

      <!-- Classes List -->
      <div v-else class="classes-grid">
        <div 
          v-for="classItem in todayClasses" 
          :key="classItem.id" 
          class="class-card"
          :class="getClassStatus(classItem)"
        >
          <div class="class-time">
            <Clock :size="16" />
            {{ classItem.startTime }} - {{ classItem.endTime }}
          </div>
          <div class="class-info">
            <h4>{{ classItem.courseName }}</h4>
            <p class="teacher-name">
              <User :size="14" />
              {{ classItem.teacherName || 'គ្រូ' }}
            </p>
            <p class="room">
              <MapPin :size="14" />
              {{ classItem.room || 'បន្ទប់' }}
            </p>
          </div>
          <div class="class-status-badge" :class="getClassStatus(classItem)">
            {{ getClassStatusLabel(classItem) }}
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions Section -->
    <div class="quick-actions-section">
      <div class="section-header">
        <h2><Zap :size="20" /> {{ t('quickActions.title') }}</h2>
      </div>
      <div class="actions-grid">
        <router-link to="/student/attendance" class="action-card">
          <div class="action-icon green">
            <ClipboardCheck :size="24" />
          </div>
          <span>{{ t('quickActions.viewAttendance') }}</span>
        </router-link>
        <router-link to="/student/timetable" class="action-card">
          <div class="action-icon blue">
            <CalendarDays :size="24" />
          </div>
          <span>{{ t('quickActions.schedule') }}</span>
        </router-link>
        <router-link to="/student/courses" class="action-card">
          <div class="action-icon orange">
            <BookOpen :size="24" />
          </div>
          <span>{{ t('quickActions.courses') }}</span>
        </router-link>
        <router-link to="/student/e-library" class="action-card">
          <div class="action-icon purple">
            <Library :size="24" />
          </div>
          <span>{{ t('quickActions.library') }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CheckCircle, XCircle, Percent, BookOpen,
  Calendar, CalendarDays, ChevronRight, Clock,
  TrendingUp, User, MapPin, Zap, ClipboardCheck, Library
} from 'lucide-vue-next'
import AttendanceChart from '../_components/AttendanceChart.vue'
import { useTranslation } from '@/composables/useTranslation'

// Translation
const { t } = useTranslation()

// ========== State ==========

// Stats - Student's personal stats
const loadingStats = ref(true)
const stats = ref({
  presentDays: 0,
  absentDays: 0,
  lateDays: 0,
  attendanceRate: 0
})

// Chart
const loadingChart = ref(true)
const chartError = ref('')
const selectedRange = ref('7')
const attendanceData = ref([])

// Today's Classes
const loadingClasses = ref(true)
const todayClasses = ref([])

// ========== Mock Data Functions ==========
// These will be replaced with real API calls when backend is ready

const fetchStats = async () => {
  try {
    loadingStats.value = true
    // Simulate API call - replace with real API later
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data for student's personal attendance
    stats.value = {
      presentDays: 45,
      absentDays: 3,
      lateDays: 2,
      attendanceRate: 90
    }
  } catch (error) {
    console.error('Failed to fetch stats:', error)
    stats.value = { presentDays: 0, absentDays: 0, lateDays: 0, attendanceRate: 0 }
  } finally {
    loadingStats.value = false
  }
}

const fetchAttendanceHistory = async () => {
  try {
    loadingChart.value = true
    chartError.value = ''
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 600))
    
    // Generate mock attendance data based on selected range
    const days = parseInt(selectedRange.value)
    const data = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      
      // Random attendance percentage between 85-100%
      const percentage = Math.floor(Math.random() * 16) + 85
      
      data.push({
        date: date.toISOString().split('T')[0],
        percentage: percentage,
        present: percentage >= 90 ? 1 : 0,
        absent: percentage < 90 ? 1 : 0,
        total: 1
      })
    }
    
    attendanceData.value = data
  } catch (error) {
    console.error('Failed to fetch attendance history:', error)
    chartError.value = 'មិនអាចទាញយកទិន្នន័យបានទេ។'
    attendanceData.value = []
  } finally {
    loadingChart.value = false
  }
}

const fetchTodayClasses = async () => {
  try {
    loadingClasses.value = true
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 400))
    
    // Mock today's classes
    todayClasses.value = [
      {
        id: 1,
        courseName: 'គណិតវិទ្យា',
        teacherName: 'លោកគ្រូ សុខា',
        room: 'បន្ទប់ A101',
        startTime: '08:00',
        endTime: '09:30'
      },
      {
        id: 2,
        courseName: 'ភាសាអង់គ្លេស',
        teacherName: 'អ្នកគ្រូ មល្លិកា',
        room: 'បន្ទប់ B205',
        startTime: '10:00',
        endTime: '11:30'
      },
      {
        id: 3,
        courseName: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ',
        teacherName: 'លោកគ្រូ វិចិត្រ',
        room: 'បន្ទប់ Lab C',
        startTime: '14:00',
        endTime: '16:00'
      }
    ]
  } catch (error) {
    console.error('Failed to fetch classes:', error)
    todayClasses.value = []
  } finally {
    loadingClasses.value = false
  }
}

// ========== Class Helpers ==========

const getClassStatus = (classItem) => {
  const now = new Date()
  const currentTime = now.getHours() * 60 + now.getMinutes()
  
  const [startHour, startMin] = classItem.startTime.split(':').map(Number)
  const [endHour, endMin] = classItem.endTime.split(':').map(Number)
  
  const startTime = startHour * 60 + startMin
  const endTime = endHour * 60 + endMin
  
  if (currentTime < startTime) return 'upcoming'
  if (currentTime >= startTime && currentTime <= endTime) return 'ongoing'
  return 'completed'
}

const getClassStatusLabel = (classItem) => {
  const status = getClassStatus(classItem)
  const labels = {
    upcoming: t('classes.upcoming'),
    ongoing: t('classes.ongoing'),
    completed: t('classes.completed')
  }
  return labels[status]
}

// ========== Init ==========

onMounted(() => {
  fetchStats()
  fetchAttendanceHistory()
  fetchTodayClasses()
})
</script>

<style scoped>
.page-header {
  margin-bottom: 24px;
}

.page-header h1 { color: #5d5fef; margin-bottom: 8px; font-size: 1.5rem; }
.page-header p { color: #64748b; margin: 0; }

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.skeleton-card {
  height: 88px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.icon-box {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.blue { background: #eef2ff; color: #6366f1; }
.orange { background: #fff7ed; color: #f59e0b; }
.green { background: #f0fdf4; color: #10b981; }
.red { background: #fef2f2; color: #ef4444; }
.purple { background: #f5f3ff; color: #8b5cf6; }

.stat-info p {
  margin: 0 0 4px 0;
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
}

.stat-info h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.unit {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.content-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-section,
.classes-section,
.quick-actions-section {
  background: white;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h2 {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select {
  padding: 6px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-size: 0.8rem;
  background: white;
  cursor: pointer;
}

.chart-container {
  height: 350px;
}

/* Classes Section */
.classes-section {
  margin-bottom: 24px;
}

.view-all-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #6366f1;
  font-size: 0.85rem;
  text-decoration: none;
  font-weight: 500;
}

.view-all-link:hover {
  text-decoration: underline;
}

.classes-loading {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-row {
  height: 80px;
  background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
  background-size: 200% 100%;
  border-radius: 12px;
  animation: shimmer 1.5s infinite;
}

.classes-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 20px;
  color: #94a3b8;
  gap: 12px;
}

.classes-empty p {
  margin: 0;
  color: #64748b;
}

.classes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.class-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border-left: 4px solid #e2e8f0;
  transition: all 0.2s;
}

.class-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.class-card.upcoming {
  border-left-color: #f59e0b;
}

.class-card.ongoing {
  border-left-color: #10b981;
  background: #f0fdf4;
}

.class-card.completed {
  border-left-color: #94a3b8;
  opacity: 0.7;
}

.class-time {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.85rem;
  color: #6366f1;
  font-weight: 600;
  margin-bottom: 8px;
}

.class-info h4 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
}

.class-info p {
  margin: 0 0 4px 0;
  font-size: 0.8rem;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 6px;
}

.class-status-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
}

.class-status-badge.upcoming {
  background: #fef3c7;
  color: #d97706;
}

.class-status-badge.ongoing {
  background: #dcfce7;
  color: #15803d;
}

.class-status-badge.completed {
  background: #f1f5f9;
  color: #64748b;
}

/* Quick Actions Section */
.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 16px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 20px 16px;
  background: #f8fafc;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  background: #f1f5f9;
  transform: translateY(-2px);
}

.action-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-card span {
  font-size: 0.85rem;
  font-weight: 500;
  color: #475569;
}
</style>
