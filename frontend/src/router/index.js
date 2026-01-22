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
    children: [
      {
        path: 'dashboard',
        name: 'TeacherDashboard',
        component: import('@/components/teacher/_pages/DashboardTeacher.vue')
      },
      {
        path: 'students',
        name: 'TeacherStuManagement',
        component: import('@/components/teacher/_pages/StudentAttendance.vue'),
      },
      {
        path: 'attendance',
        name: 'TeacherStuAttendance',
        component: import('@/components/teacher/_pages/StudentAttendance.vue'),
      },
      {
        path: 'reports',
        name: 'TeacherReports',
        component: import('@/components/teacher/_pages/TeacherReport.vue'),
      },
      {
        path: 'courses',
        name: 'TeacherCourse',
        component: import('@/components/teacher/_pages/TeacherCourses.vue'),
      },
      {
        path: 'e-library',
        name: 'TeacherElibrary',
        component: import('@/components/teacher/_pages/TeacherElibrary.vue'),
      },
    ]
  },

  {
    path: '/student',
    component: StudentLayout,
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

export default router;
