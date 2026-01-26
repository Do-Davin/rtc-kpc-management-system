<template>
  <div class="student-management">
    <header class="page-header">
      <h1 class="title">ទិដ្ឋភាព - សិស្សានុសិស្ស</h1>
      <p class="subtitle">Students Management</p>
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
      <input 
        type="text" 
        placeholder="Search by Name or ID..." 
        class="search-input" 
        v-model="searchQuery" 
      />
      
      <select class="filter-select" v-model="selectedDept">
        <option value="">All Departments</option>
        <option v-for="dept in departmentList" :key="dept.id" :value="dept.name">
          {{ dept.name }}
        </option>
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

    <div v-if="loading" class="state-message">Loading data...</div>
    <div v-else-if="filteredStudents.length === 0" class="state-message">No students found.</div>

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
              <select v-model="formData.department" required>
                <option disabled value="">Select Department</option>
                <option v-for="dept in departmentList" :key="dept.id" :value="dept.name">
                  {{ dept.name }}
                </option>
              </select>
              <p v-if="departmentList.length === 0" style="color:red; font-size: 0.8rem; margin-top:5px;">
                ⚠️ No departments found. Please create one first!
              </p>
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
              {{ isEditing ? 'Update' : 'Save' }}
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

// --- SECURITY: Auto-Inject Token ---
const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// --- State Variables ---
const students = ref([]);
const departmentList = ref([]); // 👈 Stores real departments from DB
const loading = ref(false);
const searchQuery = ref('');
const selectedDept = ref('');
const selectedYear = ref('');
const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// --- Form Data ---
const formData = ref({
  fullName: '',
  studentId: '',
  email: '',
  department: '', // Default empty so user must choose
  year: '1',
  role: 'STUDENT',
  password: 'password123' 
});

// --- 1. FETCH STUDENTS ---
const fetchStudents = async () => {
  loading.value = true;
  try {
    const response = await axios.get('http://localhost:3000/users');
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
    console.error("Fetch Error:", error);
    if (error.response && error.response.status === 401) {
      alert("Session expired. Please Login.");
    }
  } finally {
    loading.value = false;
  }
};

// --- 2. FETCH DEPARTMENTS (The Missing Link) ---
const fetchDepartments = async () => {
  try {
    const response = await axios.get('http://localhost:3000/departments');
    departmentList.value = response.data;
  } catch (error) {
    console.error("Error loading departments:", error);
  }
};

// --- 3. MODAL LOGIC ---
const openAddModal = () => {
  isEditing.value = false;
  editingId.value = null;
  // Load departments fresh every time we open modal
  fetchDepartments(); 
  
  formData.value = {
    fullName: '', studentId: '', email: '',
    department: '', // Reset
    year: '1', role: 'STUDENT', password: 'password123'
  };
  showModal.value = true;
};

const openEditModal = (student) => {
  isEditing.value = true;
  editingId.value = student.realDbId;
  fetchDepartments(); // Ensure list is loaded for editing too

  formData.value = {
    fullName: student.name,
    studentId: student.displayId,
    email: student.email,
    department: student.dept, // This will match the value in the list
    year: student.year,
    role: 'STUDENT'
  };
  showModal.value = true;
};

// --- 4. SAVE LOGIC ---
const saveStudent = async () => {
  try {
    if (isEditing.value) {
      await axios.patch(`http://localhost:3000/users/${editingId.value}`, formData.value);
      alert("Updated Successfully!");
    } else {
      await axios.post('http://localhost:3000/users', formData.value);
      alert("Created Successfully! Password is 'password123'");
    }
    showModal.value = false;
    fetchStudents();
  } catch (error) {
    alert("Failed to save. " + (error.response?.data?.message || error.message));
  }
};

// --- 5. DELETE LOGIC ---
const deleteStudent = async (id) => {
  if(!confirm("Are you sure?")) return;
  try {
    await axios.delete(`http://localhost:3000/users/${id}`);
    students.value = students.value.filter(s => s.realDbId !== id);
  } catch (error) {
    alert("Delete failed.");
  }
};

// --- Helpers ---
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

// --- Load on Start ---
onMounted(() => {
  fetchStudents();
  fetchDepartments(); // Load departments immediately
});
</script>

<style scoped>
/* Main Layout */
.student-management { padding: 20px; font-family: 'Battambang', sans-serif; }
.title { color: #5d5fef; font-size: 2rem; margin-bottom: 5px; }
.subtitle { color: #888; margin-bottom: 30px; }

/* Stats */
.summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 30px; }
.summary-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #edf2f7; text-align: center; }
.stat-value { font-size: 2rem; font-weight: 700; color: #2d3748; margin: 0; }
.stat-label { color: #a0aec0; margin: 0; font-size: 0.9rem; }

/* Filter Bar */
.filter-bar { display: flex; gap: 10px; margin-bottom: 30px; flex-wrap: wrap; }
.search-input { flex: 1; padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; min-width: 200px; }
.filter-select { padding: 10px; border-radius: 8px; border: 1px solid #e2e8f0; background: white; }
.btn { padding: 10px 15px; border-radius: 8px; border: none; cursor: pointer; font-weight: 600; }
.btn.refresh { background: #edf2f7; }
.btn.add-btn { background: #5d5fef; color: white; margin-left: auto; }

/* Grid */
.student-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
.student-card { background: white; border-radius: 16px; padding: 20px; border: 1px solid #edf2f7; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.card-header { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; }
.avatar { width: 45px; height: 45px; border-radius: 50%; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; }
.name-id h3 { margin: 0; font-size: 1.1rem; }
.name-id span { color: #a0aec0; font-size: 0.85rem; }

.info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 0.9rem; color: #4a5568; }
.value { font-weight: 600; }
.card-actions { margin-top: 15px; display: flex; gap: 10px; }
.btn.edit { background: #edf2f7; color: #4a5568; flex: 1; }
.btn.delete { background: #fee2e2; color: #ef4444; flex: 1; }
.state-message { text-align: center; color: #aaa; margin-top: 50px; }

/* Modal */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: white; padding: 30px; border-radius: 12px; width: 400px; max-width: 90%; }
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
.form-group input, .form-group select { width: 100%; padding: 10px; border: 1px solid #e2e8f0; border-radius: 6px; }
.form-row { display: flex; gap: 10px; }
.form-row .form-group { flex: 1; }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px; }
.btn.cancel { background: #edf2f7; color: #4a5568; }
.btn.save { background: #5d5fef; color: white; }
</style>