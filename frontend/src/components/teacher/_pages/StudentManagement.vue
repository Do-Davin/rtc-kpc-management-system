<template>
  <div class="student-management-wrapper">
    <!-- Header -->
    <header class="page-header">
      <div class="header-content">
        <h1>គ្រប់គ្រងសិស្ស</h1>
        <p class="subtitle">គ្រប់គ្រងសិស្សតាមវគ្គសិក្សា / ថ្នាក់រៀន</p>
      </div>
      <PrimaryButton
        label="បន្ថែមសិស្ស"
        @click="openAddModal"
      >
        <template #icon>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <line x1="19" y1="8" x2="19" y2="14"/>
            <line x1="22" y1="11" x2="16" y2="11"/>
          </svg>
        </template>
      </PrimaryButton>
    </header>

    <!-- Summary Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="10"/>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">សិស្សឈប់សិក្សា</span>
          <span class="stat-value">{{ inactiveStudents }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon attendance">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="18" y1="20" x2="18" y2="10"/>
            <line x1="12" y1="20" x2="12" y2="4"/>
            <line x1="6" y1="20" x2="6" y2="14"/>
          </svg>
        </div>
        <div class="stat-info">
          <span class="stat-label">មធ្យមភាគវត្តមាន</span>
          <span class="stat-value">{{ averageAttendance }}%</span>
        </div>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="filters-section">
      <div class="search-box">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
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

    <!-- Student Table -->
    <div class="table-card">
      <div class="table-container">
        <table class="student-table">
          <thead>
            <tr>
              <th>លេខសម្គាល់</th>
              <th>ឈ្មោះពេញ</th>
              <th>ថ្ងៃខែឆ្នាំកំណើត</th>
              <th>អ៊ីមែល</th>
              <th>វត្តមាន</th>
              <th>ស្ថានភាព</th>
              <th>សកម្មភាព</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id">
              <td class="student-id">{{ student.studentId }}</td>
              <td>
                <div class="student-name">
                  <div class="avatar">{{ getInitials(student.fullName) }}</div>
                  <span>{{ student.fullName }}</span>
                </div>
              </td>
              <td>{{ formatDate(student.dateOfBirth) }}</td>
              <td class="email">{{ student.email }}</td>
              <td>
                <div class="attendance-cell">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: student.attendance + '%' }"
                      :class="getAttendanceClass(student.attendance)"
                    ></div>
                  </div>
                  <span class="attendance-value">{{ student.attendance }}%</span>
                </div>
              </td>
              <td>
                <span :class="['status-badge', student.status.toLowerCase()]">
                  {{ student.status }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="action-btn edit" @click="openEditModal(student)" title="កែប្រែសិស្ស">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button class="action-btn delete" @click="confirmDelete(student)" title="លុបសិស្ស">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M3 6h18"/>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredStudents.length === 0" class="empty-state">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <line x1="17" y1="11" x2="22" y2="11"/>
        </svg>
        <h3>រកមិនឃើញសិស្សទេ</h3>
        <p>សូមព្យាយាមកែប្រែការស្វែងរក ឬលក្ខណៈវិនិច្ឆ័យតម្រង</p>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="filteredStudents.length > 0">
        <span class="pagination-info">
          បង្ហាញ {{ paginationStart }} ដល់ {{ paginationEnd }} ក្នុងចំណោម {{ filteredStudents.length }} សិស្ស
        </span>
        <div class="pagination-controls">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
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
          <button
            class="page-btn"
            :disabled="currentPage === totalPages"
            @click="currentPage++"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <h2>{{ isEditing ? 'កែប្រែសិស្ស' : 'បន្ថែមសិស្សថ្មី' }}</h2>
            <button class="close-btn" @click="closeModal">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="saveStudent" class="modal-form">
            <div class="form-row">
              <div class="form-group">
                <label for="studentId">លេខសម្គាល់សិស្ស</label>
                <input
                  type="text"
                  id="studentId"
                  v-model="formData.studentId"
                  placeholder="ឧ. STU001"
                  required
                />
              </div>
              <div class="form-group">
                <label for="fullName">ឈ្មោះពេញ</label>
                <input
                  type="text"
                  id="fullName"
                  v-model="formData.fullName"
                  placeholder="បញ្ចូលឈ្មោះពេញ"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="dob">ថ្ងៃខែឆ្នាំកំណើត</label>
                <input
                  type="date"
                  id="dob"
                  v-model="formData.dateOfBirth"
                  required
                />
              </div>
              <div class="form-group">
                <label for="email">អ៊ីមែល</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  placeholder="student@email.com"
                  required
                />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label for="attendance">វត្តមាន (%)</label>
                <input
                  type="number"
                  id="attendance"
                  v-model="formData.attendance"
                  min="0"
                  max="100"
                  placeholder="0-100"
                />
              </div>
              <div class="form-group">
                <label for="status">ស្ថានភាព</label>
                <select id="status" v-model="formData.status">
                  <option value="Active">កំពុងសិក្សា</option>
                  <option value="Inactive">ឈប់សិក្សា</option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn btn-secondary" @click="closeModal">បោះបង់</button>
              <button type="submit" class="btn btn-primary">
                {{ isEditing ? 'រក្សាទុកការកែប្រែ' : 'បន្ថែមសិស្ស' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>

    <Teleport to="body">
      <div v-if="showDeleteModal" class="modal-overlay" @click.self="closeDeleteModal">
        <div class="modal delete-modal">
          <div class="delete-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <circle cx="12" cy="12" r="10"/>
              <line x1="15" y1="9" x2="9" y2="15"/>
              <line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
          </div>
          <h2>លុបសិស្ស</h2>
          <p>តើអ្នកប្រាកដថាចង់លុប <strong>{{ studentToDelete?.fullName }}</strong>? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។</p>
          <div class="modal-actions">
            <button class="btn btn-secondary" @click="closeDeleteModal">បោះបង់</button>
            <button class="btn btn-danger" @click="deleteStudent">លុបសិស្ស</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import PrimaryButton from '../_components/PrimaryButton.vue'

const students = ref([
  { id: 1, studentId: 'STU001', fullName: 'cristiano ronaldo', dateOfBirth: '2005-03-15', email: 'ronaldo@gmail.com', attendance: 100, status: 'Active' },
  { id: 2, studentId: 'STU002', fullName: 'Leo Messi', dateOfBirth: '2005-07-22', email: 'messi@gmail.com', attendance: 0, status: 'Inactive' },
  { id: 3, studentId: 'STU003', fullName: 'Neymar JR', dateOfBirth: '2005-11-08', email: 'neymar@gmail.com', attendance: 100, status: 'Active' },
  { id: 4, studentId: 'STU004', fullName: 'Jing Jork', dateOfBirth: '2004-01-30', email: 'jingjork@gmail.com', attendance: 50, status: 'Active' },
  { id: 5, studentId: 'STU005', fullName: 'Huoth Sitha', dateOfBirth: '2005-09-12', email: 'sitha@gmail.com', attendance: 50, status: 'Active' },
  { id: 6, studentId: 'STU006', fullName: 'Sam Sokleap', dateOfBirth: '2004-05-25', email: 'daneth@gmail.com', attendance: 50, status: 'Active' },
  { id: 7, studentId: 'STU007', fullName: 'Vathvath', dateOfBirth: '2005-12-03', email: 'vathvath@gmail.com', attendance: 0, status: 'Inactive' },
  { id: 8, studentId: 'STU008', fullName: 'Teytey', dateOfBirth: '2004-08-19', email: 'teytey@gmail.com', attendance: 80, status: 'Active' },
  { id: 9, studentId: 'STU009', fullName: 'Vannda', dateOfBirth: '2005-02-14', email: 'vannda@gmail.com', attendance: 100, status: 'Active' },
  { id: 10, studentId: 'STU010', fullName: 'Sokha Meas', dateOfBirth: '2004-06-28', email: 'sokha@gmail.com', attendance: 75, status: 'Active' },
  { id: 11, studentId: 'STU011', fullName: 'Bopha Chan', dateOfBirth: '2005-04-10', email: 'bopha@gmail.com', attendance: 90, status: 'Active' },
  { id: 12, studentId: 'STU012', fullName: 'Dara Kim', dateOfBirth: '2004-10-05', email: 'dara@gmail.com', attendance: 25, status: 'Inactive' },
])

const searchQuery = ref('')
const currentFilter = ref('all')
const currentPage = ref(1)
const itemsPerPage = 8
const showModal = ref(false)
const showDeleteModal = ref(false)
const isEditing = ref(false)
const studentToDelete = ref(null)
const editingStudent = ref(null)

const formData = ref({
  studentId: '',
  fullName: '',
  dateOfBirth: '',
  email: '',
  attendance: 0,
  status: 'Active'
})

const statusFilters = [
  { label: 'សិស្សទាំងអស់', value: 'all' },
  { label: 'កំពុងសិក្សា', value: 'active' },
  { label: 'ឈប់សិក្សា', value: 'inactive' }
]

const totalStudents = computed(() => students.value.length)
const activeStudents = computed(() => students.value.filter(s => s.status === 'Active').length)
const inactiveStudents = computed(() => students.value.filter(s => s.status === 'Inactive').length)
const averageAttendance = computed(() => {
  if (students.value.length === 0) return 0
  const total = students.value.reduce((sum, s) => sum + s.attendance, 0)
  return Math.round(total / students.value.length)
})

const filteredStudents = computed(() => {
  let result = students.value

  if (currentFilter.value !== 'all') {
    result = result.filter(s => s.status.toLowerCase() === currentFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(s =>
      s.fullName.toLowerCase().includes(query) ||
      s.email.toLowerCase().includes(query) ||
      s.studentId.toLowerCase().includes(query)
    )
  }

  return result
})

const totalPages = computed(() => Math.ceil(filteredStudents.value.length / itemsPerPage))
const paginationStart = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const paginationEnd = computed(() => Math.min(currentPage.value * itemsPerPage, filteredStudents.value.length))

const getFilterCount = (filter) => {
  if (filter === 'all') return students.value.length
  return students.value.filter(s => s.status.toLowerCase() === filter).length
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' })
}

const getAttendanceClass = (attendance) => {
  if (attendance >= 80) return 'high'
  if (attendance >= 50) return 'medium'
  return 'low'
}

const openAddModal = () => {
  isEditing.value = false
  formData.value = {
    studentId: '',
    fullName: '',
    dateOfBirth: '',
    email: '',
    attendance: 0,
    status: 'Active'
  }
  showModal.value = true
}

const openEditModal = (student) => {
  isEditing.value = true
  editingStudent.value = student
  formData.value = { ...student }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  editingStudent.value = null
}

const saveStudent = () => {
  if (isEditing.value) {
    const index = students.value.findIndex(s => s.id === editingStudent.value.id)
    if (index !== -1) {
      students.value[index] = {
        ...formData.value,
        id: editingStudent.value.id
      }
    }
  } else {
    students.value.push({
      ...formData.value,
      id: Date.now()
    })
  }
  closeModal()
}

const confirmDelete = (student) => {
  studentToDelete.value = student
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  studentToDelete.value = null
}

const deleteStudent = () => {
  students.value = students.value.filter(s => s.id !== studentToDelete.value.id)
  closeDeleteModal()
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

.btn-secondary {
  background: #f1f5f9;
  color: #475569;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-danger {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  color: white;
}

.btn-danger:hover {
  transform: translateY(-1px);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
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

.stat-icon.attendance {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #d97706;
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
}

.email {
  color: #6b7280;
}

.attendance-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-bar {
  width: 80px;
  height: 8px;
  background: #f1f5f9;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-fill.high {
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.progress-fill.medium {
  background: linear-gradient(90deg, #f59e0b 0%, #d97706 100%);
}

.progress-fill.low {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.attendance-value {
  font-weight: 600;
  font-size: 13px;
  color: #374151;
  min-width: 40px;
}

.status-badge {
  display: inline-flex;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
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

.action-btn.edit {
  background: #eef2ff;
  color: var(--purple-500);
}

.action-btn.edit:hover {
  background: var(--purple-500);
  color: white;
}

.action-btn.delete {
  background: #fef2f2;
  color: #ef4444;
}

.action-btn.delete:hover {
  background: #ef4444;
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

.modal-form {
  padding: 28px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 13px;
  font-weight: 600;
  color: #374151;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  color: #374151;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--purple-400);
  box-shadow: 0 0 0 3px rgba(91, 85, 243, 0.1);
}

.form-group input::placeholder {
  color: #9ca3af;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid #f1f5f9;
}

.delete-modal {
  max-width: 400px;
  text-align: center;
  padding: 40px 32px;
}

.delete-icon {
  width: 80px;
  height: 80px;
  background: #fef2f2;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  color: #ef4444;
}

.delete-modal h2 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 12px;
}

.delete-modal p {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 28px;
  line-height: 1.6;
}

.delete-modal .modal-actions {
  justify-content: center;
  border-top: none;
  padding-top: 0;
  margin-top: 0;
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

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
