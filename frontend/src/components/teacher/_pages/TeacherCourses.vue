<template>
  <div class="courses-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-top">
        <h1 class="page-title">វគ្គសិក្សា</h1>
        <p class="page-subtitle">ស្វាគមន៍! ចូលរួមក្នុងដំណើរសិក្សារបស់អ្នក។</p>
      </div>

      <div class="header-actions">
        <div class="search-box">
          <svg
            class="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="Search courses..." v-model="searchQuery" class="search-input"/>
        </div>
        <button class="btn-primary" @click="openAddModal">
          <span class="plus-icon">+</span> Create Course
        </button>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Courses</p>
          <p class="stat-value">{{ filteredCourses.length }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Average Progress</p>
          <p class="stat-value">{{ averageProgress }}%</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon progress">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Hours</p>
          <p class="stat-value">{{ totalHours }}</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">Level</label>
        <select v-model="selectedLevel" class="filter-select">
          <option value="">All</option>
          <option value="Beginner">Beginner</option>
          <option value="Intermediate">Intermediate</option>
          <option value="Advanced">Advanced</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">Status</label>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
    </div>

    <!-- Courses Grid -->
    <div class="courses-grid">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <p>Loading courses...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="fetchCourses" class="btn-retry">Retry</button>
      </div>

      <!-- Courses List -->
      <div v-else-if="filteredCourses.length > 0" class="courses-list">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card">
          <!-- Course Image -->
          <div class="course-image-wrapper">
            <img :src="course.image || '/public/courses/default.jpg'" :alt="course.title" class="course-image"/>
            <div class="course-badge" :class="course.status">{{ course.status === 'active' ? 'Active' : 'Inactive' }}</div>
            <div class="course-overlay">
              <button class="btn-view" @click="viewCourse(course)">View</button>
              <button class="btn-edit" @click="editCourse(course)">Edit</button>
              <button class="btn-delete" @click="deleteCourseHandler(course.id)">Delete</button>
            </div>
          </div>

          <!-- Course Content -->
          <div class="course-content">
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description }}</p>

            <!-- Course Metadata -->
            <div class="course-meta">
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                </svg>
                <span class="meta-text">{{ course.students }} Students</span>
              </div>
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <span class="meta-text">{{ course.duration }} Hours</span>
              </div>
              <div class="meta-item">
                <svg
                  class="meta-icon"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M3 3v18h18"></path>
                  <rect x="7" y="13" width="4" height="8"></rect>
                  <rect x="15" y="8" width="4" height="13"></rect>
                  <rect x="11" y="13" width="4" height="8"></rect>
                </svg>
                <span class="meta-text">{{ course.level }}</span>
              </div>
            </div>

            <!-- Course Footer -->
            <div class="course-footer">
              <div class="progress-bar">
                <div class="progress-fill" :style="{ width: course.progress + '%' }"></div>
              </div>
              <span class="progress-text">{{ course.progress }}% Complete</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📚</div>
        <p class="empty-title">No Courses</p>
        <p class="empty-subtitle">Get started by creating your first course</p>
        <button class="btn-primary" @click="openAddModal">
          <span class="plus-icon">+</span> Create Course
        </button>
      </div>
    </div>

    <!-- Add/Edit Course Modal -->
    <div v-if="showAddCourseModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">{{ editingCourse ? 'Edit Course' : 'Create New Course' }}</h2>
          <button class="btn-close" @click="closeModal">&times;</button>
        </div>

        <form @submit.prevent="saveCourse" class="form">
          <div class="form-group">
            <label class="form-label">Course Name</label>
            <input v-model="formData.title" type="text" class="form-input" placeholder="e.g. Web Development"/>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea v-model="formData.description" class="form-textarea" placeholder="Detailed description about the course"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Level</label>
              <select v-model="formData.level" class="form-input">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Duration (Hours)</label>
              <input v-model.number="formData.duration" type="number" class="form-input" placeholder="0"/>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Status</label>
              <select v-model="formData.status" class="form-input">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Course Image</label>
            <div class="image-upload-container">
              <div class="image-preview-wrapper" v-if="imagePreview">
                <img :src="imagePreview" alt="Preview" class="image-preview" />
                <button type="button" class="btn-remove-image" @click="removeImage">&times;</button>
              </div>
              <div class="upload-area" v-else>
                <input
                  type="file"
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="file-input"
                  id="image-upload"
                />
                <label for="image-upload" class="upload-label">
                  <svg class="upload-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span class="upload-text">Click to upload image</span>
                  <span class="upload-hint">PNG, JPG, GIF up to 5MB</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : (editingCourse ? 'Update' : 'Create') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Course View Modal -->
    <div v-if="showViewCourseModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-content view-modal">
        <div class="modal-header">
          <h2 class="modal-title">{{ viewingCourse?.title }}</h2>
          <button class="btn-close" @click="closeViewModal">&times;</button>
        </div>

        <div class="view-modal-body">
          <!-- Course Info -->
          <div class="course-info-section">
            <img :src="viewingCourse?.image || '/public/courses/default.jpg'" :alt="viewingCourse?.title" class="view-course-image"/>
            <p class="view-course-description">{{ viewingCourse?.description }}</p>
            <div class="course-info-meta">
              <span class="info-badge level">{{ viewingCourse?.level }}</span>
              <span class="info-badge duration">{{ viewingCourse?.duration }} Hours</span>
              <span class="info-badge" :class="viewingCourse?.status">{{ viewingCourse?.status === 'active' ? 'Active' : 'Inactive' }}</span>
            </div>
          </div>

          <!-- Course Pages Section -->
          <div class="pages-section">
            <div class="pages-header">
              <h3>Course Pages</h3>
              <div class="overall-progress">
                <span>Overall Progress: </span>
                <strong>{{ calculateOverallProgress() }}%</strong>
              </div>
            </div>

            <div class="pages-list">
              <div
                v-for="(page, index) in coursePages"
                :key="page.id"
                class="page-item"
                :class="{ 'completed': page.completed }"
              >
                <div class="page-number">{{ index + 1 }}</div>
                <div class="page-content">
                  <h4 class="page-title">{{ page.title }}</h4>
                  <p class="page-description">{{ page.description }}</p>
                </div>
                <div class="page-status">
                  <button
                    class="status-icon-btn"
                    :class="{ 'completed': page.completed }"
                    @click="togglePageComplete(page.id)"
                    title="Click to toggle completion"
                  >
                    <svg v-if="page.completed" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <svg v-else width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"></circle>
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Progress Bar -->
            <div class="pages-progress">
              <div class="pages-progress-bar">
                <div
                  class="pages-progress-fill"
                  :style="{ width: calculateOverallProgress() + '%' }"
                ></div>
              </div>
              <div class="pages-progress-text">
                {{ completedPagesCount }} / {{ coursePages.length }} pages completed
              </div>
            </div>
          </div>

          <!-- Enrolled Students Progress -->
          <div class="students-progress-section">
            <h3>Student Progress Overview</h3>
            <div v-if="isLoadingStudents" class="students-loading">
              <p>Loading students...</p>
            </div>
            <div v-else-if="enrolledStudents.length === 0" class="students-empty">
              <p>No students enrolled yet</p>
            </div>
            <div v-else class="students-list">
              <div
                v-for="student in enrolledStudents"
                :key="student.id"
                class="student-progress-item"
              >
                <div class="student-avatar">{{ student.name.charAt(0) }}</div>
                <div class="student-info">
                  <span class="student-name">{{ student.name }}</span>
                  <div class="student-progress-bar">
                    <div
                      class="student-progress-fill"
                      :style="{ width: student.progress + '%' }"
                      :class="getProgressClass(student.progress)"
                    ></div>
                  </div>
                </div>
                <div class="student-progress-value" :class="getProgressClass(student.progress)">
                  {{ student.progress }}%
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" class="btn-secondary" @click="closeViewModal">Close</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getCourses,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse as deleteCourseApi
} from '@/services/courses.api'
import { getStudents } from '@/services/teacher-dashboard.api'

const searchQuery = ref('')
const selectedLevel = ref('')
const selectedStatus = ref('')
const showAddCourseModal = ref(false)
const showViewCourseModal = ref(false)
const editingCourse = ref(null)
const viewingCourse = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref(null)
const imagePreview = ref(null)
const fileInput = ref(null)

// Course pages data (simulated - each course has pages)
const coursePages = ref([
  { id: 1, title: 'Introduction to the Course', description: 'Overview of course objectives and structure', completed: false },
  { id: 2, title: 'Core Concepts', description: 'Fundamental concepts and principles', completed: false },
  { id: 3, title: 'Practical Applications', description: 'Hands-on exercises and real-world examples', completed: false }
])

// Enrolled students fetched from API
const enrolledStudents = ref([])
const isLoadingStudents = ref(false)

// Courses data from API
const courses = ref([])
const stats = ref({
  totalCourses: 0,
  activeCourses: 0,
  totalStudents: 0,
  totalHours: 0
})

const formData = ref({
  title: '',
  description: '',
  level: 'Beginner',
  duration: 0
})

const filteredCourses = computed(() => {
  return courses.value.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesLevel = !selectedLevel.value || course.level === selectedLevel.value
    const matchesStatus = !selectedStatus.value || course.status === selectedStatus.value
    return matchesSearch && matchesLevel && matchesStatus
  })
})

const averageProgress = computed(() => {
  if (courses.value.length === 0) return 0
  const total = courses.value.reduce((sum, c) => sum + (c.progress || 0), 0)
  return Math.round(total / courses.value.length)
})
const totalHours = computed(() => stats.value.totalHours)

const completedPagesCount = computed(() => {
  return coursePages.value.filter(p => p.completed).length
})

const calculateOverallProgress = () => {
  if (coursePages.value.length === 0) return 0
  return Math.round((completedPagesCount.value / coursePages.value.length) * 100)
}

const getProgressClass = (progress) => {
  if (progress >= 100) return 'complete'
  if (progress >= 50) return 'in-progress'
  return 'started'
}

// Toggle page completion status (teacher can check/uncheck)
const togglePageComplete = (pageId) => {
  const page = coursePages.value.find(p => p.id === pageId)
  if (page) {
    page.completed = !page.completed
    // Update course progress based on pages completed
    updateCourseProgress()
  }
}

// Update course progress when pages are toggled
const updateCourseProgress = async () => {
  if (!viewingCourse.value) return
  const progress = calculateOverallProgress()
  try {
    await updateCourse(viewingCourse.value.id, { progress })
    // Update local course data
    const courseIndex = courses.value.findIndex(c => c.id === viewingCourse.value.id)
    if (courseIndex !== -1) {
      courses.value[courseIndex].progress = progress
    }
    viewingCourse.value.progress = progress
  } catch (err) {
    console.error('Error updating course progress:', err)
  }
}

// Fetch students from API
const fetchEnrolledStudents = async () => {
  isLoadingStudents.value = true
  try {
    const response = await getStudents({ status: 'ACTIVE' })
    // Map students with simulated progress based on course progress
    const courseProgress = viewingCourse.value?.progress || 0
    enrolledStudents.value = (response.students || response || []).map((student, index) => ({
      id: student.id,
      name: student.fullName,
      // Calculate varied progress for each student based on course progress
      progress: Math.min(100, Math.max(0, courseProgress + (index % 3 - 1) * 20))
    }))
  } catch (err) {
    console.error('Error fetching students:', err)
    enrolledStudents.value = []
  } finally {
    isLoadingStudents.value = false
  }
}

// Fetch courses and stats from API
const fetchCourses = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [coursesResponse, statsResponse] = await Promise.all([
      getCourses(),
      getCourseStats()
    ])
    courses.value = coursesResponse
    stats.value = statsResponse
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value = 'Failed to load courses'
  } finally {
    isLoading.value = false
  }
}

const viewCourse = async (course) => {
  viewingCourse.value = course
  // Initialize pages based on course (3 pages per course)
  const totalPages = 3
  const completedPages = Math.floor((course.progress / 100) * totalPages)

  const pageTemplates = [
    { title: 'Introduction', description: 'Overview of course objectives and structure' },
    { title: 'Core Concepts', description: 'Fundamental concepts and principles' },
    { title: 'Practical Applications', description: 'Hands-on exercises and real-world examples' }
  ]

  coursePages.value = pageTemplates.map((page, index) => ({
    id: index + 1,
    title: page.title,
    description: page.description,
    completed: index < completedPages
  }))

  showViewCourseModal.value = true

  // Fetch real students from API
  await fetchEnrolledStudents()
}

const closeViewModal = () => {
  showViewCourseModal.value = false
  viewingCourse.value = null
}

const editCourse = (course) => {
  editingCourse.value = course
  formData.value = {
    title: course.title,
    description: course.description,
    level: course.level,
    duration: course.duration,
    image: course.image || '',
    status: course.status
  }
  // Set preview if editing and has existing image
  imagePreview.value = course.image || null
  showAddCourseModal.value = true
}

const deleteCourseHandler = async (id) => {
  if (confirm('Are you sure you want to delete this course?')) {
    try {
      await deleteCourseApi(id)
      await fetchCourses()
    } catch (err) {
      console.error('Error deleting course:', err)
      alert('Failed to delete course')
    }
  }
}

const openAddModal = () => {
  editingCourse.value = null
  formData.value = {
    title: '',
    description: '',
    level: 'Beginner',
    duration: 0,
    image: '',
    status: 'active'
  }
  imagePreview.value = null
  showAddCourseModal.value = true
}

const saveCourse = async () => {
  isSaving.value = true
  try {
    if (editingCourse.value) {
      // Update existing course
      await updateCourse(editingCourse.value.id, formData.value)
    } else {
      // Create new course
      await createCourse(formData.value)
    }
    await fetchCourses()
    closeModal()
  } catch (err) {
    console.error('Error saving course:', err)
    alert('Failed to save course')
  } finally {
    isSaving.value = false
  }
}

const closeModal = () => {
  showAddCourseModal.value = false
  editingCourse.value = null
  formData.value = {
    title: '',
    description: '',
    level: 'Beginner',
    duration: 0,
    image: '',
    status: 'active'
  }
  imagePreview.value = null
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB')
      return
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
      formData.value.image = e.target.result // Store base64 for now
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  imagePreview.value = null
  formData.value.image = ''
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// Fetch courses on mount
onMounted(() => {
  fetchCourses()
})
</script>

<style scoped>
.courses-container {
  width: 100%;
  background: #f9fafb;
  min-height: 100vh;
}

.header-section {
  margin-bottom: 40px;
}

.header-top {
  margin-bottom: 30px;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 14px;
  color: #718096;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
}

.search-box {
  flex: 1;
  position: relative;
  max-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  opacity: 0.6;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 40px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s;
}

.search-input:focus {
  border-color: #5d5fef;
  box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.1);
}

.btn-primary {
  background-color: #5d5fef;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.btn-primary:hover {
  background-color: #4c4edb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 95, 239, 0.3);
}

.plus-icon {
  font-size: 18px;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #2d3748;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  flex-shrink: 0;
}

.stat-icon.total {
  background-color: #f0f1ff;
}

.stat-icon.active {
  background-color: #f0fdf4;
}

.stat-icon.progress {
  background-color: #fef3c7;
}

.stat-label {
  font-size: 13px;
  color: #718096;
  margin: 0 0 4px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #2d3748;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s;
  min-width: 140px;
}

.filter-select:focus {
  outline: none;
  border-color: #5d5fef;
  box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.1);
}

.courses-grid {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.courses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.course-card {
  border-radius: 12px;
  overflow: hidden;
  background: white;
  border: 1px solid #e2e8f0;
  transition: all 0.3s;
  cursor: pointer;
}

.course-card:hover {
  border-color: #5d5fef;
  box-shadow: 0 8px 24px rgba(93, 95, 239, 0.15);
  transform: translateY(-4px);
}

.course-image-wrapper {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.course-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  background-color: #22c55e;
}

.course-badge.inactive {
  background-color: #ef4444;
}

.course-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.3s;
}

.course-card:hover .course-overlay {
  opacity: 1;
}

.btn-view,
.btn-edit,
.btn-delete {
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
}

.btn-view {
  background-color: #3b82f6;
}

.btn-view:hover {
  background-color: #2563eb;
}

.btn-edit {
  background-color: #10b981;
}

.btn-edit:hover {
  background-color: #059669;
}

.btn-delete {
  background-color: #ef4444;
}

.btn-delete:hover {
  background-color: #dc2626;
}

.course-content {
  padding: 16px;
}

.course-title {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.course-description {
  font-size: 13px;
  color: #718096;
  margin: 0 0 12px 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #718096;
}

.meta-icon {
  font-size: 14px;
}

.meta-text {
  font-weight: 500;
}

.course-footer {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background-color: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: #5d5fef;
  transition: width 0.3s;
}

.progress-text {
  font-size: 12px;
  color: #718096;
  font-weight: 600;
  white-space: nowrap;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 18px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  color: #718096;
  margin: 0 0 24px 0;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 60px 20px;
  color: #718096;
}

.error-state {
  color: #e53e3e;
}

.btn-retry {
  margin-top: 16px;
  padding: 8px 20px;
  background: var(--purple-500);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
}

.btn-retry:hover {
  background: var(--purple-600);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  font-size: 28px;
  color: #718096;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-close:hover {
  color: #1a202c;
  transform: scale(1.1);
}

.form {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  transition: all 0.3s;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #5d5fef;
  box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.image-upload-container {
  width: 100%;
}

.image-preview-wrapper {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-remove-image:hover {
  background-color: #dc2626;
  transform: scale(1.1);
}

.upload-area {
  position: relative;
  width: 100%;
  min-height: 200px;
  border: 2px dashed #cbd5e0;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s;
  background-color: #f7fafc;
}

.upload-area:hover {
  border-color: #5d5fef;
  background-color: #f0f1ff;
}

.file-input {
  display: none;
}

.upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 20px;
  text-align: center;
}

.upload-icon {
  color: #5d5fef;
}

.upload-text {
  font-size: 14px;
  font-weight: 600;
  color: #2d3748;
}

.upload-hint {
  font-size: 12px;
  color: #718096;
}

/* View Course Modal Styles */
.view-modal {
  max-width: 700px;
}

.view-modal-body {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.course-info-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.view-course-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 16px;
}

.view-course-description {
  font-size: 14px;
  color: #4a5568;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.course-info-meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.info-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
}

.info-badge.level {
  background-color: #f0f1ff;
  color: #5d5fef;
}

.info-badge.duration {
  background-color: #fef3c7;
  color: #d97706;
}

.info-badge.active {
  background-color: #d1fae5;
  color: #059669;
}

.info-badge.inactive {
  background-color: #fee2e2;
  color: #dc2626;
}

/* Pages Section */
.pages-section {
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.pages-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.pages-header h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.overall-progress {
  font-size: 14px;
  color: #4a5568;
}

.overall-progress strong {
  color: #5d5fef;
  font-weight: 700;
}

.pages-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.page-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s;
}

.page-item.completed {
  background: #f0fdf4;
  border-color: #86efac;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #4a5568;
  flex-shrink: 0;
}

.page-item.completed .page-number {
  background: #22c55e;
  color: white;
}

.page-content {
  flex: 1;
}

.page-title {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 4px 0;
}

.page-description {
  font-size: 12px;
  color: #718096;
  margin: 0;
}

.page-status {
  flex-shrink: 0;
}

.status-icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e2e8f0;
  border: 2px solid #cbd5e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
  cursor: pointer;
  transition: all 0.3s;
}

.status-icon-btn:hover {
  background: #d1fae5;
  border-color: #86efac;
  color: #22c55e;
  transform: scale(1.1);
}

.status-icon-btn.completed {
  background: #22c55e;
  border-color: #16a34a;
  color: white;
}

.status-icon-btn.completed:hover {
  background: #ef4444;
  border-color: #dc2626;
  color: white;
}

.status-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e2e8f0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
}

.status-icon.completed {
  background: #22c55e;
  color: white;
}

/* Students loading and empty states */
.students-loading,
.students-empty {
  text-align: center;
  padding: 24px;
  color: #718096;
  font-size: 14px;
}

.pages-progress {
  display: flex;
  align-items: center;
  gap: 16px;
}

.pages-progress-bar {
  flex: 1;
  height: 10px;
  background: #e2e8f0;
  border-radius: 5px;
  overflow: hidden;
}

.pages-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #5d5fef, #7c3aed);
  border-radius: 5px;
  transition: width 0.5s ease;
}

.pages-progress-text {
  font-size: 14px;
  color: #4a5568;
  font-weight: 600;
  white-space: nowrap;
}

/* Students Progress Section */
.students-progress-section h3 {
  font-size: 16px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 16px 0;
}

.students-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.student-progress-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.student-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5d5fef, #7c3aed);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.student-info {
  flex: 1;
}

.student-name {
  font-size: 14px;
  font-weight: 600;
  color: #1a202c;
  display: block;
  margin-bottom: 6px;
}

.student-progress-bar {
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.student-progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease;
}

.student-progress-fill.complete {
  background: linear-gradient(90deg, #22c55e, #16a34a);
}

.student-progress-fill.in-progress {
  background: linear-gradient(90deg, #f59e0b, #d97706);
}

.student-progress-fill.started {
  background: linear-gradient(90deg, #ef4444, #dc2626);
}

.student-progress-value {
  font-size: 14px;
  font-weight: 700;
  min-width: 50px;
  text-align: right;
}

.student-progress-value.complete {
  color: #22c55e;
}

.student-progress-value.in-progress {
  color: #f59e0b;
}

.student-progress-value.started {
  color: #ef4444;
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    max-width: 100%;
  }

  .btn-primary {
    justify-content: center;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .courses-list {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-select {
    min-width: 100%;
  }

  .view-modal {
    max-width: 100%;
  }

  .pages-progress {
    flex-direction: column;
    align-items: stretch;
  }

  .pages-progress-text {
    text-align: center;
  }
}
</style>
