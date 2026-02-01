<script setup>
import { ref, onMounted, computed } from 'vue'
import adminService from '@/services/admin.service'
import {
  Users,
  GraduationCap,
  Building2,
  TrendingUp,
  BarChart2,
  PieChart,
  UserCheck
} from 'lucide-vue-next'

const loading = ref(true)
const students = ref([])
const teachers = ref([])
const departments = ref([])

// --- Computed Statistics ---

// 1. Total Counts
const totalStudents = computed(() => students.value.length)
const totalTeachers = computed(() => teachers.value.length)
const totalDepartments = computed(() => departments.value.length)

// 2. Student Distribution by Department
const studentDistribution = computed(() => {
  if (!students.value.length) return []
  
  const dist = {}
  // Count students per department
  students.value.forEach(s => {
    // Check if department is an object (populated) or ID string
    const deptName = s.department?.name || 'Unassigned'
    dist[deptName] = (dist[deptName] || 0) + 1
  })

  // Convert to array and calculate percentage
  return Object.keys(dist).map(name => ({
    name,
    count: dist[name],
    percentage: Math.round((dist[name] / totalStudents.value) * 100)
  })).sort((a, b) => b.count - a.count) // Sort highest to lowest
})

// 3. Teacher to Student Ratio
const teacherStudentRatio = computed(() => {
  if (!totalTeachers.value) return 0
  return (totalStudents.value / totalTeachers.value).toFixed(1)
})

const fetchData = async () => {
  loading.value = true
  try {
    const [stuRes, teachRes, deptRes] = await Promise.all([
      adminService.getStudents(),
      adminService.getTeachers(),
      adminService.getDepartments()
    ])
    
    students.value = stuRes.data
    teachers.value = teachRes.data
    departments.value = deptRes.data
  } catch (error) {
    console.error("Failed to load report data", error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">Institutional Reports</h2>
        <p class="page-subtitle">Overview of school performance and demographics</p>
      </div>
      <div class="header-actions">
        <button @click="fetchData" class="btn-secondary">
          Refresh Data
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Generating reports...</p>
    </div>

    <div v-else class="reports-grid">
      
      <div class="metric-card purple">
        <div class="metric-icon">
          <GraduationCap size="24" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Students</span>
          <span class="metric-value">{{ totalStudents }}</span>
        </div>
      </div>

      <div class="metric-card blue">
        <div class="metric-icon">
          <Users size="24" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Total Teachers</span>
          <span class="metric-value">{{ totalTeachers }}</span>
        </div>
      </div>

      <div class="metric-card green">
        <div class="metric-icon">
          <Building2 size="24" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Departments</span>
          <span class="metric-value">{{ totalDepartments }}</span>
        </div>
      </div>

      <div class="metric-card orange">
        <div class="metric-icon">
          <TrendingUp size="24" />
        </div>
        <div class="metric-info">
          <span class="metric-label">Student/Teacher Ratio</span>
          <span class="metric-value">{{ teacherStudentRatio }} : 1</span>
        </div>
      </div>

      <div class="report-panel large">
        <div class="panel-header">
          <h3><PieChart size="20" /> Student Enrollment by Department</h3>
        </div>
        <div class="panel-body">
          <div v-if="studentDistribution.length === 0" class="empty-chart">No data available</div>
          <div v-else class="distribution-list">
            <div v-for="item in studentDistribution" :key="item.name" class="dist-item">
              <div class="dist-info">
                <span class="dist-name">{{ item.name }}</span>
                <span class="dist-count">{{ item.count }} Students ({{ item.percentage }}%)</span>
              </div>
              <div class="progress-track">
                <div class="progress-fill" :style="{ width: item.percentage + '%' }"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-panel">
        <div class="panel-header">
          <h3><BarChart2 size="20" /> Operational Health</h3>
        </div>
        <div class="panel-body stats-list">
          <div class="stat-row">
            <span class="stat-label">Active Departments</span>
            <span class="stat-val">{{ departments.length }}</span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Avg. Students per Dept</span>
            <span class="stat-val">
              {{ totalDepartments ? Math.round(totalStudents / totalDepartments) : 0 }}
            </span>
          </div>
          <div class="stat-row">
            <span class="stat-label">Faculty Size</span>
            <span class="stat-val">{{ teachers.length }} Members</span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin-top: 0.25rem;
}

.btn-secondary {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f8fafc;
  border-color: #94a3b8;
}

/* GRID LAYOUT */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

/* METRIC CARDS */
.metric-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.metric-icon {
  width: 50px;
  height: 50px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-card.purple .metric-icon { background: #f3e8ff; color: #7c3aed; }
.metric-card.blue .metric-icon { background: #dbeafe; color: #2563eb; }
.metric-card.green .metric-icon { background: #dcfce7; color: #16a34a; }
.metric-card.orange .metric-icon { background: #ffedd5; color: #ea580c; }

.metric-info {
  display: flex;
  flex-direction: column;
}

.metric-label {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 500;
}

.metric-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* REPORT PANELS */
.report-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  grid-column: span 1; /* Default span */
  display: flex;
  flex-direction: column;
}

.report-panel.large {
  grid-column: span 3; /* Takes up 75% of width */
}

.panel-header {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #334155;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.panel-body {
  padding: 1.5rem;
}

/* DISTRIBUTION CHART STYLES */
.dist-item {
  margin-bottom: 1.2rem;
}

.dist-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
}

.dist-name { color: #334155; }
.dist-count { color: #64748b; }

.progress-track {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #7c3aed; /* Primary Purple */
  border-radius: 99px;
  transition: width 0.5s ease-out;
}

/* SIMPLE STATS LIST */
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid #f1f5f9;
}

.stat-row:last-child { border-bottom: none; }

.stat-label { color: #64748b; }
.stat-val { font-weight: 600; color: #1e293b; }

.loading-state {
  text-align: center;
  padding: 4rem;
  color: #64748b;
}

.spinner {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #7c3aed;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .report-panel.large {
    grid-column: span 2;
  }
}

@media (max-width: 768px) {
  .reports-grid {
    grid-template-columns: 1fr;
  }
  .report-panel.large {
    grid-column: span 1;
  }
}
</style>