<template>
  <div class="attendance-container">
    <!-- Header -->
    <div class="header">
      <h1>Mark Attendance</h1>
      <p class="subtitle">Upload QR code to mark your attendance</p>
    </div>

    <div class="content-grid">
      <!-- QR Upload Section -->
      <div class="card main-card">
        <!-- Step Indicator -->
        <div class="steps">
          <div :class="['step', { active: currentStep >= 1, completed: currentStep > 1 }]">
            <div class="step-number">
              <CheckCircle2 v-if="currentStep > 1" :size="20" />
              <span v-else>1</span>
            </div>
            <span class="step-label">Upload QR</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 1 }"></div>
          <div :class="['step', { active: currentStep >= 2, completed: currentStep > 2 }]">
            <div class="step-number">
              <CheckCircle2 v-if="currentStep > 2" :size="20" />
              <span v-else>2</span>
            </div>
            <span class="step-label">Enter Password</span>
          </div>
          <div class="step-line" :class="{ active: currentStep > 2 }"></div>
          <div :class="['step', { active: currentStep >= 3 }]">
            <div class="step-number">
              <CheckCircle2 v-if="submissionSuccess" :size="20" />
              <span v-else>3</span>
            </div>
            <span class="step-label">Complete</span>
          </div>
        </div>

        <!-- Step 1: QR Upload -->
        <div v-if="currentStep === 1" class="step-content">
          <div
            class="upload-zone"
            :class="{ 'drag-over': isDragOver, 'has-file': qrFile }"
            @dragover.prevent="isDragOver = true"
            @dragleave="isDragOver = false"
            @drop.prevent="handleDrop"
            @click="triggerFileInput"
          >
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileSelect"
              hidden
            />

            <div v-if="!qrFile" class="upload-placeholder">
              <div class="upload-icon-wrapper">
                <Upload :size="32" />
              </div>
              <h3>Upload QR Code</h3>
              <p>Drag and drop or click to select</p>
              <span class="file-types">PNG, JPG, JPEG</span>
            </div>

            <div v-else class="upload-preview">
              <img :src="qrPreview" alt="QR Preview" class="qr-preview-img" />
              <div class="file-info">
                <FileImage :size="20" />
                <span class="file-name">{{ qrFile.name }}</span>
                <button class="remove-btn" @click.stop="clearFile">
                  <X :size="16" />
                </button>
              </div>
            </div>
          </div>

          <button
            class="btn-primary"
            :disabled="!qrFile || isValidating"
            @click="validateQr"
          >
            <span v-if="isValidating" class="flex-center">
              <Loader2 :size="20" class="spinning" /> Validating...
            </span>
            <span v-else class="flex-center">
              <ScanLine :size="20" /> Validate QR Code
            </span>
          </button>
        </div>

        <!-- Step 2: Session Info & Password -->
        <div v-if="currentStep === 2" class="step-content">
          <!-- Session Info Card -->
          <div class="session-info-card">
            <div class="session-header">
              <div class="session-icon">
                <BookOpen :size="24" />
              </div>
              <div class="session-details">
                <h3>{{ sessionInfo.courseName }}</h3>
                <p>{{ sessionInfo.department }} • Year {{ sessionInfo.year }}</p>
                <span class="session-name">{{ sessionInfo.sessionName }}</span>
              </div>
            </div>

            <!-- Countdown Timer -->
            <div class="countdown-section">
              <div class="countdown-timer" :class="{ warning: remainingSeconds <= 30 }">
                <Clock :size="18" />
                <span class="countdown-value">{{ formatTime(remainingSeconds) }}</span>
                <span class="countdown-label">remaining</span>
              </div>
            </div>
          </div>

          <!-- Password Input -->
          <div class="form-group">
            <label for="password">
              <Lock :size="16" />
              Session Password
            </label>
            <div class="password-input">
              <input
                id="password"
                v-model="sessionPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Enter password from whiteboard"
                @keyup.enter="submitAttendance"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" :size="18" />
                <Eye v-else :size="18" />
              </button>
            </div>
            <small class="hint">
              <Info :size="14" />
              Ask your teacher for the session password
            </small>
          </div>

          <div class="action-buttons">
            <button class="btn-secondary" @click="goBack">
              <span class="flex-center"><ArrowLeft :size="18" /> Back</span>
            </button>
            <button
              class="btn-primary"
              :disabled="!sessionPassword || isSubmitting"
              @click="submitAttendance"
            >
              <span v-if="isSubmitting" class="flex-center">
                <Loader2 :size="20" class="spinning" /> Submitting...
              </span>
              <span v-else class="flex-center">
                <CheckCircle2 :size="20" /> Submit Attendance
              </span>
            </button>
          </div>
        </div>

        <!-- Step 3: Success / Error -->
        <div v-if="currentStep === 3" class="step-content">
          <div v-if="submissionSuccess" class="result-card success">
            <div class="result-icon">
              <CheckCircle2 :size="48" />
            </div>
            <h2>Attendance Marked!</h2>
            <p>Your attendance has been successfully recorded.</p>
            <div class="result-details">
              <div class="detail-item">
                <BookOpen :size="16" />
                <span>{{ sessionInfo.courseName }}</span>
              </div>
              <div class="detail-item">
                <Calendar :size="16" />
                <span>{{ formatDate(new Date()) }}</span>
              </div>
              <div class="detail-item">
                <Clock :size="16" />
                <span>{{ formatTime24(new Date()) }}</span>
              </div>
            </div>
            <button class="btn-primary" @click="resetForm">
              <span class="flex-center"><RefreshCw :size="18" /> Mark Another</span>
            </button>
          </div>

          <div v-else class="result-card error">
            <div class="result-icon">
              <XCircle :size="48" />
            </div>
            <h2>Submission Failed</h2>
            <p>{{ submissionError }}</p>
            <button class="btn-primary" @click="goBack">
              <span class="flex-center"><ArrowLeft :size="18" /> Try Again</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Attendance History -->
      <div class="card history-card">
        <div class="card-header">
          <h3>
            <History :size="20" />
            Recent Attendance
          </h3>
          <button class="btn-icon" @click="loadAttendanceHistory" :disabled="isLoadingHistory">
            <RefreshCw :size="18" :class="{ spinning: isLoadingHistory }" />
          </button>
        </div>

        <div class="history-list">
          <div v-if="attendanceHistory.length === 0" class="empty-state">
            <ClipboardList :size="40" />
            <p>No attendance records yet</p>
          </div>

          <div
            v-for="record in attendanceHistory"
            :key="record.id"
            class="history-item"
          >
            <div class="history-status" :class="getStatusClass(record.status)">
              <CheckCircle2 v-if="record.status === 'PRESENT'" :size="16" />
              <FileSignature v-else-if="record.status === 'MANUAL_PRESENT'" :size="16" />
              <XCircle v-else :size="16" />
            </div>
            <div class="history-details">
              <span class="history-course">{{ record.session?.courseName || 'Unknown Course' }}</span>
              <span class="history-date">{{ formatDate(record.markedAt) }}</span>
            </div>
            <span class="history-tag" :class="getStatusClass(record.status)">
              {{ formatStatus(record.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast Notifications -->
    <div v-if="error" class="toast error">
      <AlertCircle :size="20" />
      {{ error }}
      <button @click="error = null"><X :size="18" /></button>
    </div>

    <div v-if="success" class="toast success">
      <CheckCircle2 :size="20" />
      {{ success }}
      <button @click="success = null"><X :size="18" /></button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import jsQR from 'jsqr'
import {
  Upload,
  FileImage,
  X,
  ScanLine,
  Loader2,
  CheckCircle2,
  XCircle,
  BookOpen,
  Clock,
  Lock,
  Eye,
  EyeOff,
  Info,
  ArrowLeft,
  RefreshCw,
  Calendar,
  History,
  ClipboardList,
  FileSignature,
  AlertCircle
} from 'lucide-vue-next'
import {
  submitAttendance as submitAttendanceApi,
  validateQrToken,
  getMyAttendance
} from '@/services/attendance.api'

// Step management
const currentStep = ref(1)

// File upload state
const fileInput = ref(null)
const qrFile = ref(null)
const qrPreview = ref(null)
const isDragOver = ref(false)
const extractedQrToken = ref(null)

// Session state
const sessionInfo = ref(null)
const sessionPassword = ref('')
const showPassword = ref(false)
const remainingSeconds = ref(0)
let countdownInterval = null

// Submission state
const isValidating = ref(false)
const isSubmitting = ref(false)
const submissionSuccess = ref(false)
const submissionError = ref(null)

// History state
const attendanceHistory = ref([])
const isLoadingHistory = ref(false)

// Toast state
const error = ref(null)
const success = ref(null)

// File handling
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    processFile(file)
  }
}

const handleDrop = (event) => {
  isDragOver.value = false
  const file = event.dataTransfer.files?.[0]
  if (file && file.type.startsWith('image/')) {
    processFile(file)
  }
}

const processFile = (file) => {
  qrFile.value = file
  const reader = new FileReader()
  reader.onload = (e) => {
    qrPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const clearFile = () => {
  qrFile.value = null
  qrPreview.value = null
  extractedQrToken.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

// QR Code decoding
const decodeQrFromImage = async () => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const code = jsQR(imageData.data, imageData.width, imageData.height)

      if (code) {
        resolve(code.data)
      } else {
        reject(new Error('Could not read QR code from image'))
      }
    }
    img.onerror = () => reject(new Error('Failed to load image'))
    img.src = qrPreview.value
  })
}

// Validate QR
const validateQr = async () => {
  if (!qrFile.value) return

  isValidating.value = true
  error.value = null

  try {
    // Decode QR from image
    const qrToken = await decodeQrFromImage()
    extractedQrToken.value = qrToken

    // Validate with backend
    const response = await validateQrToken(qrToken)

    if (!response.valid) {
      if (response.alreadySubmitted) {
        error.value = 'You have already submitted attendance for this session'
      } else {
        error.value = response.error || 'Invalid QR code'
      }
      return
    }

    // Store session info and move to step 2
    sessionInfo.value = response.session
    remainingSeconds.value = response.session.remainingSeconds
    startCountdown()
    currentStep.value = 2

  } catch (err) {
    error.value = err.message || 'Failed to validate QR code'
  } finally {
    isValidating.value = false
  }
}

// Countdown timer
const startCountdown = () => {
  if (countdownInterval) clearInterval(countdownInterval)

  countdownInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value--
    } else {
      clearInterval(countdownInterval)
      error.value = 'Session has expired. Please get a new QR code from your teacher.'
      currentStep.value = 1
      clearFile()
    }
  }, 1000)
}

// Submit attendance
const submitAttendance = async () => {
  if (!sessionPassword.value || !extractedQrToken.value) return

  isSubmitting.value = true
  submissionError.value = null

  try {
    await submitAttendanceApi(extractedQrToken.value, sessionPassword.value)

    if (countdownInterval) clearInterval(countdownInterval)

    submissionSuccess.value = true
    currentStep.value = 3
    success.value = 'Attendance marked successfully!'

    // Refresh history
    await loadAttendanceHistory()

  } catch (err) {
    submissionError.value = err.response?.data?.message || 'Failed to submit attendance'
    submissionSuccess.value = false
    currentStep.value = 3
  } finally {
    isSubmitting.value = false
  }
}

// Navigation
const goBack = () => {
  if (currentStep.value === 2) {
    sessionPassword.value = ''
    if (countdownInterval) clearInterval(countdownInterval)
    currentStep.value = 1
  } else if (currentStep.value === 3 && !submissionSuccess.value) {
    sessionPassword.value = ''
    currentStep.value = 2
    startCountdown()
  }
}

const resetForm = () => {
  currentStep.value = 1
  clearFile()
  sessionInfo.value = null
  sessionPassword.value = ''
  submissionSuccess.value = false
  submissionError.value = null
  if (countdownInterval) clearInterval(countdownInterval)
}

// Load attendance history
const loadAttendanceHistory = async () => {
  isLoadingHistory.value = true
  try {
    const response = await getMyAttendance(10)
    attendanceHistory.value = response.records || []
  } catch (err) {
    console.error('Failed to load history:', err)
  } finally {
    isLoadingHistory.value = false
  }
}

// Formatting helpers
const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatTime24 = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatStatus = (status) => {
  const statusMap = {
    'PRESENT': 'Present',
    'MANUAL_PRESENT': 'Manual',
    'ABSENT': 'Absent'
  }
  return statusMap[status] || status
}

const getStatusClass = (status) => {
  if (status === 'PRESENT' || status === 'MANUAL_PRESENT') return 'present'
  return 'absent'
}

// Lifecycle
onMounted(() => {
  loadAttendanceHistory()
})

onUnmounted(() => {
  if (countdownInterval) clearInterval(countdownInterval)
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
  background: linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
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

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.steps {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.step-number {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
}

.step.active .step-number {
  background: var(--color-primary);
  color: white;
}

.step.completed .step-number {
  background: #22c55e;
  color: white;
}

.step-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.step.active .step-label {
  color: var(--color-primary);
}

.step-line {
  width: 60px;
  height: 2px;
  background: #e5e7eb;
  margin: 0 12px;
  margin-bottom: 28px;
  transition: background 0.3s ease;
}

.step-line.active {
  background: var(--color-primary);
}

.upload-zone {
  border: 2px dashed var(--purple-200);
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: var(--purple-50);
  margin-bottom: 24px;
}

.upload-zone:hover {
  border-color: var(--color-primary);
  background: white;
}

.upload-zone.drag-over {
  border-color: var(--color-primary);
  background: var(--purple-100);
}

.upload-zone.has-file {
  border-style: solid;
  border-color: var(--color-primary);
  background: white;
}

.upload-icon-wrapper {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--purple-100) 0%, var(--purple-50) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: var(--color-primary);
}

.upload-placeholder h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.upload-placeholder p {
  color: #6b7280;
  margin: 0 0 8px 0;
  font-size: 14px;
}

.file-types {
  font-size: 12px;
  color: #94a3b8;
}

.upload-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.qr-preview-img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.file-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #f3f4f6;
  border-radius: 8px;
  color: #374151;
}

.file-name {
  font-size: 14px;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remove-btn {
  background: #fee2e2;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #dc2626;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #dc2626;
  color: white;
}

.session-info-card {
  background: linear-gradient(135deg, var(--purple-50) 0%, var(--purple-100) 100%);
  border: 1px solid var(--purple-200);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
}

.session-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.session-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.session-details h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.session-details p {
  margin: 4px 0 0 0;
  font-size: 14px;
  color: #6b7280;
}

.session-name {
  display: inline-block;
  margin-top: 8px;
  padding: 4px 10px;
  background: white;
  border-radius: 6px;
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 500;
}

.countdown-section {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--purple-200);
}

.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  color: #22c55e;
}

.countdown-timer.warning {
  color: #ef4444;
  background: #fef2f2;
}

.countdown-value {
  font-size: 24px;
  font-weight: 700;
  font-family: monospace;
}

.countdown-label {
  font-size: 12px;
  color: #6b7280;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
}

.password-input {
  position: relative;
  display: flex;
}

.password-input input {
  flex: 1;
  padding: 12px 52px 12px 16px;
  border: 2px solid var(--purple-200);
  border-radius: 10px;
  font-size: 15px;
  background: var(--purple-50);
  transition: all 0.2s ease;
}

.password-input input:hover {
  border-color: var(--purple-300);
  background: white;
}

.password-input input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 4px rgba(91, 85, 243, 0.15);
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
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(91, 85, 243, 0.5);
}

.btn-primary:disabled {
  background: linear-gradient(135deg, #94a3b8 0%, #64748b 100%);
  cursor: not-allowed;
  box-shadow: none;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-buttons .btn-secondary {
  flex: 0 0 auto;
}

.action-buttons .btn-primary {
  flex: 1;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.result-card {
  text-align: center;
  padding: 40px 20px;
}

.result-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
}

.result-card.success .result-icon {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #22c55e;
}

.result-card.error .result-icon {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
  color: #ef4444;
}

.result-card h2 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
}

.result-card p {
  color: #6b7280;
  margin: 0 0 24px 0;
}

.result-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 32px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #374151;
  font-size: 14px;
}

.result-card .btn-primary {
  width: auto;
  display: inline-flex;
}

.history-card {
  height: fit-content;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.btn-icon {
  background: #f3f4f6;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
  color: var(--color-primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #9ca3af;
  gap: 8px;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}

.history-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 10px;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f3f4f6;
}

.history-status {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.history-status.present {
  background: #dcfce7;
  color: #22c55e;
}

.history-status.absent {
  background: #fee2e2;
  color: #ef4444;
}

.history-details {
  flex: 1;
  min-width: 0;
}

.history-course {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.history-date {
  font-size: 12px;
  color: #6b7280;
}

.history-tag {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
}

.history-tag.present {
  background: #dcfce7;
  color: #16a34a;
}

.history-tag.absent {
  background: #fee2e2;
  color: #dc2626;
}

.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 20px;
  border-radius: 12px;
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

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
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

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .history-card {
    order: -1;
  }
}

@media (max-width: 640px) {
  .attendance-container {
    padding: 16px;
  }

  .steps {
    flex-wrap: wrap;
    gap: 8px;
  }

  .step-line {
    display: none;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
