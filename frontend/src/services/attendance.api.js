import api from './api'

/**
 * Attendance API Service
 * Handles all attendance-related API calls
 */

// ========== Teacher Endpoints ==========

/**
 * Generate a new QR code for attendance session
 */
export const generateQrCode = async (data) => {
  const response = await api.post('/attendance/generate-qr', data)
  return response.data
}

/**
 * Stop the current active attendance session
 */
export const stopAttendanceSession = async (sessionId) => {
  const response = await api.post('/attendance/stop-session', { sessionId })
  return response.data
}

/**
 * Get the current active session for the teacher
 */
export const getActiveSession = async () => {
  const response = await api.get('/attendance/active-session')
  return response.data
}

/**
 * Get attendance records for a specific session
 */
export const getSessionAttendance = async (sessionId) => {
  const response = await api.get(`/attendance/session/${sessionId}/records`)
  return response.data
}

/**
 * Get session details
 */
export const getSessionDetails = async (sessionId) => {
  const response = await api.get(`/attendance/session/${sessionId}`)
  return response.data
}

/**
 * Mark attendance manually
 */
export const markManualAttendance = async (data) => {
  const response = await api.post('/attendance/manual', data)
  return response.data
}

/**
 * Get students for manual attendance
 */
export const getStudentsForAttendance = async (department, year) => {
  const response = await api.get('/attendance/students', {
    params: { department, year }
  })
  return response.data
}

/**
 * Get teacher's session history
 */
export const getSessionHistory = async (limit = 10) => {
  const response = await api.get('/attendance/history', {
    params: { limit }
  })
  return response.data
}

/**
 * Get recent attendance records for teacher to review/edit
 */
export const getRecentRecords = async (limit = 50, department = null, year = null, offset = 0) => {
  const response = await api.get('/attendance/recent-records', {
    params: { limit, department, year, offset }
  })
  return response.data
}

/**
 * Update an attendance record
 */
export const updateAttendanceRecord = async (recordId, data) => {
  const response = await api.put(`/attendance/records/${recordId}`, {
    recordId,
    ...data
  })
  return response.data
}

// ========== Student Endpoints ==========

/**
 * Submit attendance via QR scan
 */
export const submitAttendance = async (qrToken, sessionPassword) => {
  const response = await api.post('/attendance/submit', {
    qrToken,
    sessionPassword
  })
  return response.data
}

/**
 * Get available active sessions for students to join
 */
export const getAvailableSessions = async (filters = {}) => {
  const response = await api.get('/attendance/student/available-sessions', {
    params: filters
  })
  return response.data
}

/**
 * Get student's attendance history
 */
export const getMyAttendance = async (limit = 20, offset = 0) => {
  const response = await api.get('/attendance/student/my-attendance', {
    params: { limit, offset }
  })
  return response.data
}

/**
 * Check if student already submitted for a session
 */
export const checkSubmission = async (sessionId) => {
  const response = await api.get(`/attendance/student/check-submission/${sessionId}`)
  return response.data
}

/**
 * Validate QR token and get session info
 */
export const validateQrToken = async (qrToken) => {
  const response = await api.post('/attendance/student/validate-qr', { qrToken })
  return response.data
}

export default {
  generateQrCode,
  stopAttendanceSession,
  getActiveSession,
  getSessionAttendance,
  getSessionDetails,
  markManualAttendance,
  getStudentsForAttendance,
  getSessionHistory,
  getRecentRecords,
  updateAttendanceRecord,
  submitAttendance,
  getAvailableSessions,
  getMyAttendance,
  checkSubmission,
  validateQrToken
}
