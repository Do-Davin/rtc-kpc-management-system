<template>
  <div class="teacher-container">
    <aside class="sidebar">
      <div class="logo-section">
        <img src="../assets/logo.png" class="logo-img"/>
      </div>

      <nav class="nav-menu">
        <router-link to="/teacher/dashboard" class="nav-item">
          <img src="../assets/dashboardIcon.png" class="icon"/>
          ផ្ទាំងគ្រប់គ្រង
        </router-link>
        <router-link to="/teacher/students" class="nav-item">
          <img src="../assets/studentIcon.png" class="icon"/>
          សិស្សានុសិស្ស
        </router-link>
        <router-link to="/teacher/attendance" class="nav-item">
          <img src="../assets/attendanceIcon.png" class="icon"/>
          វត្តមាន
        </router-link>
        <router-link to="/teacher/schedule" class="nav-item">
          <img src="../assets/schedule.png" class="icon" />
          កាលវិភាគ
        </router-link>
        <router-link to="/teacher/reports" class="nav-item">
          <img src="../assets/reportIcon.png" class="icon"/>
          របាយការណ៍
        </router-link>
        <router-link to="/teacher/courses" class="nav-item">
          <img src="../assets/courseIcon.png" class="icon"/>
          វគ្គសិក្សា
        </router-link>
        <router-link to="/teacher/e-library" class="nav-item">
          <img src="../assets/eLibraryIcon.png" class="icon"/>
          បណ្ណាល័យ
        </router-link>
      </nav>
      <!-- Temporary Account Sections -->
      <div class="sidebar-footer">
        <div class="teacher-avatar">KC</div>
        <div class="teacher-meta">
          <p class="name">RTC</p>
          <p class="role">គ្រូ</p>
          <button class="logout-btn" @click="logout">Logout</button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth.store'
const authStore = useAuthStore()

const logout = () => {
  authStore.logout()
}
</script>

<style scoped>
.teacher-container {
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
  justify-content: center;
}

.logo-img {
  width: 140px;
  height: auto;
  display: block;
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

.teacher-avatar {
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

.teacher-meta p { margin: 0; }
.teacher-meta .name { font-weight: 600; font-size: 0.9rem; }
.teacher-meta .role { font-size: 0.75rem; color: #888; }

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.logout-btn {
  margin-top: 8px;
  background: none;
  border: none;
  color: #ef4444;
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0;
}

.logout-btn:hover {
  text-decoration: underline;
}
</style>
