<template>
  <div class="courses-container">
    <!-- Header Section -->
    <div class="header-section">
      <div class="header-content">
        <div class="header-text">
          <h1 class="page-title">វគ្គសិក្សា</h1>
          <p class="page-subtitle">មើលវគ្គសិក្សាដែលបានកំណត់សម្រាប់ផ្នែករបស់អ្នក។</p>
        </div>
        <div class="search-box">
          <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input type="text" placeholder="ស្វែងរកវគ្គសិក្សា..." v-model="searchQuery" class="search-input"/>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon total">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">វគ្គសិក្សាសរុប</p>
          <p class="stat-value">{{ stats.totalCourses }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon active">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">វគ្គសិក្សាសកម្ម</p>
          <p class="stat-value">{{ stats.activeCourses }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon inactive">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">វគ្គសិក្សាអសកម្ម</p>
          <p class="stat-value">{{ stats.inactiveCourses }}</p>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon progress">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20v-6M6 20V10M18 20V4"></path>
          </svg>
        </div>
        <div class="stat-content">
          <p class="stat-label">វឌ្ឍនភាពជាមធ្យម</p>
          <p class="stat-value">{{ progressStats.averageProgress }}%</p>
        </div>
      </div>
    </div>

    <!-- Filters Section -->
    <div class="filters-section">
      <div class="filter-group">
        <label class="filter-label">ឆ្នាំសិក្សា</label>
        <select v-model="selectedYear" class="filter-select">
          <option value="">ទាំងអស់</option>
          <option value="1">ឆ្នាំទី ១</option>
          <option value="2">ឆ្នាំទី ២</option>
          <option value="3">ឆ្នាំទី ៣</option>
          <option value="4">ឆ្នាំទី ៤</option>
          <option value="5">ឆ្នាំទី ៥</option>
        </select>
      </div>
      <div class="filter-group">
        <label class="filter-label">ស្ថានភាព</label>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">ទាំងអស់</option>
          <option value="true">សកម្ម</option>
          <option value="false">អសកម្ម</option>
        </select>
      </div>
    </div>

    <!-- Courses Grid -->
    <div class="courses-grid">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>កំពុងផ្ទុកវគ្គសិក្សា...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">
          <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2">
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <p>{{ error }}</p>
        <button @click="fetchCourses" class="btn-retry">ព្យាយាមម្តងទៀត</button>
      </div>

      <!-- Courses List -->
      <div v-else-if="filteredCourses.length > 0" class="courses-list">
        <div v-for="course in filteredCourses" :key="course.id" class="course-card" @click="viewCourse(course)">
          <!-- Course Image -->
          <div class="course-image-wrapper">
            <img :src="getCourseImage(course)" :alt="course.title" class="course-image" @error="handleImageError"/>
            <div class="course-status-badge" :class="{ active: course.status, inactive: !course.status }">
              {{ course.status ? 'សកម្ម' : 'អសកម្ម' }}
            </div>
            <div class="course-year-badge" v-if="course.year">
              ឆ្នាំទី {{ course.year }}
            </div>
          </div>

          <!-- Course Content -->
          <div class="course-content">
            <div class="course-header">
              <span class="course-code">{{ course.courseCode || 'N/A' }}</span>
            </div>
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-subtitle">{{ course.subtitle || 'មិនមានពិពណ៌នា' }}</p>

            <!-- Course Metadata -->
            <div class="course-meta">
              <div class="meta-item" v-if="course.professorName">
                <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span class="meta-text">{{ course.professorName }}</span>
              </div>
              <div class="meta-item" v-if="course.departmentName">
                <svg class="meta-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span class="meta-text">{{ course.departmentName }}</span>
              </div>
            </div>

            <!-- Progress Checkmarks -->
            <div class="course-progress">
              <div class="progress-header">
                <span class="progress-label">វឌ្ឍនភាព</span>
                <span class="progress-percent">{{ getProgressPercent(course) }}%</span>
              </div>
              <div class="progress-steps">
                <div
                  class="progress-step"
                  :class="{ completed: course.progress1 }"
                  @click.stop="toggleProgress(course, 'progress1')"
                >
                  <div class="step-checkbox" :class="{ checked: course.progress1 }">
                    <svg v-if="course.progress1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <div class="step-info">
                    <span class="step-title">រៀបចំមេរៀន</span>
                    <span class="step-desc">រៀបចំសម្ភារៈបង្រៀន</span>
                  </div>
                </div>
                <div
                  class="progress-step"
                  :class="{ completed: course.progress2, disabled: !course.progress1 }"
                  @click.stop="canToggleProgress(course, 'progress2') && toggleProgress(course, 'progress2')"
                >
                  <div class="step-checkbox" :class="{ checked: course.progress2, disabled: !course.progress1 }">
                    <svg v-if="course.progress2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <svg v-else-if="!course.progress1" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div class="step-info">
                    <span class="step-title">បង្រៀនបាន ៥០%</span>
                    <span class="step-desc">កំពុងបង្រៀន</span>
                  </div>
                </div>
                <div
                  class="progress-step"
                  :class="{ completed: course.progress3, disabled: !course.progress1 || !course.progress2 }"
                  @click.stop="canToggleProgress(course, 'progress3') && toggleProgress(course, 'progress3')"
                >
                  <div class="step-checkbox" :class="{ checked: course.progress3, disabled: !course.progress1 || !course.progress2 }">
                    <svg v-if="course.progress3" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    <svg v-else-if="!course.progress1 || !course.progress2" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                  </div>
                  <div class="step-info">
                    <span class="step-title">បញ្ចប់វគ្គសិក្សា</span>
                    <span class="step-desc">បង្រៀនបានគ្រប់មេរៀន</span>
                  </div>
                </div>
              </div>
              <div class="progress-bar">
                <div class="progress-bar-fill" :style="{ width: getProgressPercent(course) + '%' }"></div>
              </div>
            </div>

            <!-- View Button -->
            <div class="course-footer">
              <button class="btn-view-details">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                មើលព័ត៌មានលម្អិត
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <line x1="8" y1="6" x2="16" y2="6"></line>
            <line x1="8" y1="10" x2="14" y2="10"></line>
          </svg>
        </div>
        <p class="empty-title">មិនមានវគ្គសិក្សា</p>
        <p class="empty-subtitle">មិនមានវគ្គសិក្សាសម្រាប់ផ្នែករបស់អ្នកនៅឡើយទេ។</p>
      </div>
    </div>

    <!-- Course View Modal -->
    <div v-if="showViewCourseModal" class="modal-overlay" @click.self="closeViewModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">ព័ត៌មានវគ្គសិក្សា</h2>
          <button class="btn-close" @click="closeViewModal">&times;</button>
        </div>

        <div class="modal-body">
          <!-- Course Image -->
          <div class="modal-image-wrapper">
            <img :src="getCourseImage(viewingCourse)" :alt="viewingCourse?.title" class="modal-image" @error="handleImageError"/>
            <div class="modal-status-badge" :class="{ active: viewingCourse?.status, inactive: !viewingCourse?.status }">
              {{ viewingCourse?.status ? 'សកម្ម' : 'អសកម្ម' }}
            </div>
          </div>

          <!-- Course Info -->
          <div class="modal-info">
            <div class="info-header">
              <span class="info-code">{{ viewingCourse?.courseCode || 'N/A' }}</span>
              <span class="info-year" v-if="viewingCourse?.year">ឆ្នាំទី {{ viewingCourse.year }}</span>
            </div>

            <h3 class="info-title">{{ viewingCourse?.title }}</h3>
            <p class="info-subtitle">{{ viewingCourse?.subtitle || 'មិនមានពិពណ៌នា' }}</p>

            <!-- Details Grid -->
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">កូដវគ្គសិក្សា</span>
                <span class="info-value">{{ viewingCourse?.courseCode || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ឆ្នាំសិក្សា</span>
                <span class="info-value">{{ viewingCourse?.year ? 'ឆ្នាំទី ' + viewingCourse.year : 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">សាស្រ្តាចារ្យ</span>
                <span class="info-value">{{ viewingCourse?.professorName || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ផ្នែក</span>
                <span class="info-value">{{ viewingCourse?.departmentName || 'N/A' }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">ស្ថានភាព</span>
                <span class="info-value status-value" :class="{ active: viewingCourse?.status, inactive: !viewingCourse?.status }">
                  {{ viewingCourse?.status ? 'សកម្ម' : 'អសកម្ម' }}
                </span>
              </div>
              <div class="info-item">
                <span class="info-label">បង្កើតនៅ</span>
                <span class="info-value">{{ formatDate(viewingCourse?.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn-close-modal" @click="closeViewModal">បិទ</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  getTeacherCourses,
  getTeacherCourseStats,
  updateCourseProgress,
} from '@/services/teacher-courses.api'

const searchQuery = ref('')
const selectedYear = ref('')
const selectedStatus = ref('')
const showViewCourseModal = ref(false)
const viewingCourse = ref(null)
const isLoading = ref(false)
const isUpdatingProgress = ref(false)
const error = ref(null)

// Courses data from API
const courses = ref([])
const stats = ref({
  totalCourses: 0,
  activeCourses: 0,
  inactiveCourses: 0,
})

// Progress stats computed from courses
const progressStats = computed(() => {
  if (courses.value.length === 0) {
    return { averageProgress: 0, completedCourses: 0 }
  }

  let totalProgress = 0
  let completedCourses = 0

  courses.value.forEach(course => {
    const courseProgress = getProgressPercent(course)
    totalProgress += courseProgress
    if (courseProgress === 100) completedCourses++
  })

  return {
    averageProgress: Math.round(totalProgress / courses.value.length),
    completedCourses,
  }
})

const filteredCourses = computed(() => {
  return courses.value.filter((course) => {
    const matchesSearch =
      course.title?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.subtitle?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.courseCode?.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      course.professorName?.toLowerCase().includes(searchQuery.value.toLowerCase())

    // Year filter - empty string means show all, convert to number for comparison
    let matchesYear = true
    if (selectedYear.value !== '') {
      matchesYear = Number(course.year) === Number(selectedYear.value)
    }

    // Status filter - convert string to boolean for comparison
    let matchesStatus = true
    if (selectedStatus.value !== '') {
      const filterStatus = selectedStatus.value === 'true'
      matchesStatus = course.status === filterStatus
    }

    return matchesSearch && matchesYear && matchesStatus
  })
})

// Helper functions
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

const getCourseImage = (course) => {
  if (!course) return '/courses/default.jpg'
  if (course.image) {
    // If image starts with http, use as is
    if (course.image.startsWith('http')) return course.image
    // If it's a relative path like /uploads/courses/xxx.jpg, prepend the API base URL
    if (course.image.startsWith('/')) return `${API_BASE_URL}${course.image}`
    // Otherwise just return the path
    return `${API_BASE_URL}/uploads/courses/${course.image}`
  }
  return '/courses/default.jpg'
}

const handleImageError = (e) => {
  e.target.src = '/courses/default.jpg'
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('km-KH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Fetch courses and stats from API
const fetchCourses = async () => {
  isLoading.value = true
  error.value = null
  try {
    const [coursesResponse, statsResponse] = await Promise.all([
      getTeacherCourses(),
      getTeacherCourseStats(),
    ])
    courses.value = Array.isArray(coursesResponse) ? coursesResponse : []
    stats.value = statsResponse || {
      totalCourses: 0,
      activeCourses: 0,
      inactiveCourses: 0,
    }
  } catch (err) {
    console.error('Error fetching courses:', err)
    error.value = 'មិនអាចផ្ទុកវគ្គសិក្សាបានទេ។ សូមព្យាយាមម្តងទៀត។'
  } finally {
    isLoading.value = false
  }
}

const viewCourse = (course) => {
  viewingCourse.value = course
  showViewCourseModal.value = true
}

const closeViewModal = () => {
  showViewCourseModal.value = false
  viewingCourse.value = null
}

// Progress helper functions
const getProgressPercent = (course) => {
  if (!course) return 0
  let count = 0
  if (course.progress1) count++
  if (course.progress2) count++
  if (course.progress3) count++
  return Math.round((count / 3) * 100)
}

// Check if a progress step can be toggled (enforce sequential order)
const canToggleProgress = (course, progressKey) => {
  if (progressKey === 'progress1') {
    return true // Can always toggle progress 1
  }
  if (progressKey === 'progress2') {
    return course.progress1 // Can only toggle progress 2 if progress 1 is checked
  }
  if (progressKey === 'progress3') {
    return course.progress1 && course.progress2 // Can only toggle progress 3 if 1 and 2 are checked
  }
  return false
}

const toggleProgress = async (course, progressKey) => {
  if (isUpdatingProgress.value) return

  // Check if this step can be toggled based on previous steps
  if (!canToggleProgress(course, progressKey)) {
    return
  }

  isUpdatingProgress.value = true
  const newValue = !course[progressKey]

  // If unchecking, also uncheck subsequent steps
  const updates = { [progressKey]: newValue }
  if (!newValue) {
    if (progressKey === 'progress1') {
      updates.progress2 = false
      updates.progress3 = false
    } else if (progressKey === 'progress2') {
      updates.progress3 = false
    }
  }

  try {
    await updateCourseProgress(course.id, updates)
    // Update local state
    Object.assign(course, updates)
  } catch (err) {
    console.error('Error updating progress:', err)
    // Could add a toast notification here
  } finally {
    isUpdatingProgress.value = false
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
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Header Section */
.header-section {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.header-text {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 14px;
  background: white;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

/* Stats Section */
.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-icon.total {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.stat-icon.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.stat-icon.inactive {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.stat-icon.progress {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px 0;
  font-weight: 500;
}

.stat-value {
  font-size: 28px;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

/* Filters Section */
.filters-section {
  display: flex;
  gap: 16px;
  margin-bottom: 28px;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.filter-select {
  padding: 12px 16px;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  font-size: 14px;
  background: white;
  min-width: 160px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: #667eea;
}

/* Courses Grid */
.courses-grid {
  min-height: 400px;
}

.courses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 28px;
}

.course-card {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  cursor: pointer;
}

.course-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
}

.course-image-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-status-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(8px);
}

.course-status-badge.active {
  background: rgba(16, 185, 129, 0.9);
  color: white;
}

.course-status-badge.inactive {
  background: rgba(107, 114, 128, 0.9);
  color: white;
}

.course-year-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.95);
  color: #667eea;
  backdrop-filter: blur(8px);
}

.course-content {
  padding: 24px;
}

.course-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.course-code {
  font-size: 12px;
  font-weight: 700;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 4px 10px;
  border-radius: 6px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.course-title {
  font-size: 20px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 20px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 42px;
}

.course-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-icon {
  color: #94a3b8;
  flex-shrink: 0;
}

.meta-text {
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

/* Progress Section */
.course-progress {
  margin-bottom: 20px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 12px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.progress-percent {
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
}

.progress-steps {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.progress-step {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: white;
  border: 1px solid #e2e8f0;
}

.progress-step:hover {
  border-color: #667eea;
  background: #f8fafc;
}

.progress-step.disabled {
  cursor: not-allowed;
  opacity: 0.5;
  background: #f1f5f9;
}

.progress-step.disabled:hover {
  border-color: #e2e8f0;
  background: #f1f5f9;
}

.progress-step.completed {
  background: rgba(16, 185, 129, 0.05);
  border-color: rgba(16, 185, 129, 0.3);
}

.step-checkbox {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  border: 2px solid #d1d5db;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.step-checkbox.checked {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-color: #10b981;
  color: white;
}

.step-checkbox.disabled {
  background: #e5e7eb;
  border-color: #d1d5db;
  color: #9ca3af;
}

.step-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.step-title {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
}

.step-desc {
  font-size: 10px;
  color: #64748b;
}

.progress-bar {
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.course-footer {
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.btn-view-details {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-view-details:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  color: #64748b;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  text-align: center;
}

.error-icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.btn-retry {
  margin-top: 20px;
  padding: 12px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px;
  text-align: center;
}

.empty-icon {
  font-size: 80px;
  margin-bottom: 24px;
}

.empty-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.empty-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 24px;
  width: 100%;
  max-width: 560px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  border-bottom: 1px solid #f1f5f9;
}

.modal-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.btn-close {
  width: 40px;
  height: 40px;
  border: none;
  background: #f1f5f9;
  border-radius: 10px;
  font-size: 24px;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close:hover {
  background: #e2e8f0;
  color: #1e293b;
}

.modal-body {
  padding: 0;
}

.modal-image-wrapper {
  position: relative;
  height: 220px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.modal-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-status-badge {
  position: absolute;
  bottom: 16px;
  right: 16px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.modal-status-badge.active {
  background: rgba(16, 185, 129, 0.95);
  color: white;
}

.modal-status-badge.inactive {
  background: rgba(107, 114, 128, 0.95);
  color: white;
}

.modal-info {
  padding: 28px;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.info-code {
  font-size: 13px;
  font-weight: 700;
  color: #667eea;
  background: rgba(102, 126, 234, 0.1);
  padding: 6px 12px;
  border-radius: 8px;
  font-family: 'Monaco', 'Consolas', monospace;
}

.info-year {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 8px;
}

.info-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.info-subtitle {
  font-size: 15px;
  color: #64748b;
  margin: 0 0 28px 0;
  line-height: 1.6;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 24px;
  background: #f8fafc;
  border-radius: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-label {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 15px;
  font-weight: 600;
  color: #1e293b;
}

.status-value.active {
  color: #10b981;
}

.status-value.inactive {
  color: #6b7280;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  padding: 20px 28px;
  border-top: 1px solid #f1f5f9;
}

.btn-close-modal {
  padding: 12px 32px;
  background: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-close-modal:hover {
  background: #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .courses-container {
    padding: 20px;
  }

  .header-content {
    flex-direction: column;
  }

  .search-box {
    width: 100%;
    min-width: unset;
  }

  .stats-section {
    grid-template-columns: 1fr;
  }

  .courses-list {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
