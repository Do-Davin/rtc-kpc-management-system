<template>
  <div class="dashboard">
    <h1>Admin Dashboard</h1>
    <div class="stats-grid">
      <div class="card">
        <h3>Total Staff</h3>
        <p>0</p>
      </div>
      <div class="card">
        <h3>Total Students</h3>
        <p>0</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard { padding: 20px; }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top: 20px; }
.card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
</style>