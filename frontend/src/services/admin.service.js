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
};