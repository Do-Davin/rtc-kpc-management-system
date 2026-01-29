<script setup>
import { ref, onMounted } from 'vue';
import adminService from '@/services/admin.service';
import { Users, GraduationCap, Building2, ArrowRight } from 'lucide-vue-next';

const stats = ref({
  departments: 0,
  students: 0,
  teachers: 0
});

const loading = ref(true);


const fetchStats = async () => {
  loading.value = true;
  try {
    const [deptRes, stuRes, teaRes] = await Promise.all([
      adminService.getDepartments(),
      adminService.getStudents(),
      adminService.getTeachers()
    ]);

    stats.value = {
      departments: deptRes.data.length || 0,
      students: stuRes.data.length || 0,
      teachers: teaRes.data.length || 0
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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
  min-height: 180px; /* Slightly taller for balance */
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


.stat-card.blue .card-icon {
  background-color: #eff6ff;
  color: #2563eb;
}
.stat-card.blue .card-link {
  color: #2563eb;
}


.stat-card.green .card-icon {
  background-color: #f0fdf4;
  color: #16a34a;
}
.stat-card.green .card-link {
  color: #16a34a;
}

.stat-card.purple .card-icon {
  background-color: #faf5ff;
  color: #9333ea;
}
.stat-card.purple .card-link {
  color: #9333ea;
}
</style>