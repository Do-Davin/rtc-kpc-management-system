<template>
  <div class="elibrary-wrapper">
    <div class="header">
      <div>
        <h1 class="title">បណ្ណាល័យអេឡិចត្រូនិក</h1>
        <p class="subtitle">E-Library</p>
      </div>
      <button class="add-book-btn" @click="openAddModal">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        Add Book
      </button>
    </div>

    <!-- Search Bar -->
    <SearchBar
      v-model="searchTerm"
      placeholder="ស្វែងរកសៀវភៅ..."
    />

    <!-- Category Filter -->
    <CategoryFilter
      v-model="selectedCategory"
      :categories="categories"
    />

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Loading books...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchBooks" class="btn-retry">Retry</button>
    </div>

    <!-- Books Grid -->
    <div v-else class="books-grid">
      <BookCard
        v-for="book in books"
        :key="book.id"
        :book="book"
        @view="openBookViewer"
      />
    </div>

    <!-- No Book available -->
    <EmptyState
      v-if="!isLoading && !error && books.length === 0"
      message="No books found"
    />

    <!-- Book Viewer Modal Component -->
    <BookViewer
      :book="selectedBook"
      @close="closeBookViewer"
      @edit="openEditModal"
      @delete="confirmDelete"
    />

    <!-- Add/Edit Book Modal -->
    <div v-if="showBookModal" class="modal-overlay" @click="closeBookModal">
      <div class="modal-content book-form-modal" @click.stop>
        <button @click="closeBookModal" class="close-btn">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <h2 class="modal-title">{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h2>

        <form @submit.prevent="saveBook" class="book-form">
          <div class="form-group">
            <label>Title <span class="required">*</span></label>
            <input v-model="bookForm.title" type="text" required placeholder="Enter book title" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Author</label>
              <input v-model="bookForm.author" type="text" placeholder="Enter author name" />
            </div>
            <div class="form-group">
              <label>Category</label>
              <input v-model="bookForm.category" type="text" placeholder="e.g. Mathematics" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Year</label>
              <input v-model="bookForm.year" type="text" placeholder="e.g. 2024" />
            </div>
            <div class="form-group">
              <label>Pages</label>
              <input v-model.number="bookForm.pages" type="number" placeholder="e.g. 324" />
            </div>
          </div>

          <div class="form-group">
            <label>Cover Image</label>
            <div class="cover-upload-container">
              <div v-if="bookForm.cover || coverPreviewUrl" class="cover-preview">
                <img :src="coverPreviewUrl || getCoverImageUrl(bookForm.cover)" alt="Cover preview" />
                <div v-if="isUploadingCover" class="upload-overlay">
                  <span>Uploading...</span>
                </div>
                <button type="button" class="remove-cover-btn" @click="removeCover" :disabled="isUploadingCover">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              <label v-else class="cover-upload-label">
                <input type="file" accept="image/*" @change="handleCoverUpload" hidden />
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
                <span>Click to upload cover image</span>
              </label>
            </div>
          </div>

          <div class="form-group">
            <label>Book URL (for buying)</label>
            <input v-model="bookForm.bookUrl" type="text" placeholder="https://example.com/book.pdf" />
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="bookForm.description" rows="3" placeholder="Enter book description"></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="closeBookModal">Cancel</button>
            <button type="submit" class="btn-primary" :disabled="isSaving">
              {{ isSaving ? 'Saving...' : (isEditing ? 'Update Book' : 'Add Book') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="showDeleteModal = false">
      <div class="modal-content delete-modal" @click.stop>
        <h2>Delete Book</h2>
        <p>Are you sure you want to delete "{{ bookToDelete?.title }}"?</p>
        <div class="form-actions">
          <button class="btn-secondary" @click="showDeleteModal = false">Cancel</button>
          <button class="btn-danger" @click="deleteBook" :disabled="isDeleting">
            {{ isDeleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import BookViewer from '../_components/BookViewer.vue';
import SearchBar from '../_components/SearchBar.vue';
import CategoryFilter from '../_components/CategoryFilter.vue';
import BookCard from '../_components/BookCard.vue';
import EmptyState from '../_components/EmptyState.vue';
import { getBooks, getCategories, createBook, updateBook, deleteBook as deleteBookApi, uploadCover } from '@/services/elibrary.api';

const searchTerm = ref('');
const selectedCategory = ref('All');
const selectedBook = ref(null);
const books = ref([]);
const categories = ref(['All']);
const isLoading = ref(true);
const error = ref(null);

// Modal states
const showBookModal = ref(false);
const showDeleteModal = ref(false);
const isEditing = ref(false);
const isSaving = ref(false);
const isDeleting = ref(false);
const bookToDelete = ref(null);

// Form data
const bookForm = ref({
  title: '',
  author: '',
  category: '',
  cover: '',
  year: '',
  pages: null,
  description: '',
  bookUrl: ''
});

const editingBookId = ref(null);

// Fetch books from API
const fetchBooks = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const data = await getBooks(searchTerm.value, selectedCategory.value);
    books.value = data;
  } catch (err) {
    console.error('Error fetching books:', err);
    error.value = 'Failed to load books';
  } finally {
    isLoading.value = false;
  }
};

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const data = await getCategories();
    categories.value = ['All', ...data];
  } catch (err) {
    console.error('Error fetching categories:', err);
  }
};

// Watch for search and category changes with debounce
let searchTimeout = null;
watch([searchTerm, selectedCategory], () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    fetchBooks();
  }, 300);
});

// Open book viewer
const openBookViewer = (book) => {
  selectedBook.value = book;
};

const closeBookViewer = () => {
  selectedBook.value = null;
};

// Add/Edit modal functions
const openAddModal = () => {
  isEditing.value = false;
  editingBookId.value = null;
  bookForm.value = {
    title: '',
    author: '',
    category: '',
    cover: '',
    year: '',
    pages: null,
    description: '',
    bookUrl: ''
  };
  coverPreviewUrl.value = '';
  showBookModal.value = true;
};

const openEditModal = (book) => {
  isEditing.value = true;
  editingBookId.value = book.id;
  bookForm.value = {
    title: book.title || '',
    author: book.author || '',
    category: book.category || '',
    cover: book.cover || '',
    year: book.year || '',
    pages: book.pages || null,
    description: book.description || '',
    bookUrl: book.bookUrl || ''
  };
  coverPreviewUrl.value = '';
  selectedBook.value = null;
  showBookModal.value = true;
};

const closeBookModal = () => {
  showBookModal.value = false;
};

const saveBook = async () => {
  if (!bookForm.value.title.trim()) return;

  isSaving.value = true;
  try {
    const bookData = {
      ...bookForm.value,
      pages: bookForm.value.pages || null
    };

    if (isEditing.value) {
      await updateBook(editingBookId.value, bookData);
    } else {
      await createBook(bookData);
    }

    closeBookModal();
    fetchBooks();
    fetchCategories();
  } catch (err) {
    console.error('Error saving book:', err);
    alert('Failed to save book');
  } finally {
    isSaving.value = false;
  }
};

// Delete functions
const confirmDelete = (book) => {
  bookToDelete.value = book;
  selectedBook.value = null;
  showDeleteModal.value = true;
};

// Cover image upload state
const isUploadingCover = ref(false);
const coverPreviewUrl = ref('');

// Cover image upload - uploads to server and stores URL
const handleCoverUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Image size too large! Please select an image smaller than 5MB');
    return;
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file only!');
    return;
  }

  // Show local preview immediately
  coverPreviewUrl.value = URL.createObjectURL(file);

  isUploadingCover.value = true;
  try {
    const result = await uploadCover(file);
    // Store the server URL path (e.g., /covers/cover-123456.jpg)
    bookForm.value.cover = result.url;
  } catch (err) {
    console.error('Error uploading cover:', err);
    alert('Failed to upload cover image!');
    coverPreviewUrl.value = '';
    bookForm.value.cover = '';
  } finally {
    isUploadingCover.value = false;
  }
};

const removeCover = () => {
  bookForm.value.cover = '';
  coverPreviewUrl.value = '';
};

// Get the full cover image URL for display
const getCoverImageUrl = (cover) => {
  if (!cover) return '';
  // If it's already a full URL or data URL, return as is
  if (cover.startsWith('http') || cover.startsWith('data:')) {
    return cover;
  }
  // Otherwise, prepend the API base URL
  return `http://localhost:3000${cover}`;
};

const deleteBook = async () => {
  if (!bookToDelete.value) return;

  isDeleting.value = true;
  try {
    await deleteBookApi(bookToDelete.value.id);
    showDeleteModal.value = false;
    bookToDelete.value = null;
    fetchBooks();
    fetchCategories();
  } catch (err) {
    console.error('Error deleting book:', err);
    alert('Failed to delete book');
  } finally {
    isDeleting.value = false;
  }
};

// Initial fetch
onMounted(() => {
  fetchBooks();
  fetchCategories();
});
</script>

<style scoped>
.elibrary-wrapper {
  width: 100%;
  background: #f9fafb;
  min-height: 100vh;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: var(--purple-500);
  margin: 0 0 5px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.add-book-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #5d5fef;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.add-book-btn:hover {
  background: #4a4cd4;
  transform: translateY(-1px);
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}

/* Loading and Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #5d5fef;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-retry {
  margin-top: 12px;
  padding: 8px 20px;
  background: #5d5fef;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.book-form-modal {
  padding: 30px;
}

.delete-modal {
  padding: 30px;
  max-width: 400px;
  text-align: center;
}

.delete-modal h2 {
  margin: 0 0 12px 0;
  color: #1a1a1a;
}

.delete-modal p {
  color: #666;
  margin: 0 0 24px 0;
}

.close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.modal-title {
  margin: 0 0 24px 0;
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
}

/* Form Styles */
.book-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #ef4444;
}

.form-group input,
.form-group textarea {
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #5d5fef;
  box-shadow: 0 0 0 3px rgba(93, 95, 239, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
}

.btn-primary {
  padding: 10px 24px;
  background: #5d5fef;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background: #4a4cd4;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  padding: 10px 24px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-danger {
  padding: 10px 24px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #dc2626;
}

.btn-danger:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Cover Upload Styles */
.cover-upload-container {
  width: 100%;
}

.cover-upload-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 30px 20px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  color: #6b7280;
}

.cover-upload-label:hover {
  border-color: #5d5fef;
  background: #f8f9ff;
  color: #5d5fef;
}

.cover-upload-label span {
  font-size: 14px;
  font-weight: 500;
}

.cover-preview {
  position: relative;
  width: 150px;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.cover-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-cover-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.2s;
}

.remove-cover-btn:hover {
  background: #dc2626;
  transform: scale(1.1);
}

.remove-cover-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: 500;
}
</style>
