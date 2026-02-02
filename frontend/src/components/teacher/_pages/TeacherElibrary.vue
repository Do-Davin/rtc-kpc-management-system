<template>
  <div class="elibrary-wrapper">
    <!-- Hero Header -->
    <div class="hero-header">
      <div class="hero-content">
        <div class="hero-icon">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <path d="M8 7h8M8 11h6"></path>
          </svg>
        </div>
        <div>
          <h1 class="title">បណ្ណាល័យអេឡិចត្រូនិក</h1>
          <p class="subtitle">Browse our collection of educational resources</p>
        </div>
      </div>
      <div class="stats-badges">
        <div class="stat-badge">
          <span class="stat-number">{{ books.length }}</span>
          <span class="stat-text">Total Books</span>
        </div>
        <div class="stat-badge">
          <span class="stat-number">{{ categories.length - 1 }}</span>
          <span class="stat-text">Categories</span>
        </div>
      </div>
    </div>

    <!-- Search and Filter Bar -->
    <div class="controls-bar">
      <div class="search-wrapper">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          v-model="searchTerm"
          type="text"
          placeholder="Search books by title or author..."
          class="search-input"
        />
        <button v-if="searchTerm" @click="searchTerm = ''" class="clear-search">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="view-toggle">
        <button :class="['toggle-btn', { active: viewMode === 'grid' }]" @click="viewMode = 'grid'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
          </svg>
        </button>
        <button :class="['toggle-btn', { active: viewMode === 'list' }]" @click="viewMode = 'list'">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="8" y1="6" x2="21" y2="6"></line>
            <line x1="8" y1="12" x2="21" y2="12"></line>
            <line x1="8" y1="18" x2="21" y2="18"></line>
            <line x1="3" y1="6" x2="3.01" y2="6"></line>
            <line x1="3" y1="12" x2="3.01" y2="12"></line>
            <line x1="3" y1="18" x2="3.01" y2="18"></line>
          </svg>
        </button>
      </div>
    </div>

    <!-- Category Pills -->
    <div class="category-section">
      <span class="category-label">Categories:</span>
      <div class="category-pills">
        <button
          v-for="cat in categories"
          :key="cat"
          :class="['category-pill', { active: selectedCategory === cat }]"
          @click="selectedCategory = cat"
        >
          <!-- All Books -->
          <svg v-if="cat === 'All'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <path d="M12 6v7M9 9h6"></path>
          </svg>
          <!-- Mathematics -->
          <svg v-else-if="cat === 'Mathematics'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="19" y1="5" x2="5" y2="19"></line>
            <circle cx="6.5" cy="6.5" r="2.5"></circle>
            <circle cx="17.5" cy="17.5" r="2.5"></circle>
          </svg>
          <!-- Science -->
          <svg v-else-if="cat === 'Science'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 3h6v6l4 9H5l4-9V3z"></path>
            <path d="M10 3v6"></path>
            <path d="M14 3v6"></path>
            <circle cx="12" cy="15" r="1"></circle>
          </svg>
          <!-- Literature -->
          <svg v-else-if="cat === 'Literature'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <!-- History -->
          <svg v-else-if="cat === 'History'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 21h18"></path>
            <path d="M5 21V7l7-4 7 4v14"></path>
            <path d="M9 21v-6h6v6"></path>
          </svg>
          <!-- Books List View -->
          <svg v-else-if="cat === 'Technology'" class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
          <!-- Default Book Icon -->
          <svg v-else class="pill-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- Results Info -->
    <div v-if="!isLoading && !error" class="results-info">
      <span>Showing <strong>{{ filteredBooks.length }}</strong> of {{ books.length }} books</span>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-animation">
        <div class="book-loader">
          <div class="page"></div>
          <div class="page"></div>
          <div class="page"></div>
        </div>
      </div>
      <p>Loading library...</p>
    </div>
    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="12"></line>
          <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
      </div>
      <h3>Oops! Something went wrong</h3>
      <p>{{ error }}</p>
      <button @click="fetchBooks" class="btn-retry">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="23 4 23 10 17 10"></polyline>
          <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
        </svg>
        Try Again
      </button>
    </div>

    <!-- Books Grid View -->
    <div v-else-if="filteredBooks.length > 0 && viewMode === 'grid'" class="books-grid">
      <div
        v-for="book in filteredBooks"
        :key="book.id"
        class="book-card"
        @click="openBookViewer(book)"
      >
        <div class="book-cover">
          <img :src="getCoverUrl(book.cover)" :alt="book.title" @error="handleImageError" />
          <div class="book-overlay">
            <span class="view-btn">View Details</span>
          </div>
        </div>
        <div class="book-info">
          <span class="book-category-tag">{{ book.category || 'Uncategorized' }}</span>
          <h3 class="book-title">{{ book.title }}</h3>
          <p class="book-author">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            {{ book.author || 'Unknown Author' }}
          </p>
          <div class="book-meta">
            <span v-if="book.year" class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ book.year }}
            </span>
            <span v-if="book.pages" class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              {{ book.pages }} pages
            </span>
            <span v-if="book.isbn" class="meta-item">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18M3 12h18M3 18h18"></path>
              </svg>
              {{ book.isbn }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Books List View -->
    <div v-else-if="filteredBooks.length > 0 && viewMode === 'list'" class="books-list">
      <div
        v-for="book in filteredBooks"
        :key="book.id"
        class="book-list-item"
        @click="openBookViewer(book)"
      >
        <div class="list-cover">
          <img :src="getCoverUrl(book.cover)" :alt="book.title" @error="handleImageError" />
        </div>
        <div class="list-info">
          <span class="book-category-tag">{{ book.category || 'Uncategorized' }}</span>
          <h3 class="list-title">{{ book.title }}</h3>
          <p class="list-author">By {{ book.author || 'Unknown Author' }}</p>
          <p class="list-description">{{ book.description || 'No description available' }}</p>
          <div class="list-meta">
            <span v-if="book.year" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {{ book.year }}
            </span>
            <span v-if="book.pages" class="meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="16" y1="13" x2="8" y2="13"></line>
                <line x1="16" y1="17" x2="8" y2="17"></line>
              </svg>
              {{ book.pages }} pages
            </span>
          </div>
        </div>
        <div class="list-action">
          <button class="view-details-btn">
            View
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-illustration">
        <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#d1d5db" stroke-width="1">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
        </svg>
      </div>
      <h3>No Books Found</h3>
      <p>Try adjusting your search or filter to find what you're looking for</p>
      <button @click="resetFilters" class="btn-reset">
        Clear Filters
      </button>
    </div>

    <!-- Book Viewer Modal (View Only) -->
    <Transition name="modal">
      <div v-if="selectedBook" class="modal-overlay" @click="closeBookViewer">
        <div class="modal-content" @click.stop>
          <button @click="closeBookViewer" class="close-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="modal-body">
            <div class="modal-cover">
              <img :src="getCoverUrl(selectedBook.cover)" :alt="selectedBook.title" />
            </div>

            <div class="modal-info">
              <span class="modal-category">{{ selectedBook.category || 'Uncategorized' }}</span>
              <h2 class="modal-title">{{ selectedBook.title }}</h2>
              <p class="modal-author">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                {{ selectedBook.author || 'Unknown Author' }}
              </p>

              <div class="modal-stats">
                <div class="modal-stat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <div>
                    <span class="stat-value">{{ selectedBook.year || 'N/A' }}</span>
                    <span class="stat-label">Year</span>
                  </div>
                </div>
                <div class="modal-stat">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                  </svg>
                  <div>
                    <span class="stat-value">{{ selectedBook.pages || 'N/A' }}</span>
                    <span class="stat-label">Pages</span>
                  </div>
                </div>
              </div>

              <!-- ISBN -->
              <div v-if="selectedBook.isbn" class="modal-isbn">
                <span class="isbn-label">ISBN:</span>
                <span class="isbn-value">{{ selectedBook.isbn }}</span>
              </div>

              <div class="modal-description">
                <h4>About this book</h4>
                <p>{{ selectedBook.description || 'No description available for this book.' }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { getBooks, getCategories } from '@/services/elibrary.api'

// State
const searchTerm = ref('')
const selectedCategory = ref('All')
const selectedBook = ref(null)
const books = ref([])
const categories = ref(['All'])
const isLoading = ref(true)
const error = ref(null)
const viewMode = ref('grid')

// Computed filtered books
const filteredBooks = computed(() => {
  let result = books.value

  // Filter by search term
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(
      (book) =>
        book.title?.toLowerCase().includes(term) ||
        book.author?.toLowerCase().includes(term)
    )
  }

  // Filter by category
  if (selectedCategory.value && selectedCategory.value !== 'All') {
    result = result.filter((book) => book.category === selectedCategory.value)
  }

  return result
})

// Fetch books from API
const fetchBooks = async () => {
  isLoading.value = true
  error.value = null
  try {
    const data = await getBooks()
    books.value = data || []
  } catch (err) {
    console.error('Error fetching books:', err)
    error.value = 'Failed to load books. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Fetch categories from API
const fetchCategories = async () => {
  try {
    const data = await getCategories()
    categories.value = ['All', ...(data || [])]
  } catch (err) {
    console.error('Error fetching categories:', err)
  }
}

// Default book cover as inline SVG data URI
const defaultCover = `data:image/svg+xml,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
  <rect fill="#e2e8f0" width="200" height="280"/>
  <g transform="translate(100, 120)">
    <path d="M-30 -20 L-30 30 Q-30 35 -25 35 L25 35 Q30 35 30 30 L30 -20 Q30 -25 25 -25 L-25 -25 Q-30 -25 -30 -20" fill="none" stroke="#94a3b8" stroke-width="3"/>
    <path d="M-25 -20 L-25 30" stroke="#94a3b8" stroke-width="2"/>
    <line x1="-15" y1="-10" x2="20" y2="-10" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-15" y1="0" x2="20" y2="0" stroke="#cbd5e1" stroke-width="2"/>
    <line x1="-15" y1="10" x2="10" y2="10" stroke="#cbd5e1" stroke-width="2"/>
  </g>
  <text x="100" y="200" font-family="Arial, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">No Cover</text>
</svg>
`)}`

// Get cover image URL
const getCoverUrl = (cover) => {
  if (!cover) return defaultCover
  if (cover.startsWith('http') || cover.startsWith('data:')) {
    return cover
  }
  return `http://localhost:3000${cover}`
}

// Handle image error
const handleImageError = (e) => {
  e.target.src = defaultCover
}

// Book viewer functions
const openBookViewer = (book) => {
  selectedBook.value = book
  document.body.style.overflow = 'hidden'
}

const closeBookViewer = () => {
  selectedBook.value = null
  document.body.style.overflow = ''
}

// Reset filters
const resetFilters = () => {
  searchTerm.value = ''
  selectedCategory.value = 'All'
}

// Initialize
onMounted(() => {
  fetchBooks()
  fetchCategories()
})
</script>

<style scoped>
.elibrary-wrapper {
  width: 100%;
  min-height: 100vh;
  padding: 0;
}

/* Hero Header */
.hero-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  padding: 32px;
  margin-bottom: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.hero-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.hero-icon {
  width: 64px;
  height: 64px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
}

.subtitle {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.stats-badges {
  display: flex;
  gap: 16px;
}

.stat-badge {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 14px 24px;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: white;
}

.stat-text {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.8);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Controls Bar */
.controls-bar {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 280px;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 14px 44px 14px 48px;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 15px;
  background: white;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.1);
}

.search-input::placeholder {
  color: #9ca3af;
}

.clear-search {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: #f3f4f6;
  border: none;
  padding: 6px;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-search:hover {
  background: #e5e7eb;
  color: #374151;
}

.view-toggle {
  display: flex;
  background: white;
  border-radius: 10px;
  padding: 4px;
  border: 2px solid #e5e7eb;
}

.toggle-btn {
  padding: 10px 14px;
  border: none;
  background: none;
  cursor: pointer;
  color: #9ca3af;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
}

.toggle-btn:hover {
  color: #667eea;
}

.toggle-btn.active {
  background: #667eea;
  color: white;
}

/* Category Section */
.category-section {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.category-label {
  font-size: 14px;
  font-weight: 600;
  color: #6b7280;
}

.category-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border: 2px solid #e5e7eb;
  border-radius: 25px;
  background: white;
  color: #4b5563;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.category-pill:hover {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
}

.category-pill.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
}

.category-pill.active .pill-icon {
  stroke: white;
}

.pill-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

/* Results Info */
.results-info {
  margin-bottom: 20px;
  font-size: 14px;
  color: #6b7280;
}

.results-info strong {
  color: #1f2937;
}

/* Books Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 24px;
}

.book-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #f3f4f6;
}

.book-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.book-cover {
  width: 100%;
  height: 240px;
  background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
  overflow: hidden;
  position: relative;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 20px;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.view-btn {
  background: white;
  color: #1f2937;
  padding: 10px 20px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  transform: translateY(10px);
  transition: transform 0.3s;
}

.book-card:hover .view-btn {
  transform: translateY(0);
}

.book-info {
  padding: 18px;
}

.book-category-tag {
  display: inline-block;
  padding: 4px 12px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #7c3aed;
  font-size: 11px;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 10px;
}

.book-title {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  margin: 0 0 12px 0;
}

.book-meta {
  display: flex;
  gap: 14px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #9ca3af;
}

/* Books List View */
.books-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.book-list-item {
  display: flex;
  gap: 20px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #f3f4f6;
}

.book-list-item:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.08);
  border-color: #667eea;
}

.list-cover {
  width: 100px;
  height: 140px;
  border-radius: 10px;
  overflow: hidden;
  flex-shrink: 0;
}

.list-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin: 8px 0;
}

.list-author {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.list-description {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 12px 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-meta {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.list-action {
  display: flex;
  align-items: center;
}

.view-details-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-details-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #6b7280;
}

.loading-animation {
  margin-bottom: 24px;
}

.book-loader {
  display: flex;
  gap: 4px;
}

.page {
  width: 8px;
  height: 50px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 4px;
  animation: flip 1.2s ease-in-out infinite;
}

.page:nth-child(2) { animation-delay: 0.15s; }
.page:nth-child(3) { animation-delay: 0.3s; }

@keyframes flip {
  0%, 100% { transform: rotateY(0deg); }
  50% { transform: rotateY(180deg); }
}

.loading-state p {
  font-size: 16px;
  font-weight: 500;
}

/* Error State */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.error-icon {
  margin-bottom: 16px;
}

.error-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.error-state p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.btn-retry {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-retry:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-illustration {
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 20px;
  font-weight: 700;
  color: #374151;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.btn-reset {
  padding: 12px 24px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-reset:hover {
  background: #e5e7eb;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 24px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #f3f4f6;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.modal-body {
  display: flex;
  gap: 30px;
  padding: 30px;
}

.modal-cover {
  width: 220px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.modal-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.modal-info {
  flex: 1;
  min-width: 0;
}

.modal-category {
  display: inline-block;
  padding: 6px 14px;
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  color: #7c3aed;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 26px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 12px 0;
  line-height: 1.3;
}

.modal-author {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 24px 0;
}

.modal-stats {
  display: flex;
  gap: 20px;
  margin-bottom: 24px;
}

.modal-stat {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  background: #f9fafb;
  border-radius: 12px;
  color: #667eea;
}

.modal-stat > div {
  display: flex;
  flex-direction: column;
}

.modal-stat .stat-value {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
}

.modal-stat .stat-label {
  font-size: 12px;
  color: #9ca3af;
}

.modal-isbn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 10px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.isbn-label {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
}

.isbn-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.5px;
}

.modal-description {
  margin-bottom: 24px;
}

.modal-description h4 {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin: 0 0 10px 0;
}

.modal-description p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-decoration: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-disabled {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: #e5e7eb;
  color: #9ca3af;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 600;
  cursor: not-allowed;
}

/* Modal Transition */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.9) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-header {
    padding: 24px;
  }

  .hero-content {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .title {
    font-size: 24px;
  }

  .modal-body {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .modal-author {
    justify-content: center;
  }

  .modal-stats {
    justify-content: center;
  }

  .modal-description {
    text-align: left;
  }

  .modal-actions {
    justify-content: center;
  }

  .book-list-item {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .list-action {
    width: 100%;
  }

  .view-details-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
