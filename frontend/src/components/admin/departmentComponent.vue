<template>
  <div class="department-management">
    <header class="page-header">
      <h1 class="title">ដេប៉ាដឺម៉ង់</h1>
    </header>

    <div class="department-grid">
      <div class="department-card" v-for="dept in departments" :key="dept.id">
        <div class="card-header">
          <div class="dept-code">{{ dept.code }}</div>
          <div class="card-actions-top">
            <button class="icon-btn edit" @click="editDepartment(dept.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="icon-btn delete" @click="deleteDepartment(dept.id)">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="card-body">
          <h3 class="dept-name">{{ dept.name }}</h3>
          <p class="dept-head">{{ dept.head }}</p>

          <div class="dept-info">
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>{{ dept.building }}</span>
            </div>
            <div class="info-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{{ dept.phone }}</span>
            </div>
          </div>
        </div>

        <div class="stats-row">
          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5d5fef" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div>
              <div class="stat-value">{{ dept.students }}</div>
              <div class="stat-label">Students</div>
            </div>
          </div>

          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <div>
              <div class="stat-value">{{ dept.staff }}</div>
              <div class="stat-label">Staff</div>
            </div>
          </div>

          <div class="stat-item">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" stroke-width="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            <div>
              <div class="stat-value">{{ dept.classes }}</div>
              <div class="stat-label">Classes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const departments = ref([
  {
    id: 1,
    code: 'CS',
    name: 'Computer Science',
    head: 'Dr. Alice Johnson',
    building: 'Engineering Building A',
    phone: '555-2001',
    students: 347,
    staff: 12,
    classes: 23
  },
  {
    id: 2,
    code: 'ENG',
    name: 'English Literature',
    head: 'Prof. Robert Smith',
    building: 'Liberal Arts Building',
    phone: '555-2002',
    students: 289,
    staff: 8,
    classes: 18
  },
  {
    id: 3,
    code: 'MATH',
    name: 'Mathematics',
    head: 'Dr. Sarah Wilson',
    building: 'Science Building B',
    phone: '555-2003',
    students: 421,
    staff: 15,
    classes: 32
  },
  {
    id: 4,
    code: 'PHYS',
    name: 'Physics',
    head: 'Prof. Michael Brown',
    building: 'Science Building A',
    phone: '555-2004',
    students: 234,
    staff: 9,
    classes: 16
  }
]);

const editDepartment = (id) => {
  console.log('Edit department:', id);
  // Implement edit functionality
};

const deleteDepartment = (id) => {
  console.log('Delete department:', id);
  // Implement delete functionality
};
</script>

<style scoped>
.department-management {
  padding: 10px;
  font-family: 'Noto Sans Khmer', Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.page-header {
  margin-bottom: 30px;
}

.title {
  color: #5d5fef;
  font-size: 2rem;
  margin-bottom: 5px;
  font-weight: 600;
}

/* Department Cards Grid */
.department-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-top: 20px;
}

.department-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  border: 1px solid #edf2f7;
  transition: all 0.3s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.department-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 20px rgba(93, 95, 239, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.dept-code {
  background: #f0f0ff;
  color: #5d5fef;
  padding: 6px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.card-actions-top {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn.edit {
  color: #6b7280;
}

.icon-btn.edit:hover {
  background: #f3f4f6;
  color: #5d5fef;
}

.icon-btn.delete {
  color: #6b7280;
}

.icon-btn.delete:hover {
  background: #fef2f2;
  color: #ef4444;
}

.card-body {
  margin-bottom: 20px;
}

.dept-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 6px;
}

.dept-head {
  color: #6b7280;
  font-size: 0.95rem;
  margin-bottom: 16px;
}

.dept-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 0.9rem;
}

.info-item svg {
  flex-shrink: 0;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding-top: 20px;
  border-top: 1px solid #f3f4f6;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.stat-item svg {
  flex-shrink: 0;
}

.stat-value {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: #9ca3af;
  line-height: 1.2;
}

/* Responsive */
@media (max-width: 768px) {
  .department-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>
