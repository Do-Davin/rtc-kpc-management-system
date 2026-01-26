<template>
  <div class="elibrary-wrapper">
    <div class="header">
      <h1 class="title">បណ្ណាល័យអេឡិចត្រូនិក</h1>
      <p class="subtitle">E-Library</p>
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

    <!-- Books Grid -->
    <div class="books-grid">
      <BookCard
        v-for="book in filteredBooks"
        :key="book.id"
        :book="book"
        @view="openBookViewer"
      />
    </div>

    <!-- No Book available -->
    <EmptyState
      v-if="filteredBooks.length === 0"
      message="No books found"
    />

    <!-- Book Viewer Modal Component -->
    <BookViewer :book="selectedBook" @close="closeBookViewer" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import BookViewer from '../_components/BookViewer.vue';
import SearchBar from '../_components/SearchBar.vue';
import CategoryFilter from '../_components/CategoryFilter.vue';
import BookCard from '../_components/BookCard.vue';
import EmptyState from '../_components/EmptyState.vue';

const searchTerm = ref('');
const selectedCategory = ref('All');
const selectedBook = ref(null);

const categories = ['All', 'Mathematics', 'Physics', 'Computer Science', 'Information Technology'];

const books = [
  {
    id: 1,
    title: 'Mathematics: A Complete Introduction',
    author: 'Trevor Johnson & Hugh Neill',
    category: 'Mathematics',
    cover: '/book/math1.jpg',
    year: '2023',
    pages: 324,
    description: 'A comprehensive guide to mathematics covering algebra, geometry, calculus, and statistics. Perfect for students and self-learners seeking a solid foundation in mathematical principles.'
  },
  {
    id: 2,
    title: 'Information Technology: An Introduction',
    author: 'Richard Fox',
    category: 'Information Technology',
    cover: '/book/it1.jpg',
    year: '2023',
    pages: 456,
    description: 'Explore the digital world with this introduction to information technology, covering networks, databases, cybersecurity, and modern IT infrastructure.'
  },
  {
    id: 3,
    title: 'Artificial Intelligence: A Guide for Everyone',
    author: 'Arshad Khan',
    category: 'Information Technology',
    cover: '/book/ai1.jpg',
    year: '2024',
    pages: 265,
    description: 'Dive into the world of AI, machine learning, and human interaction. This book covers neural networks, deep learning, and practical applications of artificial intelligence.'
  },
  {
    id: 4,
    title: 'Fundamentals of Computer Science',
    author: 'Emergent Learning',
    category: 'Computer Science',
    cover: '/book/it2.jpg',
    year: '2023',
    pages: 752,
    description: 'Master the core concepts of computer science including programming, algorithms, data structures, and computational thinking for the IB Diploma programme.'
  },
  {
    id: 5,
    title: 'The Essence of Mathematics',
    author: 'Alexandre Borovik & Tony Gardiner',
    category: 'Mathematics',
    cover: '/book/math2.jpg',
    year: '2022',
    pages: 276,
    description: 'Through elementary problems, this book reveals the deep beauty and power of mathematical thinking, making complex concepts accessible to all learners.'
  },
  {
    id: 6,
    title: 'The Code Book',
    author: 'Simon Singh',
    category: 'Cryptography',
    cover: '/book/cry1.jpg',
    year: '2000',
    pages: 432,
    description: 'This item: The Code Book: The Science of Secrecy from Ancient Egypt to Quantum Cryptography'
  },
  {
    id: 7,
    title: 'Advanced Computer Science',
    author: 'obra colectiva Express Publishing',
    category: 'Computer Science',
    cover: '/book/it3.jpg',
    year: '2017',
    pages: 304,
    description: 'Advanced Computer Science for the IB Diploma Program is a new educational resource for all students who need to understand the High Level topics of Computer Science.'
  },
  {
    id: 8,
    title: 'Physics: Principles and Practice',
    author: 'Eric Mazur',
    category: 'Physics',
    cover: '/book/phy1.jpg',
    year: '2015',
    pages: 2050,
    description: 'Understanding the fundamental principles of physics through practical examples, experiments, and real-world applications of physical laws.'
  },
  {
    id: 9,
    title: 'Introductory Quantum Physics and Relativity',
    author: 'Jacob Dunningham',
    category: 'Physics',
    cover: '/book/phy2.jpg',
    year: '2018',
    pages: 308,
    description: 'he authors have done an exceptional job. It’s probably more accurate to describe this text as an introduction to both non-relativistic and relativistic quantum mechanics … This book was a lot of fun to read and digest. I definitely recommend it for instructors, but also for students who have already been exposed to quantum mechanics.'
  },
  {
    id: 10,
    title: 'Data Structures & Algorithms',
    author: 'Rudolph Russell',
    category: 'Computer Science',
    cover: '/book/it4.jpg',
    year: '2018',
    pages: 97,
    description: 'Essential data structures and algorithms with detailed implementations, complexity analysis, and practical problem-solving techniques.'
  },
  {
    id: 11,
    title: 'Calculus Made Easy',
    author: 'Silvanus Thompson',
    category: 'Mathematics',
    cover: '/book/math3.jpg',
    year: '2022',
    pages: 298,
    description: 'A timeless classic that demystifies calculus, making it accessible and enjoyable for students at all levels with clear explanations and examples.'
  },
  {
    id: 12,
    title: 'Network Security Essentials',
    author: 'William Stallings',
    category: 'Information Technology',
    cover: '/book/it5.jpg',
    year: '2023',
    pages: 445,
    description: 'Comprehensive coverage of network security fundamentals, cryptography, authentication protocols, and modern cybersecurity challenges.'
  }
];

const filteredBooks = computed(() => {
  let filtered = books;

  if (selectedCategory.value !== 'All') {
    filtered = filtered.filter(book => book.category === selectedCategory.value);
  }

  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase();
    filtered = filtered.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term) ||
      book.category.toLowerCase().includes(term)
    );
  }

  return filtered;
});

const openBookViewer = (book) => {
  selectedBook.value = book;
};

const closeBookViewer = () => {
  selectedBook.value = null;
};
</script>

<style scoped>
.elibrary-wrapper {
  width: 100%;
  min-height: 100vh;
}

.header {
  margin-bottom: 30px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 5px 0;
}

.subtitle {
  font-size: 16px;
  color: #666;
  margin: 0;
  font-weight: 400;
}

.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 25px;
  margin-bottom: 40px;
}
</style>
