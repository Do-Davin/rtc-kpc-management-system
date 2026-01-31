import api from './api'

/**
 * Admin Courses API Service
 * Handles all course CRUD operations for administrators
 * Admins can create, update, and delete courses
 */

/**
 * Get all courses (Admin only)
 * @param {string} departmentId - Optional department ID to filter by
 */
export const getCourses = async (departmentId = null) => {
  const params = departmentId ? `?departmentId=${departmentId}` : ''
  const response = await api.get(`/courses${params}`)
  return response.data?.courses || response.data
}

/**
 * Get all active courses
 */
export const getActiveCourses = async () => {
  const response = await api.get('/courses/active')
  return response.data?.courses || response.data
}

/**
 * Get a single course by ID
 * @param {string} courseId - Course ID
 */
export const getCourse = async (courseId) => {
  const response = await api.get(`/courses/${courseId}`)
  return response.data?.course || response.data
}

/**
 * Create a new course (Admin only)
 * @param {Object|FormData} data - Course data
 */
export const createCourse = async (data) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
  const response = await api.post('/courses', data, config)
  return response.data?.course || response.data
}

/**
 * Update a course (Admin only)
 * @param {string} courseId - Course ID
 * @param {Object|FormData} data - Update data
 */
export const updateCourse = async (courseId, data) => {
  const config = data instanceof FormData ? { headers: { 'Content-Type': 'multipart/form-data' } } : {}
  const response = await api.patch(`/courses/${courseId}`, data, config)
  return response.data?.course || response.data
}

/**
 * Toggle course status (Admin only)
 * @param {string} courseId - Course ID
 */
export const toggleCourseStatus = async (courseId) => {
  const response = await api.patch(`/courses/${courseId}/toggle-status`)
  return response.data?.course || response.data
}

/**
 * Delete a course (Admin only)
 * @param {string} courseId - Course ID
 */
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`)
  return response.data
}

export default {
  getCourses,
  getActiveCourses,
  getCourse,
  createCourse,
  updateCourse,
  toggleCourseStatus,
  deleteCourse,
}
