<template>
  <div class="book-card" @click="$emit('view', book)">
    <div class="book-cover">
      <img :src="book.cover" :alt="book.title" @error="handleImageError" />
      <div class="book-overlay">
        <button class="view-btn">View Details</button>
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>
      <div class="book-meta">
        <span class="category-tag">{{ book.category }}</span>
        <span class="year">{{ book.year }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true
  }
});

defineEmits(['view']);

const handleImageError = (e) => {
  e.target.src = '/images/library.avif';
};
</script>

<style scoped>
.book-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.book-cover {
  position: relative;
  height: 200px;
  overflow: hidden;
  background: #f3f4f6;
}

.book-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.book-card:hover .book-cover img {
  transform: scale(1.05);
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.book-card:hover .book-overlay {
  opacity: 1;
}

.view-btn {
  padding: 10px 20px;
  background: var(--purple-500, #8b5cf6);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.view-btn:hover {
  background: var(--purple-600, #7c3aed);
}

.book-info {
  padding: 15px;
}

.book-title {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 5px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 12px;
  color: #6b7280;
  margin: 0 0 10px 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.category-tag {
  background: #f3e8ff;
  color: var(--purple-500, #8b5cf6);
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.year {
  font-size: 11px;
  color: #9ca3af;
}
</style>
