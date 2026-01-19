<template>
  <div class="student-management">
    <header class="page-header">
      <h1 class="title">ទិដ្ឋភាព - សិស្សានុសិស្ស</h1>
      <p class="subtitle">សួស្ដី, សូមស្វាគមន៍សារជាថ្មី 🙏</p>
    </header>

    <div class="summary-grid">
      <div class="summary-card">
        <h2 class="stat-value">{{ students.length }}</h2>
        <p class="stat-label">សិស្សសរុប (Total)</p>
      </div>
      <div class="summary-card">
        <h2 class="stat-value">{{ uniqueDepts }}</h2>
        <p class="stat-label">ដេប៉ាដឺម៉ង់ (Departments)</p>
      </div>
       <div class="summary-card">
        <h2 class="stat-value">94%</h2>
        <p class="stat-label">ភាគវត្តមាន (Attendance)</p>
      </div>
    </div>

    <div class="filter-bar">

      <input type="text" placeholder="ស្វែងរកសិស្ស..." class="search-input" v-model="searchQuery" />

      <select class="filter-select" v-model="selectedDept">
        <option value="">All Departments</option>
        <option value="Computer Science">Computer Science</option>
        <option value="Engineering">Engineering</option>
        <option value="Business">Business</option>
        <option value="Arts">Arts</option>
      </select>

      <select class="filter-select" v-model="selectedYear">
        <option value="">All Years</option>
        <option value="1">Year 1</option>
        <option value="2">Year 2</option>
        <option value="3">Year 3</option>
        <option value="4">Year 4</option>
      </select>

      <button class="btn refresh" @click="fetchStudents" title="Reload Data">
        🔄
      </button>

      <button class="btn add-btn" @click="openAddModal">
        + បន្ថែមសិស្ស (Add)
      </button>
    </div>

    <div v-if="loading" class="state-message">
      Loading data from Backend...
    </div>

    <div v-else-if="filteredStudents.length === 0" class="state-message">
      No students found.
    </div>

    <div v-else class="student-grid">
      <div class="student-card" v-for="student in filteredStudents" :key="student.id">
        <div class="card-header">
          <div class="avatar" :style="{ backgroundColor: student.avatarColor }">
            {{ student.initials }}
          </div>
          <div class="name-id">
            <h3>{{ student.name }}</h3>
            <span>{{ student.displayId }}</span>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">Department:</span>
            <span class="value">{{ student.dept }}</span>
          </div>
          <div class="info-row">
            <span class="label">Year:</span>
            <span class="value">{{ student.year }}</span>
          </div>
          <div class="info-row">
            <span class="label">Email:</span>
            <span class="value">{{ student.email }}</span>
          </div>
        </div>

        <div class="card-actions">
          <button class="btn edit" @click="openEditModal(student)">Edit</button>
          
          <button class="btn delete" @click="deleteStudent(student.realDbId)">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <h2>{{ isEditing ? 'Edit Student' : 'Add New Student' }}</h2>
        
        <form @submit.prevent="saveStudent">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="formData.fullName" required placeholder="e.g. Sok Sao" />
          </div>
          
          <div class="form-group">
            <label>Student ID</label>
            <input v-model="formData.studentId" required placeholder="e.g. STU001" />
          </div>
          
          <div class="form-group">
            <label>Email</label>
            <input v-model="formData.email" type="email" required placeholder="email@school.com" />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Department</label>
              <select v-model="formData.department">
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <option value="Business">Business</option>
                <option value="Arts">Arts</option>
              </select>
            </div>
            <div class="form-group">
              <label>Year</label>
              <select v-model="formData.year">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
          </div>
          
          <div class="modal-actions">
            <button type="button" class="btn cancel" @click="showModal = false">Cancel</button>
            <button type="submit" class="btn save">
              {{ isEditing ? 'Update Changes' : 'Save Student' }}
            </button>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

// --- State Variables ---
const students = ref([]);
const loading = ref(false);
const searchQuery = ref('');
const selectedDept = ref('');
const selectedYear = ref('');

// --- Modal State ---
const showModal = ref(false);
const isEditing = ref(false); // True = Update Mode, False = Create Mode
const editingId = ref(null);  // Stores ID of student being edited


const formData = ref({
  fullName: '',
  studentId: '',
  email: '',
  department: 'Computer Science',
  year: '1',
  role: 'STUDENT',
  password: 'password123' // Default password for new users
});


// --- 1. READ (Fetch Users) ---
const fetchStudents = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/users');
    
    // Map Backend Data to Frontend Design
    students.value = response.data.map(user => ({
      realDbId: user.id,
      name: user.fullName || user.email || 'Unknown',
      displayId: user.studentId || 'N/A',
      dept: user.department || 'Unassigned',
      year: user.year || 'N/A',
      email: user.email,
      initials: (user.fullName || user.email || '?').substring(0, 2).toUpperCase(),
      avatarColor: getRandomColor()
    }));
  } catch (error) {
    console.error("Error fetching:", error);
    alert("Could not connect to Backend.");
  } finally {
    loading.value = false;
  }
};

// --- 2. MODAL LOGIC (Switch between Add & Edit) ---
const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  // Reset Form
  formData.value = {
    fullName: '', studentId: '', email: '',
    department: 'Computer Science', year: '1',
    role: 'STUDENT', password: 'password123'
  };
  showModal.value = true;
};

const openEditModal = (student) => {
  isEditing.value = true;
  editingId.value = student.realDbId;
  // Fill Form with Student Data
  formData.value = {
    fullName: student.name,
    studentId: student.displayId,
    email: student.email,
    department: student.dept,
    year: student.year,
    role: 'STUDENT'
    // Note: We don't fill password here, so it won't be changed unless we add logic for it
  };
  showModal.value = true;
};

// --- 3. CREATE & UPDATE Logic ---
const saveStudent = async () => {
  try {
    if (isEditing.value) {
      // UPDATE (PATCH)
      await axios.patch(`http://localhost:3000/users/${editingId.value}`, formData.value);
      alert("Student Updated Successfully!");
    } else {
      // CREATE (POST)
      await axios.post('http://localhost:3000/users', formData.value);
      alert("Student Created Successfully!");
    }
    
    showModal.value = false;
    fetchStudents(); // Refresh the list
  } catch (error) {
    console.error(error);
    alert("Failed to save. Email might be duplicate.");
  }
};

// --- 4. DELETE Logic ---
const deleteStudent = async (id) => {
  if(!confirm("Are you sure you want to delete this student?")) return;
  try {
    await axios.delete(`http://localhost:3000/users/${id}`);
    // Remove from UI immediately
    students.value = students.value.filter(s => s.realDbId !== id);
  } catch (error) {
    alert("Failed to delete student.");
  }
};

// --- Filters & Stats ---
const filteredStudents = computed(() => {
  return students.value.filter(s => {
    const q = searchQuery.value.toLowerCase();
    const sName = (s.name || '').toLowerCase();
    const sId = (s.displayId || '').toLowerCase();
    
    return (sName.includes(q) || sId.includes(q)) &&
           (selectedDept.value === '' || s.dept === selectedDept.value) &&
           (selectedYear.value === '' || s.year === selectedYear.value);
  });
});

const uniqueDepts = computed(() => {
  const depts = new Set(students.value.map(s => s.dept).filter(d => d !== 'Unassigned'));
  return depts.size;
});

const getRandomColor = () => {
  const colors = ['#5d5fef', '#7c3aed', '#4f46e5', '#4338ca', '#059669', '#e11d48'];
  return colors[Math.floor(Math.random() * colors.length)];
};

onMounted(() => {
  fetchStudents();
});
</script>

<style scoped>
/* Main Layout */
.student-management { padding: 20px; font-family: 'Battambang', sans-serif; }
.title { color: #5d5fef; font-size: 2rem; margin-bottom: 5px; }
.subtitle { color: #888; margin-bottom: 30px; }

/* Stats Cards */
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.summary-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #edf2f7; text-align: center; }
.stat-value { font-size: 2rem; font-weight: 700; color: #2d3748; margin: 0; }
.stat-label { color: #a0aec0; margin: 0; font-size: 0.9rem; }

/* Filter Bar */
.filter-bar { display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; align-items: center; }
.search-input { flex: 1; padding: 10px 15px; border-radius: 8px; border: 1px solid #e2e8f0; min-width: 250px; }
.filter-select { padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; cursor: pointer; }
.btn { padding: 10px 15px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; transition: all 0.2s; display: inline-flex; align-items: center; justify-content: center;}

/* Buttons */
.btn.refresh { background: #edf2f7; color: #4a5568; font-size: 1.2rem; }
.btn.refresh:hover { background: #e2e8f0; }
.btn.add-btn { background: #5d5fef; color: white; margin-left: auto; box-shadow: 0 4px 6px rgba(93, 95, 239, 0.2); }
.btn.add-btn:hover { background: #4b4dce; transform: translateY(-1px); }

/* Grid & Cards */
.student-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.student-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #edf2f7; box-shadow: 0 2px 5px rgba(0,0,0,0.05); transition: transform 0.2s; }
.student-card:hover { transform: translateY(-3px); box-shadow: 0 8px 15px rgba(0,0,0,0.1); }

.card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.avatar { width: 45px; height: 45px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 1.1rem; }
.name-id h3 { margin: 0; font-size: 1.1rem; color: #2d3748; }
.name-id span { color: #a0aec0; font-size: 0.85rem; }

.info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #4a5568; }
.value { font-weight: 600; color: #2d3748; }

.card-actions { margin-top: 15px; display: flex; gap: 10px; border-top: 1px solid #edf2f7; padding-top: 15px; }
.btn.edit { background: #edf2f7; color: #4a5568; flex: 1; }
.btn.edit:hover { background: #e2e8f0; color: #2d3748; }
.btn.delete { background: #fee2e2; color: #ef4444; flex: 1; }
.btn.delete:hover { background: #ef4444; color: white; }

.state-message { text-align: center; color: #a0aec0; margin-top: 50px; font-size: 1.2rem; }

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; backdrop-filter: blur(2px); }
.modal-content { background: white; padding: 30px; border-radius: 16px; width: 400px; max-width: 90%; box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
.modal-content h2 { margin-top: 0; color: #2d3748; margin-bottom: 20px; }

.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; font-size: 0.9rem; color: #4a5568; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 8px; outline: none; transition: border-color 0.2s; box-sizing: border-box; }
.form-group input:focus, .form-group select:focus { border-color: #5d5fef; ring: 2px solid #5d5fef; }
.form-row { display: flex; gap: 15px; }
.form-row .form-group { flex: 1; }

.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; }
.btn.cancel { background: white; border: 1px solid #e2e8f0; color: #4a5568; }
.btn.cancel:hover { background: #f7fafc; }
.btn.save { background: #5d5fef; color: white; }
.btn.save:hover { background: #4b4dce; }
</style>