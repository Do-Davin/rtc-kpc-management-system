import AttendanceComponent from '@/components/admin/attendanceComponent.vue';
import CourseComponent from '@/components/admin/CourseComponent.vue';
import DashboardAdmin from '@/components/admin/dashboardAdmin.vue';
import DepartmentComponent from '@/components/admin/departmentComponent.vue';
import ELibraryComponent from '@/components/admin/e-libraryComponent.vue';
import ReportsComponent from '@/components/admin/reportsComponent.vue';
import StaffComponent from '@/components/admin/staffComponent.vue';
import StudentCompoent from '@/components/admin/studentCompoent.vue';
import AttendanceStu from '@/components/student/attendanceStu.vue';
import CourseStu from '@/components/student/courseStu.vue';
import DashboardStudent from '@/components/student/dashboardStudent.vue';
import ELibraryStu from '@/components/student/e-libraryStu.vue';
import authRoutes from '@/modules/auth/_routes/auth.routes';
import { useAuthStore } from '@/stores/auth.store';
import AdminLayout from '@/views/AdminLayout.vue';
import StudentLayout from '@/views/StudentLayout.vue';
import TeacherLayout from '@/views/TeacherLayout.vue';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/login',
  },

  ...authRoutes,

  // Admin Routes
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboard',
        component: DashboardAdmin,
      },
      {
        path: 'students',
        name: 'StudentManagement',
        component: StudentCompoent,
      },
      {
        path: 'staff',
        name: 'StaffManagement',
        component: StaffComponent,
      },
      {
        path: 'departments',
        name: 'DepartmentManagement',
        component: DepartmentComponent,
      },
      {
        path: 'attendance',
        name: 'AttendanceManagement',
        component: AttendanceComponent,
      },
      {
        path: 'reports',
        name: 'ReportsManagement',
        component: ReportsComponent
      },
      {
        path: 'courses',
        name: 'CourseManagement',
        component: CourseComponent,
      },
      {
        path: 'e-library',
        name: 'ElibraryManagement',
        component: ELibraryComponent
      },
    ]
  },
  {
    path: '/teacher',
    component: TeacherLayout,
    meta: { requiresAuth: true, roles: ['TEACHER'] },
    children: [
      {
        path: 'dashboard',
        component: import('@/components/teacher/_pages/DashboardTeacher.vue')
      },
      {
        path: 'students',
        component: import('@/components/teacher/_pages/StudentAttendance.vue'),
      },
      {
        path: 'attendance',
        component: import('@/components/teacher/_pages/StudentAttendance.vue'),
      },
      {
        path: 'schedule',
        component: import('@/components/teacher/_pages/TeacherSchedule.vue'),
      },
      {
        path: 'reports',
        component: import('@/components/teacher/_pages/TeacherReport.vue'),
      },
      {
        path: 'courses',
        component: import('@/components/teacher/_pages/TeacherCourses.vue'),
      },
      {
        path: 'e-library',
        component: import('@/components/teacher/_pages/TeacherElibrary.vue'),
      },
    ],
  },

  {
    path: '/student',
    component: StudentLayout,
    meta: { requiresAuth: true, roles: ['STUDENT'] },
    children: [
      {
        path: 'dashboard',
        name: 'StudentDashboard',
        component: DashboardStudent,
      },
      {
        path: 'attendance',
        name: 'StudentAttendance',
        component: AttendanceStu,
      },
      {
        path: 'courses',
        name: 'StudentCourse',
        component: CourseStu,
      },
      {
        path: 'e-library',
        name: 'StudentELibrary',
        component: ELibraryStu
      },
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

// Global guard
router.beforeEach((to) => {
  const auth = useAuthStore()
  const isLoggedIn = !!auth.accessToken && !!auth.user

  // BLOCK going back to /login or /register when logged in
  if (isLoggedIn && (to.path === '/login' || to.path === '/register')) {
    return roleHome(auth.user.role)
  }

  // Public route
  if (!to.meta.requiresAuth) return true

  // Not logged in
  if (!auth.accessToken | !auth.user) {
    return '/login'
  }

  // Role check
  if (to.meta.roles && !to.meta.roles.includes(auth.user.role)) {
    // Redirect user to their own dashboard
    return roleHome(auth.user.role)
  }

  // Prevent going back to login/register when logged in
  // if (
  //   (to.path === '/login' || to.path === '/register') &&
  //   auth.accessToken &&
  //   auth.user
  // ) {
  //   return auth.user.role === 'ADMIN'
  //   ? '/admin/dashboard'
  //   : auth.user.role === 'TEACHER'
  //   ? '/teacher/dashboard'
  //   : '/student/dashboard'
  // }

  return true
})

export default router;
