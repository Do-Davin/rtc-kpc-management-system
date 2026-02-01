<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted } from 'vue'
import adminService from '@/services/admin.service'
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  Check,
  X,
  Calendar,
  User,
  Tag,
  Hash,
  Building2,
  FileText,
  BarChart3
} from 'lucide-vue-next'

const books = ref([])
const showModal = ref(false)
const showSuccessModal = ref(false)
const showStatsModal = ref(false)
const isEditing = ref(false)
const editId = ref(null)
const searchQuery = ref('')
const filterCategory = ref('')
const filterAvailability = ref('')
const loading = ref(false)
const submitting = ref(false)
const imagePreview = ref(null)
const selectedFile = ref(null)
const statistics = ref(null)

const form = ref({
  title: '',
  author: '',
  year: new Date().getFullYear(),
  category: 'OTHER',
  available: true,
  description: '',
  isbn: '',
  publisher: '',
  pages: null,
  cover: null,
})

const createdBook = ref({ title: '', isbn: '' })

const categories = [
  { value: 'SCIENCE', label: 'វិទ្យាសាស្ត្រ', color: '#3b82f6' },
  { value: 'MATHEMATICS', label: 'គណិតវិទ្យា', color: '#8b5cf6' },
  { value: 'ENGINEERING', label: 'វិស្វកម្ម', color: '#f59e0b' },
  { value: 'HISTORY', label: 'ប្រវត្តិរិទ្យា', color: '#6366f1' },
  { value: 'TECHNOLOGY', label: 'បច្ចេកវិទ្យា', color: '#06b6d4' },
  { value: 'MEDICINE', label: 'វេជ្ជសាស្ត្រ', color: '#ef4444' },
  { value: 'EDUCATION', label: 'ការអប់រំ', color: '#84cc16' },
  { value: 'OTHER', label: 'ផ្សេងៗ', color: '#94a3b8' },
]

const fetchData = async () => {
  loading.value = true
  try {
    const res = await adminService.getBooks()
    books.value = res.data
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const res = await adminService.getBooksStatistics()
    statistics.value = res.data
    showStatsModal.value = true
  } catch (err) {
    console.error(err)
  }
}

const filteredBooks = computed(() => {
  let result = books.value

  if (filterCategory.value) {
    result = result.filter((b) => b.category === filterCategory.value)
  }

  if (filterAvailability.value !== '') {
    const available = filterAvailability.value === 'true'
    result = result.filter((b) => b.available === available)
  }

  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase()
    result = result.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        b.isbn?.toLowerCase().includes(lower) ||
        b.publisher?.toLowerCase().includes(lower),
    )
  }

  return result
})

const getCategoryColor = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.color : '#94a3b8'
}

const getCategoryLabel = (category) => {
  const cat = categories.find(c => c.value === category)
  return cat ? cat.label : 'Other'
}

const openCreate = () => {
  isEditing.value = false
  imagePreview.value = null
  selectedFile.value = null
  form.value = {
    title: '',
    author: '',
    year: new Date().getFullYear(),
    category: 'OTHER',
    available: true,
    description: '',
    isbn: '',
    publisher: '',
    pages: null,
    cover: null,
  }
  showModal.value = true
}

const openEdit = (book) => {
  isEditing.value = true
  editId.value = book.id
  imagePreview.value = book.cover ? `http://localhost:3000${book.cover}` : null
  selectedFile.value = null
  form.value = {
    title: book.title,
    author: book.author,
    year: book.year,
    category: book.category,
    available: book.available,
    description: book.description || '',
    isbn: book.isbn || '',
    publisher: book.publisher || '',
    pages: book.pages || null,
    cover: null,
  }
  showModal.value = true
}

const handleImageSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.value.title)
    formData.append('author', form.value.author)
    formData.append('year', form.value.year)
    formData.append('category', form.value.category)
    formData.append('available', form.value.available)
    formData.append('description', form.value.description)
    formData.append('isbn', form.value.isbn)
    formData.append('publisher', form.value.publisher)
    if (form.value.pages) {
      formData.append('pages', form.value.pages)
    }

    if (selectedFile.value) {
      formData.append('cover', selectedFile.value)
    }

    if (isEditing.value) {
      await adminService.updateBook(editId.value, formData)
      showModal.value = false
    } else {
      const response = await adminService.createBook(formData)
      createdBook.value = {
        title: response.data.title,
        isbn: response.data.isbn || 'N/A',
      }
      showModal.value = false
      showSuccessModal.value = true
    }

    await fetchData()
  } catch (err) {
    alert(err.response?.data?.message || 'Error saving book')
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (id) => {
  if (!confirm('Are you sure you want to delete this book?')) return
  try {
    await adminService.deleteBook(id)
    await fetchData()
  } catch (err) {
    alert('Failed to delete book')
  }
}

const toggleAvailability = async (id) => {
  try {
    await adminService.toggleBookAvailability(id)
    await fetchData()
  } catch (err) {
    alert('Failed to toggle availability')
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="page-container">
    <div class="page-header">
      <div>
        <h2 class="page-title">បណ្ណាល័យអេឡិចត្រូនិក</h2>
        <p class="page-subtitle">E-Library</p>
      </div>
      <div class="header-actions">
        <button @click="fetchStatistics" class="btn-stats">
          <BarChart3 size="18" /> ស្ថិតិ
        </button>
        <span class="badge">{{ books.length }} ក្បាល</span>
        <button @click="openCreate" class="btn-primary teal">
          <Plus size="18" /> បន្ថែមសៀវភៅថ្មី
        </button>
      </div>
    </div>

    <div class="controls-bar">
      <div class="search-box">
        <Search size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="ស្វែងរកតាម: ចំណងជើង, អ្នកនិពន្ធ, ISBN..." />
      </div>
      <div class="filter-box">
        <select v-model="filterCategory">
          <option value="">ប្រភេទសៀវភៅ</option>
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>
      <div class="filter-box">
        <select v-model="filterAvailability">
          <option value="">ស្ថានភាព</option>
          <option value="true">ទំនេរ</option>
          <option value="false">បានខ្ចី</option>
        </select>
      </div>
    </div>

    <div v-if="loading" class="loading-state">Loading books...</div>

    <div v-else-if="filteredBooks.length > 0" class="books-grid">
      <div v-for="book in filteredBooks" :key="book.id" class="book-card">
        <!-- Book Cover -->
        <div class="book-cover-container">
          <img v-if="book.cover" :src="`http://localhost:3000${book.cover}`" :alt="book.title" class="book-cover" />
          <div v-else class="book-cover-placeholder">
            <BookOpen size="48" />
          </div>

          <!-- Category Badge on Cover -->
          <div class="category-overlay">
            <span class="category-badge-small" :style="{
              backgroundColor: getCategoryColor(book.category) + '20',
              color: getCategoryColor(book.category),
              borderColor: getCategoryColor(book.category)
            }">
              {{ getCategoryLabel(book.category) }}
            </span>
          </div>

          <!-- Availability Indicator -->
          <div class="availability-indicator" :class="{ available: book.available }">
            <div class="indicator-dot"></div>
          </div>
        </div>

        <!-- Book Content -->
        <div class="book-content">
          <div class="book-header">
            <h3 class="book-title">{{ book.title }}</h3>
            <div class="book-author">
              <User size="12" />
              <span>{{ book.author }}</span>
            </div>
          </div>

          <div class="book-meta">
            <div class="meta-item">
              <Calendar size="12" />
              <span>{{ book.year }}</span>
            </div>
          </div>

          <div class="card-actions">
            <button @click="toggleAvailability(book.id)" class="btn-availability"
              :class="{ available: book.available }">
              <Check v-if="book.available" size="14" />
              <X v-else size="14" />
              {{ book.available ? 'ទំនេរ' : 'បានខ្ចី' }}
            </button>
            <div class="action-buttons">
              <button @click="openEdit(book)" class="btn-icon-card edit" title="Edit">
                <Edit2 size="16" />
              </button>
              <button @click="handleDelete(book.id)" class="btn-icon-card delete" title="Delete">
                <Trash2 size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <BookOpen size="48" />
      <p>No books found</p>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content large">
        <h3>{{ isEditing ? 'Edit Book' : 'Add New Book' }}</h3>
        <form @submit.prevent="handleSubmit">
          <!-- Image Upload -->
          <div class="form-group">
            <label>រូបភាពសៀវភៅ</label>
            <div class="image-upload-area">
              <div v-if="imagePreview" class="image-preview">
                <img :src="imagePreview" alt="Preview" />
                <button type="button" @click="imagePreview = null; selectedFile = null" class="remove-image">
                  <X size="16" />
                </button>
              </div>
              <label v-else for="image-input" class="upload-placeholder">
                <ImageIcon size="32" />
                <span>សូមចុចដើម្បីបញ្ចូលរូបភាពសៀវភៅ</span>
                <span class="upload-hint">PNG, JPG, WEBP, AVIF (max 5MB)</span>
              </label>
              <input id="image-input" type="file" accept="image/*" @change="handleImageSelect" style="display: none" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ចំណងជើងសៀវភៅ *</label>
              <input v-model="form.title" type="text" required />
            </div>
            <div class="form-group half">
              <label>អ្នកនិពន្ធ *</label>
              <input v-model="form.author" type="text" required />
            </div>
          </div>

          <div class="form-group">
            <label>ការពិពណ៌នា</label>
            <textarea v-model="form.description" rows="3" placeholder="ខ្លះៗអំពីសៀវភៅ"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ប្រភេទសៀវភៅ *</label>
              <select v-model="form.category" required>
                <option v-for="cat in categories" :key="cat.value" :value="cat.value">
                  {{ cat.label }}
                </option>
              </select>
            </div>
            <div class="form-group half">
              <label>ឆ្នាំផលិត *</label>
              <input v-model="form.year" type="number" min="1000" max="2100" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ISBN (លេខកូដ)</label>
              <input v-model="form.isbn" type="text" placeholder="978-0-..." />
            </div>
            <div class="form-group half">
              <label>អ្នកផ្សព្វផ្សាយ</label>
              <input v-model="form.publisher" type="text" placeholder="Publisher name" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>ចំនួនទំព័រ</label>
              <input v-model="form.pages" type="number" min="1" placeholder="Number of pages" />
            </div>
            <div class="form-group half">
              <label>ស្ថានភាព</label>
              <select v-model="form.available">
                <option :value="true">ទំនេរ</option>
                <option :value="false">បានខ្ចី</option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn-text">បោះបង់</button>
            <button type="submit" :disabled="submitting" class="btn-primary teal">
              {{ submitting ? 'Saving...' : isEditing ? 'Save Changes' : 'បញ្ចូលសៀវភៅ' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal-content success-content">
        <div class="success-icon teal">
          <Check size="32" />
        </div>
        <h3>សៀវភៅបានបញ្ចូល - ជោគជ័យ!</h3>
        <div class="credential-box">
          <div class="cred-row">
            <span class="label">ចំណងជើងសៀវភៅ:</span>
            <span class="value">{{ createdBook.title }}</span>
          </div>
          <div class="cred-row">
            <span class="label">ISBN:</span>
            <span class="value font-mono">{{ createdBook.isbn }}</span>
          </div>
        </div>
        <button @click="showSuccessModal = false" class="btn-primary teal w-full mt-4">
          រូចរាល់
        </button>
      </div>
    </div>

    <!-- Statistics Modal -->
    <div v-if="showStatsModal && statistics" class="modal-overlay">
      <div class="modal-content stats-modal">
        <h3>ស្ថិតិនៃបណ្ណាល័យ</h3>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon total">
              <BookOpen size="24" />
            </div>
            <div class="stat-info">
              <span class="stat-label">ចំនួនសៀវភៅសរុប</span>
              <span class="stat-value">{{ statistics.total }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon available">
              <Check size="24" />
            </div>
            <div class="stat-info">
              <span class="stat-label">ទំនេរ</span>
              <span class="stat-value">{{ statistics.available }}</span>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon borrowed">
              <X size="24" />
            </div>
            <div class="stat-info">
              <span class="stat-label">បានខ្ចី</span>
              <span class="stat-value">{{ statistics.borrowed }}</span>
            </div>
          </div>
        </div>

        <div class="category-stats">
          <h4>ប្រភេទនៃសៀវភៅ</h4>
          <div class="category-list">
            <div v-for="item in statistics.byCategory" :key="item.category" class="category-stat-item">
              <div class="category-stat-label">
                <span class="category-dot" :style="{ backgroundColor: getCategoryColor(item.category) }"></span>
                <span>{{ getCategoryLabel(item.category) }}</span>
              </div>
              <span class="category-stat-count">{{ item.count }}</span>
            </div>
          </div>
        </div>

        <button @click="showStatsModal = false" class="btn-primary teal w-full mt-4">
          បិទ
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
}

.page-subtitle {
  color: #64748b;
  margin-top: 0.25rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.badge {
  background: #e2e8f0;
  color: #475569;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  font-size: 0.85rem;
  font-weight: 600;
}

.btn-primary {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
}

.btn-primary.teal {
  background: #14b8a6;
}

.btn-primary.teal:hover {
  background: #0d9488;
}

.btn-stats {
  background: white;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.btn-stats:hover {
  background: #f8fafc;
  border-color: #14b8a6;
  color: #14b8a6;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.controls-bar {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box input {
  width: 100%;
  padding: 0.6rem 1rem 0.6rem 2.5rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
}

.filter-box select {
  padding: 0.6rem 1rem;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  background: white;
  cursor: pointer;
}

/* BOOK GRID LAYOUT */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 1.25rem;
}

.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.book-card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-4px);
  border-color: #14b8a6;
}

.book-cover-container {
  position: relative;
  width: 100%;
  height: 280px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1px solid #f1f5f9;
  overflow: hidden;
}

.book-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: drop-shadow(0 4px 6px rgba(0,0,0,0.1));
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover {
  transform: scale(1.02);
}

.book-cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
}

.category-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
}

.category-badge-small {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  backdrop-filter: blur(8px);
  border: 1.5px solid;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.availability-indicator {
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(254, 226, 226, 0.95);
  padding: 6px 10px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #991b1b;
  border: 1px solid #fca5a5;
}

.availability-indicator.available {
  background: rgba(220, 252, 231, 0.95);
  color: #15803d;
  border-color: #86efac;
}

.indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #991b1b;
  animation: pulse 2s infinite;
}

.availability-indicator.available .indicator-dot {
  background: #15803d;
}

@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.book-content {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.book-header {
  margin-bottom: 0.5rem;
}

.book-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.2;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.3rem;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #14b8a6;
  font-weight: 600;
}

.book-author svg {
  color: #94a3b8;
}

.book-description {
  font-size: 0.85rem;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.55rem;
}

.book-meta {
  margin-bottom: 1rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: #64748b;
}

.meta-item svg {
  color: #94a3b8;
  flex-shrink: 0;
}

.card-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.btn-availability {
  flex: 1;
  padding: 0.5rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.btn-availability.available {
  background: #dcfce7;
  color: #15803d;
}

.btn-availability:hover {
  opacity: 0.8;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.btn-icon-card {
  padding: 0.5rem;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}

.btn-icon-card.edit {
  color: #2563eb;
  background: #eff6ff;
}

.btn-icon-card.edit:hover {
  background: #dbeafe;
}

.btn-icon-card.delete {
  color: #ef4444;
  background: #fef2f2;
}

.btn-icon-card.delete:hover {
  background: #fee2e2;
}

.loading-state,
.empty-state {
  padding: 4rem;
  text-align: center;
  color: #94a3b8;
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-state svg {
  color: #cbd5e1;
}

/* MODAL STYLES */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content.large {
  max-width: 600px;
}

.modal-content h3 {
  margin: 0 0 1.5rem 0;
  font-size: 1.3rem;
  color: #1e293b;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.half {
  flex: 1;
}

.form-group label {
  display: block;
  margin-bottom: 0.4rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: #475569;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  outline: none;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
}

.image-upload-area {
  margin-top: 0.5rem;
}

.image-preview {
  position: relative;
  width: 100%;
  height: 200px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #e2e8f0;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  border: 2px dashed #cbd5e1;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #94a3b8;
  text-align: center;
  padding: 20px;
}

.upload-placeholder:hover {
  border-color: #14b8a6;
  color: #14b8a6;
}

.upload-placeholder svg {
  margin-bottom: 12px;
  display: block;
}

.upload-placeholder span {
  display: block;
  font-size: 0.95rem;
  font-weight: 500;
}

.upload-hint {
  font-size: 0.8rem;
  color: #94a3b8;
  margin-top: 4px;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.btn-text {
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-weight: 500;
  padding: 0.6rem 1.2rem;
}

.success-content {
  text-align: center;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: #dcfce7;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
}

.success-icon.teal {
  background: #ccfbf1;
  color: #14b8a6;
}

.credential-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 1rem;
  border-radius: 8px;
  text-align: left;
  margin: 1rem 0;
}

.cred-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.cred-row:last-child {
  margin-bottom: 0;
}

.label {
  color: #64748b;
  font-size: 0.9rem;
}

.value {
  color: #1e293b;
  font-weight: 500;
}

/* STATISTICS MODAL */
.stats-modal {
  max-width: 500px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.75rem;
}

.stat-icon.total {
  background: #eff6ff;
  color: #2563eb;
}

.stat-icon.available {
  background: #dcfce7;
  color: #15803d;
}

.stat-icon.borrowed {
  background: #fee2e2;
  color: #991b1b;
}

.stat-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.category-stats h4 {
  font-size: 1rem;
  color: #1e293b;
  margin: 0 0 1rem 0;
}

.category-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 300px;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.category-stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.category-stat-label {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: #475569;
  font-weight: 500;
}

.category-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.category-stat-count {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
  background: white;
  padding: 0.25rem 0.75rem;
  border-radius: 99px;
  border: 1px solid #e2e8f0;
}

.w-full {
  width: 100%;
}

.mt-4 {
  margin-top: 1rem;
}

.font-mono {
  font-family: monospace;
}

/* Responsive */
@media (max-width: 768px) {
  .books-grid {
    grid-template-columns: 1fr;
  }

  .controls-bar {
    flex-direction: column;
  }

  .search-box {
    max-width: 100%;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
