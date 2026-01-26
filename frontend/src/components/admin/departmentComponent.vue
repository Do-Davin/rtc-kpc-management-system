<template>
  <div class="department-container">
    <h2>Manage Departments</h2>

    <div class="add-dept-box">
      <input 
        v-model="newDepartmentName" 
        placeholder="Enter department name (e.g. IT)" 
        @keyup.enter="createDepartment"
      />
      <button @click="createDepartment">Add Department</button>
    </div>

    <p v-if="error" class="error-text">{{ error }}</p>

    <ul v-if="departments.length > 0">
      <li v-for="dept in departments" :key="dept.id">
        {{ dept.name }}
        <button class="delete-btn" @click="deleteDepartment(dept.id)">Delete</button>
      </li>
    </ul>
    <p v-else>No departments found.</p>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      departments: [],
      newDepartmentName: '',
      error: ''
    };
  },
  mounted() {
    this.fetchDepartments();
  },
  methods: {
    // Helper to get headers with Token
    getAuthHeader() {
      // ⚠️ Make sure this matches what you saved in Login (access_token or token)
      const token = localStorage.getItem('access_token'); 
      return { 
        headers: { Authorization: `Bearer ${token}` } 
      };
    },

    async fetchDepartments() {
      try {
        const response = await axios.get('http://localhost:3000/departments', this.getAuthHeader());
        this.departments = response.data;
      } catch (err) {
        console.error("Fetch error:", err);
        if (err.response && err.response.status === 401) {
          this.error = "Session expired. Please log out and log in again.";
        }
      }
    },

    async createDepartment() {
      if (!this.newDepartmentName) return;

      try {
        await axios.post(
          'http://localhost:3000/departments', 
          { name: this.newDepartmentName }, 
          this.getAuthHeader()
        );
        this.newDepartmentName = ''; // Clear input
        this.fetchDepartments(); // Refresh list
      } catch (err) {
        console.error("Create error:", err);
        alert("Failed to save. Are you an ADMIN?");
      }
    },

    async deleteDepartment(id) {
      if (!confirm("Are you sure?")) return;
      
      try {
        await axios.delete(`http://localhost:3000/departments/${id}`, this.getAuthHeader());
        this.fetchDepartments(); // Refresh list
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  }
};
</script>

<style scoped>
.error-text { color: red; }
.add-dept-box { margin-bottom: 20px; }
.delete-btn { margin-left: 10px; color: red; cursor: pointer; }
</style>