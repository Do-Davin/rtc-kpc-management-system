import api from './api'

/**
 * Student Dashboard API Service
 * Handles all student dashboard-related API calls
 */

// ========== Student Profile ==========

/**
 * Get the logged-in student's profile
 */
export const getStudentProfile = async () => {
  const response = await api.get('/student-dashboard/profile')
  return response.data?.profile || response.data
}

/**
 * Update the logged-in student's profile
 * @param {Object} data - Profile data { fullName?, phoneNumber?, dateOfBirth?, imageUrl? }
 */
export const updateStudentProfile = async (data) => {
  const response = await api.put('/student-dashboard/profile', data)
  return response.data?.profile || response.data
}

// ========== Dashboard Statistics ==========

/**
 * Get dashboard statistics for the logged-in student
 * @param {number} days - Number of days for time range (default 30)
 * Returns (tracking by courses, each course is 2 hours, timeline 7:00-17:00):
 * - presentCourses: Number of courses student was marked present
 * - lateCourses: Number of courses student was late
 * - absentCourses: Number of courses student was absent
 * - attendanceRate: Average attendance percentage
 * - totalCourses: Total number of courses
 */
export const getDashboardStats = async (days = 30) => {
  const response = await api.get('/student-dashboard/stats', {
    params: { days }
  })
  return response.data?.stats || response.data
}

// ========== Attendance Trend ==========

/**
 * Get attendance trend data for chart
 * @param {number} days - Number of days for trend data (default 30)
 * Returns array of daily course attendance data: 
 * { date, percentage, present, absent, late, total, coursesAttended }
 */
export const getAttendanceTrend = async (days = 30) => {
  const response = await api.get('/student-dashboard/attendance-trend', {
    params: { days }
  })
  return response.data?.trend || response.data
}

// ========== Today's Classes ==========

/**
 * Get today's scheduled classes for the student
 * Returns array of today's classes based on student's department and year
 */
export const getTodayClasses = async () => {
  const response = await api.get('/student-dashboard/today-classes')
  return response.data?.classes || response.data
}

// ========== Student's Full Schedule/Timetable ==========

/**
 * Get all schedules for the student (for timetable view)
 * Returns student info and all their scheduled classes
 */
export const getMySchedule = async () => {
  const response = await api.get('/student-dashboard/my-schedule')
  return response.data
}

// ========== Student Courses ==========

/**
 * Get all courses for the student's department
 * Returns courses where course.departmentId === student.departmentId
 */
export const getMyCourses = async () => {
  const response = await api.get('/student-dashboard/my-courses')
  return response.data
}

/**
 * Get a specific course by ID
 * @param {string} courseId - The course ID
 * Returns course details if it belongs to student's department
 */
export const getCourseById = async (courseId) => {
  const response = await api.get(`/student-dashboard/courses/${courseId}`)
  return response.data
}

export default {
  getStudentProfile,
  getDashboardStats,
  getAttendanceTrend,
  getTodayClasses,
  getMySchedule,
  getMyCourses,
  getCourseById
}
