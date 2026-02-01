<template>
  <div class="courses-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-top">
        <h1 class="page-title">{{ t('coursesPage.title') }}</h1>
        <p class="page-subtitle">{{ t('coursesPage.subtitle') }}</p>
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
          <input type="text" :placeholder="t('coursesPage.searchPlaceholder')" v-model="searchQuery" class="search-input"/>
        </div>
      </div>
    </div>



    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">{{ t('coursesPage.level') }}</label>
        <select v-model="selectedLevel" class="filter-select">
          <option value="">{{ t('coursesPage.all') }}</option>
          <option value="Beginner">{{ t('coursesPage.beginner') }}</option>
          <option value="Intermediate">{{ t('coursesPage.intermediate') }}</option>
          <option value="Advanced">{{ t('coursesPage.advanced') }}</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">{{ t('coursesPage.status') }}</label>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">{{ t('coursesPage.all') }}</option>
          <option value="active">{{ t('coursesPage.active') }}</option>
          <option value="inactive">{{ t('coursesPage.inactive') }}</option>
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
            <div class="course-badge" :class="course.status">{{ course.status === 'active' ? t('coursesPage.active') : t('coursesPage.inactive') }}</div>
            <div class="course-overlay">
              <button class="btn-view" @click="viewCourse(course)">{{ t('coursesPage.viewCourse') }}</button>
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
                <span class="meta-text">{{ course.students }} {{ t('coursesPage.students') }}</span>
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
                <span class="meta-text">{{ course.duration }} {{ t('coursesPage.hours') }}</span>
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
              <span class="progress-text">{{ course.progress }}% {{ t('coursesPage.completed') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">📚</div>
        <p class="empty-title">{{ t('coursesPage.noCourses') }}</p>
        <p class="empty-subtitle">{{ t('coursesPage.noCoursesMatch') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useTranslation } from '@/composables/useTranslation'

const { t } = useTranslation()

const searchQuery = ref('')
const selectedLevel = ref('')
const selectedStatus = ref('')

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

const viewCourse = (course) => {
  // TODO: Navigate to course detail page
  console.log('View course:', course)
  alert(`Viewing course: ${course.title}`)
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
