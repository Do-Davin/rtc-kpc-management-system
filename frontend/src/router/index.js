import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth.store';
import authRoutes from '@/modules/auth/_routes/auth.routes';

// Layouts
import AdminLayout from '@/views/AdminLayout.vue';
import StudentLayout from '@/views/StudentLayout.vue';
import TeacherLayout from '@/views/TeacherLayout.vue';

// Admin Components
import DashboardAdmin from '@/components/admin/dashboardAdmin.vue';
import StudentComponent from '@/components/admin/studentComponent.vue';
import StaffComponent from '@/components/admin/staffComponent.vue';
import DepartmentComponent from '@/components/admin/departmentComponent.vue';
import ReportsComponent from '@/components/admin/reportsComponent.vue';
import CourseComponent from '@/components/admin/CourseComponent.vue';
import ELibraryComponent from '@/components/admin/e-libraryComponent.vue';
import AttendanceComponent from '@/components/admin/attendanceComponent.vue'; // Imported only once now

// Student Components
import DashboardStudent from '@/components/student/dashboardStudent.vue';
import AttendanceStu from '@/components/student/attendanceStu.vue';
import CourseStu from '@/components/student/courseStu.vue';
import ELibraryStu from '@/components/student/e-libraryStu.vue';

const routes = [
  { path: '/', redirect: '/login' },
  ...authRoutes,
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', name: 'AdminDashboard', component: DashboardAdmin },
      { path: 'students', name: 'StudentManagement', component: StudentComponent },
      { path: 'staff', name: 'StaffManagement', component: StaffComponent },
      { path: 'departments', name: 'DepartmentManagement', component: DepartmentComponent },
      { path: 'attendance', name: 'AttendanceManagement', component: AttendanceComponent }, // Logic is perfect here
      { path: 'reports', name: 'ReportsManagement', component: ReportsComponent },
      { path: 'courses', name: 'CourseManagement', component: CourseComponent },
      { path: 'e-library', name: 'ElibraryManagement', component: ELibraryComponent },
    ]
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, roles: ['TEACHER'] },
    children: [
      { path: 'dashboard', component: () => import('@/components/teacher/_pages/DashboardTeacher.vue') },
      { path: 'student-management', component: () => import('@/components/teacher/_pages/StudentManagement.vue') },
      { path: 'attendance', component: () => import('@/components/teacher/_pages/StudentAttendance.vue') },
      { path: 'schedule', component: () => import('@/components/teacher/_pages/TeacherSchedule.vue') },
      { path: 'reports', component: () => import('@/components/teacher/_pages/TeacherReport.vue') },
      { path: 'courses', component: () => import('@/components/teacher/_pages/TeacherCourses.vue') },
      { path: 'e-library', component: () => import('@/components/teacher/_pages/TeacherElibrary.vue') },
    ],
  },
  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, roles: ['STUDENT'] },
    children: [
      { path: 'dashboard', name: 'StudentDashboard', component: DashboardStudent },
      { path: 'attendance', name: 'StudentAttendance', component: AttendanceStu },
      { path: 'courses', name: 'StudentCourse', component: CourseStu },
      { path: 'e-library', name: 'StudentELibrary', component: ELibraryStu },
    ]
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const roleHome = (role) => {
  if (role === 'ADMIN') return '/admin/dashboard'
  if (role === 'TEACHER') return '/teacher/dashboard'
  return '/student/dashboard'
}

router.beforeEach((to) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.accessToken && !!auth.user

  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return roleHome(auth.user.role)
  }

  if (!to.meta.requiresAuth) return true

  if (!auth.accessToken || !auth.user) {
    return '/login'
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user.role)) {
    return roleHome(auth.user.role)
  }

  return true
})

export default router;