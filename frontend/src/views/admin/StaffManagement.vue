<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const staffList = ref([]);
const newStaff = ref({ name: '', email: '', password: '', role: 'staff' });

// 1. Fetch Staff
const fetchStaff = async () => {
  try {
    const res = await axios.get('/users'); // Backend should filter or returns all
    // Client-side filter example (better to filter on backend)
    staffList.value = res.data.filter(u => u.role === 'staff');
  } catch (error) {
    console.error("Access denied. Are you an admin?");
  }
};

// 2. Create Staff
const createStaff = async () => {
  await axios.post('/users', newStaff.value);
  fetchStaff(); // Refresh list
  newStaff.value = { name: '', email: '', password: '', role: 'staff' };
};

onMounted(fetchStaff);
</script>

<template>
  <div>
    <h1>Staff Management</h1>
    
    <div class="card">
      <h3>Add New Staff</h3>
      <input v-model="newStaff.name" placeholder="Full Name" />
      <input v-model="newStaff.email" placeholder="Email" />
      <input v-model="newStaff.password" type="password" placeholder="Password" />
      <button @click="createStaff">Create Staff Account</button>
    </div>

    <table>
      <thead>
        <tr><th>Name</th><th>Email</th><th>Actions</th></tr>
      </thead>
      <tbody>
        <tr v-for="staff in staffList" :key="staff.id">
          <td>{{ staff.name }}</td>
          <td>{{ staff.email }}</td>
          <td>
            <button>Edit</button>
            <button>Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>