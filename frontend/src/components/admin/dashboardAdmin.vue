<script setup>
import { ref, onMounted } from 'vue';
import adminService from '@/services/admin.service';
import { 
  Users, 
  GraduationCap, 
  Building2, 
  ArrowRight, 
  BookOpen, 
  BarChart2,
  Clock // 1. Added Clock Icon
} from 'lucide-vue-next';

const stats = ref({
  departments: 0,
  students: 0,
  teachers: 0,
  courses: 0,
  activeSessions: 0 // 2. Added activeSessions
});

const loading = ref(true);

const fetchStats = async () => {
  loading.value = true;
  try {
    // 3. Fetch Attendance Stats in parallel
    const [deptRes, stuRes, teaRes, courseRes, attRes] = await Promise.all([
      adminService.getDepartments(),
      adminService.getStudents(),
      adminService.getTeachers(),
      adminService.getCourses(),
      adminService.getAttendanceStats() // New API Call
    ]);

    stats.value = {
      departments: deptRes.data.length || 0,
      students: stuRes.data.length || 0,
      teachers: teaRes.data.length || 0,
      courses: courseRes.data.length || 0,
      activeSessions: attRes.data.activeSessions || 0 // Map result
    };
  } catch (error) {
    console.error("Failed to load dashboard stats", error);
  } finally {
    loading.value = false;
  }
};

onMounted(fetchStats);
</script>

<template>
  <div class="dashboard-wrapper">
    <header class="dashboard-header">
      <div>
        <h1>Dashboard Overview</h1>
        <p class="subtitle">Welcome back, Admin.</p>
      </div>
      <button class="refresh-btn" @click="fetchStats" :disabled="loading">
        {{ loading ? 'Refreshing...' : 'Refresh Data' }}
      </button>
    </header>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="card-icon">
          <Building2 :size="32" />
        </div>
        <div class="card-info">
          <h3>Departments</h3>
          <p class="count">{{ stats.departments }}</p>
        </div>
        <router-link to="/admin/departments" class="card-link">
          Manage Departments <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="stat-card green">
        <div class="card-icon">
          <GraduationCap :size="32" />
        </div>
        <div class="card-info">
          <h3>Total Students</h3>
          <p class="count">{{ stats.students }}</p>
        </div>
        <router-link to="/admin/students" class="card-link">
          Manage Students <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="stat-card purple">
        <div class="card-icon">
          <Users :size="32" />
        </div>
        <div class="card-info">
          <h3>Total Staff</h3>
          <p class="count">{{ stats.teachers }}</p>
        </div>
        <router-link to="/admin/staff" class="card-link">
          Manage Staff <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="stat-card orange">
        <div class="card-icon">
          <BookOpen :size="32" />
        </div>
        <div class="card-info">
          <h3>Active Courses</h3>
          <p class="count">{{ stats.courses }}</p>
        </div>
        <router-link to="/admin/courses" class="card-link">
          Manage Courses <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="stat-card red">
        <div class="card-icon">
          <Clock :size="32" />
        </div>
        <div class="card-info">
          <h3>Live Classes</h3>
          <div class="count-row">
            <p class="count">{{ stats.activeSessions }}</p>
            <span v-if="stats.activeSessions > 0" class="live-badge">
              <span class="pulse-dot"></span> LIVE
            </span>
          </div>
        </div>
        <router-link to="/admin/attendance" class="card-link">
          Monitor Attendance <ArrowRight :size="16" />
        </router-link>
      </div>

      <div class="stat-card teal">
        <div class="card-icon">
          <BarChart2 :size="32" />
        </div>
        <div class="card-info">
          <h3>Analytics</h3>
          <p class="count-text">View Reports</p>
        </div>
        <router-link to="/admin/reports" class="card-link">
          Open Analytics <ArrowRight :size="16" />
        </router-link>
      </div>

    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: 'Inter', sans-serif;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
}

h1 {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.subtitle {
  color: #64748b;
  margin-top: 0.5rem;
  font-size: 0.95rem;
}

.refresh-btn {
  background-color: white;
  border: 1px solid #e2e8f0;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  color: #475569;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background-color: #f8fafc;
  border-color: #cbd5e1;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 180px;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.card-info h3 {
  font-size: 0.9rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
}

.card-info .count {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0.25rem 0 1.5rem 0;
}

/* NEW: Layout for Count + Live Badge */
.count-row {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.live-badge {
  background: #fee2e2;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 1rem; /* Align with count baseline */
}

.pulse-dot {
  width: 6px;
  height: 6px;
  background: #ef4444;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.4; }
  100% { opacity: 1; }
}

.card-info .count-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0.25rem 0 1.5rem 0;
  padding: 0.5rem 0;
}

.card-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
  margin-top: auto;
  padding-top: 1rem;
  border-top: 1px solid #f1f5f9; 
}

/* Colors */
.stat-card.blue .card-icon { background-color: #eff6ff; color: #2563eb; }
.stat-card.blue .card-link { color: #2563eb; }

.stat-card.green .card-icon { background-color: #f0fdf4; color: #16a34a; }
.stat-card.green .card-link { color: #16a34a; }

.stat-card.purple .card-icon { background-color: #faf5ff; color: #9333ea; }
.stat-card.purple .card-link { color: #9333ea; }

.stat-card.orange .card-icon { background-color: #fff7ed; color: #ea580c; }
.stat-card.orange .card-link { color: #ea580c; }

.stat-card.teal .card-icon { background-color: #f0fdfa; color: #0d9488; }
.stat-card.teal .card-link { color: #0d9488; }

/* NEW: Red Color for Live Class */
.stat-card.red .card-icon { background-color: #fef2f2; color: #ef4444; }
.stat-card.red .card-link { color: #ef4444; }
</style>