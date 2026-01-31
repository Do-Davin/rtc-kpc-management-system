import api from './api'

/**
 * Teacher Courses API Service
 * Handles all teacher course-related API calls (READ ONLY)
 * Teachers can only view courses from their department
 */

/**
 * Get all courses for the logged-in teacher's department
 */
export const getTeacherCourses = async () => {
  const response = await api.get('/teacher-courses')
  return response.data?.courses || response.data
}

/**
 * Get active courses for the logged-in teacher's department
 */
export const getActiveTeacherCourses = async () => {
  const response = await api.get('/teacher-courses/active')
  return response.data?.courses || response.data
}

/**
 * Get course statistics for the logged-in teacher's department
 */
export const getTeacherCourseStats = async () => {
  const response = await api.get('/teacher-courses/stats')
  return response.data?.stats || response.data
}

/**
 * Get a single course by ID
 * @param {string} courseId - Course ID
 */
export const getTeacherCourse = async (courseId) => {
  const response = await api.get(`/teacher-courses/${courseId}`)
  return response.data?.course || response.data
}

/**
 * Update course progress checkmarks
 * @param {string} courseId - Course ID
 * @param {object} progressData - Progress data { progress1, progress2, progress3 }
 */
export const updateCourseProgress = async (courseId, progressData) => {
  const response = await api.patch(`/teacher-courses/${courseId}/progress`, progressData)
  return response.data
}

export default {
  getTeacherCourses,
  getActiveTeacherCourses,
  getTeacherCourseStats,
  getTeacherCourse,
  updateCourseProgress,
}
