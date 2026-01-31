<template>
  <div class="attendance-container">
    <!-- Header -->
    <div class="header">
      <h1>Student Attendance</h1>
      <p class="subtitle">Generate QR codes and manage student attendance</p>
    </div>

    <!-- Session Setup Section -->
    <div v-if="!activeSession" class="setup-section">
      <div class="card">
        <h2>Start Attendance Session</h2>

        <div class="form-grid">
          <!-- Course Select -->
          <div class="form-group full-width">
            <label for="course">Course <span class="required">*</span></label>
            <select id="course" v-model="form.courseId" @change="onCourseChange" :disabled="isLoadingCourses">
              <option value="">{{ isLoadingCourses ? 'Loading courses...' : 'Select Course' }}</option>
              <option v-for="course in filteredCourses" :key="course.id" :value="course.id">
                {{ course.name }}
              </option>
            </select>
            <small v-if="filteredCourses.length === 0 && !isLoadingCourses" class="hint warning">
              <Info :size="14" />
              No courses found. Please add courses first.
            </small>
          </div>

          <!-- Session Name -->
          <div class="form-group">
            <label for="sessionName">Session Name <span class="optional">(Optional)</span></label>
            <input
              id="sessionName"
              v-model="form.sessionName"
              type="text"
              placeholder="e.g., Lecture 5, Lab 2"
            />
            <small class="hint">
              <Info :size="14" />
              Leave empty to auto-generate
            </small>
          </div>

          <!-- Session Password -->
          <div class="form-group">
            <label for="password">Session Password <span class="required">*</span></label>
            <div class="password-input">
              <input
                id="password"
                v-model="form.sessionPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password (min 4 characters)"
                minlength="4"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
            <small class="hint">
              <Info :size="14" />
              Students will need this password to mark attendance
            </small>
          </div>
        </div>

        <button
          class="btn-primary generate-btn"
          :disabled="!isFormValid || isLoading"
          @click="generateQR"
        >
          <span v-if="isLoading">Generating...</span>
          <span v-else class="flex-center"><QrCode :size="20" /> Generate QR Code</span>
        </button>
      </div>

      <!-- Recent Attendance Records Card -->
      <div class="card recent-records-card">
        <div class="card-header-row">
          <h2>
            <History :size="22" />
            Recent Attendance Records
          </h2>
          <button class="btn-icon" @click="loadRecentRecords" :disabled="isLoadingRecords">
            <RefreshCw :size="18" :class="{ 'spinning': isLoadingRecords }" />
          </button>
        </div>
        <p class="card-description">Review and edit recent attendance records when something went wrong</p>

        <!-- Filter Row -->
        <div class="filter-row">
          <div class="filter-group">
            <label>Department</label>
            <select v-model="recordsFilter.department">
              <option value="">All Departments</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>
          <div class="filter-group">
            <label>Year</label>
            <select v-model="recordsFilter.year">
              <option value="">All Years</option>
              <option v-for="yr in years" :key="yr" :value="yr">Year {{ yr }}</option>
            </select>
          </div>
          <button class="btn-filter" @click="loadRecentRecords" :disabled="isLoadingRecords">
            <span class="flex-center">
              <Search :size="16" />
              Apply Filter
            </span>
          </button>
        </div>

        <!-- Records List -->
        <div class="recent-records-list">
          <!-- Loading Overlay -->
          <div v-if="isLoadingRecords || isLoadingMore" class="loading-overlay">
            <div class="loading-spinner">
              <Loader2 :size="24" class="spinning" />
            </div>
          </div>

          <div v-if="recentRecords.length === 0 && !isLoadingRecords" class="empty-state">
            <ClipboardList :size="48" />
            <p>No recent attendance records</p>
          </div>

          <div v-if="recentRecords.length > 0" class="records-table">
            <div class="table-header">
              <span class="col-student">Student</span>
              <span class="col-course">Course</span>
              <span class="col-session">Session</span>
              <span class="col-time">Time</span>
              <span class="col-status">Status</span>
              <span class="col-actions">Actions</span>
            </div>
            <div
              v-for="record in recentRecords"
              :key="record.id"
              class="record-row"
              :class="{ 'editing': editingRecordId === record.id }"
            >
              <div class="col-student">
                <div class="student-avatar">
                  <User :size="16" />
                </div>
                <div class="student-details-col">
                  <span class="student-name">{{ record.student?.fullName || record.student?.email || 'Unknown' }}</span>
                </div>
              </div>
              <div class="col-course">{{ record.session?.courseName || 'N/A' }}</div>
              <div class="col-session">{{ record.session?.sessionName || 'N/A' }}</div>
              <div class="col-time">{{ formatDateTime(record.markedAt) }}</div>
              <div class="col-status">
                <span v-if="editingRecordId !== record.id" :class="['status-tag', record.status.toLowerCase().replace('_', '-')]">
                  {{ formatStatus(record.status) }}
                </span>
                <select
                  v-else
                  v-model="editForm.status"
                  class="status-select"
                >
                  <option value="PRESENT">Present</option>
                  <option value="MANUAL_PRESENT">Manual Present</option>
                  <option value="LATE">Late</option>
                  <option value="ABSENT">Absent</option>
                </select>
              </div>
              <div class="col-actions">
                <template v-if="editingRecordId !== record.id">
                  <button class="btn-edit" @click="startEditRecord(record)" title="Edit">
                    <Edit3 :size="16" />
                  </button>
                </template>
                <template v-else>
                  <button class="btn-save" @click="saveRecordEdit(record.id)" :disabled="isSavingRecord" title="Save">
                    <Check :size="16" />
                  </button>
                  <button class="btn-cancel" @click="cancelEdit" title="Cancel">
                    <X :size="16" />
                  </button>
                </template>
              </div>
            </div>
          </div>

          <!-- Load More Button -->
          <div v-if="hasMoreRecords && recentRecords.length > 0 && !isLoadingRecords && !isLoadingMore" class="load-more-section">
            <button
              class="btn-load-more"
              @click="loadMoreRecords"
              :disabled="isLoadingMore"
            >
              <span v-if="isLoadingMore" class="flex-center">
                <Loader2 :size="16" class="spinning" />
                Loading...
              </span>
              <span v-else class="flex-center">
                <ChevronDown :size="16" />
                Load More Records
              </span>
            </button>
          </div>
        </div>

        <!-- Edit Remarks (shown when editing) -->
        <div v-if="editingRecordId" class="edit-remarks-section">
          <label>Remarks (Optional)</label>
          <input
            v-model="editForm.remarks"
            type="text"
            placeholder="Add a note about this change..."
          />
        </div>
      </div>
    </div>

    <!-- Active Session Section -->
    <div v-else class="active-session-section">
      <div class="session-grid">
        <!-- QR Code Card -->
        <div class="card qr-card">
          <div class="session-header">
            <div class="session-info">
              <h2>{{ activeSession.courseName }}</h2>
              <p class="session-meta">
                {{ activeSession.department }} • Year {{ activeSession.year }} • {{ activeSession.sessionName }}
              </p>
            </div>
            <div :class="['status-badge', activeSession.status.toLowerCase()]">
              {{ activeSession.status }}
            </div>
          </div>

          <!-- QR Code Display -->
          <div class="qr-display">
            <div v-if="activeSession.status === 'ACTIVE'" class="qr-code-wrapper">
              <div class="qr-code" ref="qrCodeEl"></div>
              <div class="countdown-timer">
                <div class="timer-circle" :style="timerStyle">
                  <span class="timer-text">{{ formatTime(remainingSeconds) }}</span>
                </div>
                <p class="timer-label">Time Remaining</p>
              </div>
            </div>
            <div v-else class="session-ended">
              <div class="ended-icon-wrapper">
                <ClockAlert class="ended-icon" :size="48" />
              </div>
              <h3 class="ended-title">Session {{ activeSession.status === 'EXPIRED' ? 'Expired' : 'Stopped' }}</h3>
              <p class="ended-subtitle">This attendance session has {{ activeSession.status === 'EXPIRED' ? 'expired' : 'been stopped' }}. Start a new session to continue taking attendance.</p>
              <button class="btn-primary back-btn" @click="clearSession">
                <span class="flex-center"><ArrowLeft :size="18" /> Start New Session</span>
              </button>
            </div>
          </div>

          <!-- Password Display -->
          <div class="password-display" v-if="activeSession.status === 'ACTIVE'">
            <span class="password-label">Session Password:</span>
            <span class="password-value">{{ sessionPassword }}</span>
          </div>

          <!-- Action Buttons -->
          <div class="session-actions" v-if="activeSession.status === 'ACTIVE'">
            <button
              class="btn-danger"
              @click="stopSession"
              :disabled="isLoading"
            >
              <span class="flex-center"><Square :size="18" fill="currentColor" /> Stop Attendance</span>
            </button>
            <button
              class="btn-secondary"
              @click="clearSession"
            >
              <span class="flex-center"><RefreshCw :size="18" /> New Session</span>
            </button>
          </div>
        </div>

        <!-- Attendance List Card -->
        <div class="card attendance-card">
          <div class="attendance-header">
            <h3>Live Attendance</h3>
            <div class="attendance-stats">
              <span class="stat present"><CheckCircle2 :size="16" /> {{ presentCount }}</span>
              <span class="stat manual"><FileSignature :size="16" /> {{ manualPresentCount }}</span>
              <span class="stat absent"><XCircle :size="16" /> {{ absentCount }}</span>
            </div>
            <button class="btn-icon" @click="refreshAttendance" :disabled="isRefreshing">
              <RefreshCw :size="20" :class="{ 'spinning': isRefreshing }" />
            </button>
          </div>

          <div class="attendance-list">
            <div v-if="attendanceRecords.length === 0" class="empty-state">
              <ClipboardList class="empty-icon" :size="48" />
              <p>No attendance records yet</p>
            </div>
            <div
              v-for="record in attendanceRecords"
              :key="record.id"
              class="attendance-item"
            >
              <div class="student-info">
                <div class="student-avatar">
                  <User :size="20" />
                </div>
                <div class="student-details">
                  <span class="student-name">{{ record.student?.email || 'Unknown Student' }}</span>
                  <span class="marked-time">{{ formatDateTime(record.markedAt) }}</span>
                </div>
              </div>
              <span :class="['status-tag', record.status.toLowerCase().replace('_', '-')]">
                {{ formatStatus(record.status) }}
              </span>
            </div>
          </div>

          <!-- Manual Attendance Button -->
          <button
            class="btn-outline manual-btn"
            @click="showManualModal = true"
          >
            <span class="flex-center"><PenLine :size="16" /> Mark Manual Attendance</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Manual Attendance Modal -->
    <div v-if="showManualModal" class="modal-overlay" @click.self="showManualModal = false">
      <div class="modal">
        <div class="modal-header">
          <h3>Manual Attendance</h3>
          <button class="close-btn" @click="showManualModal = false">
            <X :size="24" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label for="studentSearch">Search Student</label>
            <input
              id="studentSearch"
              v-model="studentSearch"
              type="text"
              placeholder="Search by name, email, or ID..."
            />
          </div>

          <div class="student-list">
            <div
              v-for="student in filteredStudents"
              :key="student.id"
              class="student-row"
            >
              <div class="student-info">
                <div class="student-avatar">
                  <User :size="16" />
                </div>
                <div class="student-details">
                  <span class="student-name">{{ student.fullName }}</span>
                  <span class="student-email">{{ student.email }} · {{ student.studentId }}</span>
                </div>
              </div>
              <div class="attendance-buttons">
                <button
                  class="btn-small present"
                  :disabled="isMarkingAttendance"
                  @click="markManual(student.id, 'MANUAL_PRESENT')"
                  :class="{ 'active': getStudentStatus(student.id) === 'MANUAL_PRESENT' }"
                >
                  Present
                </button>
                <button
                  class="btn-small absent"
                  :disabled="isMarkingAttendance"
                  @click="markManual(student.id, 'ABSENT')"
                  :class="{ 'active': getStudentStatus(student.id) === 'ABSENT' }"
                >
                  Absent
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showManualModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Error Toast -->
    <div v-if="error" class="toast error">
      {{ error }}
      <button @click="error = null"><X :size="18" /></button>
    </div>

    <!-- Success Toast -->
    <div v-if="success" class="toast success">
      {{ success }}
      <button @click="success = null"><X :size="18" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import QRCode from 'qrcode'
import {
  Eye,
  EyeOff,
  QrCode,
  ClockAlert,
  Square,
  RefreshCw,
  ClipboardList,
  CheckCircle2,
  FileSignature,
  XCircle,
  User,
  PenLine,
  X,
  Info,
  ArrowLeft,
  History,
  Loader2,
  Edit3,
  Check,
  Search,
  ChevronDown
} from 'lucide-vue-next'
import {
  generateQrCode,
  stopAttendanceSession,
  getActiveSession,
  getSessionAttendance,
  markManualAttendance,
  getStudentsForAttendance,
  getRecentRecords,
  updateAttendanceRecord
} from '@/services/attendance.api'
import adminService from '@/services/admin.service'
import { getStudents } from '@/services/teacher-dashboard.api'
import { getCourses } from '@/services/courses.api'

// Form state
const form = ref({
  courseId: '',
  courseName: '',
  sessionName: '',
  sessionPassword: ''
})

const showPassword = ref(false)
const isLoading = ref(false)
const isRefreshing = ref(false)
const isMarkingAttendance = ref(false)
const error = ref(null)
const success = ref(null)

// Recent records state
const recentRecords = ref([])
const isLoadingRecords = ref(false)
const isLoadingMore = ref(false)
const recordsPage = ref(1)
const recordsPerPage = 20
const hasMoreRecords = ref(true)
const recordsFilter = ref({
  department: '',
  year: ''
})
const editingRecordId = ref(null)
const editForm = ref({
  status: '',
  remarks: ''
})
const isSavingRecord = ref(false)

// Session state
const activeSession = ref(null)
const sessionPassword = ref('')
const remainingSeconds = ref(0)
const qrCodeEl = ref(null)
let countdownInterval = null
let refreshInterval = null

// Attendance state
const attendanceRecords = ref([])
const students = ref([])
const showManualModal = ref(false)
const studentSearch = ref('')

// Data from API (fetched on mount)
const departments = ref([])
const isLoadingDepartments = ref(false)
const isLoadingCourses = ref(false)

const years = ref([1, 2, 3, 4, 5])

// Courses fetched from backend API
const courses = ref([])

// Computed
const filteredCourses = computed(() => {
  // Return all courses from the teacher - they are already filtered by teacher's department
  return courses.value
})

const isFormValid = computed(() => {
  return form.value.courseId &&
    form.value.sessionPassword.length >= 4
})

const presentCount = computed(() =>
  attendanceRecords.value.filter(r => r.status === 'PRESENT').length
)

const manualPresentCount = computed(() =>
  attendanceRecords.value.filter(r => r.status === 'MANUAL_PRESENT').length
)

const absentCount = computed(() =>
  attendanceRecords.value.filter(r => r.status === 'ABSENT').length
)

const filteredStudents = computed(() => {
  const search = studentSearch.value.toLowerCase()
  return students.value.filter(s =>
    (s.fullName?.toLowerCase().includes(search)) ||
    (s.email?.toLowerCase().includes(search)) ||
    (s.studentId?.toLowerCase().includes(search))
  )
})

const timerStyle = computed(() => {
  const percentage = (remainingSeconds.value / 120) * 100
  const color = remainingSeconds.value <= 30 ? '#ef4444' : '#22c55e'
  return {
    background: `conic-gradient(${color} ${percentage}%, #e5e7eb ${percentage}%)`
  }
})

// Methods
const onCourseChange = () => {
  const course = courses.value.find(c => c.id === form.value.courseId)
  form.value.courseName = course?.name || ''
}

const generateQR = async () => {
  if (!isFormValid.value) return

  isLoading.value = true
  error.value = null

  // Get selected course details
  const selectedCourse = courses.value.find(c => c.id === form.value.courseId)
  const department = selectedCourse?.department || ''
  const year = selectedCourse?.year || 1

  // Auto-generate session name if not provided
  const sessionName = form.value.sessionName || `Session ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`

  try {
    const response = await generateQrCode({
      courseId: form.value.courseId,
      courseName: form.value.courseName,
      department: department,
      year: year,
      sessionName: sessionName,
      sessionPassword: form.value.sessionPassword
    })

    // Store password for display
    sessionPassword.value = form.value.sessionPassword

    // Set active session
    activeSession.value = {
      id: response.sessionId,
      courseName: form.value.courseName,
      department: getDepartmentName(department),
      year: year,
      sessionName: sessionName,
      status: 'ACTIVE',
      qrToken: response.qrToken,
      expiryTime: new Date(response.expiryTime)
    }

    // Calculate remaining time
    remainingSeconds.value = response.expiresInSeconds

    // Generate QR code
    await nextTick()
    await generateQRCodeImage(response.qrToken)

    // Start countdown
    startCountdown()

    // Start refresh interval for attendance
    startRefreshInterval()

    // Load students for manual attendance
    await loadStudents()

    success.value = 'QR code generated successfully!'
    setTimeout(() => success.value = null, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to generate QR code'
    setTimeout(() => error.value = null, 5000)
  } finally {
    isLoading.value = false
  }
}

const generateQRCodeImage = async (token) => {
  if (!qrCodeEl.value) return

  try {
    qrCodeEl.value.innerHTML = ''
    const canvas = document.createElement('canvas')
    await QRCode.toCanvas(canvas, token, {
      width: 200,
      margin: 2,
      color: {
        dark: '#1f2937',
        light: '#ffffff'
      }
    })
    qrCodeEl.value.appendChild(canvas)
  } catch (err) {
    console.error('QR generation error:', err)
  }
}

const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)

  countdownInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      // Session expired
      if (activeSession.value) {
        activeSession.value.status = 'EXPIRED'
      }
      clearInterval(countdownInterval)
    }
  }, 1000)
}

const startRefreshInterval = () => {
  if (refreshInterval) clearInterval(refreshInterval)

  // Refresh attendance list every 5 seconds
  refreshInterval = setInterval(refreshAttendance, 5000)
}

const stopSession = async () => {
  if (!activeSession.value) return

  isLoading.value = true
  try {
    await stopAttendanceSession(activeSession.value.id)
    activeSession.value.status = 'STOPPED'
    remainingSeconds.value = 0

    if (countdownInterval) clearInterval(countdownInterval)

    success.value = 'Attendance session stopped'
    setTimeout(() => success.value = null, 3000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to stop session'
    setTimeout(() => error.value = null, 5000)
  } finally {
    isLoading.value = false
  }
}

const clearSession = () => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (refreshInterval) clearInterval(refreshInterval)

  activeSession.value = null
  sessionPassword.value = ''
  remainingSeconds.value = 0
  attendanceRecords.value = []

  // Reset form
  form.value = {
    courseId: '',
    courseName: '',
    sessionName: '',
    sessionPassword: ''
  }
}

const refreshAttendance = async () => {
  if (!activeSession.value) return

  isRefreshing.value = true
  try {
    const response = await getSessionAttendance(activeSession.value.id)
    attendanceRecords.value = response.records || []
  } catch (err) {
    console.error('Failed to refresh attendance:', err)
  } finally {
    isRefreshing.value = false
  }
}

const loadStudents = async () => {
  try {
    // Use teacher-dashboard API to get students from teacher's department
    const response = await getStudents({
      status: 'ACTIVE', // Only get active students for attendance
      limit: 100
    })
    students.value = response.students || []
  } catch (err) {
    console.error('Failed to load students:', err)
    // Fallback to attendance API if teacher-dashboard fails
    try {
      const fallbackResponse = await getStudentsForAttendance(
        form.value.department,
        form.value.year
      )
      students.value = fallbackResponse.students || []
    } catch (fallbackErr) {
      console.error('Fallback also failed:', fallbackErr)
    }
  }
}

const markManual = async (studentId, status) => {
  if (!activeSession.value) return

  isMarkingAttendance.value = true
  try {
    const result = await markManualAttendance({
      sessionId: activeSession.value.id,
      studentId,
      status,
      remarks: 'Marked manually by teacher'
    })

    // Update local records
    const existingIndex = attendanceRecords.value.findIndex(
      r => r.studentId === studentId
    )
    if (existingIndex >= 0) {
      attendanceRecords.value[existingIndex] = result
    } else {
      attendanceRecords.value.unshift(result)
    }

    success.value = 'Attendance marked successfully'
    setTimeout(() => success.value = null, 2000)
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to mark attendance'
    setTimeout(() => error.value = null, 5000)
  } finally {
    isMarkingAttendance.value = false
  }
}

const getStudentStatus = (studentId) => {
  const record = attendanceRecords.value.find(r => r.studentId === studentId)
  return record?.status || null
}

const getDepartmentName = (id) => {
  return departments.value.find(d => d.id === id)?.name || id
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status) => {
  const statusMap = {
    'PRESENT': 'Present',
    'MANUAL_PRESENT': 'Manual',
    'ABSENT': 'Absent',
    'LATE': 'Late'
  }
  return statusMap[status] || status
}

// Recent records methods
const loadRecentRecords = async (reset = true) => {
  if (reset) {
    isLoadingRecords.value = true
    recordsPage.value = 1
    // Don't clear records here - keep them visible during loading
  } else {
    isLoadingMore.value = true
  }

  try {
    const limit = recordsPerPage
    const offset = (recordsPage.value - 1) * recordsPerPage

    const response = await getRecentRecords(
      limit,
      recordsFilter.value.department || null,
      recordsFilter.value.year || null,
      offset
    )

    const newRecords = response.records || []

    if (reset) {
      // Replace records only after data arrives
      recentRecords.value = newRecords
    } else {
      recentRecords.value = [...recentRecords.value, ...newRecords]
    }

    // Check if there are more records
    hasMoreRecords.value = newRecords.length === limit

  } catch (err) {
    console.error('Failed to load recent records:', err)
    error.value = 'Failed to load recent records'
  } finally {
    isLoadingRecords.value = false
    isLoadingMore.value = false
  }
}

const loadMoreRecords = async () => {
  if (isLoadingMore.value || !hasMoreRecords.value) return
  recordsPage.value++
  await loadRecentRecords(false)
}

const startEditRecord = (record) => {
  editingRecordId.value = record.id
  editForm.value = {
    status: record.status,
    remarks: record.remarks || ''
  }
}

const cancelEdit = () => {
  editingRecordId.value = null
  editForm.value = { status: '', remarks: '' }
}

const saveRecordEdit = async (recordId) => {
  isSavingRecord.value = true
  try {
    await updateAttendanceRecord(recordId, {
      status: editForm.value.status,
      remarks: editForm.value.remarks || null
    })

    // Update local record
    const index = recentRecords.value.findIndex(r => r.id === recordId)
    if (index >= 0) {
      recentRecords.value[index].status = editForm.value.status
      recentRecords.value[index].remarks = editForm.value.remarks
    }

    success.value = 'Attendance record updated successfully'
    cancelEdit()
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to update record'
  } finally {
    isSavingRecord.value = false
  }
}

// Check for existing active session on mount
onMounted(async () => {
  // Load departments and courses from API
  await Promise.all([
    loadDepartments(),
    loadCourses()
  ])

  // Load recent records on mount
  loadRecentRecords()

  try {
    const response = await getActiveSession()
    if (response.session) {
      activeSession.value = response.session

      // Calculate remaining time
      const expiry = new Date(response.session.expiryTime)
      const now = new Date()
      remainingSeconds.value = Math.max(0, Math.floor((expiry - now) / 1000))

      if (remainingSeconds.value > 0 && response.session.status === 'ACTIVE') {
        await nextTick()
        await generateQRCodeImage(response.session.qrToken)
        startCountdown()
        startRefreshInterval()
        await loadStudents()
      }

      await refreshAttendance()
    }
  } catch (err) {
    console.error('Failed to check active session:', err)
  }
})

// Load departments from API
const loadDepartments = async () => {
  isLoadingDepartments.value = true
  try {
    const response = await adminService.getDepartments()
    departments.value = response.data || []
  } catch (err) {
    console.error('Failed to load departments:', err)
    error.value = 'Failed to load departments'
  } finally {
    isLoadingDepartments.value = false
  }
}

// Load courses from API (teacher's courses)
const loadCourses = async () => {
  isLoadingCourses.value = true
  try {
    const coursesData = await getCourses()
    // Map courses to expected format for the attendance form
    courses.value = (coursesData || []).map(course => ({
      id: course.id,
      name: course.title || course.name,
      department: course.departmentId,
      year: course.level || 1
    }))
  } catch (err) {
    console.error('Failed to load courses:', err)
    error.value = 'Failed to load courses'
  } finally {
    isLoadingCourses.value = false
  }
}

// Cleanup on unmount
onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
  if (refreshInterval) clearInterval(refreshInterval)
})

// Auto-clear toasts
watch(error, (val) => {
  if (val) setTimeout(() => error.value = null, 5000)
})

watch(success, (val) => {
  if (val) setTimeout(() => success.value = null, 3000)
})
</script>

<style scoped>
.attendance-container {
  width: 100%;
  height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.header {
  margin-bottom: 32px;
}

.header h1 {
  font-size: 32px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--purple-700) 0%, var(--purple-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -0.5px;
}

.subtitle {
  color: #64748b;
  margin-top: 8px;
  font-size: 16px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
}

.card h2 {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 24px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.required {
  color: #ef4444;
  font-weight: 700;
  font-size: 16px;
}

.optional {
  color: #94a3b8;
  font-size: 12px;
  font-weight: 400;
  margin-left: 4px;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid var(--purple-200);
  border-radius: 10px;
  font-size: 15px;
  background: var(--purple-50);
  transition: all 0.2s ease;
}

.form-group input:hover,
.form-group select:hover {
  border-color: var(--purple-300);
  background: white;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(91, 85, 243, 0.15);
}

.form-group input::placeholder {
  color: #94a3b8;
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
  padding-right: 52px;
}

.toggle-password {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #94a3b8;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s;
}

.toggle-password:hover {
  background: #f1f5f9;
  color: var(--color-primary);
}

.hint {
  color: #64748b;
  font-size: 12px;
  margin-top: 6px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.hint.warning {
  color: #f59e0b;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0 auto;
  gap: 8px;
}


.btn-primary {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--purple-600) 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(91, 85, 243, 0.4);
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 85, 243, 0.5);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.back-btn {
  margin-top: 8px;
  padding: 12px 24px;
  width: auto;
  display: inline-flex;
  font-size: 15px;
}

.generate-btn {
  width: 100%;
}

/* Active Session Styles */
.session-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.qr-card {
  display: flex;
  flex-direction: column;
}

.session-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.session-info h2 {
  margin: 0;
}

.session-meta {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status-badge.active {
  background: #dcfce7;
  color: #16a34a;
}

.status-badge.expired {
  background: #fef3c7;
  color: #d97706;
}

.status-badge.stopped {
  background: #fee2e2;
  color: #dc2626;
}

.qr-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px;
  background: #f9fafb;
  border-radius: 12px;
  margin-bottom: 20px;
}

.qr-code-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.qr-code {
  padding: 16px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.countdown-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.timer-circle {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.timer-circle::before {
  content: '';
  position: absolute;
  inset: 4px;
  background: white;
  border-radius: 50%;
}

.timer-text {
  position: relative;
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
}

.timer-label {
  margin-top: 8px;
  font-size: 12px;
  color: #6b7280;
}

.session-ended {
  text-align: center;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.ended-icon-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-100) 0%, var(--purple-50) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;
}

.ended-icon {
  color: var(--color-primary);
}

.ended-title {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0;
}

.ended-subtitle {
  color: #6b7280;
  margin: 0;
  max-width: 320px;
  line-height: 1.5;
  font-size: 14px;
}

.password-display {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  background: linear-gradient(135deg, var(--purple-50) 0%, var(--purple-100) 100%);
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid var(--purple-200);
}

.password-label {
  color: #6b7280;
  font-size: 14px;
}

.password-value {
  font-weight: 600;
  color: var(--color-primary);
  font-size: 16px;
  letter-spacing: 2px;
}

.session-actions {
  display: flex;
  gap: 12px;
}

.btn-danger {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-secondary {
  flex: 1;
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

/* Attendance Card */
.attendance-card {
  display: flex;
  flex-direction: column;
}

.attendance-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.attendance-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.attendance-stats {
  display: flex;
  gap: 12px;
  margin-left: auto;
}

.stat {
  font-size: 14px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

.stat.present {
  color: #16a34a;
}

.stat.manual {
  color: var(--color-primary);
}

.stat.absent {
  color: #ef4444;
}

.btn-icon {
  background: #f3f4f6;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.attendance-list {
  flex: 1;
  overflow-y: auto;
  max-height: 400px;
  margin-bottom: 16px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  color: #9ca3af;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.attendance-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  margin-bottom: 8px;
}

.student-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.student-avatar {
  width: 36px;
  height: 36px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}

.student-details {
  display: flex;
  flex-direction: column;
}

.student-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 14px;
}

.marked-time {
  font-size: 12px;
  color: #6b7280;
}

.status-tag {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-tag.present {
  background: #dcfce7;
  color: #16a34a;
}

.status-tag.manual-present {
  background: var(--purple-100);
  color: var(--color-primary);
}

.status-tag.absent {
  background: #fee2e2;
  color: #dc2626;
}

.status-tag.late {
  background: #fef3c7;
  color: #d97706;
}

.btn-outline {
  width: 100%;
  background: transparent;
  color: var(--color-primary);
  border: 2px dashed var(--color-primary);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-outline:hover {
  background: var(--purple-50);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
  color: #1f2937;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.student-list {
  margin-top: 16px;
}

.student-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-radius: 8px;
  background: #f9fafb;
  margin-bottom: 8px;
}

.student-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.student-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.student-email {
  font-size: 12px;
  color: #6b7280;
}

.student-details-col {
  display: flex;
  flex-direction: column;
}

.student-details-col .student-name {
  font-size: 13px;
  font-weight: 500;
  color: #1f2937;
}

.attendance-buttons {
  display: flex;
  gap: 8px;
}

.btn-small {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-small.present {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.btn-small.present:hover,
.btn-small.present.active {
  background: #16a34a;
  color: white;
}

.btn-small.absent {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.btn-small.absent:hover,
.btn-small.absent.active {
  background: #dc2626;
  color: white;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

/* Toast Notifications */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1001;
  animation: slideIn 0.3s ease;
}

.toast.error {
  background: #fee2e2;
  color: #dc2626;
}

.toast.success {
  background: #dcfce7;
  color: #16a34a;
}

.toast button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.toast button:hover {
  opacity: 1;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Recent Records Styles */
.recent-records-card {
  margin-top: 24px;
}

.card-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.card-header-row h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.card-description {
  color: #64748b;
  margin: 0 0 20px 0;
  font-size: 14px;
}

.filter-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 160px;
}

.btn-filter {
  align-self: flex-end;
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-filter:hover:not(:disabled) {
  background: var(--purple-600);
  transform: translateY(-1px);
}

.btn-filter:disabled {
  background: #94a3b8;
  cursor: not-allowed;
}

.recent-records-list {
  position: relative;
  min-height: 200px;
  max-height: 400px;
  overflow-y: auto;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: 12px;
}

.loading-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: var(--color-primary);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #94a3b8;
  gap: 12px;
  min-height: 200px;
}

.records-table {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
}

.load-more-section {
  display: flex;
  justify-content: center;
  padding: 16px;
}

.btn-load-more {
  padding: 10px 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 2px solid #e2e8f0;
  color: var(--color-primary);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-load-more:hover:not(:disabled) {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(91, 85, 243, 0.2);
}

.btn-load-more:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 80px;
  gap: 12px;
  padding: 12px 16px;
  background: #f8fafc;
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.record-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1fr 1fr 1fr 80px;
  gap: 12px;
  padding: 12px 16px;
  border-top: 1px solid #e5e7eb;
  align-items: center;
  font-size: 14px;
  transition: background 0.2s;
}

.record-row:hover {
  background: #f8fafc;
}

.record-row.editing {
  background: #eff6ff;
  border-top-color: #bfdbfe;
}

.record-row .col-student {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1f2937;
  font-weight: 500;
}

.record-row .student-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
}

.record-row .col-course,
.record-row .col-session,
.record-row .col-time {
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-select {
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 13px;
  background: white;
}

.col-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.btn-edit,
.btn-save,
.btn-cancel {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-edit {
  background: #f3f4f6;
  color: #6b7280;
}

.btn-edit:hover {
  background: #e5e7eb;
  color: var(--color-primary);
}

.btn-save {
  background: #dcfce7;
  color: #16a34a;
}

.btn-save:hover:not(:disabled) {
  background: #22c55e;
  color: white;
}

.btn-cancel {
  background: #fee2e2;
  color: #dc2626;
}

.btn-cancel:hover {
  background: #dc2626;
  color: white;
}

.edit-remarks-section {
  margin-top: 16px;
  padding: 16px;
  background: #eff6ff;
  border-radius: 10px;
  border: 1px solid #bfdbfe;
}

.edit-remarks-section label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 8px;
}

.edit-remarks-section input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.edit-remarks-section input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Responsive */
@media (max-width: 1024px) {
  .session-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .record-row {
    grid-template-columns: 1.5fr 1fr 1fr 80px;
  }

  .col-session,
  .col-time {
    display: none;
  }
}

@media (max-width: 640px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-group.full-width {
    grid-column: span 1;
  }

  .session-actions {
    flex-direction: column;
  }

  .filter-row {
    flex-direction: column;
  }

  .table-header,
  .record-row {
    grid-template-columns: 1fr 1fr 80px;
  }

  .col-course {
    display: none;
  }
}
</style>
