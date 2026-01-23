<template>
  <div class="register-page">
    <!-- Left Section - Form -->
    <div class="form-section">
      <div class="form-container">
        <!-- Header -->
        <AuthHeader
          title="Create Account"
          subtitle="Join us by creating your account"
        />

        <form class="form" @submit.prevent="onRegister">
          <!-- Email Field -->
          <AuthEmailField
            v-model="email"
            :error="authStore.fieldErrors.email"
          />

          <!-- Password Field -->
          <AuthPasswordField
            v-model="password"
            label="Password"
            :error="authStore.fieldErrors.password"
          />

          <!-- Confirm Password Field -->
          <AuthPasswordField
            v-model="password"
            label="Confirm Password"
            :error="authStore.fieldErrors.password"
          />

          <!-- Terms Checkbox -->
          <AuthCheckBoxRow>
            I agree to the
            <a href="#">terms & policy</a>
          </AuthCheckBoxRow>


          <!-- Sign Up Button -->
          <AuthButton :loading="authStore.loading">
            Sign up
          </AuthButton>

          <!-- Login Link -->
          <AuthSwitchLink
            text="Already have an account?"
            link-text="Login"
            to="/login"
          />

          <!-- Divider -->
          <AuthDivider text="Sign up with Others" />

          <!-- Auth Social Buttons -->
          <AuthSocialButtons />
        </form>
      </div>
    </div>

    <!-- Right Section - Image -->
    <AuthSideImage />
  </div>
</template>

<script setup>
import AuthHeader from '../_components/AuthHeader.vue';
import AuthEmailField from '../_components/AuthEmailField.vue';
import AuthPasswordField from '../_components/AuthPasswordField.vue';
import AuthDivider from '../_components/AuthDivider.vue';
import AuthButton from '../_components/AuthButton.vue';
import AuthSocialButtons from '../_components/AuthSocialButtons.vue';
import AuthSwitchLink from '../_components/AuthSwitchLink.vue';
import AuthCheckBoxRow from '../_components/AuthCheckBoxRow.vue';
import AuthSideImage from '../_components/AuthSideImage.vue';
import { useAuthStore } from '@/stores/auth.store';
import { ref, watch } from 'vue';

const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const confirmError = ref('')

// clear errors on typing
watch(email, () => delete authStore.fieldErrors.email)
watch(password, () => delete authStore.fieldErrors.password)
watch(confirmPassword, () => (confirmError.value = ''))

const onRegister = () => {
  authStore.register(
    email.value,
    password.value,
  )
}
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

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
  }
}
</style>
