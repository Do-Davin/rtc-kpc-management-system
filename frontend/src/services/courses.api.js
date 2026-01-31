import api from './api'

/**
 * Courses API Service
 * Handles all course-related API calls
 */

/**
 * Get all courses for the logged-in teacher
 */
export const getCourses = async () => {
  const response = await api.get('/courses')
  return response.data?.courses || response.data
}

/**
 * Get course statistics
 */
export const getCourseStats = async () => {
  const response = await api.get('/courses/stats')
  return response.data?.stats || response.data
}

/**
 * Create a new course
 * @param {Object} data - Course data { title, description?, image?, level?, duration?, status? }
 */
export const createCourse = async (data) => {
  const response = await api.post('/courses', data)
  return response.data?.course || response.data
}

/**
 * Update a course
 * @param {string} courseId - Course ID
 * @param {Object} data - Update data
 */
export const updateCourse = async (courseId, data) => {
  const response = await api.put(`/courses/${courseId}`, data)
  return response.data?.course || response.data
}

/**
 * Delete a course
 * @param {string} courseId - Course ID
 */
export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/courses/${courseId}`)
  return response.data
}

export default {
  getCourses,
  getCourseStats,
  createCourse,
  updateCourse,
  deleteCourse,
}
