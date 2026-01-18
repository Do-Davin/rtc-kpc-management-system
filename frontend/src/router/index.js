import AttendanceComponent from '@/components/admin/attendanceComponent.vue';
import CourseComponent from '@/components/admin/CourseComponent.vue';
import DashboardAdmin from '@/components/admin/dashboardAdmin.vue';
import DepartmentComponent from '@/components/admin/departmentComponent.vue';
import ELibraryComponent from '@/components/admin/e-libraryComponent.vue';
import ReportsComponent from '@/components/admin/reportsComponent.vue';
import StaffComponent from '@/components/admin/staffComponent.vue';
import StudentCompoent from '@/components/admin/studentCompoent.vue';
import AdminLayout from '@/views/AdminLayout.vue';
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'HomeView',
    component: () => import('@/views/HomeView.vue'),
  },

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
  }


];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
