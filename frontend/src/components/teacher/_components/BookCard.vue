<template>
  <div class="book-card">
    <div class="book-cover">
      <img :src="getCoverUrl(book.cover)" :alt="book.title" />
      <div class="book-overlay">
        <button @click="$emit('view', book)" class="view-btn">
          View Book
        </button>
      </div>
    </div>

    <div class="book-info">
      <h3 class="book-title">{{ book.title }}</h3>
      <p class="book-author">{{ book.author }}</p>

      <div class="book-meta">
        <span class="book-category">{{ book.category }}</span>
        <span class="book-year">{{ book.year }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  book: {
    type: Object,
    required: true,
  },
});

defineEmits(['view']);

// Get the full cover image URL for display
const getCoverUrl = (cover) => {
  if (!cover) return '/images/default-book.svg';
  // If it's already a full URL or data URL, return as is
  if (cover.startsWith('http') || cover.startsWith('data:')) {
    return cover;
  }
  // Otherwise, prepend the API base URL
  return `http://localhost:3000${cover}`;
};
</script>

<style scoped>
.book-card {
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s;
  cursor: pointer;
}

.book-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.book-cover {
  position: relative;
  width: 100%;
  padding-top: 140%;
  overflow: hidden;
  background: #f5f5f5;
}

.book-cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.book-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
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
  padding: 10px 24px;
  background: #5d5fef;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.view-btn:hover {
  background: #4a4cd4;
  transform: scale(1.05);
}

.book-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 16px;
}

.book-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 6px 0;
  line-height: 1.4;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-author {
  font-size: 13px;
  color: #666;
  margin: 0 0 10px 0;
  display: -webkit-box;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.book-meta {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.book-category {
  font-size: 11px;
  color: #5d5fef;
  background: #f0f2ff;
  padding: 4px 10px;
  border-radius: 4px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-year {
  font-size: 12px;
  color: #999;
  font-weight: 500;
}
</style>
