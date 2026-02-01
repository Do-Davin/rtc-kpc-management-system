import api from './api';

export default {
  // --- Departments ---
  getDepartments() { return api.get('/departments'); },
  createDepartment(data) { return api.post('/departments', data); },
  updateDepartment(id, data) { return api.patch(`/departments/${id}`, data); },
  deleteDepartment(id) { return api.delete(`/departments/${id}`); },

  // --- Students ---
  getStudents() { return api.get('/students'); },
  createStudent(data) { return api.post('/students', data); },
  updateStudent(id, data) { return api.patch(`/students/${id}`, data); },
  deleteStudent(id) { return api.delete(`/students/${id}`); },

  // --- Teachers ---
  getTeachers() { return api.get('/teachers'); },
  createTeacher(data) { return api.post('/teachers', data); },
  updateTeacher(id, data) { return api.patch(`/teachers/${id}`, data); },
  deleteTeacher(id) { return api.delete(`/teachers/${id}`); },

  // --- Courses ---
  getCourses() { return api.get('/courses'); },
  createCourse(data) {
    return api.post('/courses', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateCourse(id, data) {
    return api.patch(`/courses/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteCourse(id) { return api.delete(`/courses/${id}`); },
  toggleCourseStatus(id) { return api.patch(`/courses/${id}/toggle-status`); },

  // --- E-Library ---
  getBooks() { return api.get('/e-library'); },
  getBook(id) { return api.get(`/e-library/${id}`); },
  createBook(formData) {
    return api.post('/e-library', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateBook(id, formData) {
    return api.patch(`/e-library/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteBook(id) { return api.delete(`/e-library/${id}`); },
  toggleBookAvailability(id) { return api.patch(`/e-library/${id}/toggle-availability`); },
  getBooksStatistics() { return api.get('/e-library/statistics'); },

  // --- NEW: Attendance (Admin View) ---
  getAttendanceStats() {
    return api.get('/attendance/admin/stats');
  },

  getAllSessions(limit = 20, offset = 0) {
    return api.get(`/attendance/admin/all-sessions?limit=${limit}&offset=${offset}`);
  }
};
