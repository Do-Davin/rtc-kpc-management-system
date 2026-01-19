<template>
  <div class="department-view">
    <header class="page-header">
      <h1 class="title">ដេប៉ាដឺម៉ង់</h1>
    </header>

    <div class="dept-grid">
      <div class="dept-card" v-for="dept in departments" :key="dept.code">
        <div class="card-top">
          <span class="dept-tag">{{ dept.code }}</span>
          <div class="action-buttons">
            <button class="icon-btn edit-btn" title="Edit">
              <span class="icon">✏️</span>
            </button>
            <button class="icon-btn delete-btn" title="Delete">
              <span class="icon">🗑️</span>
            </button>
          </div>
        </div>

        <div class="dept-info">
          <h2 class="dept-name">{{ dept.name }}</h2>
          <p class="dept-head">{{ dept.head }}</p>

          <div class="meta-info">
            <div class="info-item">
              <span class="icon">🏢</span>
              <span>{{ dept.building }}</span>
            </div>
            <div class="info-item">
              <span class="icon">📞</span>
              <span>{{ dept.phone }}</span>
            </div>
          </div>
        </div>

        <div class="dept-stats">
          <div class="stat-item">
            <span class="stat-icon students">👥</span>
            <span class="stat-value">{{ dept.studentCount }}</span>
            <span class="stat-label">សិស្សានុសិស្ស</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon staff">🧑‍🏫</span>
            <span class="stat-value">{{ dept.staffCount }}</span>
            <span class="stat-label">បុគ្គលិក</span>
          </div>
          <div class="stat-item">
            <span class="stat-icon classes">📖</span>
            <span class="stat-value">{{ dept.classCount }}</span>
            <span class="stat-label">ថ្នាក់រៀន</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Dummy data matching the visual provided in your image
const departments = ref([
  {
    code: 'CS',
    name: 'វិទ្យាសាស្ត្រកុំព្យូទ័រ',
    head: 'លោក​ វត្រ័',
    building: 'អគារ A',
    phone: '555-2001',
    studentCount: 347,
    staffCount: 12,
    classCount: 24
  },
  {
    code: 'ENG',
    name: 'ភាសាអង់គ្លេស',
    head: 'លោកស្រី វង្ស',
    building: 'អគារ B',
    phone: '555-2002',
    studentCount: 289,
    staffCount: 8,
    classCount: 18
  },
  {
    code: 'MATH',
    name: 'គណិតវិទ្យា',
    head: 'លោក ជិន',
    building: 'អគារ C',
    phone: '555-2003',
    studentCount: 421,
    staffCount: 15,
    classCount: 32
  },
  {
    code: 'PHYS',
    name: 'រូបវិទ្យា',
    head: 'លោក សុភា',
    building: 'អគារ D',
    phone: '555-2004',
    studentCount: 234,
    staffCount: 9,
    classCount: 16
  }
]);
</script>

<style scoped>
.department-view {
  width: 100%;
}

.title {
  color: #5d5fef;
  font-size: 2rem;
  margin-bottom: 30px;
}

.dept-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 25px;
}

.dept-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #edf2f7;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.dept-tag {
  background: #f7fafc;
  color: #4a5568;
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #e2e8f0;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.edit-btn:hover { background-color: #ebf8ff; border-color: #bee3f8; }
.delete-btn:hover { background-color: #fff5f5; border-color: #fed7d7; }

.dept-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0 0 4px 0;
}

.dept-head {
  color: #718096;
  font-size: 0.95rem;
  margin-bottom: 20px;
}

.meta-info {
  margin-bottom: 25px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #a0aec0;
  font-size: 0.85rem;
  margin-bottom: 8px;
}

.dept-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid #edf2f7;
  padding-top: 20px;
  text-align: center;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-icon {
  font-size: 1.2rem;
  margin-bottom: 5px;
}

.stat-value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #2d3748;
}

.stat-label {
  font-size: 0.7rem;
  color: #a0aec0;
  text-transform: uppercase;
}

/* Icon specific colors for stats */
.students { color: #5d5fef; }
.staff { color: #48bb78; }
.classes { color: #9f7aea; }
</style>
