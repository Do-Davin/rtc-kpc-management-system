import api from './api'

/**
 * Teacher Dashboard API Service
 * Handles all teacher dashboard-related API calls
 */

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

export default {
  getDashboardStats,
  getAttendanceTrend,
  getTodaySessions,
  getTodos,
  createTodo,
  updateTodo,
  toggleTodoComplete,
  deleteTodo,
}
