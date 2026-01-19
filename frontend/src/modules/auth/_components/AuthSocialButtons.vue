<template>
  <div class="social-group">
    <!-- Google -->
    <button type="button" class="social-btn">
      <span class="social-icon">
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
      </span>

      <span class="social-text">Continue with Google</span>
    </button>

    <!-- Gmail -->
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
</template>

<style scoped>
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
}

.social-text {
  line-height: 1;
  letter-spacing: 0.1px;
}
</style>
