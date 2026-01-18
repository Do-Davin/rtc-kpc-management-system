<template>
  <div class="register-page">
    <!-- Left Section - Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Logo -->
        <div class="logo-wrapper">
          <img src="/images/logo.png" alt="Logo" class="logo" />
        </div>

        <h1>Create Account</h1>
        <p class="subtitle">Join us by creating your account</p>

        <form class="form" @submit.prevent>
          <!-- Email Field -->
          <div class="field">
            <label>Email Address</label>
            <div class="input-wrapper">
              <span class="icon">
                <Mail />
              </span>
              <input type="email" placeholder="Email Address" />
            </div>
          </div>

          <!-- Password Field -->
          <div class="field">
            <label>Password</label>
            <div class="input-wrapper">
              <span class="icon">
                <Lock />
              </span>
              <input :type="showPassword ? 'text' : 'password'" placeholder="Password" />
              <span class="toggle" @click="showPassword = !showPassword">
                <EyeOff v-if="showPassword" class="toggle-icon" />
                <Eye v-else class="toggle-icon" />
              </span>
            </div>
          </div>

          <!-- Confirm Password Field -->
          <div class="field">
            <label>Password</label>
            <div class="input-wrapper">
              <span class="icon">
                <Lock />
              </span>
              <input :type="showConfirmPassword ? 'text' : 'password'" placeholder="Password" />
              <span class="toggle" @click="showConfirmPassword = !showConfirmPassword">
                <EyeOff v-if="showConfirmPassword" class="toggle-icon" />
                <Eye v-else class="toggle-icon" />
              </span>
            </div>
          </div>

          <!-- Terms Checkbox -->
          <label class="checkbox">
            <input type="checkbox" />
            <span>I agree to the <a href="#">terms & policy</a></span>
          </label>

          <!-- Sign Up Button -->
          <button class="primary-btn">Sign up</button>

          <!-- Login Link -->
          <p class="login-link">
            Already have an account? <a href="#">Login</a>
          </p>

          <!-- Divider -->
          <div class="divider">
            <span>Sign up with Others</span>
          </div>

          <div class="social-group">
            <!-- Google Login Button -->
            <button type="button" class="social-btn">
              <span class="social-icon">
                <!-- Google official icon -->
                <svg viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
              </span>

              <span class="social-text">Continue with Google</span>
            </button>

            <!-- Email Login Button -->
            <button type="button" class="social-btn">
              <span class="social-icon">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="52 42 88 66">
                  <path fill="#4285f4" d="M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6"/>
                  <path fill="#34a853" d="M120 108h14c3.32 0 6-2.69 6-6V59l-20 15"/>
                  <path fill="#fbbc04" d="M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2"/>
                  <path fill="#ea4335" d="M72 74V48l24 18 24-18v26L96 92"/>
                  <path fill="#c5221f" d="M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2"/>
                </svg>
              </span>
              <span class="social-text">Continue with Gmail</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Right Section - Image -->
    <div class="image-section">
      <img
        src="/images/library.avif"
        alt="Library"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Mail } from 'lucide-vue-next';
import { Lock } from 'lucide-vue-next';
import { EyeOff } from 'lucide-vue-next';
import { Eye } from 'lucide-vue-next';

const showPassword = ref(false)
const showConfirmPassword = ref(false)
</script>

<style scoped>
.register-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.form-section {
  flex: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #fdfeff 100%);
}

.form-container {
  width: 100%;
  max-width: 440px;
}

.logo-wrapper {
  margin-bottom: 24px;
  display: flex;
  justify-content: center;
}

.logo {
  display: flex;
  justify-content: center;
  width: 80px;
  height: 80px;
  object-fit: contain;
  scale: 1.25;
}

h1 {
  display: flex;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  color: #5B55F3;
  margin-bottom: 8px;
}

.subtitle {
  display: flex;
  justify-content: center;
  color: #818cf8;
  margin-bottom: 32px;
  font-size: 15px;
}

.field {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #6366f1;
  margin-bottom: 8px;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.icon {
  position: absolute;
  left: 16px;
  top: 9.5px;
  font-size: 18px;
  opacity: 0.2;
}

input {
  width: 100%;
  padding: 14px 16px 14px 48px;
  border-radius: 12px;
  border: none;
  background: #f3f4f6;
  font-size: 14px;
  color: #6b7280;
  transition: all 0.2s ease;
}

input::placeholder {
  color: #d1d5db;
}

input:focus {
  outline: none;
  background: #ede9fe;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.toggle {
  position: absolute;
  right: 16px;
  cursor: pointer;
  font-size: 18px;
  opacity: 0.5;
  transition: opacity 0.2s;
}

.toggle:hover {
  opacity: 0.8;
}

.toggle-icon {
  width: 20px;
  height: 20px;
  color: #9ca3af;
  transition: color 0.2s ease, transform 0.15s ease;
}

.toggle:hover .toggle-icon {
  color: #6366f1;
  transform: scale(1.05);
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 20px 0;
  font-size: 13px;
  color: #6366f1;
  cursor: pointer;
}

.checkbox input[type="checkbox"] {
  width: auto;
  cursor: pointer;
  margin: 0;
}

.checkbox a {
  color: #6366f1;
  text-decoration: underline;
}

.primary-btn {
  width: 100%;
  padding: 16px;
  background: linear-gradient(135deg, #6366f1 0%, #5B55F3 100%);
  color: white;
  border-radius: 12px;
  border: none;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-out;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.primary-btn:hover {
  scale: 1.025;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.primary-btn:active {
  scale: 0.98;
  box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4);
}

.login-link {
  margin-top: 20px;
  font-size: 14px;
  text-align: center;
  color: #6b7280;
}

.login-link a {
  color: #6366f1;
  font-weight: 600;
  text-decoration: none;
}

.login-link:hover a {
  text-decoration: underline;
}

.divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 20px;
  color: #9ca3af;
  font-size: 13px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #e5e7eb;
}

.divider span {
  padding: 0 4px;
  white-space: nowrap;
}

.social-group {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 10px;
}

.social-icon {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.social-icon svg {
  width: 100%;
  height: 100%;
  display: block;
}

.social-btn {
  width: 100%;
  height: 52px;
  border-radius: 14px;
  background: #ffffff;
  border: 0.7px solid #8F8AFF;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  font-size: 15px;
  font-weight: 500;
  color: #374151;
  cursor: pointer;
  transition: all 0.18s ease-out;
  box-shadow: 0 1px 2px rgba(0,0,0,0.03);
}

.social-btn:hover {
  scale: 1.025;
  background: #f9fafb;
  border-color: #8F8AFF;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.social-btn:active {
  scale: 0.98;
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
}

.social-text {
  line-height: 1;
  letter-spacing: 0.1px;
}

.image-section {
  flex: 1;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.image-section img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-top-left-radius: 24px;
  border-bottom-left-radius: 24px;
}

@media (max-width: 1024px) {
  .image-section {
    display: none;
  }
}

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
  }

  h1 {
    font-size: 28px;
  }
}
</style>
