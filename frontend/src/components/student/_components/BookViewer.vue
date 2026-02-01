<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="book" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <button class="close-btn" @click="$emit('close')">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 6 6 18"></path>
              <path d="m6 6 12 12"></path>
            </svg>
          </button>
          
          <div class="book-details">
            <div class="book-cover">
              <img :src="book.cover" :alt="book.title" @error="handleImageError" />
            </div>
            
            <div class="book-info">
              <span class="category-badge">{{ book.category }}</span>
              <h2 class="book-title">{{ book.title }}</h2>
              <p class="book-author">by {{ book.author }}</p>
              
              <div class="book-meta">
                <div class="meta-item">
                  <span class="meta-label">Year</span>
                  <span class="meta-value">{{ book.year }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Pages</span>
                  <span class="meta-value">{{ book.pages }}</span>
                </div>
              </div>
              
              <div class="book-description">
                <h3>Description</h3>
                <p>{{ book.description }}</p>
              </div>
              
              <div class="actions">
                <button class="btn-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Read Now
                </button>
                <button class="btn-secondary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" x2="12" y1="15" y2="3"></line>
                  </svg>
                  Download
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    default: null
  }
});

defineEmits(['close']);

const handleImageError = (e) => {
  e.target.src = '/images/library.avif';
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 16px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #f3f4f6;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background 0.2s, color 0.2s;
  z-index: 10;
}

.close-btn:hover {
  background: #e5e7eb;
  color: #1f2937;
}

.book-details {
  display: flex;
  gap: 30px;
  padding: 30px;
}

.book-cover {
  flex-shrink: 0;
  width: 250px;
  height: 350px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-info {
  flex: 1;
  min-width: 0;
}

.category-badge {
  display: inline-block;
  background: #f3e8ff;
  color: var(--purple-500, #8b5cf6);
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 15px;
}

.book-title {
  font-size: 24px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.book-author {
  font-size: 15px;
  color: #6b7280;
  margin: 0 0 20px 0;
}

.book-meta {
  display: flex;
  gap: 30px;
  margin-bottom: 25px;
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meta-label {
  font-size: 12px;
  color: #9ca3af;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.meta-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.book-description h3 {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 10px 0;
}

.book-description p {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.7;
  margin: 0 0 25px 0;
}

.actions {
  display: flex;
  gap: 12px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--purple-500, #8b5cf6);
  border: none;
  color: white;
}

.btn-primary:hover {
  background: var(--purple-600, #7c3aed);
}

.btn-secondary {
  background: white;
  border: 1px solid #e5e7eb;
  color: #374151;
}

.btn-secondary:hover {
  border-color: var(--purple-500, #8b5cf6);
  color: var(--purple-500, #8b5cf6);
}

/* Modal Animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(20px);
}

/* Responsive */
@media (max-width: 768px) {
  .book-details {
    flex-direction: column;
    padding: 20px;
  }
  
  .book-cover {
    width: 100%;
    height: 300px;
  }
  
  .actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    justify-content: center;
  }
}
</style>
