<template>
  <div class="staff-view">
    <header class="page-header">
      <h1 class="title">ទិដ្ឋភាព - បុគ្គលិក</h1>
    </header>

    <div class="filter-container">
      <div class="filter-group">
        <div class="filter-trigger">
          <span class="icon">🔍</span>
          <span>Filter By</span>
        </div>
        <select class="filter-select" v-model="filterDate">
          <option value="Date">Date</option>
          <option value="Newest">Newest First</option>
          <option value="Oldest">Oldest First</option>
        </select>
        <button class="reset-btn" @click="resetFilters">
          <span class="reset-icon">↺</span> Reset Filter
        </button>
      </div>
    </div>

    <div class="table-card">
      <table class="staff-table">
        <thead>
          <tr>
            <th>ល.រ</th>
            <th>ឈ្មោះ</th>
            <th>ថ្ងៃខែឆ្នាំកំណើត</th>
            <th>ដេប៉ាដឺម៉ង់</th>
            <th>ថ្ងៃចុះបញ្ជី</th>
            <th>អីមែល</th>
            <th>ស្ថានភាព</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffData" :key="staff.id">
            <td class="id-col">{{ staff.id }}</td>
            <td class="name-col">{{ staff.name }}</td>
            <td>{{ staff.dob }}</td>
            <td>{{ staff.department }}</td>
            <td>{{ staff.registerDate }}</td>
            <td>{{ staff.email }}</td>
            <td>
              <span :class="['status-badge', staff.status.toLowerCase().replace(' ', '-')]">
                {{ staff.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const filterDate = ref('Date');

// Dummy data matching the image provided
const staffData = ref([
  { id: '00001', name: 'គ្រីស្ទានូ រ៉ូណាល់', dob: '12/31/2005', department: 'Information Techn', registerDate: '04 Sep 2024', email: 'email@gmail.com', status: 'ធ្វើការ' },
  { id: '00002', name: 'លីអូ ម៉េស៊ី', dob: '12/31/2005', department: 'Network & Cybersecurity', registerDate: '28 May 2025', email: 'email@gmail.com', status: 'ជិតចេញ' },
  { id: '00003', name: 'នេយម៉ារ ជេអរ', dob: '12/31/2005', department: 'Information Techn', registerDate: '23 Nov 2025', email: 'email@gmail.com', status: 'ធ្វើការ' },
  { id: '00004', name: 'ជីង ជក', dob: '12/31/2005', department: 'Computer Science', registerDate: '05 Feb 2025', email: 'email@gmail.com', status: 'ធ្វើការ' },
  { id: '00005', name: 'ហួត សីថា', dob: '12/31/2005', department: 'Information Techn', registerDate: '29 Jul 2025', email: 'email@gmail.com', status: 'ជិតចេញ' },
  { id: '00006', name: 'សេរី វង្ស', dob: '12/31/2005', department: 'Mechanical Engineering', registerDate: '15 Aug 2024', email: 'email@gmail.com', status: 'ធ្វើការ' },
  { id: '00007', name: 'វត្រ័វត្រ័', dob: '12/31/2005', department: 'Network & Cybersecurity', registerDate: '21 Dec 2025', email: 'email@gmail.com', status: 'ជិតចេញ' },
  { id: '00008', name: 'ទីទី', dob: '12/31/2005', department: 'Information Techn', registerDate: '30 Apr 2025', email: 'email@gmail.com', status: 'ចូលនិវត្តិ' },
  { id: '00009', name: 'ដូ ដាវីន', dob: '12/31/2005', department: 'Software Engineering', registerDate: '09 Jan 2015', email: 'email@gmail.com', status: 'ចូលនិវត្តិ' },
]);

const resetFilters = () => {
  filterDate.value = 'Date';
};
</script>

<style scoped>
.staff-view {
  width: 100%;
}

.title {
  color: #5d5fef;
  font-size: 1.8rem;
  margin-bottom: 25px;
}

.filter-container {
  display: flex;
  margin-bottom: 25px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 15px;
}

.filter-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  color: #333;
}

.filter-select {
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: white;
  min-width: 100px;
}

.reset-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  color: #ff5c5c;
  border: 1px solid #fecaca;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}

.table-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #eee;
  overflow: hidden;
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.staff-table th {
  padding: 20px;
  font-size: 1.2rem;
  color: #333;
  font-weight: 700;
  border-bottom: 1px solid #f0f0f0;
  text-transform: uppercase;
}

.staff-table td {
  padding: 18px 20px;
  font-size: 0.9rem;
  color: #555;
  border-bottom: 1px solid #f9f9f9;
}

.id-col { color: #666; }
.name-col { font-weight: 500; color: #333; }

.status-badge {
  padding: 6px 16px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
  text-align: center;
}

.ធ្វើការ {
  background-color: #e6fffa;
  color: #38b2ac;
}

.ជិតចេញ {
  background-color: #f0f2ff;
  color: #5d5fef;
}

.ចូលនិវត្តិ {
  background-color: #f5f5f5;
  color: #666;
}
</style>
