<template>
  <div class="login-page">
    <!-- Left Section - Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Header -->
        <AuthHeader
          title="Welcome"
          subtitle="Please login to your account"
        />

        <form class="form" @submit.prevent="onLogin">
          <!-- Email Field -->
          <AuthEmailField v-model="email" :error="authStore.fieldErrors.email" />

          <!-- Password Field -->
          <AuthPasswordField v-model="password" label="Password" :error="authStore.fieldErrors.password" />

          <!-- Error message -->
          <p v-if="authStore.error" class="error-text">
            {{ authStore.error }}
          </p>

          <!-- Checkbox & Forgot Password -->
          <AuthCheckBoxRow>
            Remember for 30 days

            <template #action>
              <span class="forgot-password" @click="onForgotPassword">
                Forgot Password?
              </span>
            </template>
          </AuthCheckBoxRow>

          <!-- Login Button -->
          <AuthButton :loading="authStore.loading">
            Login
          </AuthButton>

          <!-- Login Link -->
          <AuthSwitchLink
            text="Don't have account yet?"
            link-text="Sign Up"
            to="/register"
          />

          <!-- Divider -->
          <AuthDivider text="Login with Others" />

          <!-- Auth Social Buttons -->
          <AuthSocialButtons />
        </form>
      </div>
    </div>

    <!-- Right Section - Image -->
    <AuthSideImage />

    <!-- Future Different Image -->
    <!-- <AuthSideImage src="/images/login.avif" /> -->
  </div>
</template>

<script setup>
import AuthHeader from '../_components/AuthHeader.vue';
import AuthButton from '../_components/AuthButton.vue';
import AuthSocialButtons from '../_components/AuthSocialButtons.vue';
import AuthEmailField from '../_components/AuthEmailField.vue';
import AuthPasswordField from '../_components/AuthPasswordField.vue';
import AuthSwitchLink from '../_components/AuthSwitchLink.vue';
import AuthSideImage from '../_components/AuthSideImage.vue';
import AuthDivider from '../_components/AuthDivider.vue';
import AuthCheckBoxRow from '../_components/AuthCheckBoxRow.vue';
import { useAuthStore } from '@/stores/auth.store';
import { ref, watch } from 'vue';

const authStore = useAuthStore()

const email = ref('')
const password = ref('')

// clear error when typing
watch(email, () => delete authStore.fieldErrors.email)
watch(password, () => delete authStore.fieldErrors.password)

const onLogin = () => {
  authStore.login({
    email: email.value,
    password: password.value,
  })
}
</script>

<style scoped>
.login-page {
  display: flex;
  height: 100vh;
  overflow: hidden;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.form-section {
  flex: 1;
  height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 87.5px 24px 40px;
  overflow: hidden;
  background: linear-gradient(135deg, #f5f7fa 0%, #fdfeff 100%);
}

.form-container {
  width: 100%;
  max-width: 440px;
}

.error-text {
  color: #ef4444;
  font-size: 13px;
  margin: 8px 0;
}

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
  }
}
</style>
