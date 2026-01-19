export default [
  {
    path: '/register',
    name: 'Register',
    component: () =>
      import('@/modules/auth/_views/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () =>
      import('@/modules/auth/_views/LoginView.vue'),
  },
]
