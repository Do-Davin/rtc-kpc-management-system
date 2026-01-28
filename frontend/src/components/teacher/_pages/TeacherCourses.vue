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
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">Total Students</p>
          <p class="stat-value">{{ totalStudents }}</p>
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
      <div v-if="filteredCourses.length > 0" class="courses-list">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card">
          <!-- Course Image -->
          <div class="course-image-wrapper">
            <img :src="course.image" :alt="course.title" class="course-image"/>
            <div class="course-badge" :class="course.status">{{ course.status === 'active' ? 'Active' : 'Inactive' }}</div>
            <div class="course-overlay">
              <button class="btn-view" @click="viewCourse(course)">View</button>
              <button class="btn-edit" @click="editCourse(course)">Edit</button>
              <button class="btn-delete" @click="deleteCourse(course.id)">Delete</button>
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

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeModal">Close</button>
            <button type="submit" class="btn-primary">{{ editingCourse ? 'Update' : 'Create' }}</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const searchQuery = ref('')
const selectedLevel = ref('')
const selectedStatus = ref('')
const showAddCourseModal = ref(false)
const editingCourse = ref(null)

// Add dummy data sen for now jam connect to backend tam kroii
const courses = ref([
  {
    id: 1,
    title: 'Introduction to Computer Science',
    description: 'Learn the fundamentals of computer science including algorithms, data structures, and computational thinking.',
    image: '/public/courses/cs.jpeg',
    level: 'Beginner',
    duration: 20,
    students: 45,
    progress: 75,
    status: 'active'
  },
  {
    id: 2,
    title: 'Web Development Fundamentals',
    description: 'Master HTML, CSS, and JavaScript to build modern, responsive websites and web applications.',
    image: '/public/courses/webdev.png',
    level: 'Intermediate',
    duration: 30,
    students: 38,
    progress: 60,
    status: 'active'
  },
  {
    id: 3,
    title: 'Data Structures & Algorithms',
    description: 'Deep dive into essential data structures and algorithms needed for efficient software development.',
    image: '/public/courses/ds.jpg',
    level: 'Intermediate',
    duration: 25,
    students: 52,
    progress: 85,
    status: 'active'
  },
  {
    id: 4,
    title: 'Cybersecurity Essentials',
    description: 'Understand network security, encryption, and best practices for protecting digital assets.',
    image: '/public/courses/ce.webp',
    level: 'Advanced',
    duration: 35,
    students: 28,
    progress: 45,
    status: 'inactive'
  },
  {
    id: 5,
    title: 'IT Infrastructure & Systems',
    description: 'Learn about servers, networking, cloud computing, and system administration fundamentals.',
    image: '/public/courses/itf.jpg',
    level: 'Beginner',
    duration: 28,
    students: 61,
    progress: 70,
    status: 'active'
  },
  {
    id: 6,
    title: 'Advanced Python Programming',
    description: 'Master Python programming including OOP, file handling, and building real-world applications.',
    image: '/public/courses/apy.jpg',
    level: 'Advanced',
    duration: 32,
    students: 35,
    progress: 55,
    status: 'active'
  }
])

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

const totalStudents = computed(() => {
  return courses.value.reduce((sum, course) => sum + course.students, 0)
})

const totalHours = computed(() => {
  return courses.value.reduce((sum, course) => sum + course.duration, 0)
})

const viewCourse = (course) => {
  console.log('View course:', course)
  alert(`View course: ${course.title}`)
}

const editCourse = (course) => {
  editingCourse.value = course
  formData.value = { ...course }
  showAddCourseModal.value = true
}

const deleteCourse = (id) => {
  if (confirm('Are you sure you want to delete this course?')) {
    const index = courses.value.findIndex(c => c.id === id)
    if (index > -1) {
      courses.value.splice(index, 1)
    }
  }
}

const openAddModal = () => {
  editingCourse.value = null
  formData.value = {
    title: '',
    description: '',
    level: 'Beginner',
    duration: 0
  }
  showAddCourseModal.value = true
}

const saveCourse = () => {
  if (editingCourse.value) {
    // Update existing course
    const index = courses.value.findIndex(c => c.id === editingCourse.value.id)
    if (index > -1) {
      courses.value[index] = { ...courses.value[index], ...formData.value }
    }
  } else {
    // Create new course
    courses.value.push({
      id: Math.max(...courses.value.map(c => c.id), 0) + 1,
      ...formData.value,
      image: '/public/courses/default.jpg',
      students: 0,
      progress: 0,
      status: 'active'
    })
  }
  closeModal()
}

const closeModal = () => {
  showAddCourseModal.value = false
  editingCourse.value = null
  formData.value = {
    title: '',
    description: '',
    level: 'Beginner',
    duration: 0
  }
}
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
}
</style>
