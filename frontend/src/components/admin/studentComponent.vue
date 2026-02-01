<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import adminService from '@/services/admin.service'
import { Plus, Search, Check, Edit2, Trash2, GraduationCap } from 'lucide-vue-next'

const students = ref([])
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
  studentIdCard: '',
  year: '',
  enrollmentYear: new Date().getFullYear(),
  phoneNumber: '',
  departmentId: '',
  status: 'សកម្ម',
  password: '',
})
const createdAccount = ref({ email: '', password: '' })

const loadData = async () => {
  loading.value = true
  try {
    const [stuRes, deptRes] = await Promise.all([
      adminService.getStudents(),
      adminService.getDepartments(),
    ])
    students.value = stuRes.data
    departments.value = deptRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredStudents = computed(() => {
  let result = students.value
  if (filterDept.value) result = result.filter((s) => s.department?.id === filterDept.value)
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase()
    result = result.filter(
      (s) =>
        s.studentIdCard.toLowerCase().includes(lower) ||
        s.user?.email.toLowerCase().includes(lower) ||
        s.fullName.toLowerCase().includes(lower),
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
    studentIdCard: '',
    year: '',
    enrollmentYear: new Date().getFullYear(),
    phoneNumber: '',
    departmentId: '',
    status: 'សកម្ម',
    password: 'STU@123',
  }
  showModal.value = true
}

const openEdit = (stu) => {
  isEditing.value = true
  editId.value = stu.id
  form.value = {
    fullName: stu.fullName,
    email: stu.user?.email,
    studentIdCard: stu.studentIdCard,
    year: stu.year,
    enrollmentYear: stu.enrollmentYear,
    phoneNumber: stu.phoneNumber,
    departmentId: stu.department?.id || '',
    status: stu.status || 'សកម្ម',
    password: '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    if (isEditing.value) {
      await adminService.updateStudent(editId.value, {
        fullName: form.value.fullName,
        studentIdCard: form.value.studentIdCard,
        year: parseInt(form.value.year),
        enrollmentYear: parseInt(form.value.enrollmentYear),
        phoneNumber: form.value.phoneNumber,
        departmentId: form.value.departmentId,
        status: form.value.status,
      })
      showModal.value = false
    } else {

      const payload = {
        ...form.value,
        year: parseInt(form.value.year),
        enrollmentYear: parseInt(form.value.enrollmentYear)
      }
      await adminService.createStudent(payload)
      createdAccount.value = {
        email: form.value.email,
        password: form.value.password || 'STU@123',
      }
      showModal.value = false
      showSuccessModal.value = true
    }
    await loadData()
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving student')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure? This deletes the User Account as well.')) return
  try {
    await adminService.deleteStudent(id)
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
        <h2 class="page-title">សិស្សានុសិស្ស</h2>
        <p class="page-subtitle">គ្រប់គ្រងគណនីសិស្ស</p>
      </div>
      <div class="header-actions">
        <span class="badge">{{ students.length }} សរុប</span>
        <button @click="openCreate" class="btn-primary green">
          <Plus size="18" /> បង្កើតសិស្សថ្មី
        </button>
      </div>
    </div>

    <div class="controls-bar flex-row">
      <div class="search-box">
        <Search size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកដោយ: ឈ្មោះ, ID, អ៊ីមែល..." />
      </div>
      <div class="filter-box">
        <select v-model="filterDept">
          <option value="">ដេប៉ាដឺម៉ង់</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <div v-if="loading" class="loading-state">Loading students...</div>
      <table v-else-if="filteredStudents.length > 0" class="custom-table">
        <thead>
          <tr>
            <th>ប្រវត្តិរូបសិស្ស</th>
            <th>លេខកូដសិស្ស (ID)</th>
            <th>ឆ្នាំសិក្សា</th>
            <th>ដេប៉ាដឺម៉ង់</th>
            <th>ស្ថានភាព</th>
            <th class="actions-col">សកម្មភាពផ្លាស់ប្ដូរ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="stu in filteredStudents" :key="stu.id">
            <td>
              <div class="user-cell">
                <div class="icon-box green">
                  <GraduationCap size="16" />
                </div>
                <div class="user-info">
                  <span class="name">{{ stu.fullName }}</span>
                  <span class="email">{{ stu.user?.email }}</span>
                  <span v-if="stu.phoneNumber" class="text-xs text-gray-500">{{ stu.phoneNumber }}</span>
                </div>
              </div>
            </td>
            <td>
              <span class="font-mono">{{ stu.studentIdCard }}</span>
            </td>
            <td>
              <span>ឆ្នាំទី {{ stu.year }}</span>
            </td>
            <td>
              <span v-if="stu.department" class="dept-badge blue">{{ stu.department.code }}</span>
            </td>
            <td>
              <span :class="['status-badge', stu.status === 'ACTIVE' ? 'active' : 'inactive']">
                {{ stu.status === 'ACTIVE' ? 'សកម្ម' : 'អសកម្ម' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button @click="openEdit(stu)" class="btn-icon edit">
                  <Edit2 size="18" />
                </button>
                <button @click="handleDelete(stu.id)" class="btn-icon delete">
                  <Trash2 size="18" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="empty-state">គ្មានសិស្សទេ</div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h3>{{ isEditing ? 'Edit Student' : 'Register New Student' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-row">
            <div class="form-group half">
              <label>ឈ្មោះពេញ</label>
              <input v-model="form.fullName" type="text" required />
            </div>
            <div class="form-group half">
              <label>លេខទូរសព្ទ</label>
              <input v-model="form.phoneNumber" type="text" placeholder="012..." />
            </div>
          </div>

          <div class="form-group">
            <label>អ៊ីមែល</label>
            <input v-model="form.email" type="email" :disabled="isEditing" required />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>លេខកូដសិស្ស (ID)</label>
              <input v-model="form.studentIdCard" type="text" required />
            </div>
            <div class="form-group half">
              <label>ដេប៉ាដឺម៉ង់</label>
              <select v-model="form.departmentId" required>
                <option value="" disabled>ជ្រើសរើសដេប៉ាដឺម៉ង់</option>
                <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ឆ្នាំទី (1-4)</label>
              <input v-model="form.year" type="number" min="1" max="8" required />
            </div>
            <div class="form-group half">
              <label>ឆ្នាំចូលរៀន</label>
              <input v-model="form.enrollmentYear" type="number" required />
            </div>
          </div>

          <div class="form-group" v-if="!isEditing">
            <label>លេខសម្ងាត់លំនាំដើម (STU@123)</label>
            <input v-model="form.password" type="password" placeholder="លំនាំដើម: STU@123" />
          </div>

          <div class="form-group">
            <label>ស្ថានភាព</label>
            <select v-model="form.status">
              <option value="ACTIVE">សកម្ម</option>
              <option value="INACTIVE">អសកម្ម</option>
              <option value="GRADUATED">បានបញ្ចប់ការសិក្សា</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-text">បោះបង់</button>
            <button type="submit" :disabled="submitting" class="btn-primary green">
              {{ submitting ? 'កំពុងរក្សាទុក...' : isEditing ? 'រក្សាទុកការផ្លាស់ប្ដូរ' : 'ចុះឈ្មោះ' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-content">
        <div class="success-icon">
          <Check size="32" />
        </div>
        <h3>គណនីបានបង្កើត!</h3>
        <div class="credential-box">
          <div class="cred-row">
            <span class="label">អ៊ីមែល:</span><span class="value">{{ createdAccount.email }}</span>
          </div>
          <div class="cred-row">
            <span class="label">លេខសម្ងាត់:</span><span class="value font-mono font-bold text-blue-600">{{
              createdAccount.password
              }}</span>
          </div>
        </div>
        <button @click="showSuccessModal = false" class="btn-primary w-full mt-4">រួចរាល់</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-row {
  display: flex;
  gap: 1rem;
}

.form-group.half {
  flex: 1;
}


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

.btn-primary.green {
  background: #16a34a;
}

.btn-primary.green:hover {
  background: #15803d;
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

.icon-box.green {
  background: #f0fdf4;
  color: #16a34a;
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
  max-width: 500px;
  /* Increased width slightly for form rows */
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
