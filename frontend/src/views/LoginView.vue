<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  try {
    // 1. Send credentials to Backend
    const res = await axios.post('/auth/login', {
      email: email.value,
      password: password.value
    });

    // 2. Extract Token
    const { access_token } = res.data;
    
    // 3. Save Token & User Info
    localStorage.setItem('token', access_token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

    // 4. Check who is logging in
    const userRes = await axios.get('/users/me');
    const user = userRes.data;
    localStorage.setItem('user', JSON.stringify(user));

    // 5. Redirect based on Role
    if (user.role === 'ADMIN') {
      router.push('/admin/dashboard');
    } else {
      router.push('/');
    }

  } catch (err) {
    error.value = 'Invalid email or password';
    console.error(err);
  }
};
</script>

<template>
  <div class="login-container">
    <div class="card">
      <h2>RTC System Login</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="admin@rtc.edu.kh" required />
        </div>
        <div class="input-group">
          <label>Password</label>
          <input v-model="password" type="password" required />
        </div>
        <p v-if="error" class="error">{{ error }}</p>
        <button type="submit">Login</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container { display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #f4f4f9; }
.card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); width: 350px; }
.input-group { margin-bottom: 15px; }
.input-group label { display: block; margin-bottom: 5px; font-weight: bold; }
.input-group input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; }
button { width: 100%; padding: 10px; background-color: #2c3e50; color: white; border: none; border-radius: 5px; cursor: pointer; }
button:hover { background-color: #34495e; }
.error { color: red; font-size: 0.9em; margin-bottom: 10px; }
</style>