<template>
  <div class="student-management">
    <header class="page-header">
      <h1 class="title">ទិដ្ឋភាព - សិស្សានុសិស្ស</h1>
      <p class="subtitle">សួស្ដី, សូមស្វាគមន៍សារជាថ្មី 🙏</p>
    </header>

    <div class="summary-grid">
      <div class="summary-card" v-for="stat in summaryStats" :key="stat.label">
        <h2 class="stat-value">{{ stat.value }}</h2>
        <p class="stat-label">{{ stat.label }}</p>
      </div>
    </div>
    <!-- Temporay -->
    <div class="filter-bar">
      <input type="text" placeholder="Search students..." class="search-input" v-model="searchQuery" />
      <select class="filter-select" v-model="selectedDept">
        <option value="">Computer Science</option>
        <option value="Engineering">Engineering</option>
        <option value="Business">Business</option>
        <option value="Arts">Arts</option>
      </select>
      <select class="filter-select" v-model="selectedYear">
        <option value="">All Years</option>
        <option value="Year 1">1</option>
        <option value="Year 2">2</option>
        <option value="Year 3">3</option>
        <option value="Year 4">4</option>
      </select>
    </div>

    <div class="student-grid">
      <div class="student-card" v-for="student in filteredStudents" :key="student.id">
        <div class="card-header">
          <div class="avatar" :style="{ backgroundColor: student.avatarColor }">
            {{ student.initials }}
          </div>
          <div class="name-id">
            <h3>{{ student.name }}</h3>
            <span>{{ student.id }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">ដេប៉ាដឺម៉ង់:</span>
            <span class="value">{{ student.dept }}</span>
          </div>
          <div class="info-row">
            <span class="label">ឆ្នាំទី:</span>
            <span class="value">{{ student.year }}</span>
          </div>
          <div class="info-row">
            <span class="label">អុីម៉ែល:</span>
            <span class="value">{{ student.email }}</span>
          </div>
          <div class="info-row">
            <span class="label">ចំនួនថ្នាក់:</span>
            <span class="value">{{ student.courses }} enrolled</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn view">
            <img src="../../assets/view.png" class="icon" /> View
          </button>
          <button class="btn edit">
            <img src="../../assets/edit.png" class="icon" /> Edit
          </button>
          <button class="btn delete">
            <img src="../../assets/delete.png" class="icon" /> Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Temporay Student Management Sections -->
<script setup>
import { ref, computed } from 'vue';

const searchQuery = ref('');
const selectedDept = ref('');
const selectedYear = ref('');

const summaryStats = [
  { label: 'សិស្សសរុប', value: '1,247' },
  { label: 'ដេប៉ាដឺម៉ង់', value: '8' },
  { label: 'វគ្គសិក្សាសរុប', value: '156' },
  { label: 'ភាគវត្តមាន', value: '94%' },
];

const students = ref([
  { initials: 'TV', name: 'ធី សេដ្ឋាសារវត្រ័', id: 'STU001', dept: 'Computer Science', year: '3', email: 'thy.vath@university.edu', courses: 2, avatarColor: '#5d5fef' },
  { initials: 'HS', name: 'ហួត សីថា', id: 'STU002', dept: 'Engineering', year: '2', email: 'hout.sitha@university.edu', courses: 2, avatarColor: '#7c3aed' },
  { initials: 'DV', name: 'ដូ ឌាវីន', id: 'STU003', dept: 'Business', year: '4', email: 'do.davin@university.edu', courses: 2, avatarColor: '#4f46e5' },
  { initials: 'SV', name: 'សេរី រង្ស', id: 'STU004', dept: 'Arts', year: '1', email: 'serey.vong@university.edu', courses: 2, avatarColor: '#4338ca' },
  { initials: 'SL', name: 'សាម​ សុខលៀប', id: 'STU005', dept: 'Computer Science', year: '2', email: 'sok.leap@university.edu', courses: 2, avatarColor: '#6366f1' },
  { initials: 'NH', name: 'ជិន ហុងនីហេង', id: 'STU006', dept: 'Science', year: '3', email: 'ny.heng@university.edu', courses: 2, avatarColor: '#3730a3' },
]);

const filteredStudents = computed(() => {
  return students.value.filter(s =>
    s.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});
</script>

<style scoped>
.student-management {
  padding: 10px;
}

.title {
  color: #5d5fef;
  font-size: 2rem;
  margin-bottom: 5px;
}

.subtitle {
  color: #888;
  margin-bottom: 30px;
}

/* Summary Cards */
.summary-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 30px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #edf2f7;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.stat-label {
  color: #a0aec0;
  font-size: 0.85rem;
  margin: 0;
}

/* Filter Bar */
.filter-bar {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  max-width: 400px;
}

.filter-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: white;
  min-width: 150px;
}

/* Student Cards Grid */
.student-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.student-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #edf2f7;
  transition: transform 0.2s;
}

.student-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
}

.name-id h3 {
  margin: 0;
  font-size: 1.1rem;
}

.name-id span {
  color: #a0aec0;
  font-size: 0.85rem;
}

.card-body {
  margin-bottom: 25px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.label {
  color: #a0aec0;
}

.value {
  font-weight: 600;
  color: #2d3748;
}

.card-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  border-top: 1px solid #edf2f7;
  padding-top: 20px;
}

.btn {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  background: white;
  font-size: 0.8rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  transition: background 0.2s, color 0.2s;
}

.btn:hover {
  background: #f7fafc;
}

.btn.delete {
  background: #fef2f2;
  color: #e53e3e;
  border-color: #e53e3e;
}

.btn.delete:hover {
  background: #e53e3e;
  color: white;
  border-color: #e53e3e;
}

.icon {
  width: 16px;
  height: 16px;
  margin-right: 6px;
}

</style>
