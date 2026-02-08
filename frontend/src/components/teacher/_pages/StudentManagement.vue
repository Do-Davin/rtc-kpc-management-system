<template>
  <div class="student-management-wrapper">
    <header class="page-header">
      <div class="header-content">
        <h1>គ្រប់គ្រងសិស្ស</h1>
        <p class="subtitle">មើលព័ត៌មានសិស្សទាំងអស់</p>
      </div>
      <span class="badge">{{ students.length }} សរុប</span>
    </header>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">សិស្សសរុប</span>
          <span class="stat-value">{{ totalStudents }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon active">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">សិស្សកំពុងសិក្សា</span>
          <span class="stat-value">{{ activeStudents }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon inactive">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">សិស្សឈប់សិក្សា</span>
          <span class="stat-value">{{ inactiveStudents }}</span>
        </div>
      </div>
    </div>

    <div class="filters-section">
      <div class="search-box">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <input
          type="text"
          v-model="searchQuery"
          placeholder="ស្វែងរកតាមឈ្មោះ ឬអ៊ីមែល..."
          class="search-input"
        />
      </div>
      <div class="filter-tabs">
        <button
          v-for="filter in statusFilters"
          :key="filter.value"
          :class="['filter-btn', { active: currentFilter === filter.value }]"
          @click="currentFilter = filter.value"
        >
          {{ filter.label }}
          <span class="filter-count">{{ getFilterCount(filter.value) }}</span>
        </button>
      </div>
    </div>

    <div class="table-card">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>កំពុងផ្ទុកទិន្នន័យ...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchStudents">ព្យាយាមម្តងទៀត</button>
      </div>

      <div v-else class="table-container">
        <table class="student-table">
          <thead>
            <tr>
              <th>លេខកូដសិស្ស</th>
              <th>ប្រវត្តិរូបសិស្ស</th>
              <th>ឆ្នាំសិក្សា</th>
              <th>ដេប៉ាដឺម៉ង់</th>
              <th>ស្ថានភាព</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in paginatedStudents" :key="student.id">
              <td class="student-id">{{ student.studentIdCard }}</td>
              <td>
                <div class="student-name">
                  <div class="avatar">{{ getInitials(student.fullName) }}</div>
                  <div class="user-info">
                    <span class="name">{{ student.fullName }}</span>
                    <span class="email">{{ student.user?.email }}</span>
                    <span v-if="student.phoneNumber" class="phone">{{ student.phoneNumber }}</span>
                  </div>
                </div>
              </td>
              <td>ឆ្នាំទី {{ student.year || 'N/A' }}</td>
              <td>
                <span v-if="student.department" class="dept-badge">{{ student.department.code }}</span>
                <span v-else>-</span>
              </td>
              <td>
                <span :class="['status-badge', student.status === 'ACTIVE' ? 'active' : 'inactive']">
                  {{ student.status === 'ACTIVE' ? 'សកម្ម' : 'អសកម្ម' }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn view" @click="viewStudentDetails(student)" title="មើលព័ត៌មានលម្អិត">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="!isLoading && !error && filteredStudents.length === 0" class="empty-state">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="17" y1="11" x2="22" y2="11"/>
        </svg>
        <h3>រកមិនឃើញសិស្សទេ</h3>
        <p>សូមព្យាយាមកែប្រែការស្វែងរក ឬលក្ខណៈវិនិច្ឆ័យតម្រង</p>
      </div>

      <div class="pagination" v-if="filteredStudents.length > 0">
        <span class="pagination-info">
          បង្ហាញ {{ paginationStart }} ដល់ {{ paginationEnd }} ក្នុងចំណោម {{ filteredStudents.length }} សិស្ស
        </span>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="15 18 9 12 15 6"/>
            </svg>
          </button>
          <button
            v-for="page in totalPages"
            :key="page"
            :class="['page-btn', { active: currentPage === page }]"
            @click="currentPage = page"
          >
            {{ page }}
          </button>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="showDetailsModal" class="modal-overlay" @click.self="closeDetailsModal">
        <div class="modal details-modal">
          <div class="modal-header">
            <h2>ព័ត៌មានលម្អិតសិស្ស</h2>
            <button class="close-btn" @click="closeDetailsModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          <div class="details-content" v-if="selectedStudent">
            <div class="student-profile-header">
              <div class="large-avatar">{{ getInitials(selectedStudent.fullName) }}</div>
              <div class="student-header-info">
                <h3>{{ selectedStudent.fullName }}</h3>
                <span class="student-id-badge">{{ selectedStudent.studentIdCard }}</span>
              </div>
              <span :class="['status-badge', selectedStudent.status === 'ACTIVE' ? 'active' : 'inactive']">
                {{ selectedStudent.status === 'ACTIVE' ? 'សកម្ម' : 'អសកម្ម' }}
              </span>
            </div>

            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-icon class-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div class="detail-info">
                  <span class="detail-label">ឆ្នាំសិក្សា</span>
                  <span class="detail-value">ឆ្នាំទី {{ selectedStudent.year || 'N/A' }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon email-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <div class="detail-info">
                  <span class="detail-label">អ៊ីមែល</span>
                  <span class="detail-value">{{ selectedStudent.user?.email || 'N/A' }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon dob-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <div class="detail-info">
                  <span class="detail-label">លេខទូរស័ព្ទ</span>
                  <span class="detail-value">{{ selectedStudent.phoneNumber || 'N/A' }}</span>
                </div>
              </div>

              <div class="detail-item">
                <div class="detail-icon status-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <div class="detail-info">
                  <span class="detail-label">ដេប៉ាដឺម៉ង់</span>
                  <span class="detail-value">{{ selectedStudent.department?.name || 'N/A' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import adminService from '@/services/admin.service'

const students = ref([])
const isLoading = ref(false)
const error = ref(null)

const searchQuery = ref('')
const currentFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 8
const showDetailsModal = ref(false)
const selectedStudent = ref(null)

const statusFilters = [
  { label: 'សិស្សទាំងអស់', value: 'all' },
  { label: 'កំពុងសិក្សា', value: 'active' },
  { label: 'ឈប់សិក្សា', value: 'inactive' }
]

const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'ACTIVE').length)
const inactiveStudents = computed(() => students.value.filter(s => s.status !== 'ACTIVE').length)

const filteredStudents = computed(() => {
  let result = students.value

  if (currentFilter.value === 'active') {
    result = result.filter(s => s.status === 'ACTIVE')
  } else if (currentFilter.value === 'inactive') {
    result = result.filter(s => s.status !== 'ACTIVE')
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.fullName?.toLowerCase().includes(query) ||
      s.user?.email?.toLowerCase().includes(query) ||
      s.studentIdCard?.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredStudents.value.length / itemsPerPage)))
const paginationStart = computed(() => filteredStudents.value.length === 0 ? 0 : (currentPage.value - 1) * itemsPerPage + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredStudents.value.length))

const paginatedStudents = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return filteredStudents.value.slice(start, start + itemsPerPage)
})

watch([currentFilter, searchQuery], () => {
  currentPage.value = 1
})

const fetchStudents = async () => {
  isLoading.value = true
  error.value = null

  try {
    const response = await adminService.getStudents()
    students.value = response.data || []
  } catch (err) {
    console.error('Error fetching students:', err)
    error.value = err.response?.data?.message || 'បរាជ័យក្នុងការផ្ទុកទិន្នន័យសិស្ស'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchStudents()
})

const getFilterCount = (filter) => {
  if (filter === 'all') return totalStudents.value
  if (filter === 'active') return activeStudents.value
  return inactiveStudents.value
}

const getInitials = (name) => {
  if (!name) return '??'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const viewStudentDetails = (student) => {
  selectedStudent.value = student
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedStudent.value = null
}
</script>

<style scoped>
.student-management-wrapper {
  width: 100%;
  background: #f8f9fc;
  min-height: 100vh;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: var(--purple-500);
  margin-bottom: 4px;
}

.subtitle {
  color: #6b7280;
  font-size: 14px;
  margin: 0;
}

.badge {
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
  height: fit-content;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: linear-gradient(135deg, var(--purple-500) 0%, var(--purple-600) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(91, 85, 243, 0.3);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(91, 85, 243, 0.4);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.stat-card {
  background: white;
  padding: 20px 24px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.stat-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%);
  color: var(--purple-500);
}

.stat-icon.active {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
  color: #059669;
}

.stat-icon.inactive {
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  color: #dc2626;
}

.stat-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  gap: 20px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  width: 320px;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.search-box:focus-within {
  border-color: var(--purple-400);
  box-shadow: 0 0 0 3px rgba(91, 85, 243, 0.1);
}

.search-box svg {
  color: #9ca3af;
  flex-shrink: 0;
}

.search-input {
  border: none;
  outline: none;
  width: 100%;
  font-size: 14px;
  color: #374151;
  background: transparent;
}

.search-input::placeholder {
  color: #9ca3af;
}

.filter-tabs {
  display: flex;
  gap: 8px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-btn:hover {
  border-color: var(--purple-300);
  color: var(--purple-600);
}

.filter-btn.active {
  background: var(--purple-500);
  border-color: var(--purple-500);
  color: white;
}

.filter-btn.active .filter-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.filter-count {
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.table-card {
  background: white;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid #f1f5f9;
  overflow: hidden;
}

.table-container {
  overflow-x: auto;
}

.student-table {
  width: 100%;
  border-collapse: collapse;
}

.student-table th {
  text-align: left;
  padding: 16px 20px;
  background: #fafbfc;
  font-weight: 600;
  font-size: 13px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 1px solid #f1f5f9;
}

.student-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f8f9fc;
  font-size: 14px;
  color: #374151;
}

.student-table tbody tr {
  transition: background 0.15s ease;
}

.student-table tbody tr:hover {
  background: #fafbfc;
}

.student-table tbody tr:last-child td {
  border-bottom: none;
}

.student-id {
  font-family: 'SF Mono', Monaco, 'Consolas', monospace;
  font-weight: 600;
  color: var(--purple-600);
}

.student-name {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, var(--purple-100) 0%, var(--purple-200) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: var(--purple-600);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-info .name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.user-info .email {
  font-size: 0.85rem;
  color: #64748b;
}

.user-info .phone {
  font-size: 0.8rem;
  color: #94a3b8;
}

.dept-badge {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status-badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.status-badge.active {
  background: #ecfdf5;
  color: #059669;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.view {
  background: #f0fdf4;
  color: #16a34a;
}

.action-btn.view:hover {
  background: #16a34a;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #9ca3af;
}

.empty-state svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 18px;
  color: #374151;
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 14px;
  margin: 0;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid #f1f5f9;
}

.pagination-info {
  font-size: 13px;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 6px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid #e5e7eb;
  background: white;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  border-color: var(--purple-300);
  color: var(--purple-600);
}

.page-btn.active {
  background: var(--purple-500);
  border-color: var(--purple-500);
  color: white;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: white;
  border-radius: 20px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-header h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.close-btn {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: none;
  background: #f3f4f6;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.details-modal {
  max-width: 680px;
}

.details-content {
  padding: 24px 28px;
}

.student-profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 24px;
}

.large-avatar {
  width: 72px;
  height: 72px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--purple-400) 0%, var(--purple-600) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 700;
  color: white;
  box-shadow: 0 8px 24px rgba(91, 85, 243, 0.3);
  flex-shrink: 0;
}

.student-header-info {
  flex: 1;
}

.student-header-info h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 6px 0;
  text-transform: capitalize;
}

.student-id-badge {
  font-family: 'SF Mono', Monaco, 'Consolas', monospace;
  font-size: 13px;
  font-weight: 600;
  color: var(--purple-600);
  background: #eef2ff;
  padding: 4px 10px;
  border-radius: 6px;
}

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: #fafbfc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
}

.detail-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.detail-icon.class-icon {
  background: #eef2ff;
  color: var(--purple-500);
}

.detail-icon.email-icon {
  background: #fef3c7;
  color: #d97706;
}

.detail-icon.dob-icon {
  background: #f0fdf4;
  color: #16a34a;
}

.detail-icon.status-icon {
  background: #ecfdf5;
  color: #059669;
}

.detail-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.detail-label {
  font-size: 11px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-state .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: var(--purple-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p,
.error-state p {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 16px;
}

.error-state {
  color: #ef4444;
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .student-management-wrapper {
    padding: 16px;
  }

  .page-header {
    flex-direction: column;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    width: 100%;
  }

  .filter-tabs {
    overflow-x: auto;
    padding-bottom: 4px;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
