import AttendanceComponent from '@/components/admin/attendanceComponent.vue';
import CourseComponent from '@/components/admin/courseComponent.vue';
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
import DashboardTeacher from '@/components/teacher/dashboardTeacher.vue';
import StudentAttendance from '@/components/teacher/studentAttendance.vue';
import StudentManagement from '@/components/teacher/studentManagement.vue';
import TeacherCourses from '@/components/teacher/teacherCourses.vue';
import TeacherELibrary from '@/components/teacher/teacherE-library.vue';
import TeacherReport from '@/components/teacher/teacherReport.vue';
import authRoutes from '@/modules/auth/_routes/auth.routes';
import AdminLayout from '@/views/AdminLayout.vue';
import StudentLayout from '@/views/StudentLayout.vue';
import TeacherLayout from '@/views/TeacherLayout.vue';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
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
        component: DashboardTeacher,
      },
      {
        path: 'students',
        name: 'TeacherStuManagement',
        component: StudentManagement,
      },
      {
        path: 'attendance',
        name: 'StuAttendance4Teacher',
        component: StudentAttendance,
      },
      {
        path: 'reports',
        name: 'TeacherReports',
        component: TeacherReport,
      },
      {
        path: 'courses',
        name: 'TeacherCourse',
        component: TeacherCourses,
      },
      {
        path: 'e-library',
        name: 'TeacherELibrary',
        component: TeacherELibrary
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
