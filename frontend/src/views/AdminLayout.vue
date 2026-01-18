<template>
  <div class="admin-container">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="../assets/logo.png" class="logo-img"/>
        <span class="brand-name">RTC</span>
      </div>

      <nav class="nav-menu">
        <router-link to="/admin/dashboard" class="nav-item">
          <img src="../assets/dashboardIcon.png" class="icon"/> Dashboard
        </router-link>
        <router-link to="/admin/students" class="nav-item">
          <img src="../assets/studentIcon.png" class="icon"/> Students
        </router-link>
        <router-link to="/admin/staff" class="nav-item">
          <img src="../assets/staffIcon.png" class="icon"/> Staff
        </router-link>
        <router-link to="/admin/departments" class="nav-item">
          <img src="../assets/departmentIcon.png" class="icon"/> Departments
        </router-link>
        <router-link to="/admin/attendance" class="nav-item">
          <img src="../assets/attendanceIcon.png" class="icon"/> Attendance
        </router-link>
        <router-link to="/admin/reports" class="nav-item">
          <img src="../assets/reportIcon.png" class="icon"/> Reports
        </router-link>
        <router-link to="/admin/courses" class="nav-item">
          <img src="../assets/courseIcon.png" class="icon"/> Courses
        </router-link>
        <router-link to="/admin/e-library" class="nav-item">
          <img src="../assets/eLibraryIcon.png" class="icon"/> E-Library
        </router-link>
      </nav>

      // Temporary account sections
      <div class="sidebar-footer">
        <div class="admin-avatar">KC</div>
        <div class="admin-meta">
          <p class="name">RTC</p>
          <p class="role">Administrator</p>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style scoped>
.admin-container {
  display: flex;
  height: 100vh;
  background-color: #f8f9fa;
}

.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #eee;
  display: flex;
  flex-direction: column;
}

.logo-section {
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: bold;
  color: #333;
}

.logo-img {
  width: 90px;
  height: auto;
}

.nav-menu {
  flex: 1;
  padding: 10px 20px;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  text-decoration: none;
  color: #666;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}


.nav-item:hover, .router-link-active {
  background-color: #f0f2ff;
  color: #5d5fef;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-avatar {
  width: 40px;
  height: 40px;
  background: #5d5fef;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.admin-meta p { margin: 0; }
.admin-meta .name { font-weight: 600; font-size: 0.9rem; }
.admin-meta .role { font-size: 0.75rem; color: #888; }

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}
</style>
