import api from './api'

/**
 * Teacher Dashboard API Service
 * Handles all teacher dashboard-related API calls
 */

// ========== Teacher Profile ==========

/**
 * Get the logged-in teacher's profile
 */
export const getTeacherProfile = async () => {
  const response = await api.get('/teacher-dashboard/profile')
  return response.data?.profile || response.data
}

/**
 * Update the logged-in teacher's profile
 * @param {Object} data - Profile data { fullName?, phoneNumber?, dateOfBirth?, imageUrl? }
 */
export const updateTeacherProfile = async (data) => {
  const response = await api.put('/teacher-dashboard/profile', data)
  return response.data?.profile || response.data
}

// ========== Dashboard Statistics ==========

/**
 * Get dashboard statistics for the logged-in teacher
 * @param {number} days - Number of days for time range (default 30)
 */
export const getDashboardStats = async (days = 30) => {
  const response = await api.get('/teacher-dashboard/stats', {
    params: { days }
  })
  // Backend returns { stats: {...} }
  return response.data?.stats || response.data
}

// ========== Attendance Trend ==========

/**
 * Get attendance trend data for chart
 * @param {number} days - Number of days for trend data (default 30)
 */
export const getAttendanceTrend = async (days = 30) => {
  const response = await api.get('/teacher-dashboard/attendance-trend', {
    params: { days }
  })
  // Backend returns { trend: [...] }
  return response.data?.trend || response.data
}

// ========== Today's Sessions ==========

/**
 * Get today's teaching sessions for the teacher
 */
export const getTodaySessions = async () => {
  const response = await api.get('/teacher-dashboard/today-sessions')
  // Backend returns { sessions: [...] }
  return response.data?.sessions || response.data
}

// ========== Todo CRUD ==========

/**
 * Get all todos for the teacher
 */
export const getTodos = async () => {
  const response = await api.get('/teacher-dashboard/todos')
  // Backend returns { todos: [...] }
  return response.data?.todos || response.data
}

/**
 * Create a new todo
 * @param {Object} data - Todo data { title, description?, dueDate? }
 */
export const createTodo = async (data) => {
  const response = await api.post('/teacher-dashboard/todos', data)
  // Backend returns { todo: {...} }
  return response.data?.todo || response.data
}

/**
 * Update a todo
 * @param {string} todoId - Todo ID
 * @param {Object} data - Update data { title?, description?, dueDate?, status?, isCompleted? }
 */
export const updateTodo = async (todoId, data) => {
  const response = await api.put(`/teacher-dashboard/todos/${todoId}`, data)
  // Backend returns { todo: {...} }
  return response.data?.todo || response.data
}

/**
 * Toggle todo completion status
 * @param {string} todoId - Todo ID
 */
export const toggleTodoComplete = async (todoId) => {
  const response = await api.patch(`/teacher-dashboard/todos/${todoId}/toggle`)
  // Backend returns { todo: {...} }
  return response.data?.todo || response.data
}

/**
 * Delete a todo
 * @param {string} todoId - Todo ID
 */
export const deleteTodo = async (todoId) => {
  const response = await api.delete(`/teacher-dashboard/todos/${todoId}`)
  return response.data
}

// ========== Student Management ==========

/**
 * Get students in teacher's department with filtering
 * @param {Object} params - Query parameters
 * @param {string} [params.search] - Search query for name, email, or student ID
 * @param {string} [params.status] - Filter by status (ACTIVE, INACTIVE, GRADUATED)
 * @param {number} [params.page] - Page number (default 1)
 * @param {number} [params.limit] - Items per page (default 50)
 */
export const getStudents = async (params = {}) => {
  const response = await api.get('/teacher-dashboard/students', { params })
  return response.data
}

/**
 * Get a single student's details
 * @param {string} studentId - Student ID
 */
export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/teacher-dashboard/students/${studentId}`)
  return response.data?.student || response.data
}

/**
 * Add a new student to teacher's department
 * @param {Object} data - Student data
 * @param {string} data.fullName - Student's full name
 * @param {string} data.studentIdCard - Student ID card number
 * @param {string} data.email - Student email
 * @param {number} data.year - Current year of study
 * @param {number} data.enrollmentYear - Year of enrollment
 * @param {string} [data.phoneNumber] - Phone number
 * @param {string} [data.status] - Status (ACTIVE, INACTIVE)
 */
export const addStudent = async (data) => {
  const response = await api.post('/teacher-dashboard/students', data)
  return response.data?.student || response.data
}

/**
 * Update a student in teacher's department
 * @param {string} studentId - Student ID
 * @param {Object} data - Update data
 * @param {string} [data.fullName] - Student's full name
 * @param {string} [data.phoneNumber] - Phone number
 * @param {number} [data.year] - Current year of study
 * @param {string} [data.status] - Status (ACTIVE, INACTIVE)
 */
export const updateStudent = async (studentId, data) => {
  const response = await api.put(`/teacher-dashboard/students/${studentId}`, data)
  return response.data?.student || response.data
}

/**
 * Remove a student from teacher's department (soft delete)
 * @param {string} studentId - Student ID
 */
export const removeStudent = async (studentId) => {
  const response = await api.delete(`/teacher-dashboard/students/${studentId}`)
  return response.data
}

export default {
  // Profile
  getTeacherProfile,
  updateTeacherProfile,
  // Dashboard
  getDashboardStats,
  getAttendanceTrend,
  getTodaySessions,
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
  // Student Management
  getStudents,
  getStudentDetails,
  addStudent,
  updateStudent,
  removeStudent,
}
