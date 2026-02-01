<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue';
import adminService from '@/services/admin.service';
import {
  Calendar,
  Clock,
  Users,
  RefreshCw,
  Search
} from 'lucide-vue-next';

const loading = ref(true);
const stats = ref({
  totalSessions: 0,
  activeSessions: 0,
  activeTeachers: 0
});
const recentSessions = ref([]);

const fetchData = async () => {
  loading.value = true;
  try {
    const [statsRes, sessionsRes] = await Promise.all([
      adminService.getAttendanceStats(),
      adminService.getAllSessions(50, 0) // Fetch last 50 sessions
    ]);

    stats.value = statsRes.data;
    recentSessions.value = sessionsRes.data;
  } catch (err) {
    console.error("Failed to load attendance data", err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString();
};

const getStatusClass = (status) => {
  switch (status) {
    case 'ACTIVE': return 'status-active';
    case 'STOPPED': return 'status-stopped';
    case 'EXPIRED': return 'status-expired';
    default: return '';
  }
};

onMounted(fetchData);
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">ផ្ទាំងត្រួតពិនិត្យវត្តមាន</h2>
        <p class="page-subtitle">តាមដានសកម្មភាពគ្រូ និងវគ្គក្នុងថ្នាក់</p>
      </div>
      <button @click="fetchData" class="btn-refresh" :disabled="loading">
        <RefreshCw size="18" :class="{ 'spin': loading }" /> ផ្ទុកឡើងវិញ
      </button>
    </div>

    <div class="stats-grid">
      <div class="stat-card blue">
        <div class="icon-box"><Calendar size="24" /></div>
        <div class="stat-info">
          <span class="label">ចំនួនសរុបវគ្គ</span>
          <span class="value">{{ stats.totalSessions }}</span>
        </div>
      </div>

      <div class="stat-card green">
        <div class="icon-box"><Clock size="24" /></div>
        <div class="stat-info">
          <span class="label">កំពុងមានសកម្មភាព</span>
          <span class="value">{{ stats.activeSessions }}</span>
        </div>
      </div>

      <div class="stat-card purple">
        <div class="icon-box"><Users size="24" /></div>
        <div class="stat-info">
          <span class="label">គ្រូដែលមានសកម្មភាព</span>
          <span class="value">{{ stats.activeTeachers }}</span>
        </div>
      </div>
    </div>

    <div class="content-card">
      <div class="card-header">
        <h3>វគ្គថ្នាក់ដែលបានចូលរួមថ្មីៗ</h3>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>គ្រូ</th>
              <th>វគ្គ / ថ្នាក់</th>
              <th>ឈ្មោះវគ្គសិក្សា</th>
              <th>ពេលវេលាចាប់ផ្តើម</th>
              <th>វត្តមាន</th>
              <th>ស្ថានភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading && recentSessions.length === 0">
              <td colspan="6" class="text-center">Loading data...</td>
            </tr>
            <tr v-else-if="recentSessions.length === 0">
              <td colspan="6" class="text-center">គ្មានវគ្គសិក្សា</td>
            </tr>
            <tr v-for="session in recentSessions" :key="session.id">
              <td>
                <div class="teacher-info">
                  <span class="teacher-name">{{ session.teacher?.firstName }} {{ session.teacher?.lastName }}</span>
                  <span class="teacher-email">{{ session.teacher?.email }}</span>
                </div>
              </td>
              <td>
                <div class="course-info">
                  <span class="course-name">{{ session.courseName }}</span>
                  <span class="course-year">ឆ្នាំ {{ session.year }}</span>
                </div>
              </td>
              <td>{{ session.sessionName }}</td>
              <td>{{ formatDate(session.createdAt || session.sessionDate) }}</td>
              <td>
                <span class="badge-count">
                  {{ session.attendanceRecords?.length || 0 }} សិស្ស
                </span>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(session.status)">
                  {{ session.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
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
  align-items: center;
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

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.6rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: #475569;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-refresh:hover {
  background: #f8fafc;
  color: #1e293b;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* STATS CARDS */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.icon-box {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-card.blue .icon-box { background: #eff6ff; color: #2563eb; }
.stat-card.green .icon-box { background: #f0fdf4; color: #16a34a; }
.stat-card.purple .icon-box { background: #faf5ff; color: #9333ea; }

.stat-info { display: flex; flex-direction: column; }
.stat-info .label { font-size: 0.85rem; color: #64748b; }
.stat-info .value { font-size: 1.5rem; font-weight: 700; color: #1e293b; }

/* TABLE STYLES */
.content-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
}

.card-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
}

.card-header h3 { margin: 0; color: #334155; font-size: 1.1rem; }

.table-container { overflow-x: auto; }

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.data-table th {
  background: #f8fafc;
  color: #475569;
  font-weight: 600;
  text-align: left;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.data-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}

.teacher-info, .course-info { display: flex; flex-direction: column; }
.teacher-name, .course-name { font-weight: 500; color: #1e293b; }
.teacher-email, .course-year { font-size: 0.8rem; color: #64748b; }

.badge-count {
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

.status-active { background: #dcfce7; color: #16a34a; }
.status-stopped { background: #f1f5f9; color: #64748b; }
.status-expired { background: #fee2e2; color: #991b1b; }

.text-center { text-align: center; padding: 2rem; color: #94a3b8; }
</style>
