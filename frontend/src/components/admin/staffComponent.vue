<script setup>
import { ref, computed, onMounted } from 'vue'
import adminService from '@/services/admin.service'
import { Plus, Search, Check, Edit2, Trash2, Briefcase } from 'lucide-vue-next'

const teachers = ref([])
const departments = ref([])
const showModal = ref(false)
const showSuccessModal = ref(false)
const searchQuery = ref('')
const filterDept = ref('')
const loading = ref(false)
const submitting = ref(false)
const isEditing = ref(false)
const editId = ref(null)

const form = ref({
  fullName: '',
  email: '',
  specialization: '',
  departmentId: '',
  status: 'Active',
  password: '',
})
const createdAccount = ref({ email: '', password: '' })

const loadData = async () => {
  loading.value = true
  try {
    const [teaRes, deptRes] = await Promise.all([
      adminService.getTeachers(),
      adminService.getDepartments(),
    ])
    teachers.value = teaRes.data
    departments.value = deptRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredTeachers = computed(() => {
  let result = teachers.value
  if (filterDept.value) result = result.filter((t) => t.department?.id === filterDept.value)
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase()
    result = result.filter(
      (t) =>
        t.user?.email.toLowerCase().includes(lower) ||
        t.specialization.toLowerCase().includes(lower) ||
        t.fullName.toLowerCase().includes(lower),
    )
  }
  return result
})

const formatDate = (dateString) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

const openCreate = () => {
  isEditing.value = false
  form.value = {
    fullName: '',
    email: '',
    specialization: '',
    departmentId: '',
    status: 'Active',
    password: '',
  }
  showModal.value = true
}

const openEdit = (tea) => {
  isEditing.value = true
  editId.value = tea.id
  form.value = {
    fullName: tea.fullName,
    email: tea.user?.email,
    specialization: tea.specialization,
    departmentId: tea.department?.id || '',
    status: tea.status || 'Active',
    password: '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await adminService.updateTeacher(editId.value, {
        fullName: form.value.fullName,
        specialization: form.value.specialization,
        departmentId: form.value.departmentId,
        status: form.value.status,
      })
      showModal.value = false
    } else {
      await adminService.createTeacher(form.value)
      createdAccount.value = {
        email: form.value.email,
        password: form.value.password || 'RTC@2026',
      }
      showModal.value = false
      showSuccessModal.value = true
    }
    await loadData()
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving teacher')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure? This deletes the User Account as well.')) return
  try {
    await adminService.deleteTeacher(id)
    await loadData()
  } catch (err) {
    alert('Failed to delete')
  }
}

onMounted(loadData)
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">Staff & Teachers</h2>
        <p class="page-subtitle">Manage faculty members</p>
      </div>
      <div class="header-actions">
        <span class="badge">{{ teachers.length }} Total</span>
        <button @click="openCreate" class="btn-primary purple">
          <Plus size="18" /> Add Teacher
        </button>
      </div>
    </div>

    <div class="controls-bar flex-row">
      <div class="search-box">
        <Search size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Search name or email..." />
      </div>
      <div class="filter-box">
        <select v-model="filterDept">
          <option value="">All Departments</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loading-state">Loading staff...</div>
      <table v-else-if="filteredTeachers.length > 0" class="custom-table">
        <thead>
          <tr>
            <th>Staff Info</th>
            <th>Specialization</th>
            <th>Department</th>
            <th>Joined</th>
            <th>Status</th>
            <th class="actions-col">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="tea in filteredTeachers" :key="tea.id">
            <td>
              <div class="user-cell">
                <div class="icon-box purple"><Briefcase size="16" /></div>
                <div class="user-info">
                  <span class="name">{{ tea.fullName }}</span>
                  <span class="email">{{ tea.user?.email }}</span>
                </div>
              </div>
            </td>
            <td>{{ tea.specialization }}</td>
            <td>
              <span v-if="tea.department" class="dept-badge purple">{{ tea.department.name }}</span>
            </td>
            <td class="text-sm text-gray-600">{{ formatDate(tea.user?.createdAt) }}</td>
            <td>
              <span :class="['status-badge', tea.status === 'Active' ? 'active' : 'inactive']">
                {{ tea.status || 'Active' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button @click="openEdit(tea)" class="btn-icon edit"><Edit2 size="18" /></button>
                <button @click="handleDelete(tea.id)" class="btn-icon delete">
                  <Trash2 size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">No teachers found.</div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Teacher' : 'Add New Teacher' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.fullName" type="text" required />
          </div>
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="form.email" type="email" :disabled="isEditing" required />
          </div>
          <div class="form-group">
            <label>Specialization</label>
            <input v-model="form.specialization" type="text" required />
          </div>
          <div class="form-group">
            <label>Department</label>
            <select v-model="form.departmentId" required>
              <option value="" disabled>Select Department</option>
              <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
            </select>
          </div>

          <div class="form-group" v-if="!isEditing">
            <label>Default Password (RTC@2026)</label>
            <input v-model="form.password" type="password" placeholder="Default: RTC@2026" />
          </div>

          <div class="form-group">
            <label>Status</label>
            <select v-model="form.status">
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-text">Cancel</button>
            <button type="submit" :disabled="submitting" class="btn-primary purple">
              {{ submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Account' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-content">
        <div class="success-icon purple"><Check size="32" /></div>
        <h3>Teacher Added!</h3>
        <div class="credential-box">
          <div class="cred-row">
            <span class="label">Email:</span><span class="value">{{ createdAccount.email }}</span>
          </div>
          <div class="cred-row">
            <span class="label">Password:</span
            ><span class="value font-mono font-bold text-purple-600">{{
              createdAccount.password
            }}</span>
          </div>
        </div>
        <button @click="showSuccessModal = false" class="btn-primary purple w-full mt-4">
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Common Styles */
.page-container {
  padding: 2rem;
  max-width: 1200px;
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
.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.badge {
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}
.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}
.btn-primary.purple {
  background: #9333ea;
}
.btn-primary.purple:hover {
  background: #7e22ce;
}
.controls-bar {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
}
.search-box,
.filter-box {
  position: relative;
}
.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}
.search-box input,
.filter-box select {
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  min-width: 200px;
  background: white;
}
.table-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}
.custom-table {
  width: 100%;
  border-collapse: collapse;
}
.custom-table th {
  background: #f8fafc;
  text-align: left;
  padding: 1rem;
  font-weight: 600;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}
.custom-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
  vertical-align: middle;
}
.user-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.icon-box {
  width: 32px;
  height: 32px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.icon-box.purple {
  background: #faf5ff;
  color: #9333ea;
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
.dept-badge {
  background: #eff6ff;
  color: #1d4ed8;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 600;
}
.dept-badge.purple {
  background: #faf5ff;
  color: #9333ea;
}
.status-badge {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.8rem;
  font-weight: 600;
}
.status-badge.active {
  background: #dcfce7;
  color: #15803d;
}
.status-badge.inactive {
  background: #f1f5f9;
  color: #64748b;
}

/* NEW ACTIONS STYLING */
.actions-col {
  text-align: center;
  width: 100px;
}
.actions-cell {
  text-align: center;
}
.action-buttons {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}
.btn-icon.edit {
  color: #2563eb;
  background: none;
  border: none;
  cursor: pointer;
}
.btn-icon.delete {
  color: #ef4444;
  background: none;
  border: none;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}
.form-group input,
.form-group select {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
.btn-text {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
}
.loading-state,
.empty-state {
  padding: 3rem;
  text-align: center;
  color: #94a3b8;
}
.success-content {
  text-align: center;
}
.success-icon {
  width: 64px;
  height: 64px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}
.success-icon.purple {
  background: #faf5ff;
  color: #9333ea;
}
.credential-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
}
.cred-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}
.label {
  color: #64748b;
  font-size: 0.9rem;
}
.value {
  color: #1e293b;
  font-weight: 500;
}
.w-full {
  width: 100%;
}
</style>
