<template>
  <div class="language-switcher" ref="dropdownRef">
    <button class="switcher-btn" @click="toggleDropdown">
      <img :src="currentLang.flagImage" :alt="currentLang.name" class="flag-img" />
      <span class="lang-name">{{ currentLang.name }}</span>
      <ChevronDown :size="14" class="chevron" :class="{ rotated: isOpen }" />
    </button>

    <Transition name="dropdown">
      <div v-if="isOpen" class="dropdown-menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          class="dropdown-item"
          :class="{ active: lang.code === currentLanguage }"
          @click="selectLanguage(lang.code)"
        >
          <img :src="lang.flagImage" :alt="lang.name" class="flag-img" />
          <span class="lang-name">{{ lang.name }}</span>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { useLanguageStore } from '@/stores/language.store'

const languageStore = useLanguageStore()

const isOpen = ref(false)
const dropdownRef = ref(null)

// Flag images - using CDN for country flags
const flagImages = {
  km: 'https://flagcdn.com/w40/kh.png',
  en: 'https://flagcdn.com/w40/us.png'
}

const currentLanguage = computed(() => languageStore.currentLanguage)
const currentLang = computed(() => ({
  ...languageStore.currentLang,
  flagImage: flagImages[languageStore.currentLanguage] || flagImages.km
}))
const languages = computed(() => 
  languageStore.languages.map(lang => ({
    ...lang,
    flagImage: flagImages[lang.code] || flagImages.km
  }))
)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLanguage = (langCode) => {
  languageStore.setLanguage(langCode)
  isOpen.value = false
}

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.language-switcher {
  position: relative;
  z-index: 100;
}

.switcher-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  color: #334155;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.switcher-btn:hover {
  border-color: #cbd5e1;
  background: #f8fafc;
}

.flag-img {
  width: 24px;
  height: 16px;
  object-fit: cover;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.1);
}

.lang-name {
  font-weight: 500;
  font-size: 14px;
}

.chevron {
  color: #64748b;
  transition: transform 0.2s ease;
  margin-left: 2px;
}

.chevron.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  min-width: 140px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 4px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 12px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  color: #334155;
  transition: background 0.15s ease;
  text-align: left;
}

.dropdown-item:hover {
  background: #f1f5f9;
}

.dropdown-item.active {
  background: #f1f5f9;
  color: #334155;
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
