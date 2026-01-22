<template>
  <div v-if="book" class="modal-overlay" @click="closeViewer">
    <div class="modal-content" @click.stop>
      <button @click="closeViewer" class="close-btn">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <div class="viewer-container">
        <!-- Book Details Sidebar -->
        <div class="book-details">
          <div class="book-cover-large">
            <img :src="book.cover" :alt="book.title" />
          </div>
          <h2 class="book-title-large">{{ book.title }}</h2>
          <p class="book-author-large">By {{ book.author }}</p>
          <div class="book-stats">
            <div class="stat-item">
              <span class="stat-label">Category</span>
              <span class="stat-value">{{ book.category }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Year</span>
              <span class="stat-value">{{ book.year }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Pages</span>
              <span class="stat-value">{{ book.pages }}</span>
            </div>
          </div>
          <div class="book-description">
            <h3>Description</h3>
            <p>{{ book.description }}</p>
          </div>
          <div class="action-buttons">
            <button class="btn-primary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </button>
            <button class="btn-secondary">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
              Bookmark
            </button>
          </div>
        </div>

        <!-- Book Preview -->
        <div class="book-preview">
          <div class="preview-header">
            <h3>Book Preview</h3>
            <div class="preview-controls">
              <button @click="prevPage" :disabled="currentPage === 1" class="control-btn">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
              <button
                @click="nextPage" :disabled="currentPage === totalPages"
                class="control-btn"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </div>
          </div>
          <div class="preview-content">
            <div class="page-content">
              <h2 class="chapter-title">{{ pageContent.title }}</h2>
              <div class="page-text">
                <p v-for="(paragraph, index) in pageContent.paragraphs" :key="index">
                  {{ paragraph }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  book: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

const currentPage = ref(1);
const totalPages = ref(3);

const dummyContent = [
  {
    title: 'Chapter 1: Introduction',
    paragraphs: [
      'Welcome to this comprehensive guide. In this chapter, we will explore the fundamental concepts that form the foundation of this subject.',
      'Mathematics has been the cornerstone of human civilization, enabling us to understand patterns, solve problems, and build the modern world.',
      'Throughout history, great minds have contributed to the development of mathematical theories and principles that we use today.',
      'This book aims to provide you with a solid understanding of these concepts through clear explanations and practical examples.'
    ]
  },
  {
    title: 'Chapter 2: Basic Principles',
    paragraphs: [
      'In this chapter, we delve into the basic principles that govern the field. Understanding these fundamentals is crucial for mastering more advanced topics.',
      'Every concept builds upon previous knowledge, creating a framework of understanding that grows stronger with each lesson.',
      'We will explore various theories and their practical applications, demonstrating how abstract ideas translate into real-world solutions.',
      'Practice exercises are included throughout to reinforce your learning and build confidence in applying these principles.'
    ]
  },
  {
    title: 'Chapter 3: Advanced Concepts',
    paragraphs: [
      'As we progress into more advanced territory, you will discover the depth and beauty of complex problem-solving.',
      'These advanced concepts may seem challenging at first, but with careful study and practice, they become powerful tools in your arsenal.',
      'Real-world case studies demonstrate how professionals apply these principles in their daily work.',
      'Remember that mastery comes through persistent effort and continuous learning.'
    ]
  }
];

const pageContent = computed(() => {
  const contentIndex = (currentPage.value - 1) % dummyContent.length;
  return dummyContent[contentIndex];
});

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const closeViewer = () => {
  emit('close');
};

// Reset page when book changes
watch(() => props.book, (newBook) => {
  if (newBook) {
    currentPage.value = 1;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = 'auto';
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  animation: fadeIn 0.3s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal-content {
  background: white;
  border-radius: 16px;
  width: 100%;
  max-width: 1400px;
  max-height: 90vh;
  overflow: hidden;
  position: relative;
  animation: slideUp 0.3s;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.5);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.7);
  transform: scale(1.1);
}

.close-btn svg {
  color: white;
}

.viewer-container {
  display: grid;
  grid-template-columns: 350px 1fr;
  height: 90vh;
  overflow: hidden;
}

.book-details {
  background: #f8f9fa;
  padding: 40px 30px;
  overflow-y: auto;
  border-right: 1px solid #e0e0e0;
}

.book-cover-large {
  width: 100%;
  margin-bottom: 24px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.book-cover-large img {
  width: 100%;
  height: auto;
  display: block;
}

.book-title-large {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.book-author-large {
  font-size: 15px;
  color: #666;
  margin: 0 0 24px 0;
}

.book-stats {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
}

.stat-item:last-child {
  border-bottom: none;
}

.stat-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

.stat-value {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 600;
}

.book-description {
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 24px;
}

.book-description h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.book-description p {
  font-size: 14px;
  color: #666;
  line-height: 1.7;
  margin: 0;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary, .btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #5d5fef;
  color: white;
}

.btn-primary:hover {
  background: #4a4cd4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(93, 95, 239, 0.3);
}

.btn-secondary {
  background: white;
  color: #5d5fef;
  border: 2px solid #5d5fef;
}

.btn-secondary:hover {
  background: #f8f9ff;
  transform: translateY(-2px);
}

.book-preview {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30px 90px 40px ;
  border-bottom: 1px solid #e0e0e0;
  background: white;
}

.preview-header h3 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.preview-controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.control-btn {
  background: #f0f2ff;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #5d5fef;
}

.control-btn:hover:not(:disabled) {
  background: #5d5fef;
  color: white;
}

.control-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 120px;
  text-align: center;
}

.preview-content {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  background: #fafafa;
}

.page-content {
  background: white;
  border-radius: 12px;
  padding: 60px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  min-height: 600px;
}

.chapter-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 30px 0;
  padding-bottom: 20px;
  border-bottom: 2px solid #5d5fef;
}

.page-text p {
  font-size: 16px;
  line-height: 1.8;
  color: #333;
  margin: 0 0 24px 0;
  text-align: justify;
}

.page-text p:last-child {
  margin-bottom: 0;
}

@media (max-width: 1024px) {
  .viewer-container {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }

  .book-details {
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
