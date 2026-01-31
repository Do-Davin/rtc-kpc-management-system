import api from './api';

// Get all schedules with optional filters
export const getSchedules = async (departmentId = '', year = '') => {
  const params = new URLSearchParams();
  if (departmentId) params.append('departmentId', departmentId);
  if (year) params.append('year', year);

  const response = await api.get(`/schedules?${params.toString()}`);
  return response.data;
};

// Get schedules for the current logged-in teacher
export const getMySchedule = async () => {
  const response = await api.get('/schedules/my-schedule');
  return response.data;
};

// Get a single schedule by ID
export const getSchedule = async (id) => {
  const response = await api.get(`/schedules/${id}`);
  return response.data;
};

// Create a new schedule
export const createSchedule = async (scheduleData) => {
  const response = await api.post('/schedules', scheduleData);
  return response.data;
};

// Update a schedule
export const updateSchedule = async (id, scheduleData) => {
  const response = await api.patch(`/schedules/${id}`, scheduleData);
  return response.data;
};

// Delete a schedule
export const deleteSchedule = async (id) => {
  const response = await api.delete(`/schedules/${id}`);
  return response.data;
};
