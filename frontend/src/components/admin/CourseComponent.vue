<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import adminService from '@/services/admin.service'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  Check,
  X,
  Calendar,
  User,
  Building2
} from 'lucide-vue-next'

const courses = ref([])
const departments = ref([])
const teachers = ref([])
const showModal = ref(false)
const showSuccessModal = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const searchQuery = ref('')
const filterDept = ref('')
const filterStatus = ref('')
const loading = ref(false)
const submitting = ref(false)
const imagePreview = ref(null)
const selectedFile = ref(null)

const form = ref({
  title: '',
  courseCode: '',
  subtitle: '',
  year: 1,
  status: true,
  departmentId: '',
  professorName: '',
  image: null,
})

const createdCourse = ref({ title: '', courseCode: '' })

const fetchData = async () => {
  loading.value = true
  try {
    const [coursesRes, deptsRes, teachersRes] = await Promise.all([
      adminService.getCourses(),
      adminService.getDepartments(),
      adminService.getTeachers()
    ])
    courses.value = coursesRes.data
    departments.value = deptsRes.data
    teachers.value = teachersRes.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const filteredCourses = computed(() => {
  let result = courses.value

  if (filterDept.value) {
    result = result.filter((c) => c.departmentId === filterDept.value)
  }

  if (filterStatus.value !== '') {
    const status = filterStatus.value === 'true'
    result = result.filter((c) => c.status === status)
  }

  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase()
    result = result.filter(
      (c) =>
        c.title.toLowerCase().includes(lower) ||
        c.courseCode.toLowerCase().includes(lower) ||
        c.professorName?.toLowerCase().includes(lower),
    )
  }

  return result
})

const getDepartmentName = (departmentId) => {
  const dept = departments.value.find(d => d.id === departmentId)
  return dept ? dept.name : 'Unknown'
}

const openCreate = () => {
  isEditing.value = false
  imagePreview.value = null
  selectedFile.value = null
  form.value = {
    title: '',
    courseCode: '',
    subtitle: '',
    year: 1,
    status: true,
    departmentId: '',
    professorName: '',
    image: null,
  }
  showModal.value = true
}

const openEdit = (course) => {
  isEditing.value = true
  editId.value = course.id
  imagePreview.value = course.image ? `http://localhost:3000${course.image}` : null
  selectedFile.value = null
  form.value = {
    title: course.title,
    courseCode: course.courseCode,
    subtitle: course.subtitle || '',
    year: course.year,
    status: course.status,
    departmentId: course.departmentId || '',
    professorName: course.professorName || '',
    image: null,
  }
  showModal.value = true
}

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('courseCode', form.value.courseCode)
    formData.append('subtitle', form.value.subtitle)
    formData.append('year', form.value.year)
    formData.append('status', form.value.status)
    formData.append('departmentId', form.value.departmentId)
    formData.append('professorName', form.value.professorName)

    if (selectedFile.value) {
      formData.append('image', selectedFile.value)
    }

    if (isEditing.value) {
      await adminService.updateCourse(editId.value, formData)
      showModal.value = false
    } else {
      const response = await adminService.createCourse(formData)
      createdCourse.value = {
        title: response.data.title,
        courseCode: response.data.courseCode,
      }
      showModal.value = false
      showSuccessModal.value = true
    }

    await fetchData()
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving course')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this course?')) return
  try {
    await adminService.deleteCourse(id)
    await fetchData()
  } catch (err) {
    alert('Failed to delete course')
  }
}

const toggleStatus = async (id) => {
  try {
    await adminService.toggleCourseStatus(id)
    await fetchData()
  } catch (err) {
    alert('Failed to toggle status')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">វគ្គសិក្សា</h2>
        <p class="page-subtitle">គ្រប់គ្រងវគ្គសិក្សានិងកម្រិតសិក្សា</p>
      </div>
      <div class="header-actions">
        <span class="badge">{{ courses.length }} សរុប</span>
        <button @click="openCreate" class="btn-primary purple">
          <Plus size="18" /> បន្ថែមវគ្គសិក្សាថ្មី
        </button>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <Search size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកវគ្គសិក្សា..." />
      </div>
      <div class="filter-box">
        <select v-model="filterDept">
          <option value="">ដេប៉ាដឺម៉ង់ទាំងអស់</option>
          <option v-for="d in departments" :key="d.id" :value="d.id">{{ d.name }}</option>
        </select>
      </div>
      <div class="filter-box">
        <select v-model="filterStatus">
          <option value="">ស្ថានភាពទាំងអស់</option>
          <option value="true">សកម្ម</option>
          <option value="false">អសកម្ម</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">កំពុងផ្ទុកវគ្គសិក្សា...</div>

    <div v-else-if="filteredCourses.length > 0" class="courses-grid">
      <div v-for="course in filteredCourses" :key="course.id" class="course-card">
        <div class="course-image-container">
          <img v-if="course.image" :src="`http://localhost:3000${course.image}`" :alt="course.title"
            class="course-image" />
          <div v-else class="course-image-placeholder">
            <BookOpen size="40" />
          </div>

          <div class="status-overlay">
            <span :class="['status-badge-small', course.status ? 'active' : 'inactive']">
              {{ course.status ? 'សកម្ម' : 'អសកម្ម' }}
            </span>
          </div>
        </div>

        <div class="course-content">
          <div class="course-header">
            <h3 class="course-title">{{ course.title }}</h3>
            <span class="course-code">{{ course.courseCode }}</span>
          </div>

          <p class="course-subtitle">{{ course.subtitle || 'គ្មានការពិពណ៌នា' }}</p>

          <div class="course-meta">
            <div class="meta-item">
              <Building2 size="14" />
              <span>{{ getDepartmentName(course.departmentId) }}</span>
            </div>
            <div class="meta-item" v-if="course.professorName">
              <User size="14" />
              <span>{{ course.professorName }}</span>
            </div>
            <div class="meta-item">
              <Calendar size="14" />
              <span>{{ course.year }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button @click="toggleStatus(course.id)" class="btn-toggle" :class="{ active: course.status }">
              <Check v-if="course.status" size="14" />
              <X v-else size="14" />
              {{ course.status ? 'សកម្ម' : 'អសកម្ម' }}
            </button>
            <div class="action-buttons">
              <button @click="openEdit(course)" class="btn-icon-card edit" title="Edit">
                <Edit2 size="16" />
              </button>
              <button @click="handleDelete(course.id)" class="btn-icon-card delete" title="Delete">
                <Trash2 size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <BookOpen size="48" />
      <p>គ្មានរគវ្គសិក្សាថ្មី</p>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content large">
        <h3>{{ isEditing ? 'Edit Course' : 'Add New Course' }}</h3>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>រូបភាពនៃវគ្គសិក្សា</label>
            <div class="image-upload-area">
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <button type="button" @click="imagePreview = null; selectedFile = null" class="remove-image">
                  <X size="16" />
                </button>
              </div>
              <label v-else for="image-input" class="upload-placeholder">
                <ImageIcon size="32" />
                <span>ចុចដើម្បីផ្ទុករូបភាព</span>
                <span class="upload-hint">PNG, JPG, WEBP, AVIF (max 5MB)</span>
              </label>
              <input id="image-input" type="file" accept="image/*" @change="handleImageSelect" style="display: none" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ចំណងជើងវគ្គសិក្សា *</label>
              <input v-model="form.title" type="text" required />
            </div>
            <div class="form-group half">
              <label>លេខកូដវគ្គសិក្សា *</label>
              <input v-model="form.courseCode" type="text" :disabled="isEditing" required placeholder="e.g., PHY101" />
            </div>
          </div>

          <div class="form-group">
            <label>ការពិពណ៌នា</label>
            <textarea v-model="form.subtitle" rows="2" placeholder="Short description of the course"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ដេប៉ាដឺម៉ង់ *</label>
              <select v-model="form.departmentId" required>
                <option value="" disabled>ជ្រើសរើសដេប៉ាដឺម៉ង់</option>
                <option v-for="d in departments" :key="d.id" :value="d.id">
                  {{ d.name }}
                </option>
              </select>
            </div>

            <div class="form-group half">
              <label>ឈ្មោះគ្រូបង្រៀន</label>
              <select v-model="form.professorName">
                <option value="">ជ្រើសរើសគ្រូបង្រៀន</option>
                <option v-for="t in teachers" :key="t.id" :value="t.fullName">
                  {{ t.fullName }} ({{ t.user?.email || 'គ្មានអ៊ីមែល' }})
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ឆ្នាំ *</label>
              <select v-model="form.year" required>
                <option :value="1">ឆ្នាំទី 1</option>
                <option :value="2">ឆ្នាំទី 2</option>
                <option :value="3">ឆ្នាំទី 3</option>
                <option :value="4">ឆ្នាំទី 4</option>
                <option :value="5">ឆ្នាំទី 5</option>
              </select>
            </div>
            <div class="form-group half">
              <label>ស្ថានភាព</label>
              <select v-model="form.status">
                <option :value="true">សកម្ម</option>
                <option :value="false">អសកម្ម</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-text">បោះបង់</button>
            <button type="submit" :disabled="submitting" class="btn-primary purple">
              {{ submitting ? 'កំពុងរក្សាទុក...' : isEditing ? 'រក្សាទុកការផ្លាស់ប្ដូរ' : 'បង្កើតវគ្គសិក្សា' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-content">
        <div class="success-icon purple">
          <Check size="32" />
        </div>
        <h3>វគ្គសិក្សាត្រូវបានបង្កើត!</h3>
        <div class="credential-box">
          <div class="cred-row">
            <span class="label">ចំណងជើង:</span>
            <span class="value">{{ createdCourse.title }}</span>
          </div>
          <div class="cred-row">
            <span class="label">លេខកូដ:</span>
            <span class="value font-mono font-bold text-purple-600">
              {{ createdCourse.courseCode }}
            </span>
          </div>
        </div>
        <button @click="showSuccessModal = false" class="btn-primary purple w-full mt-4">
          រួចរាល់
        </button>
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
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0;
}

.page-subtitle {
  color: var(--purple-400);
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  background: var(--purple-100);
  color: var(--purple-700);
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-primary {
  background: var(--purple-500);
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
  transition: transform 0.12s ease, box-shadow 0.12s ease;
}

.btn-primary.purple {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--purple-600) 100%);
}

.btn-primary.purple:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--purple-600) 100%);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.controls-bar {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--purple-500);
}

.search-box input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  color: var(--purple-500);
}

.search-box input::placeholder { color: var(--purple-500); opacity: 0.7; }

.filter-box select {
  padding: 0.6rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  background: white;
  cursor: pointer;
  color: var(--purple-500);
}

.filter-box select option { color: var(--purple-500); }

/* CARD GRID LAYOUT */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1.5rem;
}

.course-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.course-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
  border-color: #7c3aed;
}

.course-image-container {
  position: relative;
  width: 100%;
  height: 150px;
  overflow: hidden;
  background: #f1f5f9;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-image-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.status-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
}

.status-badge-small {
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.status-badge-small.active {
  background: rgba(220, 252, 231, 0.95);
  color: #15803d;
  border: 1px solid #86efac;
}

.status-badge-small.inactive {
  background: rgba(254, 226, 226, 0.95);
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.course-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.course-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0;
  line-height: 1.2;
  flex: 1;
}

.course-code {
  background: #f5f3ff;
  color: var(--purple-500);
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  font-family: monospace;
  border: 1px solid #ede9fe;
  white-space: nowrap;
}

.course-subtitle {
  font-size: 0.9rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.7rem;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: #64748b;
}

.meta-item svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.75rem;
  margin-top: auto;
}

.btn-toggle {
  flex: 1;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: all 0.2s;
}

.btn-toggle.active {
  background: #dcfce7;
  color: #15803d;
}

.btn-toggle:not(.active) {
  background: #fee2e2;
  color: #991b1b;
}

.btn-toggle:hover {
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-icon-card {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-icon-card.edit {
  color: #2563eb;
  background: #eff6ff;
}

.btn-icon-card.edit:hover {
  background: #dbeafe;
}

.btn-icon-card.delete {
  color: #ef4444;
  background: #fef2f2;
}

.btn-icon-card.delete:hover {
  background: #fee2e2;
}

.loading-state,
.empty-state {
  padding: 4rem;
  text-align: center;
  color: #94a3b8;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state svg {
  color: #cbd5e1;
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 600px;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  color: #1e293b;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.image-upload-area {
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
  text-align: center;
  padding: 20px;
}

.upload-placeholder svg {
  margin-bottom: 12px;
  display: block;
}

.upload-placeholder span {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
}

.upload-placeholder:hover {
  border-color: #7c3aed;
  color: #7c3aed;
}

.upload-hint {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
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
  padding: 0.6rem 1.2rem;
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
  background: #f5f3ff;
  color: #7c3aed;
}

.credential-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
  margin: 1rem 0;
}

.cred-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.cred-row:last-child {
  margin-bottom: 0;
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

.mt-4 {
  margin-top: 1rem;
}

.font-mono {
  font-family: monospace;
}

.font-bold {
  font-weight: 700;
}

.text-purple-600 {
  color: #7c3aed;
}

/* Responsive */
@media (max-width: 768px) {
  .courses-grid {
    grid-template-columns: 1fr;
  }

  .controls-bar {
    flex-direction: column;
  }

  .search-box {
    max-width: 100%;
  }
}
</style>
