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

        <form class="form" @submit.prevent>
          <!-- Email Field -->
          <AuthEmailField />

          <!-- Password Field -->
          <AuthPasswordField label="Password" />

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
          <AuthButton>Login</AuthButton>

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

@media (max-width: 480px) {
  .form-container {
    max-width: 100%;
  }
}
</style>
