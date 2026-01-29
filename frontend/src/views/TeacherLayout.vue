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
        <router-link to="/teacher/student-management" class="nav-item">
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
      <!-- Teacher Profile & Account Section -->
      <div class="sidebar-footer">
        <div class="profile-card" @click="openProfile">
          <div class="teacher-avatar">
            <span>KC</span>
          </div>
          <div class="teacher-info">
            <p class="name">RTC</p>
            <p class="role">គ្រូបង្រៀន</p>
          </div>
          <div class="profile-arrow">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </div>
        </div>
        <button class="logout-btn" @click="logout">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          ចាកចេញ
        </button>
      </div>
    </aside>

    <main class="main-content">
      <router-view />
    </main>

    <!-- Teacher Profile Modal -->
    <TeacherProfile
      :isOpen="isProfileOpen"
      @close="closeProfile"
      @update="handleProfileUpdate"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import TeacherProfile from '@/components/teacher/_pages/TeacherProfile.vue'

const authStore = useAuthStore()
const isProfileOpen = ref(false)

const openProfile = () => {
  isProfileOpen.value = true
}

const closeProfile = () => {
  isProfileOpen.value = false
}

const handleProfileUpdate = (updatedData) => {
  // TODO: Update user data in store or backend
  console.log('Profile updated:', updatedData)
}

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
  padding: 16px;
  border-top: 1px solid #eee;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profile-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.profile-card:hover {
  background: linear-gradient(135deg, #eef0ff 0%, #e8ebff 100%);
  border-color: #c7d2fe;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(93, 95, 239, 0.15);
}

.teacher-avatar {
  width: 42px;
  height: 42px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.9rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.teacher-info {
  flex: 1;
  min-width: 0;
}

.teacher-info p { margin: 0; }
.teacher-info .name {
  font-weight: 600;
  font-size: 0.9rem;
  color: #1e293b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.teacher-info .role {
  font-size: 0.75rem;
  color: #6366f1;
  font-weight: 500;
}

.profile-arrow {
  color: #94a3b8;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.profile-card:hover .profile-arrow {
  color: #6366f1;
  transform: translateX(2px);
}

.main-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.15);
}

.logout-btn:active {
  transform: translateY(0);
}
</style>
