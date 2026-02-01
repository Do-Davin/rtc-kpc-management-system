import api from './api';

// Get all books with optional filters
export const getBooks = async (search = '', category = '') => {
  const params = new URLSearchParams();
  if (search) params.append('search', search);
  if (category && category !== 'All') params.append('category', category);

  const response = await api.get(`/e-library?${params.toString()}`);
  return response.data;
};

// Get a single book by ID
export const getBook = async (id) => {
  const response = await api.get(`/e-library/${id}`);
  return response.data;
};

// Get all categories
export const getCategories = async () => {
  const response = await api.get('/e-library/categories');
  return response.data;
};

// Upload cover image
export const uploadCover = async (file) => {
  const formData = new FormData();
  formData.append('cover', file);

  const response = await api.post('/e-library/upload-cover', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Create a new book
export const createBook = async (bookData) => {
  const response = await api.post('/e-library', bookData);
  return response.data;
};

// Update a book
export const updateBook = async (id, bookData) => {
  const response = await api.patch(`/e-library/${id}`, bookData);
  return response.data;
};

// Delete a book
export const deleteBook = async (id) => {
  const response = await api.delete(`/e-library/${id}`);
  return response.data;
};
